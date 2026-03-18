import express from 'express';
import {
  getMoodLogs,
  getTodaysMoodLogs,
  addMoodLog,
  deleteMoodLog,
} from '../controllers/moodLogController.js';

const router = express.Router();

router.get('/', getMoodLogs);
router.get('/today', getTodaysMoodLogs);
router.post('/', addMoodLog);
router.delete('/:mentalLogId', deleteMoodLog);

export default router;
