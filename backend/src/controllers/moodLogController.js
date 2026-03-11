import pool from '../config/database.js';

// DB columns ↔ Frontend fields mapping:
//   BrainFog   = 10 - clarity    (high fog = low clarity)
//   Exhaustion = 10 - energy     (high exhaustion = low energy)
//   Stress     = stress          (direct — higher = more stressed)
//   Burnout    = 10 - focus      (high burnout = low focus)
//   FocusScore = focus           (direct)

function dbRowToFrontend(row) {
  return {
    id: String(row.mental_log_id),
    timestamp: row.loggedat,
    clarity: 10 - (row.brainfog ?? 5),
    energy: 10 - (row.exhaustion ?? 5),
    stress: row.stress ?? 5,
    focus: row.focusscore ?? 5,
    note: row.note || undefined,
  };
}

export const getMoodLogs = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const result = await pool.query(
      `SELECT Mental_Log_ID, BrainFog, Exhaustion, Stress, Burnout, FocusScore, Note, LoggedAt
       FROM MentalLogs
       WHERE UserID = $1
       ORDER BY LoggedAt DESC`,
      [userId]
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows.map(dbRowToFrontend),
    });
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch mood logs', message: error.message });
  }
};

export const getTodaysMoodLogs = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    const result = await pool.query(
      `SELECT Mental_Log_ID, BrainFog, Exhaustion, Stress, Burnout, FocusScore, Note, LoggedAt
       FROM MentalLogs
       WHERE UserID = $1 AND DATE(LoggedAt) = CURRENT_DATE
       ORDER BY LoggedAt DESC`,
      [userId]
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows.map(dbRowToFrontend),
    });
  } catch (error) {
    console.error('Error fetching today mood logs:', error);
    res.status(500).json({ success: false, error: "Failed to fetch today's mood logs", message: error.message });
  }
};

export const addMoodLog = async (req, res) => {
  try {
    const { userId = 1, clarity, energy, stress, focus, note } = req.body;

    if (clarity === undefined || energy === undefined || stress === undefined || focus === undefined) {
      return res.status(400).json({ success: false, error: 'clarity, energy, stress, and focus are required' });
    }

    const brainFog = 10 - Number(clarity);
    const exhaustion = 10 - Number(energy);
    const burnout = 10 - Number(focus);
    const focusScore = Number(focus);
    const stressVal = Number(stress);

    const result = await pool.query(
      `INSERT INTO MentalLogs (UserID, BrainFog, Exhaustion, Stress, Burnout, FocusScore, Note, LoggedAt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       RETURNING Mental_Log_ID, BrainFog, Exhaustion, Stress, Burnout, FocusScore, Note, LoggedAt`,
      [userId, brainFog, exhaustion, stressVal, burnout, focusScore, note || null]
    );

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      data: dbRowToFrontend(result.rows[0]),
    });
  } catch (error) {
    console.error('Error adding mood log:', error);
    res.status(500).json({ success: false, error: 'Failed to add mood log', message: error.message });
  }
};

export const deleteMoodLog = async (req, res) => {
  try {
    const { mentalLogId } = req.params;
    const userId = req.query.userId || 1;
    const result = await pool.query(
      'DELETE FROM MentalLogs WHERE Mental_Log_ID = $1 AND UserID = $2 RETURNING Mental_Log_ID',
      [mentalLogId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mood log not found or unauthorized' });
    }
    res.json({ success: true, message: 'Mood log deleted', data: { id: result.rows[0].mental_log_id } });
  } catch (error) {
    console.error('Error deleting mood log:', error);
    res.status(500).json({ success: false, error: 'Failed to delete mood log', message: error.message });
  }
};
