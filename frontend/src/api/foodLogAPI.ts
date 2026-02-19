const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = '1';
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const foodLogAPI = {
  async getAll() {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/foodlogs?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch food logs');
    }
    return response.json();
  },

  async getToday() {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/foodlogs/today?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch today\'s food logs');
    }
    return response.json();
  },

  async add(foodName, emoji = '🍽️') {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/foodlogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: parseInt(userId),
        foodName,
        emoji,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add food log');
    }

    return response.json();
  },

  async delete(foodLogId) {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/foodlogs/${foodLogId}?userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete food log');
    }

    return response.json();
  },
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
