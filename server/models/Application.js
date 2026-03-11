import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    influencerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' },
    message: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// One application per influencer per opportunity
applicationSchema.index({ opportunity: 1, influencer: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
