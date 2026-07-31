export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  notes: string[];
}

export const APP_VERSION = '0.5.1';

export const CHANGELOG: ChangelogItem[] = [
  {
    version: '0.5.1',
    date: '2026-07-31',
    title: 'Language Selector & Localized Compact Currency (jt/rb vs M/k)',
    notes: [
      'Language Selection setting in Settings (Bahasa Indonesia vs English).',
      'Indonesian compact currency suffixes: Ribuan -> rb (500rb), Jutaan -> jt (25jt), Miliaran -> M (1,2M).',
      'English compact currency suffixes: Thousands -> k (500k), Millions -> M (25M), Billions -> B (1.2B).',
    ],
  },
  {
    version: '0.5.0',
    date: '2026-07-31',
    title: 'Compact Currency, Assets Manager, PWA & Supabase',
    notes: [
      'Smart Compact Currency formatting for small screens (e.g. +Rp 25M, -Rp 40M).',
      'Dedicated Assets & Net Worth Manager view with portfolio allocation bar.',
      'Standalone Floating Action Button (FAB) + symmetrical 4-tab capsule bar.',
      'Real-time thousand dot separator input formatting (12.000.000).',
      'PWA (Progressive Web App) offline support & installation manifest.',
      'Supabase client integration architecture with local-first fallback.',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-07-31',
    title: 'Edit Transactions & Debt Payoff Engine',
    notes: [
      'Interactive Edit Transaction bottom-sheet modal with 1-tap delete.',
      'Automatic category spent and paid debt recalculations.',
      'Integrated Debt Payoff categories with due date badges and freedom progress bars.',
      'Smart due date alert banner on Dashboard.',
      'Removed quick presets for a clean add form.',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-07-31',
    title: 'Custom 50/30/20 Budgeting & Clean UI',
    notes: [
      'Full 50/30/20 Needs, Wants, and Savings budget engine.',
      'Custom ratio settings modal and pill trigger.',
      'Smart date grouping in transaction history.',
      '1-Click CSV transaction export.',
      'Ultra-clean category budget cards and unified badges.',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-07-31',
    title: 'Vite React Web Application Migration',
    notes: [
      'Migrated architecture from Expo to Vite + React Web Application.',
      'Antyo Focus brand alignment with Electric Blue #2563EB.',
      'Floating capsule bottom navigation bar.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-07-31',
    title: 'Personal Finance Core Initial Release',
    notes: [
      'Initial release of Antyo Finance core budgeting application.',
      'Dashboard net balance and transaction tracking.',
      'Local storage persistence adapter.',
    ],
  },
];
