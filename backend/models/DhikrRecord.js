import mongoose from 'mongoose';

const dhikrRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dhikrText: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('DhikrRecord', dhikrRecordSchema);
