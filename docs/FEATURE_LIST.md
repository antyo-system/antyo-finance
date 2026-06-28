# Antyo Finance - Feature Inventory & Checklist

This document serves as the absolute ground truth for features that have been *implemented* versus what is *planned*. 
If a feature is checked here, it exists in the codebase and is fully functional.

## 💰 1. Core Budgeting Engine
- [ ] **Category Management:** Users can create, edit, and delete spending categories with customizable icons and colors.
- [ ] **Monthly Budget Setting:** Set spending limits per category per month.
- [ ] **Budget Progress Tracking:** Visual progress bars showing budget consumption per category in real-time.
- [ ] **Budget vs Actual View:** Side-by-side comparison of planned budget versus actual spending per category.
- [ ] **Rollover Budgets:** Option to carry over unspent budget to the next month.

## 💳 2. Transaction Engine
- [ ] **Quick Transaction Entry:** Fast input with amount, category, date, and optional notes.
- [ ] **Smart Categorization:** Auto-suggest categories based on transaction description patterns.
- [ ] **Recurring Transactions:** Set up auto-repeating entries for bills, subscriptions, and salary.
- [ ] **Transaction Search & Filter:** Search by amount, category, date range, or notes.
- [ ] **Transaction Editing:** Full CRUD (create, read, update, delete) for all transactions.
- [ ] **Multi-Account Support:** Track transactions across multiple accounts (cash, bank, e-wallet).

## 📊 3. Dashboard & Statistics
- [ ] **Financial Dashboard:** At-a-glance summary showing total balance, monthly income, monthly expenses, and budget remaining.
- [ ] **Category Breakdown Chart:** Donut/pie chart showing spending distribution by category.
- [ ] **Weekly/Monthly Trend Chart:** Bar chart comparing spending week-over-week and month-over-month.
- [ ] **Budget Health Score:** Proprietary score (0-100) measuring budgeting discipline and consistency.
- [ ] **Spending Heatmap:** Calendar-style grid showing daily spending intensity.
- [ ] **Income vs Expense Overview:** Clear visualization of money in vs money out.

## 🎯 4. Savings & Goals
- [ ] **Savings Goals:** Create visual savings targets (e.g., "Emergency Fund: Rp 50,000,000") with progress tracking.
- [ ] **Goal Milestones:** Celebrate reaching savings milestones with animations.
- [ ] **Auto-Save Rules:** Set rules to automatically allocate leftover budget to savings goals.

## 🛠️ 5. Infrastructure & Settings
- [ ] **100% Local-First Storage:** Custom `expo-file-system` adapter to ensure Zustand state is never lost on Expo Go/Bare workflow.
- [ ] **Settings Control:** Configure currency, date format, first day of week, and notification preferences.
- [ ] **Data Portability:** Export full data as Backup (JSON) or Transactions to Excel (CSV).
- [ ] **Onboarding Flow:** Interactive multi-step tutorial explaining the Budget vs Reality concept.
- [ ] **Theme Customization:** Support for System, Light, and Dark Mode.
- [ ] **Changelog System:** In-app popup to notify users of version updates.
- [ ] **Currency Formatting:** Proper locale-aware currency display (Rp, $, €, etc.).

---

## 🚀 Upcoming / Backlog (Phase 2 & Beyond)
- [ ] **Financial Health Score & Gamification:** Identity-driven financial scoring system.
- [ ] **Milestone Sharing:** Aesthetic export images for social media when hitting savings milestones.
- [ ] **Widgets:** iOS/Android home screen budget summary widgets.
- [ ] **Cloud Sync:** Clerk + Supabase integration for multi-device sync.
- [ ] **AI Spending Insights (Pro):** Smart analysis of spending patterns and suggestions.
- [ ] **Pro Paywall:** Premium subscription logic UI with Freemium model.
