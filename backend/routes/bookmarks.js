import express from 'express';
import { getBookmarks, addBookmark, removeBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:surahNumber/:ayahNumber', removeBookmark);

export default router;
