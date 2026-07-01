# Product Requirements Document (PRD)

**Project Name:** Antyo Finance  
**Document Status:** Draft  
**Target Platform:** Android & iOS (Google Play Store & Apple App Store)  
**Tech Stack:** Expo (React Native)  

---

## 1. Executive Summary
Antyo Finance is a minimalist, local-first budgeting and personal finance application designed to bridge the gap between financial planning and financial reality. By capturing actual spending data and overlaying it on planned budgets, users gain unprecedented visibility into how they actually spend their money compared to how they planned it.

## 2. Problem Statement
Current budgeting tools are fragmented. Spreadsheet-based budgets excel at planning but fail to track day-to-day execution. Expense tracker apps capture transactions but lack the context of a planned budget. As a result, users suffer from a "budgeting fallacy," unable to visualize the discrepancy between their intended spending and real-world financial behavior.

## 3. Product Vision & Value Proposition
**Vision:** To provide users with a transparent, unified view of their finances, automatically transforming raw transactions into a clear picture of their financial identity.

**Value Proposition:** Stop guessing where your money went. Antyo Finance lets you see your budgets side-by-side with your reality, enabling data-driven adjustments to your spending habits without complex manual reconciliation.

## 4. Market Strategy & Personas

### 4.1 STP (Segmentation, Targeting, Positioning)

**1. Segmentation:**
- **Demographic:** Young Adults (18-30), Working Professionals (25-40), Freelancers & Gig Workers (20-35).
- **Psychographic:** Financially aware but inconsistent, frustrated by overspending, appreciates minimalist and premium design, values privacy (local-first).
- **Behavioral:** Budget app switchers, spreadsheet abandoners, visual learners who respond to charts and progress bars.

**2. Targeting:**
- **Primary Target:** Young adults and early-career professionals aged **18-35** in emerging markets (Indonesia, SEA). These users have growing incomes but lack disciplined spending habits and are underserved by complex Western finance apps.

**3. Positioning:**
- **Tagline:** "A Financial Identity System, Not Just a Budget Tracker."
- **Differentiation:** Unlike basic expense trackers or complex finance suites, Antyo Finance is positioned as a **Financial Reality Check tool**. It visually juxtaposes BUDGET vs ACTUAL spending, giving users an immediate, data-driven reality check on their finances without complex setups.

### 4.2 User Personas
### Primary Personas
- **The Young Professional:** Has a stable income but struggles to track where the money goes each month. Wants simple visual feedback, not accounting software.
- **The Freelancer / Gig Worker:** Has irregular income and needs to budget carefully across variable months. Needs flexible budgeting that adapts.
- **The Conscious Spender:** Knows they overspend in certain categories (food delivery, entertainment) and wants accountability through data.

### Secondary Personas
- **The Savings Goal Setter:** Has specific financial targets (emergency fund, vacation, gadget) and wants progress visualization.
- **The Couple / Shared Finance User:** Wants to track household spending across shared categories (future feature).

## 5. Scope Definition

### In-Scope for MVP (V1)
The MVP prioritizes core loop functionality: Budget → Track → Compare → Reflect.
- **Onboarding:** A brief, frictionless introduction to the "Budget vs Reality" concept.
- **Budget Setup:** Create monthly budgets with custom categories and spending limits.
- **Transaction Entry:** Quick add income and expense transactions with category, amount, date, and notes.
- **Budget vs Actual View:** A comparison view showing planned budget alongside actual spending per category.
- **Dashboard:** At-a-glance financial summary (total balance, monthly income, monthly expenses, budget remaining).
- **Basic Statistics:** Category breakdown charts, weekly/monthly spending trends.
- **Settings:** Basic app configuration (currency, theme, data export).

### Out of Scope (MVP Boundaries)
- **AI Features:** Smart categorization, spending pattern analysis, and predictive insights are strictly deferred.
- **Social & Community:** No shared budgets, friend lists, or community features.
- **Gamification:** No scoring systems, achievements, or badges.
- **Cloud Sync & Backend:** App must remain entirely local-first for MVP. No complex syncing, account creation, or backend architecture.
- **Investment Tracking:** No stock/crypto portfolio management.
- **Bank Integration:** No automatic bank feed imports (Open Banking API deferred).

## 6. Detailed Feature Requirements

### 6.1 Onboarding
- **Requirement:** Display 3-4 swipeable screens explaining the core value loop (Budget → Track → See Reality).
- **Requirement:** No mandatory login or account creation required to start using the app.
- **Requirement:** Allow users to set their primary currency during onboarding.

### 6.2 Budget Management
- **Requirement:** Allow users to create monthly budget categories with a name, icon, color, and spending limit.
- **Requirement:** Provide a set of default category templates (Food, Transport, Entertainment, Bills, Shopping, Health).
- **Requirement:** Display budget progress as visual progress bars per category.
- **Requirement:** Show total budget vs total spent at the top of the budget screen.

### 6.3 Transaction Tracking
- **Requirement:** Allow users to add income and expense transactions with: amount, category, date, and optional notes.
- **Requirement:** Provide a transaction history list with search and filter (by category, date range).
- **Requirement:** On save, a `Transaction` object is generated and saved to local storage with a UUID.

### 6.4 Budget vs Actual View
- **Requirement:** Display a per-category comparison view showing budgeted amount vs actual spent.
- **Requirement:** Use color-coded indicators: green (under budget), yellow (approaching limit), red (over budget).
- **Requirement:** Show percentage consumed per category.

### 6.5 Statistics & Insights
- **Requirement:** Display total income and expenses for the current month.
- **Requirement:** Show category breakdown as a donut/pie chart.
- **Requirement:** Calculate and display a "Budget Health Score" (Actual Spent / Budgeted × 100).
- **Requirement:** Show weekly and monthly spending trend bar charts.

## 7. Non-Functional Requirements
- **Performance:** App must load instantly. State read/writes must be synchronous and fast.
- **Platform:** Cross-platform (Android & iOS) optimized experience.
- **Offline Capability:** 100% functionality without an active internet connection.
- **Design & UI:** Must feel premium, modern, and distinct. It should prioritize clarity and simplicity, avoiding cluttered interfaces. Budget vs Actual must be visually unmistakable.
- **Data Privacy:** All financial data stored locally on-device. No telemetry of financial data.

## 8. Technical Architecture & Stack
- **Framework:** Expo (React Native)
- **Routing:** Expo Router (File-based navigation)
- **State Management:** Zustand (Lightweight global state)
- **Persistence:** Custom JSON storage adapter built on `expo-file-system` (to ensure 100% data safety and compatibility across Expo Go and bare native workflows)
- **Date Handling:** `date-fns` (modular utility library)
- **Styling:** NativeWind (Tailwind CSS for React Native)

## 9. Success Metrics (KPIs for MVP)
- **Retention:** Day 1 and Day 7 retention rates.
- **Core Loop Completion:** Percentage of users who create at least one budget category and log at least one transaction.
- **Time to Value:** Time taken from app install to the first budget vs actual comparison viewed.
- **Budget Accuracy:** Average deviation between planned budget and actual spending (lower is better).

## 10. Future Roadmap (Post-MVP)
- **Phase 2:** Financial Health Score, Savings Goals with visual progress and milestone celebrations.
- **Phase 3:** Cloud sync and multi-device support via Clerk + Supabase.
- **Phase 4:** AI-powered spending insights, smart categorization, and predictive budgeting (Pro tier).
- **Phase 5:** ANTYO Ecosystem integration (API synergy with ANTYO Focus for time-correlated spending analysis).
