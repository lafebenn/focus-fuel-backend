const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getUserId = () => localStorage.getItem('userId') || '1';

export const userAPI = {
  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/users/${getUserId()}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(data: {
    notifications?: boolean;
    reminderFrequency?: string;
    reminderTime?: string;
    allergies?: string[];
  }) {
    const res = await fetch(`${API_BASE_URL}/users/${getUserId()}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update settings');
    }
    return res.json();
  },
};
