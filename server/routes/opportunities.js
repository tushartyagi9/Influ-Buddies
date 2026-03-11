import express from 'express';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import Influencer from '../models/Influencer.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// ────────── OPPORTUNITIES ──────────

// GET /api/opportunities – list all open opportunities (public)
router.get('/', async (req, res) => {
  try {
    const { category, platform, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'open' };

    if (category) query.category = new RegExp(category, 'i');
    if (platform) query.platforms = platform;
    if (search) query.title = new RegExp(search, 'i');

    const pageNum = Number(page) || 1;
    const pageSize = Number(limit) || 12;

    const [items, total] = await Promise.all([
      Opportunity.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Opportunity.countDocuments(query),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.error('List opportunities error', err);
    res.status(500).json({ message: 'Failed to load opportunities' });
  }
});

// GET /api/opportunities/mine – brand's own opportunities
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const items = await Opportunity.find({ brand: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('My opportunities error', err);
    res.status(500).json({ message: 'Failed to load your opportunities' });
  }
});

// GET /api/opportunities/applications/mine – influencer's own applications (must be before /:id)
router.get('/applications/mine', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can view their applications' });
    }

    const apps = await Application.find({ influencer: req.user._id })
      .populate('opportunity', 'title brandName category budget status deadline')
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your applications' });
  }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opp);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load opportunity' });
  }
});

// POST /api/opportunities – brand creates an opportunity
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can post opportunities' });
    }

    const opp = await Opportunity.create({
      ...req.body,
      brand: req.user._id,
      brandName: req.user.name,
    });
    res.status(201).json(opp);
  } catch (err) {
    console.error('Create opportunity error', err);
    res.status(500).json({ message: 'Failed to create opportunity' });
  }
});

// PUT /api/opportunities/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    if (opp.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your opportunity' });
    }
    Object.assign(opp, req.body);
    await opp.save();
    res.json(opp);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update opportunity' });
  }
});

// DELETE /api/opportunities/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    if (opp.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your opportunity' });
    }
    await Application.deleteMany({ opportunity: opp._id });
    await opp.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete opportunity' });
  }
});

// ────────── APPLICATIONS ──────────

// POST /api/opportunities/:id/apply – influencer applies
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can apply' });
    }

    const opp = await Opportunity.findById(req.params.id);
    if (!opp || opp.status !== 'open') {
      return res.status(404).json({ message: 'Opportunity not available' });
    }

    // Check if already applied
    const existing = await Application.findOne({
      opportunity: opp._id,
      influencer: req.user._id,
    });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied' });
    }

    // Find influencer profile
    const infProfile = await Influencer.findOne({ owner: req.user._id });

    const app = await Application.create({
      opportunity: opp._id,
      influencer: req.user._id,
      influencerProfile: infProfile?._id,
      message: req.body.message || '',
    });

    // Increment applicant count
    await Opportunity.findByIdAndUpdate(opp._id, { $inc: { applicantCount: 1 } });

    res.status(201).json(app);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already applied' });
    }
    console.error('Apply error', err);
    res.status(500).json({ message: 'Failed to apply' });
  }
});

// GET /api/opportunities/:id/applications – brand views applicants
router.get('/:id/applications', authMiddleware, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    if (opp.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your opportunity' });
    }

    const apps = await Application.find({ opportunity: opp._id })
      .populate('influencer', 'name email location')
      .populate('influencerProfile', 'name niche platforms followerCount engagementRate imageUrl socialLink location')
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load applications' });
  }
});

// PUT /api/opportunities/:oppId/applications/:appId – brand updates application status
router.put('/:oppId/applications/:appId', authMiddleware, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.oppId);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    if (opp.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your opportunity' });
    }

    const app = await Application.findById(req.params.appId);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.status = req.body.status;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update application' });
  }
});

export default router;
