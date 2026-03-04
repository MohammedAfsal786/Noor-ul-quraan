import express from 'express';
import { protect } from '../middleware/auth.js';
import { getTodayPrayer, markPrayer } from '../controllers/prayerController.js';

const router = express.Router();

router.use(protect);

router.get('/today', getTodayPrayer);
router.post('/mark', markPrayer);

export default router;

