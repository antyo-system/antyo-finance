# Antyo Finance Changelog

All notable changes to the Antyo Finance project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-07-31

### Added
- **Compact Currency Abbreviation:** Smart formatting for small screens (`+Rp 25M`, `-Rp 40M`, `Rp 500k`) preventing text truncation.
- **Assets & Net Worth View (`AssetsView.tsx`):** Dedicated net worth manager with portfolio allocation breakdown bar (`Stocks 40% | Gold 40% | Savings 20%`).
- **PWA (Progressive Web App):** Added `manifest.json` and service worker (`sw.js`) for offline caching and home screen installation.
- **Supabase Integration:** Client helper in `src/lib/supabase.ts` supporting cloud sync with local-first `localStorage` fallback.
- **Standalone FAB & 4-Tab Capsule Bar:** Standalone floating action button (`+`) and 4 symmetrical navigation tabs.
- **Real-Time Thousand Dots:** Auto-formatting dot thousand separators (`12.000.000`) in amount inputs.

---

## [0.4.0] - 2026-07-31

### Added
- **Interactive Edit Transaction Modal:** Edit amount, category, date, or note with 1-tap delete.
- **Debt Payoff Engine:** Debt categories with due date badges (`Due Day 5`) and freedom progress bars (`33% Paid Off`).
- **Smart Due Date Alerts:** Banner on Dashboard warning when debt payments are due within 7 days.

---

## [0.3.0] - 2026-07-31

### Added
- **Customizable 50/30/20 Budgeting:** Needs, Wants, and Savings target percentage configuration.
- **1-Click CSV Export:** Transaction history CSV export.
- **Smart Date Grouping:** Transactions grouped by `Today`, `Yesterday`, `Earlier this Week`, `MMMM yyyy`.

---

## [0.2.0] - 2026-07-31

### Added
- **Vite React Web Application:** Migrated from Expo to Vite + React Web Application.
- **Antyo Focus Brand Alignment:** Electric Blue (`#2563EB`) design system.

---

## [0.1.0] - 2026-07-31

### Added
- Initial release of Antyo Finance core budgeting application.
