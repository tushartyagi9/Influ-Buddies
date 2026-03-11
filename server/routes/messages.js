import express from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// All message routes require auth
router.use(authMiddleware);

// GET /api/messages/conversations – list unique conversation partners
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user._id;

    const sent = await Message.aggregate([
      { $match: { sender: userId } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$receiver', lastMessage: { $first: '$content' }, lastDate: { $first: '$createdAt' } } },
    ]);

    const received = await Message.aggregate([
      { $match: { receiver: userId } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$sender', lastMessage: { $first: '$content' }, lastDate: { $first: '$createdAt' }, unread: { $sum: { $cond: ['$read', 0, 1] } } } },
    ]);

    // Merge partners
    const map = new Map();
    for (const s of sent) {
      map.set(s._id.toString(), { partnerId: s._id, lastMessage: s.lastMessage, lastDate: s.lastDate, unread: 0 });
    }
    for (const r of received) {
      const key = r._id.toString();
      const existing = map.get(key);
      if (!existing || r.lastDate > existing.lastDate) {
        map.set(key, { partnerId: r._id, lastMessage: r.lastMessage, lastDate: r.lastDate, unread: r.unread || 0 });
      } else if (existing) {
        existing.unread = r.unread || 0;
      }
    }

    let conversations = Array.from(map.values()).sort((a, b) => b.lastDate - a.lastDate);

    // Populate partner names
    const partnerIds = conversations.map((c) => c.partnerId);
    const users = await User.find({ _id: { $in: partnerIds } }).select('name role').lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    conversations = conversations.map((c) => ({
      ...c,
      partner: userMap[c.partnerId.toString()] || { name: 'Unknown' },
    }));

    res.json(conversations);
  } catch (err) {
    console.error('Conversations error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/:partnerId – get messages with a specific user
router.get('/:partnerId', async (req, res) => {
  try {
    const userId = req.user._id;
    const partnerId = new mongoose.Types.ObjectId(req.params.partnerId);

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark received messages as read
    await Message.updateMany({ sender: partnerId, receiver: userId, read: false }, { read: true });

    res.json(messages);
  } catch (err) {
    console.error('Messages error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages – send a message
router.post('/', async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ message: 'receiverId and content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim(),
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
