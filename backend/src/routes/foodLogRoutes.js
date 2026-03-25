import express from 'express';
import { 
  getFoodLogs, 
  addFoodLog, 
  deleteFoodLog,
  getTodaysFoodLogs,
  updateFoodLogTime
} from '../controllers/foodLogController.js';
 
const router = express.Router();
 
router.get('/', getFoodLogs);
 
router.get('/today', getTodaysFoodLogs);
 
router.post('/', addFoodLog);
 
router.patch('/:foodLogId', updateFoodLogTime);
 
router.delete('/:foodLogId', deleteFoodLog);
 
export default router;