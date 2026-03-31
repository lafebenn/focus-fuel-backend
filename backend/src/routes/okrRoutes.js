import express from 'express';
import { getKr1 } from '../controllers/okrController.js';

const router = express.Router();

router.get('/kr1', getKr1);

export default router;

