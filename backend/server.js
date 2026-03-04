import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import bookmarkRoutes from './routes/bookmarks.js';
import dhikrRoutes from './routes/dhikr.js';
import duasRoutes from './routes/duas.js';
import quranRoutes from './routes/quran.js';
import prayerRoutes from './routes/prayer.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/dhikr', dhikrRoutes);
app.use('/api/duas', duasRoutes);
app.use('/api/quran', quranRoutes);
app.use('/api/prayer', prayerRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Noor-ul-Quran API' }));

// Error handling
app.use(errorHandler);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/noor-ul-quran';
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ MongoDB connected');
    startServer();
  })
  .catch(err => {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.log('⚠️  Server starting without MongoDB. Auth, Duas, Dhikr features will not work.');
    console.log('💡 Tip: Start MongoDB to enable all features.');
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`🕌 Noor-ul-Quran API running on http://localhost:${PORT}`);
    console.log(`📖 Quran API available at http://localhost:${PORT}/api/quran`);
  });
}
