/**
 * transactionClass.js
 * ES6 Class demonstrating: Classes, Constructors, Methods, Objects
 */

// Constants for transaction types
export const TYPES = { INCOME: 'income', EXPENSE: 'expense' };

// Array of available categories
export const CATEGORIES = [
  'Salary', 'Freelance', 'Food', 'Shopping', 'Travel',
  'Bills', 'Entertainment', 'Health', 'Education', 'Other'
];

/**
 * Transaction class – each transaction is an object instance
 */
export class Transaction {
  constructor(title, amount, category, type, date, id = null) {
    this.id = id || Date.now().toString(); // unique ID using Date
    this.title = title;
    this.amount = parseFloat(amount);
    this.category = category;
    this.type = type;
    this.date = date;
  }

  // Method: format amount with currency symbol
  formatAmount() {
    const prefix = this.type === TYPES.INCOME ? '+' : '-';
    return `${prefix}₹${this.amount.toFixed(2)}`;
  }

  // Method: convert instance to plain object for JSON storage
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      amount: this.amount,
      category: this.category,
      type: this.type,
      date: this.date
    };
  }

  // Static method: create Transaction from stored object
  static fromJSON(obj) {
    return new Transaction(obj.title, obj.amount, obj.category, obj.type, obj.date, obj.id);
  }
}
