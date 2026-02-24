import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/influ_buddies';

  try {
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB (${uri})`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

