import express from 'express';
import { getDuas } from '../controllers/duaController.js';

const router = express.Router();

router.get('/', getDuas);

export default router;
