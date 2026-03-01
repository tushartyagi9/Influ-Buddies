import './config/env.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import influencerRoutes from './routes/influencers.js';
import userRoutes from './routes/users.js';
import chatbotRoutes from './routes/chatbot.js';
import Influencer from './models/Influencer.js';
import defaultInfluencers from './utils/defaultInfluencers.js';
import { connectDB } from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Influ-Buddies API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);

async function start() {
  try {
    await connectDB();

    const count = await Influencer.estimatedDocumentCount();
    if (count === 0) {
      await Influencer.insertMany(defaultInfluencers);
      console.log(`Seeded ${defaultInfluencers.length} default influencers.`);
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

