import pool from '../config/database.js';

export const getKr1 = async (req, res) => {
  try {
    const userId = req.query.userId || 1;

    const totals = await pool.query(
      `SELECT
         COUNT(*)::int AS meals_total,
         COUNT(*) FILTER (WHERE Satisfied = true)::int AS meals_with_mood_within_2h
       FROM OkrMealMoodKr1
       WHERE UserID = $1`,
      [userId]
    );

    const mealsTotal = totals.rows[0]?.meals_total ?? 0;
    const mealsWithMoodWithin2h = totals.rows[0]?.meals_with_mood_within_2h ?? 0;
    const percent = mealsTotal === 0 ? 0 : (mealsWithMoodWithin2h / mealsTotal) * 100;

    res.json({
      success: true,
      data: {
        objective: 'Objective 1: Establish the link between food and mood for the user',
        keyResult: 'KR1: 60% of users log a Mood Check-in within 2 hours of logging a meal',
        userId: Number(userId),
        mealsTotal,
        mealsWithMoodWithin2h,
        percent,
        targetPercent: 60,
      },
    });
  } catch (error) {
    console.error('Error fetching OKR KR1:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch OKR KR1', message: error.message });
  }
};

