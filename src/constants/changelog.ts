export const APP_VERSION = '0.2.0';

export interface ChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.2.0',
    date: '2026-07-01',
    notes: [
      'Transitioned into a minimalist, simple budgeting app',
      'Implemented Side-by-Side Plan vs Reality comparison',
      'Added the core Financial Identity Mirror widget on the dashboard',
      'Configured 100% local-first data safety persistence with Zustand and expo-file-system',
      'Integrated NativeWind v5 and PostCSS for Tailwind styling',
      'Designed responsive, clean and premium UI/UX theme with dark mode support'
    ]
  },
  {
    version: '0.1.0',
    date: '2026-07-01',
    notes: [
      'Initial setup and architecture draft documentation files'
    ]
  }
];
