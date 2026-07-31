# Antyo Finance - Web App Tech Stack Specification

This document details the ground truth technology stack for the **Antyo Finance Web Application**.

## 1. Core Framework: Vite + React 19 + TypeScript
- **Why chosen:** Vite provides an ultra-fast development server with instant Hot Module Replacement (HMR) and optimized ESbuild bundling. React 19 with strict TypeScript guarantees type safety, fast component rendering, and zero mobile bundler friction.
- **Entry point:** `index.html` mounting `src/main.tsx` into `App.tsx`.

## 2. Styling: Tailwind CSS v4
- **Why chosen:** Uses `@tailwindcss/vite` for first-class Tailwind v4 CSS processing. Enables rapid styling, responsive web layouts, custom dark mode, and smooth glassmorphism effects without heavy CSS-in-JS runtimes.
- **Entry stylesheet:** `src/global.css`.

## 3. UI Iconography: Lucide React
- **Why chosen:** Lightweight, beautiful, consistent vector icons (`lucide-react`) for web financial dashboards, action buttons, category tags, and navigation bars.

## 4. State Management & Storage: Zustand + localStorage
- **Why chosen:** Boilerplate-free global client state. Uses Zustand's `persist` middleware with `localStorage` adapter (`src/utils/storage.ts`) to provide 100% local-first data persistence without requiring external databases or server sync for MVP.

## 5. Date & Time: date-fns
- **Why chosen:** Modular date utilities for monthly budget cycles, current month prefix calculations, and formatted transaction history.

## Summary of Core Web Dependencies
- `vite` & `@vitejs/plugin-react`
- `react` & `react-dom`
- `typescript`
- `tailwindcss` & `@tailwindcss/vite`
- `lucide-react`
- `zustand`
- `date-fns`
