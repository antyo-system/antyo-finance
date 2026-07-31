# Antyo Finance Changelog

All notable changes to the Antyo Finance project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2026-07-31

### Added
- **Language Selector:** Added Language Selection option in Settings (`Bahasa Indonesia` vs `English`).
- **Localized Compact Currency Suffixes:**
  - **Indonesian Mode (`id`):** Ribuan $\rightarrow$ `rb` (e.g. `500rb`), Jutaan $\rightarrow$ `jt` (e.g. `25jt`), Miliaran $\rightarrow$ `M` (e.g. `1,2M`).
  - **English Mode (`en`):** Thousands $\rightarrow$ `k` (e.g. `500k`), Millions $\rightarrow$ `M` (e.g. `25M`), Billions $\rightarrow$ `B` (e.g. `1.2B`).

---

## [0.5.0] - 2026-07-31

### Added
- **Compact Currency Abbreviation:** Smart formatting for small screens (`+Rp 25M`, `-Rp 40M`, `Rp 500k`).
- **Assets & Net Worth View (`AssetsView.tsx`):** Dedicated net worth manager with portfolio allocation breakdown bar (`Stocks 40% | Gold 40% | Savings 20%`).
- **PWA (Progressive Web App):** Added `manifest.json` and service worker (`sw.js`).
- **Supabase Integration:** Client helper in `src/lib/supabase.ts` with local-first fallback.

---

## [0.4.0] - 2026-07-31

### Added
- **Interactive Edit Transaction Modal:** Edit amount, category, date, or note with 1-tap delete.
- **Debt Payoff Engine:** Debt categories with due date badges (`Due Day 5`) and freedom progress bars.
- **Smart Due Date Alerts:** Banner on Dashboard warning when debt payments are due within 7 days.
