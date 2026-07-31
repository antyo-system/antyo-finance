# Antyo Finance - Feature Inventory

This file is the ground truth for what exists in the codebase today versus what is still planned.

## 1. Dashboard
- [x] **Money-First Dashboard:** Shows current-month net balance as the primary number.
- [x] **Income vs Expense Summary:** Shows monthly income and expenses below net balance.
- [x] **Monthly Budget Summary:** Shows total limit, remaining budget, percent spent, and total spent.
- [x] **Recent Transactions:** Shows the latest transactions on the dashboard.
- [ ] **Dashboard Savings Goals:** Deferred. Savings goals should not appear on the current dashboard.
- [ ] **Personal Mirror Copy:** Removed from dashboard.
- [ ] **Dashboard Budget vs Actual Card:** Removed from dashboard; detailed budget progress belongs in the Budget tab.

## 2. Budgeting Engine
- [x] **Category Management:** Users can create and delete spending categories with customizable icons and colors.
- [x] **Monthly Budget Setting:** Users can set spending limits per category.
- [x] **Category Budget Progress:** Budget tab shows actual spending against category limits.
- [x] **Budget Status Labels:** Categories can show under budget, approaching limit, or over budget states.
- [ ] **Rollover Budgets:** Option to carry unspent budget to the next month.

## 3. Transaction Engine
- [x] **Quick Transaction Entry:** Fast input with amount, type, category, date, and optional notes.
- [x] **Transaction History:** List of income and expense transactions.
- [x] **Transaction Search & Filter:** Search and filter transaction history.
- [x] **Transaction Delete:** Users can delete transactions.
- [ ] **Recurring Transactions:** Bills, subscriptions, and salary templates are still planned.
- [ ] **Multi-Account Support:** Cash, bank, and e-wallet accounts are still planned.

## 4. Antyo Spaces (REMOVED in v0.4.0)
- [ ] **Space Switcher:** Removed in v0.4.0 to eliminate overengineering and restore 100% focus on personal finance.
- [ ] **Business Space & Revenue/Profit Summaries:** Removed in v0.4.0.
- [ ] **Accountant View:** Deferred/Removed.

## 5. Infrastructure & Settings
- [x] **Local-First Storage:** Zustand persistence uses `expo-file-system` on native.
- [x] **Web Preview Storage Fallback:** Web previews use `localStorage`.
- [x] **Currency Formatting:** Uses the selected currency symbol with locale-aware formatting.
- [x] **Theme Setting:** Supports System, Light, and Dark Mode.
- [x] **Changelog System:** Settings can show version update notes.
- [x] **Factory Reset:** Users can clear local app data.
- [ ] **Data Export / Restore:** JSON backup and CSV export are still planned.
- [ ] **Onboarding Flow:** Still planned.

## 6. Deferred / Backlog
- [ ] Savings goals and milestone celebrations.
- [ ] Spending heatmap and trend charts.
- [ ] Cloud sync and multi-device support.
- [ ] AI spending insights.
- [ ] Professional accounting engine, ledger, journals, PSAK reports, CaLK, and accountant collaboration.
