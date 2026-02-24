import fs from 'fs';
import path from 'path';
import url from 'url';
import mongoose from 'mongoose';
import Influencer from '../models/Influencer.js';
import defaultInfluencers from '../utils/defaultInfluencers.js';

import '../config/env.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadJson(fileName) {
  const fullPath = path.join(__dirname, '..', 'data', fileName);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found, skipping: ${fullPath}`);
    return [];
  }
  const raw = await fs.promises.readFile(fullPath, 'utf-8');
  return JSON.parse(raw);
}

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/influ_buddies';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  const categories = ['beauty.json', 'dance.json', 'Fashion.json'];

  const all = [];
  for (const file of categories) {
    const items = await loadJson(file);
    for (const item of items) {
      all.push({
        name: item.name || item.fullName,
        niche: item.niche || path.basename(file, '.json'),
        platforms: item.platforms || (item.platform ? [item.platform] : []),
        location: item.location || item.country || '',
        gender: item.gender || '',
        imageUrl: item.image || item.imageUrl || '',
        socialLink: item.socialLink || item.link || '',
        followerCount: item.followerCount || item.followers || undefined,
        engagementRate: item.engagementRate || undefined
      });
    }
  }

  if (!all.length) {
    console.log('No data loaded from JSON files. Seeding default demo influencers instead.');
    all.push(...defaultInfluencers);
  }

  await Influencer.deleteMany({});
  await Influencer.insertMany(all);

  console.log(`Seeded ${all.length} influencers.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});

