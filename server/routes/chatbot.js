import express from 'express';
import Influencer from '../models/Influencer.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  analyzeMarketingRequest,
  generateInfluencerRecommendationResponse,
  scoreInfluencer,
} from '../utils/chatbotHelper.js';

const router = express.Router();

// ---------- Helper: build Mongo query from criteria ----------
function buildQuery(criteria, strict = true) {
  const query = {};

  if (criteria.niches && criteria.niches.length && !criteria.niches.includes('general')) {
    query.niche = { $in: criteria.niches };
  }

  if (strict && criteria.platforms && criteria.platforms.length) {
    query.platforms = { $in: criteria.platforms };
  }

  if (strict && criteria.location) {
    query.location = new RegExp(criteria.location, 'i');
  }

  if (strict && criteria.gender) {
    query.gender = criteria.gender;
  }

  // Engagement threshold
  if (criteria.engagementLevel === 'high') {
    query.engagementRate = { $gte: 5 };
  } else if (criteria.engagementLevel === 'medium') {
    query.engagementRate = { $gte: 2 };
  }

  // Follower tier
  if (strict && criteria.followerTier) {
    query.followerCount = { $gte: criteria.followerTier.min };
    if (criteria.followerTier.max !== Infinity) {
      query.followerCount.$lte = criteria.followerTier.max;
    }
  }

  return query;
}

// ---------- POST /api/chatbot/analyze ----------
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { brandRequest, conversationContext } = req.body;
    const userId = req.user.id;

    if (!brandRequest || brandRequest.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide your campaign requirements' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can use the AI matcher' });
    }

    // 1. Parse criteria
    const criteria = await analyzeMarketingRequest(brandRequest, conversationContext);

    // 2. Strict query
    let matched = await Influencer.find(buildQuery(criteria, true)).limit(20);

    // 3. If too few results, relax progressively
    if (matched.length < 3) {
      const relaxed = await Influencer.find(buildQuery(criteria, false)).limit(20);
      // Merge without duplicates
      const existingIds = new Set(matched.map((m) => m._id.toString()));
      for (const inf of relaxed) {
        if (!existingIds.has(inf._id.toString())) matched.push(inf);
      }
    }

    // 4. If still empty, show top influencers overall
    if (matched.length === 0) {
      matched = await Influencer.find({}).sort({ followerCount: -1 }).limit(10);
    }

    // 5. Score & rank
    const scored = matched.map((inf) => {
      const infObj = inf.toObject();
      const { score, reasons } = scoreInfluencer(infObj, criteria);
      return { ...infObj, _matchScore: score, _matchReasons: reasons };
    });
    scored.sort((a, b) => b._matchScore - a._matchScore);

    // Limit to requested count or 10
    const limit = criteria.requestedCount || 10;
    const topResults = scored.slice(0, limit);

    // 6. Generate response text
    const suggestion = await generateInfluencerRecommendationResponse(criteria, topResults);

    res.json({
      success: true,
      message:
        topResults.length > 0
          ? `Found ${topResults.length} influencer(s) ranked by relevance to your campaign.`
          : 'No exact matches — showing top suggestions instead.',
      criteria,
      influencers: topResults,
      suggestion,
    });
  } catch (error) {
    console.error('Chatbot analyze error:', error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

// ---------- POST /api/chatbot/quick-search ----------
router.post('/quick-search', async (req, res) => {
  try {
    const { niche, platforms, minEngagement, location } = req.body;

    const query = {};
    if (niche) query.niche = new RegExp(niche, 'i');
    if (platforms && platforms.length > 0) query.platforms = { $in: platforms };
    if (location) query.location = new RegExp(location, 'i');
    if (minEngagement) query.engagementRate = { $gte: minEngagement };

    const influencers = await Influencer.find(query).limit(20);

    res.json({
      success: true,
      influencers,
      count: influencers.length,
    });
  } catch (error) {
    console.error('Quick search error:', error);
    res.status(500).json({ message: 'Failed to search influencers' });
  }
});

export default router;
