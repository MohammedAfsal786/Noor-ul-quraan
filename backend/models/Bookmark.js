import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  surahNumber: { type: Number, required: true },
  ayahNumber: { type: Number, required: true },
  surahName: { type: String, required: true }
}, { timestamps: true });

bookmarkSchema.index({ user: 1, surahNumber: 1, ayahNumber: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
