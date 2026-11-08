/**
 * app.js – Main entry point (ES6 Module)
 * Connects all modules, handles events, orchestrates the app
 * Demonstrates: ES6 Modules, Event Listeners, Variables, Operators
 */

import {
  getTransactions, setTransactions, addTransaction, updateTransaction,
  deleteTransaction, getTransactionById, filterTransactions,
  calculateStats, getExpensesByCategory
} from './transaction.js';
import { saveTransactions, loadTransactions, saveTheme, loadTheme } from './storage.js';
import {
  initElements, populateCategories, setDefaultDate, updateStats,
  renderTransactions, fillEditForm, resetForm, showFormError,
  showDeleteModal, showToast, applyTheme, getFormData, els,
  renderBudgets
} from './ui.js';
import { updateCharts } from './charts.js';
import {
  loadBudgets, setBudgetLimit, removeBudgetLimit, checkBudgets
} from './budget.js';

let deleteTargetId = null; // Variable to track which transaction to delete
let currentTheme = 'light'; // Variable for theme state

/** Refresh budget panel */
const refreshBudgets = () => {
  const categoryData = getExpensesByCategory();
  const budgets = loadBudgets();
  const alerts = checkBudgets(categoryData);
  renderBudgets(alerts, budgets, (cat) => {
    removeBudgetLimit(cat);
    refreshBudgets();
  });
};

/** Refresh entire UI from current data */
const refreshUI = () => {
  const stats = calculateStats();
  updateStats(stats);

  // Read all active filters
  const search = els.searchInput.value;
  const filter = els.filterType.value;
  const period = els.filterPeriod.value;
  const dateFrom = els.dateFrom.value;
  const dateTo = els.dateTo.value;

  const filtered = filterTransactions(search, filter, dateFrom, dateTo, period);
  renderTransactions(filtered, handleEdit, handleDeleteRequest);

  const categoryData = getExpensesByCategory();
  updateCharts(stats, categoryData);

  refreshBudgets();

  // Save to localStorage
  const data = getTransactions().map(tx => tx.toJSON());
  saveTransactions(data);
};

/** Handle form submit (add or update) */
const handleSubmit = (e) => {
  e.preventDefault();
  const { id, title, amount, category, type, date } = getFormData();

  let result;
  if (id) {
    result = updateTransaction(id, title, amount, category, type, date);
    if (result.success) showToast('Transaction updated!');
  } else {
    result = addTransaction(title, amount, category, type, date);
    if (result.success) showToast('Transaction added!');
  }

  if (!result.success) {
    showFormError(result.error);
    return;
  }

  resetForm();
  refreshUI();
};

/** Handle edit button click */
const handleEdit = (id) => {
  const tx = getTransactionById(id);
  if (tx) fillEditForm(tx);
};

/** Show delete confirmation */
const handleDeleteRequest = (id) => {
  deleteTargetId = id;
  showDeleteModal(true);
};

/** Confirm delete */
const handleConfirmDelete = () => {
  if (deleteTargetId) {
    deleteTransaction(deleteTargetId);
    deleteTargetId = null;
    showDeleteModal(false);
    showToast('Transaction deleted!');
    refreshUI();
  }
};

/** Toggle theme */
const toggleTheme = () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  saveTheme(currentTheme);
  refreshUI();
};

/** Handle budget form submit */
const handleBudgetSubmit = (e) => {
  e.preventDefault();
  const cat = els.budgetCategory.value;
  const amt = parseFloat(els.budgetAmount.value);
  if (!cat || isNaN(amt) || amt <= 0) return;
  setBudgetLimit(cat, amt);
  els.budgetAmount.value = '';
  showToast(`Budget set for ${cat}!`);
  refreshBudgets();
};

/** When period filter changes, clear date range inputs (they conflict) */
const handlePeriodChange = () => {
  if (els.filterPeriod.value !== 'all') {
    els.dateFrom.value = '';
    els.dateTo.value = '';
  }
  refreshUI();
};

/** When date range changes, reset period filter */
const handleDateRangeChange = () => {
  els.filterPeriod.value = 'all';
  refreshUI();
};

/** Initialize the application */
const init = () => {
  initElements();
  populateCategories();
  setDefaultDate();

  // Load saved data
  const saved = loadTransactions();
  setTransactions(saved);

  // Load theme
  currentTheme = loadTheme();
  applyTheme(currentTheme);

  // Transaction form events
  els.form.addEventListener('submit', handleSubmit);
  els.searchInput.addEventListener('input', refreshUI);
  els.filterType.addEventListener('change', refreshUI);
  els.filterPeriod.addEventListener('change', handlePeriodChange);
  els.dateFrom.addEventListener('change', handleDateRangeChange);
  els.dateTo.addEventListener('change', handleDateRangeChange);

  // Delete modal events
  els.confirmDelete.addEventListener('click', handleConfirmDelete);
  els.cancelDelete.addEventListener('click', () => showDeleteModal(false));

  // Theme toggle
  els.themeToggle.addEventListener('click', toggleTheme);

  // Budget form
  if (els.budgetForm) els.budgetForm.addEventListener('submit', handleBudgetSubmit);

  refreshUI();
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
