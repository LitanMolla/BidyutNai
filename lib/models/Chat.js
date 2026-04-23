import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
