import express from 'express';
import Influencer from '../models/Influencer.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      niche,
      location,
      platform,
      gender,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (niche) query.niche = niche;
    if (location) query.location = new RegExp(location, 'i');
    if (gender) query.gender = gender;
    if (platform) query.platforms = platform;
    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 12;

    const [items, total] = await Promise.all([
      Influencer.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Influencer.countDocuments(query)
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    console.error('List influencers error', err);
    res.status(500).json({ message: 'Failed to load influencers' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (err) {
    console.error('Get influencer error', err);
    res.status(500).json({ message: 'Failed to load influencer' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const influencer = await Influencer.create({
      ...data,
      owner: req.user._id
    });
    res.status(201).json(influencer);
  } catch (err) {
    console.error('Create influencer error', err);
    res.status(500).json({ message: 'Failed to create influencer' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    if (influencer.owner && influencer.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this profile' });
    }

    Object.assign(influencer, req.body);
    await influencer.save();
    res.json(influencer);
  } catch (err) {
    console.error('Update influencer error', err);
    res.status(500).json({ message: 'Failed to update influencer' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    if (influencer.owner && influencer.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this profile' });
    }
    await influencer.deleteOne();
    res.status(204).send();
  } catch (err) {
    console.error('Delete influencer error', err);
    res.status(500).json({ message: 'Failed to delete influencer' });
  }
});

export default router;

