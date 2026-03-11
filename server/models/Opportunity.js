import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    platforms: [{ type: String }],
    budget: { type: Number },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    location: { type: String },
    requirements: { type: String },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['open', 'closed', 'paused'],
      default: 'open',
    },
    applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
