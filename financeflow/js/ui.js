/**
 * ui.js
 * DOM manipulation and UI updates
 * Demonstrates: DOM Manipulation, Event Listeners, Template Literals
 */

import { CATEGORIES, TYPES } from './transaction.js';

// DOM element references
const els = {};

/** Build a progress bar color based on percent */
const budgetBarColor = (percent, exceeded) => {
  if (exceeded) return 'var(--expense)';
  if (percent >= 80) return '#F28E2B'; // Tableau orange – warning
  return 'var(--income)';
};

/** Cache all DOM elements on init */
export const initElements = () => {
  els.form = document.getElementById('transactionForm');
  els.editId = document.getElementById('editId');
  els.title = document.getElementById('title');
  els.amount = document.getElementById('amount');
  els.category = document.getElementById('category');
  els.type = document.getElementById('type');
  els.date = document.getElementById('date');
  els.formError = document.getElementById('formError');
  els.submitBtn = document.getElementById('submitBtn');
  els.list = document.getElementById('transactionList');
  els.emptyMsg = document.getElementById('emptyMsg');
  els.searchInput = document.getElementById('searchInput');
  els.filterType = document.getElementById('filterType');
  els.filterPeriod = document.getElementById('filterPeriod');
  els.dateFrom = document.getElementById('dateFrom');
  els.dateTo = document.getElementById('dateTo');
  els.totalBalance = document.getElementById('totalBalance');
  els.totalIncome = document.getElementById('totalIncome');
  els.totalExpenses = document.getElementById('totalExpenses');
  els.totalSavings = document.getElementById('totalSavings');
  els.deleteModal = document.getElementById('deleteModal');
  els.confirmDelete = document.getElementById('confirmDelete');
  els.cancelDelete = document.getElementById('cancelDelete');
  els.toast = document.getElementById('toast');
  els.themeToggle = document.getElementById('themeToggle');
  els.budgetList = document.getElementById('budgetList');
  els.budgetCategory = document.getElementById('budgetCategory');
  els.budgetAmount = document.getElementById('budgetAmount');
  els.budgetForm = document.getElementById('budgetForm');
};

/** Populate category dropdown */
export const populateCategories = () => {
  const options = CATEGORIES
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');
  els.category.innerHTML = options;
  if (els.budgetCategory) els.budgetCategory.innerHTML = options;
};

/** Set default date to today */
export const setDefaultDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  els.date.value = `${yyyy}-${mm}-${dd}`;
};

/** Update dashboard stat cards */
export const updateStats = (stats) => {
  els.totalBalance.textContent = `₹${stats.balance.toFixed(2)}`;
  els.totalIncome.textContent = `₹${stats.income.toFixed(2)}`;
  els.totalExpenses.textContent = `₹${stats.expenses.toFixed(2)}`;
  els.totalSavings.textContent = `₹${stats.savings.toFixed(2)}`;
};

/** Render transaction list */
export const renderTransactions = (transactions, onEdit, onDelete) => {
  els.list.innerHTML = '';

  if (transactions.length === 0) {
    els.emptyMsg.style.display = 'block';
    return;
  }
  els.emptyMsg.style.display = 'none';

  transactions.forEach(tx => {
    const li = document.createElement('li');
    const sign = tx.type === TYPES.INCOME ? '+' : '-';
    li.innerHTML = `
      <span class="tx-type-dot ${tx.type}"></span>
      <div class="tx-info">
        <p class="tx-title">${tx.title}</p>
        <p class="tx-meta">${tx.category} · ${tx.date}</p>
      </div>
      <span class="tx-amount ${tx.type}">${sign}₹${tx.amount.toFixed(2)}</span>
      <div class="tx-actions">
        <button class="btn btn-icon edit-btn" data-id="${tx.id}" aria-label="Edit">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn btn-icon btn-danger-icon delete-btn" data-id="${tx.id}" aria-label="Delete">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
        </button>
      </div>
    `;
    els.list.appendChild(li);
  });

  // Event listeners for edit/delete buttons
  els.list.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => onEdit(btn.dataset.id));
  });
  els.list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => onDelete(btn.dataset.id));
  });
};

/** Fill form for editing */
export const fillEditForm = (tx) => {
  els.editId.value = tx.id;
  els.title.value = tx.title;
  els.amount.value = tx.amount;
  els.category.value = tx.category;
  els.type.value = tx.type;
  els.date.value = tx.date;
  els.submitBtn.textContent = 'Update Transaction';
};

/** Reset form to add mode */
export const resetForm = () => {
  els.form.reset();
  els.editId.value = '';
  els.submitBtn.textContent = 'Add Transaction';
  els.formError.textContent = '';
  setDefaultDate();
};

/** Show form validation error */
export const showFormError = (msg) => { els.formError.textContent = msg; };

/** Show/hide delete modal */
export const showDeleteModal = (show) => {
  els.deleteModal.classList.toggle('hidden', !show);
};

/** Show toast notification */
export const showToast = (message) => {
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  setTimeout(() => els.toast.classList.add('hidden'), 2500);
};

/** Toggle dark/light theme */
export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

/** Get form values */
export const getFormData = () => ({
  id: els.editId.value,
  title: els.title.value,
  amount: els.amount.value,
  category: els.category.value,
  type: els.type.value,
  date: els.date.value
});

/** Render budget alerts/progress bars
 *  alerts = array from checkBudgets()
 *  onRemove = callback(category)
 */
export const renderBudgets = (alerts, budgets, onRemove) => {
  if (!els.budgetList) return;
  if (alerts.length === 0) {
    els.budgetList.innerHTML = '<p class="empty-msg" style="padding:1rem 0">No budgets set. Add one above.</p>';
    return;
  }
  els.budgetList.innerHTML = alerts.map(({ category, spent, limit, percent, exceeded }) => {
    const clampedPct = Math.min(percent, 100);
    const barColor = budgetBarColor(percent, exceeded);
    const statusLabel = exceeded
      ? `<span class="budget-exceeded">Over by ₹${(spent - limit).toFixed(2)}</span>`
      : `<span class="budget-ok">₹${(limit - spent).toFixed(2)} left</span>`;
    return `
      <div class="budget-item${exceeded ? ' budget-item--exceeded' : ''}">
        <div class="budget-item-header">
          <span class="budget-cat">${category}</span>
          <div class="budget-meta">
            ${statusLabel}
            <button class="btn btn-icon btn-danger-icon btn-sm remove-budget-btn" data-cat="${category}" aria-label="Remove budget">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="budget-bar-track">
          <div class="budget-bar-fill" style="width:${clampedPct}%; background:${barColor}"></div>
        </div>
        <div class="budget-amounts">
          <span>₹${spent.toFixed(2)} spent</span>
          <span>${percent}% of ₹${limit.toFixed(2)}</span>
        </div>
      </div>`;
  }).join('');

  els.budgetList.querySelectorAll('.remove-budget-btn').forEach(btn => {
    btn.addEventListener('click', () => onRemove(btn.dataset.cat));
  });
};

export { els };
