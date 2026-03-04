import express from 'express';
import { saveDhikr, getDhikrHistory } from '../controllers/dhikrController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/', saveDhikr);
router.get('/history', getDhikrHistory);

export default router;
