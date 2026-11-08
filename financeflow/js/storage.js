/**
 * storage.js
 * Local Storage operations with JSON
 * Demonstrates: JSON, Local Storage, try-catch, Error Handling
 */

const STORAGE_KEY = 'financeflow_transactions';
const THEME_KEY = 'financeflow_theme';

/** Save transactions array to localStorage */
export const saveTransactions = (transactions) => {
  try {
    const jsonData = JSON.stringify(transactions); // JSON serialization
    localStorage.setItem(STORAGE_KEY, jsonData);
    return true;
  } catch (error) {
    console.error('Failed to save:', error.message);
    return false;
  }
};

/** Load transactions from localStorage */
export const loadTransactions = () => {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEY);
    if (!jsonData) return [];
    return JSON.parse(jsonData); // JSON parsing
  } catch (error) {
    console.error('Failed to load:', error.message);
    return [];
  }
};

/** Save theme preference */
export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

/** Load theme preference */
export const loadTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light';
};
