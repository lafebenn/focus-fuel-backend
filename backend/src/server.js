import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import foodLogRoutes from './routes/foodLogRoutes.js';
import moodLogRoutes from './routes/moodLogRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      message: 'FocusFuel API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.json({
      status: 'OK',
      message: 'FocusFuel API is running',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/api/foodlogs', foodLogRoutes);
app.use('/api/moodlogs', moodLogRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
