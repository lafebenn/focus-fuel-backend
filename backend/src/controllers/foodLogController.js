import pool from '../config/database.js';
 
export const getFoodLogs = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    
    const result = await pool.query(
      `SELECT 
        fl.FoodLogID,
        fl.LoggedAt,
        COALESCE(
          json_agg(
            json_build_object(
              'FoodID', f.FoodID,
              'FoodName', f.FoodName,
              'IsCommon', f.IsCommon
            )
          ) FILTER (WHERE f.FoodID IS NOT NULL),
          '[]'
        ) as foods
      FROM FoodLogs fl
      LEFT JOIN FoodLogItems fli ON fl.FoodLogID = fli.FoodLogID
      LEFT JOIN Foods f ON fli.FoodID = f.FoodID
      WHERE fl.UserID = $1
      GROUP BY fl.FoodLogID, fl.LoggedAt
      ORDER BY fl.LoggedAt DESC`,
      [userId]
    );
 
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching food logs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch food logs',
      message: error.message 
    });
  }
};
 
export const addFoodLog = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { userId = 1, foodName, emoji } = req.body;
 
    if (!foodName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Food name is required' 
      });
    }
 
    await client.query('BEGIN');
 
    let foodId;
    const existingFood = await client.query(
      'SELECT FoodID FROM Foods WHERE LOWER(FoodName) = LOWER($1)',
      [foodName]
    );
 
    if (existingFood.rows.length > 0) {
      foodId = existingFood.rows[0].foodid;
    } else {
      const newFood = await client.query(
        'INSERT INTO Foods (FoodName, IsCommon) VALUES ($1, false) RETURNING FoodID',
        [foodName]
      );
      foodId = newFood.rows[0].foodid;
    }
 
    const foodLogResult = await client.query(
      'INSERT INTO FoodLogs (UserID, LoggedAt) VALUES ($1, CURRENT_TIMESTAMP) RETURNING FoodLogID, LoggedAt',
      [userId]
    );
 
    const foodLogId = foodLogResult.rows[0].foodlogid;
    const loggedAt = foodLogResult.rows[0].loggedat;
 
    await client.query(
      `INSERT INTO OkrMealMoodKr1 (FoodLogID, UserID, MealLoggedAt, Satisfied)
       VALUES ($1, $2, $3, false)`,
      [foodLogId, userId, loggedAt]
    );

    await client.query(
      'INSERT INTO FoodLogItems (FoodLogID, FoodID) VALUES ($1, $2)',
      [foodLogId, foodId]
    );
 
    await client.query('COMMIT');
 
    res.status(201).json({
      success: true,
      message: 'Food logged successfully',
      data: {
        foodLogId,
        foodId,
        foodName,
        emoji: emoji || '🍽️',
        loggedAt,
        userId
      }
    });
 
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding food log:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add food log',
      message: error.message 
    });
  } finally {
    client.release();
  }
};
 
export const updateFoodLogTime = async (req, res) => {
  try {
    const { foodLogId } = req.params;
    const { userId = 1, loggedAt } = req.body;
 
    if (!loggedAt) {
      return res.status(400).json({
        success: false,
        error: 'loggedAt timestamp is required'
      });
    }
 
    const newTime = new Date(loggedAt);
    if (isNaN(newTime.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid timestamp format'
      });
    }
 
    if (newTime > new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Time cannot be in the future'
      });
    }
 
    const result = await pool.query(
      'UPDATE FoodLogs SET LoggedAt = $1 WHERE FoodLogID = $2 AND UserID = $3 RETURNING FoodLogID, LoggedAt',
      [newTime.toISOString(), foodLogId, userId]
    );
 
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Food log not found or unauthorized'
      });
    }
 
    // Keep OKR tracking in sync if a meal time is edited.
    // Reset satisfaction, then re-check whether a mood exists within 2 hours after the new meal time.
    await pool.query(
      `UPDATE OkrMealMoodKr1
       SET MealLoggedAt = $1, Satisfied = false, SatisfiedAt = NULL, SatisfiedMentalLogID = NULL
       WHERE FoodLogID = $2 AND UserID = $3`,
      [newTime.toISOString(), foodLogId, userId]
    );

    const satisfied = await pool.query(
      `SELECT Mental_Log_ID, LoggedAt
       FROM MentalLogs
       WHERE UserID = $1
         AND LoggedAt >= $2
         AND LoggedAt <= ($2::timestamp + interval '2 hours')
       ORDER BY LoggedAt ASC
       LIMIT 1`,
      [userId, newTime.toISOString()]
    );

    if (satisfied.rows.length > 0) {
      await pool.query(
        `UPDATE OkrMealMoodKr1
         SET Satisfied = true, SatisfiedAt = $1, SatisfiedMentalLogID = $2
         WHERE FoodLogID = $3 AND UserID = $4`,
        [satisfied.rows[0].loggedat, satisfied.rows[0].mental_log_id, foodLogId, userId]
      );
    }

    res.json({
      success: true,
      message: 'Food log time updated successfully',
      data: {
        foodLogId: result.rows[0].foodlogid,
        loggedAt: result.rows[0].loggedat
      }
    });
  } catch (error) {
    console.error('Error updating food log time:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update food log time',
      message: error.message
    });
  }
};
 
export const deleteFoodLog = async (req, res) => {
  try {
    const { foodLogId } = req.params;
    const userId = req.query.userId || 1;
 
    const result = await pool.query(
      'DELETE FROM FoodLogs WHERE FoodLogID = $1 AND UserID = $2 RETURNING FoodLogID',
      [foodLogId, userId]
    );
 
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Food log not found or unauthorized' 
      });
    }
 
    res.json({
      success: true,
      message: 'Food log deleted successfully',
      data: { foodLogId: result.rows[0].foodlogid }
    });
  } catch (error) {
    console.error('Error deleting food log:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete food log',
      message: error.message 
    });
  }
};
 
export const getTodaysFoodLogs = async (req, res) => {
  try {
    const userId = req.query.userId || 1;
    
    const result = await pool.query(
      `SELECT 
        fl.FoodLogID,
        fl.LoggedAt,
        f.FoodID,
        f.FoodName
      FROM FoodLogs fl
      JOIN FoodLogItems fli ON fl.FoodLogID = fli.FoodLogID
      JOIN Foods f ON fli.FoodID = f.FoodID
      WHERE fl.UserID = $1 
        AND DATE(fl.LoggedAt) = CURRENT_DATE
      ORDER BY fl.LoggedAt DESC`,
      [userId]
    );
 
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching today food logs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch today\'s food logs',
      message: error.message 
    });
  }
};