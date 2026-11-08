# FinanceFlow – Video Script
**Duration: ~2.5–3 minutes**

---

## INTRO (0:00 – 0:20)
"Hi, I'm [Your Name]. This is **FinanceFlow** — a personal finance tracker built with pure HTML, CSS, and Vanilla JavaScript, covering concepts from Cisco JS Essentials 1 and 2. No frameworks, just clean JS."

---

## PROJECT STRUCTURE (0:20 – 0:40)
"The project is split into ES6 modules — each file has one job.
- `transactionClass.js` — the Class
- `transaction.js` — business logic
- `storage.js` — localStorage
- `ui.js` — DOM manipulation
- `charts.js` — Chart.js graphs
- `app.js` — ties everything together"

---

## LIVE DEMO (0:40 – 1:40)
*(Show the app running in browser)*

"On the dashboard you see four stat cards — Balance, Income, Expenses, and Savings, calculated using **filter and reduce** on the transactions array.

Adding a transaction runs form validation with **if-else**, creates a **new Transaction class instance**, and saves it to **localStorage as JSON**.

The list supports search, type filter, and — newly added — **This Week, This Month**, and a **custom date range filter** using the Date object.

Down here is the **Budget Limits panel**. Set a limit per category. A progress bar tracks spending — green means safe, orange is a warning at 80%, red means exceeded. This uses a **for...in loop** over a budgets object."

---

## CHARTS (1:40 – 2:05)
"The analytics section has two Chart.js charts. The doughnut shows expenses by category — grouped using a **for loop into an object**. The bar chart compares income vs expenses, styled like Tableau — flat bars, value labels on top, dashed gridlines."

---

## KEY CONCEPTS COVERED (2:05 – 2:30)
"In total this project demonstrates:
**Variables, Functions, Arrays, Objects, Classes, DOM Manipulation, Event Listeners, JSON, localStorage, Date Object, ES6 Modules, and try-catch** — the full JS Essentials 1 and 2 curriculum in one app."

---

## OUTRO (2:30 – 2:50)
"That's FinanceFlow — a simple, practical project that brings every JS concept together in something you'd actually use. Thanks for watching!"

---
*Tip: Keep the demo moving — don't pause too long on any one screen.*
