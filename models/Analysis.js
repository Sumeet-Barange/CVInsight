import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  // NEW: Optional Job Description
  jobDescription: {
    type: String,
    default: "", 
  },
  score: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
  },
  strengths: [String],
  weaknesses: [String],
  improvements: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
export default Analysis;