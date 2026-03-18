const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getUserId = () => localStorage.getItem('userId') || '1';

export const moodLogAPI = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/moodlogs?userId=${getUserId()}`);
    if (!res.ok) throw new Error('Failed to fetch mood logs');
    return res.json();
  },

  async getToday() {
    const res = await fetch(`${API_BASE_URL}/moodlogs/today?userId=${getUserId()}`);
    if (!res.ok) throw new Error("Failed to fetch today's mood logs");
    return res.json();
  },

  async add(data: { clarity: number; energy: number; stress: number; focus: number; note?: string }) {
    const res = await fetch(`${API_BASE_URL}/moodlogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: parseInt(getUserId()), ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to add mood log');
    }
    return res.json();
  },

  async delete(mentalLogId: string) {
    const res = await fetch(`${API_BASE_URL}/moodlogs/${mentalLogId}?userId=${getUserId()}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete mood log');
    return res.json();
  },
};
