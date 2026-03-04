import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateLastRead } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/last-read', protect, updateLastRead);

export default router;
