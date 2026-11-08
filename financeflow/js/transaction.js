/**
 * transaction.js
 * Business logic: validation, CRUD, calculations
 * Demonstrates: Functions, Arrow Functions, Arrays, if-else, Array Methods
 */

import { Transaction, TYPES, CATEGORIES } from './transactionClass.js';

let transactions = []; // Array to hold all transactions

/** Get all transactions */
export const getTransactions = () => transactions;

/** Set transactions (used when loading from storage) */
export const setTransactions = (data) => {
  transactions = data.map(obj => Transaction.fromJSON(obj));
};

/** Validate form fields – returns error message or empty string */
export const validateTransaction = (title, amount, category, type, date) => {
  if (!title || title.trim() === '') return 'Title is required.';
  if (!amount || parseFloat(amount) <= 0) return 'Amount must be greater than zero.';
  if (!category) return 'Please select a category.';
  if (!type) return 'Please select a type.';
  if (!date) return 'Date is required.';
  return '';
};

/** Add a new transaction */
export const addTransaction = (title, amount, category, type, date) => {
  const error = validateTransaction(title, amount, category, type, date);
  if (error) return { success: false, error };

  const tx = new Transaction(title, amount, category, type, date);
  transactions.push(tx);
  return { success: true, transaction: tx };
};

/** Update existing transaction by ID */
export const updateTransaction = (id, title, amount, category, type, date) => {
  const error = validateTransaction(title, amount, category, type, date);
  if (error) return { success: false, error };

  const index = transactions.findIndex(tx => tx.id === id); // find method
  if (index === -1) return { success: false, error: 'Transaction not found.' };

  transactions[index] = new Transaction(title, amount, category, type, date, id);
  return { success: true };
};

/** Delete transaction by ID */
export const deleteTransaction = (id) => {
  transactions = transactions.filter(tx => tx.id !== id); // filter method
};

/** Get transaction by ID */
export const getTransactionById = (id) => transactions.find(tx => tx.id === id);

/**
 * Get the Monday of the current week (ISO week)
 * Demonstrates: Date object, arithmetic operators
 */
const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon ...
  const diff = (day === 0 ? -6 : 1 - day); // adjust to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * Get the first day of the current month
 * Demonstrates: Date object, setDate
 */
const getMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

/** Filter & search transactions */
export const filterTransactions = (search = '', typeFilter = 'all', dateFrom = '', dateTo = '', period = 'all') => {
  let result = [...transactions];

  // --- Period filter (this week / this month) ---
  if (period === 'week') {
    const weekStart = getWeekStart();
    result = result.filter(tx => new Date(tx.date) >= weekStart);
  } else if (period === 'month') {
    const monthStart = getMonthStart();
    result = result.filter(tx => new Date(tx.date) >= monthStart);
  }

  // --- Date range filter using Date object comparisons ---
  if (dateFrom) {
    const from = new Date(dateFrom);
    result = result.filter(tx => new Date(tx.date) >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo);
    result = result.filter(tx => new Date(tx.date) <= to);
  }

  // Filter by type using if-else
  if (typeFilter === TYPES.INCOME) {
    result = result.filter(tx => tx.type === TYPES.INCOME);
  } else if (typeFilter === TYPES.EXPENSE) {
    result = result.filter(tx => tx.type === TYPES.EXPENSE);
  }

  // Search by title or category
  if (search.trim()) {
    const term = search.toLowerCase();
    result = result.filter(tx =>
      tx.title.toLowerCase().includes(term) ||
      tx.category.toLowerCase().includes(term)
    );
  }

  // Sort by date (newest first) using Date object
  result.sort((a, b) => new Date(b.date) - new Date(a.date));
  return result;
};

/** Calculate dashboard stats using reduce */
export const calculateStats = () => {
  const income = transactions
    .filter(tx => tx.type === TYPES.INCOME)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expenses = transactions
    .filter(tx => tx.type === TYPES.EXPENSE)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = income - expenses;
  const savings = balance > 0 ? balance : 0;

  return { income, expenses, balance, savings };
};

/** Get expense totals grouped by category (for pie chart) */
export const getExpensesByCategory = () => {
  const expenseTxs = transactions.filter(tx => tx.type === TYPES.EXPENSE);
  const grouped = {};

  // Loop through expenses and group by category
  for (let i = 0; i < expenseTxs.length; i++) {
    const cat = expenseTxs[i].category;
    grouped[cat] = (grouped[cat] || 0) + expenseTxs[i].amount;
  }
  return grouped;
};

export { CATEGORIES, TYPES };
