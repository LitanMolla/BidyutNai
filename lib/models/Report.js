import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  areaName: { type: String, required: true },
  status: { type: String, enum: ['ON', 'OFF'], required: true },
  startTime: { type: Date, default: Date.now },
  duration: { type: Number }, // in minutes
  imageUrl: { type: String },
  creatorDeviceId: { type: String, required: true },
  votes: {
    trueCount: { type: Number, default: 0 },
    falseCount: { type: Number, default: 0 }
  },
  votedBy: [{ type: String }] // Array of UUIDs
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
