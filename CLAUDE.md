# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

Single-page React app with no routing and no backend. All state is persisted to `localStorage`.

**Key files:**
- `src/App.jsx` — entire app lives here: state management, UI, all interactions
- `src/data/recommendations.js` — static list of recommended items grouped by category (채소/과일, 유제품, etc.)

**State:**
- `items` — shopping list array `{ id, name, checked }`, persisted via `useLocalStorage` hook (defined in App.jsx)
- `input` — current text input value
- `activeTab` — currently selected recommendation category (null = collapsed)

**Data flow:** Recommendations are static import-time data. Items are added either by typing + Enter/버튼, or by clicking a recommendation chip. Duplicate names are silently rejected. The `useLocalStorage` hook syncs state to localStorage on every change via `useEffect`.

## Stack

- React 19, Vite 8, Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed)
