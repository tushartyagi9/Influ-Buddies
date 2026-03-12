import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    niche: { type: String, required: true },
    platforms: [{ type: String }], // e.g. ['instagram', 'youtube']
    location: { type: String },
    gender: { type: String },
    imageUrl: { type: String },
    socialLink: { type: String },
    followerCount: { type: Number },
    engagementRate: { type: Number },
    bio: { type: String },
    reelCaption: { type: String },
    tags: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Influencer = mongoose.model('Influencer', influencerSchema);

export default Influencer;

