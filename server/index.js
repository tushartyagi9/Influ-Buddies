import './config/env.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import influencerRoutes from './routes/influencers.js';
import userRoutes from './routes/users.js';
import chatbotRoutes from './routes/chatbot.js';
import opportunityRoutes from './routes/opportunities.js';
import messageRoutes from './routes/messages.js';
import Influencer from './models/Influencer.js';
import Opportunity from './models/Opportunity.js';
import defaultInfluencers from './utils/defaultInfluencers.js';
import defaultOpportunities from './utils/defaultOpportunities.js';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/messages', messageRoutes);

// ── Serve React client build in production ──
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

async function start() {
  try {
    await connectDB();

    const count = await Influencer.estimatedDocumentCount();
    if (count === 0) {
      await Influencer.insertMany(defaultInfluencers);
      console.log(`Seeded ${defaultInfluencers.length} default influencers.`);
    }

    const oppCount = await Opportunity.estimatedDocumentCount();
    if (oppCount === 0) {
      await Opportunity.insertMany(defaultOpportunities);
      console.log(`Seeded ${defaultOpportunities.length} default opportunities.`);
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

