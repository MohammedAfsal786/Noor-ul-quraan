import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  bookmarks: [{
    surahNumber: Number,
    ayahNumber: Number,
    surahName: String,
    addedAt: { type: Date, default: Date.now }
  }],
  lastRead: {
    surahNumber: { type: Number, default: 1 },
    ayahNumber: { type: Number, default: 1 }
  },
  dhikrHistory: [{
    dhikrText: String,
    count: Number,
    date: { type: Date, default: Date.now }
  }],
  prayerHistory: [{
    date: { type: String, required: true }, // e.g. '2026-02-20'
    prayers: {
      Fajr: { type: Boolean, default: false },
      Dhuhr: { type: Boolean, default: false },
      Asr: { type: Boolean, default: false },
      Maghrib: { type: Boolean, default: false },
      Isha: { type: Boolean, default: false }
    }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
