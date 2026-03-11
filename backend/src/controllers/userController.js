import pool from '../config/database.js';

export const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const userResult = await pool.query(
      `SELECT UserID, Username, Reminder_Frequency, Reminder_Time, PushNotifications
       FROM Users WHERE UserID = $1`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const user = userResult.rows[0];

    const allergyResult = await pool.query(
      `SELECT a.AllergyID, a.AllergyName
       FROM UserAllergies ua
       JOIN Allergies a ON ua.AllergyID = a.AllergyID
       WHERE ua.UserID = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        notifications: user.pushnotifications ?? false,
        reminderFrequency: (user.reminder_frequency || 'daily').toLowerCase(),
        reminderTime: user.reminder_time ? user.reminder_time.slice(0, 5) : '19:15',
        allergies: allergyResult.rows.map(r => r.allergyname),
      },
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch settings', message: error.message });
  }
};

export const updateUserSettings = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.params;
    const { notifications, reminderFrequency, reminderTime, allergies } = req.body;

    await client.query('BEGIN');

    if (notifications !== undefined || reminderFrequency !== undefined || reminderTime !== undefined) {
      const sets = [];
      const vals = [];
      let idx = 1;

      if (notifications !== undefined) {
        sets.push(`PushNotifications = $${idx++}`);
        vals.push(notifications);
      }
      if (reminderFrequency !== undefined) {
        sets.push(`Reminder_Frequency = $${idx++}`);
        vals.push(reminderFrequency);
      }
      if (reminderTime !== undefined) {
        sets.push(`Reminder_Time = $${idx++}`);
        vals.push(reminderTime + ':00');
      }

      if (sets.length > 0) {
        vals.push(userId);
        await client.query(
          `UPDATE Users SET ${sets.join(', ')} WHERE UserID = $${idx}`,
          vals
        );
      }
    }

    if (allergies !== undefined && Array.isArray(allergies)) {
      await client.query('DELETE FROM UserAllergies WHERE UserID = $1', [userId]);

      for (const name of allergies) {
        let allergyRow = await client.query(
          'SELECT AllergyID FROM Allergies WHERE LOWER(AllergyName) = LOWER($1)',
          [name]
        );
        let allergyId;
        if (allergyRow.rows.length > 0) {
          allergyId = allergyRow.rows[0].allergyid;
        } else {
          const ins = await client.query(
            'INSERT INTO Allergies (AllergyName) VALUES ($1) RETURNING AllergyID',
            [name]
          );
          allergyId = ins.rows[0].allergyid;
        }
        await client.query(
          'INSERT INTO UserAllergies (UserID, AllergyID) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, allergyId]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating user settings:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings', message: error.message });
  } finally {
    client.release();
  }
};
