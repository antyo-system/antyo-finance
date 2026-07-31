# Product Requirements Document (PRD)

**Project Name:** Antyo Finance  
**Document Status:** Draft  
**Target Platform:** Android & iOS
**Tech Stack:** Expo, React Native, TypeScript, Zustand

---

## 1. Executive Summary
Antyo Finance is a minimalist, local-first budgeting and personal finance app. The product helps users answer one simple daily question: **How much money do I have this month after income, expenses, and planned budgets?**

The dashboard must stay calm and direct. It highlights net balance, income, expenses, remaining budget, and recent transactions. It does not use motivational mirror copy, savings-goal widgets, or professional accounting language on the main dashboard.

## 2. Product Direction
**Primary Value:** Give users a clean monthly money snapshot without making them feel like they are using accounting software.

**Design Principle:** Money first, explanation second. The first screen should immediately show:
- Net balance this month
- Monthly income
- Monthly expenses
- Total planned budget
- Remaining budget
- Recent transactions

## 3. Core Personas
- **Young Professional:** Wants to know where salary went this month without opening a spreadsheet.
- **Freelancer / Gig Worker:** Needs a simple view of variable income, expenses, and remaining budget.
- **Conscious Spender:** Wants quick feedback on whether current spending still fits the monthly plan.

## 4. MVP Scope

### In Scope
- **Money-First Dashboard:** Net balance, income, expenses, monthly budget summary, and recent transactions.
- **Budget Management:** Create, edit, delete, and track category budgets.
- **Budget Tab Comparison:** Budget vs actual category progress can live in the Budget tab, not as a main dashboard card.
- **Transaction Tracking:** Add, view, search, filter, and delete income/expense transactions.
- **Settings:** Currency, theme, changelog, and data reset.
- **Antyo Spaces Shell:** Lightweight Personal/Business context switcher with no ledger, accountant role, or formal report engine.

### Out of Scope for Current MVP
- Savings goal dashboard widgets.
- Personal Mirror headline or identity slogan on the main dashboard.
- Business owner overview copy.
- Accountant view, journals, CoA, PSAK reports, CaLK, and formal export.
- Bank integration, AI analysis, cloud sync, and social sharing.

## 5. Feature Requirements

### 5.1 Dashboard
- Show **Net Balance (This Month)** as the primary visual element.
- Show income and expenses directly under the net balance.
- Show **Monthly Budget Summary** with total limit, remaining budget, percent spent, and total spent.
- Show recent transactions below the summary.
- Avoid dashboard cards for savings goals or budget-vs-actual detail.
- Avoid brand/title blocks such as "Antyo", "Personal Mirror", or "Business Owner Overview".

### 5.2 Budget
- Users can create categories with name, icon, color, and monthly limit.
- Users can edit limits and delete categories.
- Each category shows actual spending against the planned limit.
- Color feedback should remain simple: under budget, approaching limit, over budget.

### 5.3 Transactions
- Users can add income and expense transactions.
- Required fields: amount, type, category for expenses, date, optional note.
- Transactions must use UUIDs.
- Users can search/filter history and delete transactions.

### 5.4 Antyo Spaces
- Personal Space is the default.
- Business Space is a lightweight money-summary preview only.
- Business Space may show revenue, expenses, profit, and margin using existing local transaction data.
- Accountant/professional layers remain deferred until the business data model is designed and tested.

## 6. Non-Functional Requirements
- **Local-first:** Core data must work offline.
- **Fast:** Dashboard should feel instant.
- **Private:** No financial data leaves the device during MVP.
- **Readable:** Financial numbers must be more prominent than decorative UI.
- **Simple:** Do not add new major dependencies without approval.

## 7. Success Metrics
- User can understand monthly money position within 5 seconds of opening the dashboard.
- User can add a transaction in under 10 seconds.
- User can identify remaining monthly budget without navigating away from the dashboard.
- Day 1 and Day 7 retention improve after simplifying the dashboard.

## 8. Roadmap
- **Phase 1:** Stabilize the money-first local dashboard, budgets, transactions, and settings.
- **Phase 2:** Add recurring transactions, export/restore, onboarding, and improved charts.
- **Phase 3:** Validate Business Space with simple owner-facing summaries.
- **Phase 4:** Only after validation, design professional accounting, reports, roles, and sync.
