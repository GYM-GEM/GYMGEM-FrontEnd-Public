const HISTORY_KEY = 'gg_food_history';
const MAX_HISTORY = 5;

export const foodHistory = {
  getHistory: () => {
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading food history:', error);
      return [];
    }
  },

  saveMeal: (meal) => {
    try {
      const history = foodHistory.getHistory();
      
      // Create new record with unique ID and timestamp
      const newMeal = {
        ...meal,
        id: meal.id || Date.now().toString(),
        timestamp: new Date().toISOString(),
      };

      // Check if meal with same content already exists to avoid duplicates if re-analyzing
      const existingIndex = history.findIndex(m => m.id === newMeal.id);
      
      let updatedHistory;
      if (existingIndex > -1) {
        // Update existing
        updatedHistory = [newMeal, ...history.filter(m => m.id !== newMeal.id)];
      } else {
        // Add new to top
        updatedHistory = [newMeal, ...history];
      }

      // Limit to MAX_HISTORY
      updatedHistory = updatedHistory.slice(0, MAX_HISTORY);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      console.error('Error saving food history:', error);
      return [];
    }
  },

  deleteMeal: (id) => {
    try {
      const history = foodHistory.getHistory();
      const updatedHistory = history.filter(meal => meal.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      console.error('Error deleting meal record:', error);
      return [];
    }
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
  },

  getMealById: (id) => {
    const history = foodHistory.getHistory();
    return history.find(meal => meal.id === id);
  }
};
