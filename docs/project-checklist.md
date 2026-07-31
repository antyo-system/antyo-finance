# Antyo Finance - Project Checklist

## Project Documentation & Usage
This checklist tracks the progress of **Antyo Finance** from its MVP state all the way to the 100M downloads vision outlined in `ROADMAP_100M.md`.
- **Status Legend:**
  - ✅ **Completed:** Task is finished and verified in the app.
  - 🏗️ **In Progress:** Task is currently being developed.
  - ⏳ **Pending:** Task is scheduled for future work.
- **Maintenance:** Update this file whenever a task is completed or when requirements shift.

---

## Phase 1: The Bulletproof Foundation (MVP & V1 Release)
**Status: 🏗️ In Progress**
*Fokus: Retensi D-1 & D-7. Pengguna harus jatuh cinta pada pandangan pertama.*

**Core Setup & Architecture**
- [x] Create Expo App, TypeScript, & Router
- [x] Install NativeWind, Zustand & expo-file-system Local Storage Adapter
- [x] Configure ESLint, Prettier, and TypeScript strict mode
- [x] Setup project folder structure (`/app`, `/src` as per AGENTS.md)

**Core Features — Budgeting Engine**
- [x] Budget Category Management (Create, Edit, Delete with icons & colors)
- [x] Monthly Budget Setting (set spending limits per category)
- [x] Budget Progress Tracking (visual progress bars per category)
- [x] Budget vs Actual Comparison View (side-by-side per category)

**Core Features — Transaction Engine**
- [x] Quick Transaction Entry (amount, category, date, notes)
- [x] Transaction History List with search & filter
- [ ] Recurring Transaction Setup (bills, subscriptions, salary)
- [x] Transaction Edit & Delete (full CRUD)
- [ ] Multi-Account Support (cash, bank, e-wallet)

**Core Features — Dashboard**
- [x] Financial Dashboard (balance, income, expenses, budget remaining)
- [x] Money-first dashboard cleanup (remove brand block, mirror copy, savings-goal card, and dashboard Budget vs Actual card)
- [ ] Category Breakdown Chart (donut/pie)
- [x] Income vs Expense Overview

**Statistics & Insights**
- [ ] Weekly & Monthly Spending Trend Charts
- [ ] Budget Health Score (0-100 / Identity Mirror Widget) - deferred, not shown on current dashboard
- [ ] Spending Heatmap (calendar-style daily grid)

**Polish & UX**
- [x] Beautiful Empty States for all screens
- [x] Haptic Feedback on key interactions (transaction add, delete, click)
- [ ] Custom App Icon & Splash Screen
- [ ] Onboarding Flow (3-4 screens explaining Budget vs Reality)

**Infrastructure**
- [x] 100% Local-First Storage (custom expo-file-system Zustand adapter)
- [x] Currency Formatting (locale-aware: Rp, $, €)
- [ ] Data Export (JSON backup & CSV transactions)
- [x] Theme Customization (System, Light, Dark Mode)
- [x] Changelog System (in-app version update popup)
- [x] Settings Screen (currency, theme)

**V1 Release Preparation**
- [ ] Build Android APK / AAB
- [ ] Privacy Policy & Play Store Screenshots
- [ ] Purchase Google Play Console Account ($25)
- [ ] Internal Testing & Production Release (V1.0)
- [ ] Purchase Apple Developer Program ($99/year)
- [ ] iOS App Store submission

### 🔍 MVP-to-Live Production Audit Tasks
- **🔴 Critical (Ship-blockers)**
  - [ ] Implement Local Data Import/Restore in settings
  - [ ] Add Zustand Store Versioning & Migration logic for all persisted stores
  - [x] Add native `ErrorBoundary` fallback UI to layout root
  - [x] Ensure all models use UUIDs (not `Date.now()` IDs)
  - [x] Implement "Delete All Data" to reset all stores
- **🟠 High (Launch Essentials)**
  - [ ] Integrate PostHog for event analytics
  - [ ] Implement native "Rate This App" trigger (`expo-store-review`)
  - [ ] Add basic accessibility labels/roles to interactive elements
  - [x] Hydration check & splash screen loading guard in `_layout.tsx`
- **🟡 Medium (Quality Bar)**
  - [ ] Write critical unit tests for `/src/utils` (currency math, budget calculations, date helpers)
  - [x] Hardcode dynamic changelog dates in `changelog.ts`
- **🟢 Nice-to-have (Post-launch)**
  - [ ] Onboarding skip button
  - [x] Haptic Feedback on key interactions

---

## Phase 2: Antyo Spaces (REMOVED in v0.4.0)
**Status: 🚫 Removed / Reverted**
*Fokus: Reverted to 100% Personal Finance core in v0.4.0 to eliminate overengineering and maintain a laser-focused MVP experience.*

- [x] **Task 2.0: Chunk Antyo Spaces Idea Into Buildable Roadmap**
  - **Goal:** Break the Personal, Business, and Accountant modes into MVP-safe phases and document the future scope in the idea bank.
- [x] **Task 2.1: Scope & Identity Gate**
  - **Goal:** Define the smallest Spaces version that helps users make better identity-aligned financial decisions while keeping Personal Space as the default MVP experience.
- [x] **Task 2.2: Personal Navigation Alignment**
  - **Goal:** Align Personal Space navigation to `Dashboard`, `Budgets`, `History`, and `Settings` before adding new modes.
- [x] **Task 2.3: Space Switcher UI Shell**
  - **Goal:** Add a top-left Space Switcher with a simple premium menu or bottom sheet using existing Expo/React Native tools; do not add a new animation library without approval.
- [x] **Task 2.4: Space Theme Tokens**
  - **Goal:** Define Personal green and Business violet/indigo accent tokens with strong contrast, avoiding decorative glass effects that reduce financial readability.
- [x] **Task 2.5: Business Space Preview State**
  - **Goal:** Add a lightweight Business Space preview/empty state for cash flow and reports, with no ledger schema, roles, invites, or formal accounting screens yet.
- [x] **Task 2.6: Minimalist Spaces Dashboard Correction**
  - **Goal:** Keep Spaces visually lightweight by removing dashboard brand/mirror/professional copy and keeping Personal Space focused on net balance, income, expenses, budget remaining, and recent transactions.
- [ ] **Task 2.7: Progressive Disclosure Deep Layers**
  - **Goal:** Add `Detail Screen -> Source Drawer` only after the business ledger model is designed and tested.

---

## Phase 3: Business Owner Accounting Layer
**Status: ⏳ Pending**
*Fokus: Build business cash clarity only after the Spaces MVP proves useful.*

- [ ] **Task 3.1: Business Domain Model RFC**
  - **Goal:** Document the minimum local-first data model for Business Space without disrupting existing Personal budgets and transactions.
- [ ] **Task 3.2: Double-Entry Ledger Architecture Spike**
  - **Goal:** Design Chart of Accounts, Journal Entries, and Journal Lines behind the scenes, including migration strategy and required `/src/utils` tests.
- [ ] **Task 3.3: Silent Ledger Entry Engine**
  - **Goal:** Auto-generate balanced debit/credit journal lines when Business transactions are saved, while keeping accounting jargon hidden from owner-facing screens.
- [ ] **Task 3.4: Business Dashboard Signal Widgets**
  - **Goal:** Add simple owner-facing cash flow, revenue, expense, and net profit cards before building formal reports.
- [ ] **Task 3.5: Accountant Mode Deferral Gate**
  - **Goal:** Keep Accountant View, PSAK tables, journals, invites, and formal reports parked until Business Space, sync, and paywall strategy are validated.
- [ ] **Task 3.6: Formal Reports Readiness Gate**
  - **Goal:** Only start P&L, balance sheet, cash flow, equity, and CaLK screens after ledger correctness is proven with unit tests and sample data.

---

## Phase 4: Gamification, Streaks & Ecosystem
**Status: ⏳ Pending**
*Fokus: Retention Loop, Gamifikasi Finansial Pribadi, & Sinergi Ekosistem Antyo.*

- [ ] **Task 4.1: Financial Health Score & Gamification**
  - **Goal:** Build a 0-100 score system based on budgeting discipline, savings ratio, and tracking consistency.
- [ ] **Task 4.2: Savings Goal Engine & Milestone Sharing**
  - **Goal:** Visual savings targets with celebrations and aesthetic shareable cards for IG/TikTok.
- [ ] **Task 4.3: ANTYO Ecosystem API Synergy**
  - **Goal:** Connect transactions/expenses to ANTYO Focus (time-based spending blocks) and ANTYO Health.
- [ ] **Task 4.4: Shared Budgets (Couples/Families)**
  - **Goal:** Allow couples/families to share specific budget categories in the Personal Space.

---

## Technical Documentation & Reference
- **[AGENTS.md](../AGENTS.md):** Coding standards, philosophy, and architectural rules.
- **[ROADMAP_100M.md](./ROADMAP_100M.md):** High-level strategic vision and monetization.
- **[FEATURE_LIST.md](./FEATURE_LIST.md):** Ground truth feature inventory.
- **[tech-stack.md](./tech-stack.md):** Technology choices and rationale.
- **[prd.md](./prd.md):** Product Requirements Document.
- **[README.md](../README.md):** High-level overview, features, and setup instructions.
