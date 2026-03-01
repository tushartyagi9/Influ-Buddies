import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Influencer from '../models/Influencer.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

function signToken(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role
  };
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, bio, niche, platforms, gender, followerCount, engagementRate, socialLink, imageUrl } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      location,
      bio
    });

    // If user is an influencer, create influencer profile
    if (role === 'influencer') {
      if (!niche) {
        return res.status(400).json({ message: 'Niche is required for influencers' });
      }
      
      await Influencer.create({
        name,
        niche,
        platforms: platforms || [],
        location,
        gender,
        imageUrl,
        socialLink,
        followerCount: followerCount || 0,
        engagementRate: engagementRate || 0,
        owner: user._id
      });
    }

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        bio: user.bio
      }
    });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        bio: user.bio
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Failed to login' });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;

