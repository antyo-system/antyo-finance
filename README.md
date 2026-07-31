<div align="center">
  <h1>Antyo Finance <code>v0.4.0</code> (Web Edition)</h1>
  <p><strong>A minimalist, local-first web application for personal budgeting and spending tracking.</strong></p>
</div>

Antyo Finance helps users quickly understand their monthly money position: how much came in, how much went out, and how much budget remains.

The app stays intentionally simple, elegant, and fast. Built with **Vite + React 19 + Tailwind CSS v4**.

---

## Core Features

### 1. Personal Finance Dashboard
- Current month Net Balance hero card.
- Income vs Expense summary cards.
- Monthly Budget Summary with total limit, remaining budget, and progress bars.
- Recent Transactions list with quick action triggers.

### 2. Side-by-Side Category Budgets
- Create, edit, and delete spending categories with custom colors.
- Set monthly spending limits per category.
- Visual budget health badges (`Under Budget`, `Approaching Limit`, `Over Budget`).

### 3. Transaction Management
- Add income and expense transactions with date, category, and notes.
- Instant search and type filter (All, Expense, Income).
- Delete transactions with automatic budget recalculation.

### 4. Application Settings
- Currency symbol picker (Rp, $, €, £).
- Theme mode selector (Dark, Light, System).
- 100% local-first data privacy in browser `localStorage`.
- Release Notes popup and Factory Data Reset capability.

---

## Tech Stack

- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Lucide React Icons
- **State Management:** Zustand + `localStorage` persistence
- **Dates & Time:** `date-fns`

---

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. Build production bundle:
   ```bash
   npm run build
   ```

Refer to [AGENTS.md](./AGENTS.md) for project guidelines and standards.
