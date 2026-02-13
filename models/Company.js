import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Company name is required'],
    trim: true 
  },
  roles: [String],                  // e.g. ["SDE", "Data Analyst"]
  eligibleBranches: [String],       // e.g. ["CSE", "ECE", "EEE"]
  cgpaCutoff: { 
    type: Number, 
    default: 0 
  },
  stipend: String,                  // e.g. "50k/month" or "12 LPA"
  selectionRounds: [String],        // e.g. ["OA", "Technical Interview", "HR"]
  studentExperience: String,        // The detailed paragraph from the chronicle
  year: {
    type: Number,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Prevent model overwrite error in Next.js hot reloading
export default mongoose.models.Company || mongoose.model('Company', CompanySchema);