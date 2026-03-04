import mongoose from 'mongoose';

const duaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  arabic: { type: String, required: true },
  transliteration: { type: String },
  english: { type: String, required: true },
  category: { type: String, enum: ['daily', 'morning_evening', 'quran', 'situations'], required: true },
  audioUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Dua', duaSchema);
