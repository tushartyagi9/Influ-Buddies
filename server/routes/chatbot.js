import express from 'express';
import Influencer from '../models/Influencer.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { analyzeMarketingRequest, generateInfluencerRecommendationResponse } from '../utils/chatbotHelper.js';

const router = express.Router();

// POST /api/chatbot/analyze - Analyze brand request and find matching influencers
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { brandRequest } = req.body;
    const userId = req.user.id;

    if (!brandRequest || brandRequest.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide your campaign requirements' });
    }

    // Get user info to check if they are a brand
    const user = await User.findById(userId);
    if (!user || user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can use the chatbot matcher' });
    }

    console.log('Analyzing campaign request:', brandRequest);

    // Step 1: Analyze the request to extract criteria
    const criteria = await analyzeMarketingRequest(brandRequest);
    console.log('Extracted criteria:', criteria);

    // Step 2: Build query based on criteria
    const query = {};
    
    if (criteria.niches && criteria.niches.length > 0) {
      query.niche = { $in: criteria.niches };
    }
    
    if (criteria.platforms && criteria.platforms.length > 0) {
      query.platforms = { $in: criteria.platforms };
    }
    
    if (criteria.location && criteria.location !== 'null') {
      query.location = new RegExp(criteria.location, 'i');
    }

    // Set engagement threshold based on engagement level
    let minEngagementRate = 0;
    if (criteria.engagementLevel === 'high') {
      minEngagementRate = 5;
    } else if (criteria.engagementLevel === 'medium') {
      minEngagementRate = 2;
    }
    
    if (minEngagementRate > 0) {
      query.engagementRate = { $gte: minEngagementRate };
    }

    // Step 3: Query influencers from database
    const matchedInfluencers = await Influencer.find(query).limit(10);

    // Step 4: Generate response with follow-up questions
    const response = await generateInfluencerRecommendationResponse(criteria, matchedInfluencers);

    res.json({
      success: true,
      message: matchedInfluencers.length > 0 
        ? `Found ${matchedInfluencers.length} influencer(s) for you!` 
        : 'No exact matches found. Let me suggest alternatives...',
      criteria,
      influencers: matchedInfluencers,
      suggestion: response
    });

  } catch (error) {
    console.error('Chatbot analyze error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      message: `Error: ${error.message}`,
      error: error.message 
    });
  }
});

// POST /api/chatbot/quick-search - Quick search without AI analysis
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
      count: influencers.length
    });
  } catch (error) {
    console.error('Quick search error:', error);
    res.status(500).json({ message: 'Failed to search influencers' });
  }
});

export default router;
