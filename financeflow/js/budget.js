/**
 * budget.js
 * Budget limit management per category
 * Demonstrates: Objects, localStorage, for...in loops, comparison operators
 */

const BUDGET_KEY = 'financeflow_budgets';

/** Load budgets from localStorage – returns plain object { category: limit } */
export const loadBudgets = () => {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load budgets:', e.message);
    return {};
  }
};

/** Save budgets object to localStorage */
export const saveBudgets = (budgets) => {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
  } catch (e) {
    console.error('Failed to save budgets:', e.message);
  }
};

/** Set a budget limit for a category */
export const setBudgetLimit = (category, limit) => {
  const budgets = loadBudgets();
  budgets[category] = parseFloat(limit);
  saveBudgets(budgets);
};

/** Remove budget limit for a category */
export const removeBudgetLimit = (category) => {
  const budgets = loadBudgets();
  delete budgets[category];
  saveBudgets(budgets);
};

/**
 * Check all categories against their budgets.
 * Returns array of { category, spent, limit, percent, exceeded }
 * Demonstrates: for...in loop, objects, arithmetic operators
 */
export const checkBudgets = (expensesByCategory) => {
  const budgets = loadBudgets();
  const alerts = [];

  for (const category in budgets) {
    const limit = budgets[category];
    const spent = expensesByCategory[category] || 0;
    const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const exceeded = spent > limit;

    alerts.push({ category, spent, limit, percent, exceeded });
  }

  // Sort: exceeded first, then by percent descending
  alerts.sort((a, b) => {
    if (a.exceeded && !b.exceeded) return -1;
    if (!a.exceeded && b.exceeded) return 1;
    return b.percent - a.percent;
  });

  return alerts;
};
