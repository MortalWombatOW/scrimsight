# Scrimsight

Scrimsight ingests Overwatch scrim exports and turns them into interactive dashboards.
The front-end is a **React 19** application styled with **Tailwind 4** and **daisyUI 5**,
using a domain-driven architecture to transform raw log data into insights.

---

## 🚀 Quick start

```bash
npm install            # install dependencies
npm run dev            # launch Vite on http://localhost:3000
```

All quality gates (linting, testing, building) are managed via `npm run` scripts defined
in `package.json`.

For a comprehensive check (lint, types, build, and tests) before pushing:
```bash
./check-lint-build-errors.sh
```

---

## 📂 Project layout

The project follows a layered architecture:

```
src/
  data/         ── State repositories (Jotai atoms), file ingestion, and persistence
  domain/       ── Pure business logic, transformations, and scrim detection algorithms
  hooks/        ── React hooks (Facades) that expose data/domain logic to components
  components/   ── Reusable UI building blocks (View Layer)
  pages/        ── Route-level screens managed by React Router
  lib/          ── Generic TypeScript utilities (math, string, time)
  icons/        ── SVG assets and React components
```

---

## 🏗️ Architecture & Data Flow

Scrimsight follows a **Repository & Facade** pattern:

1.  **Ingestion & Persistence (`src/data`)**: Raw files are read and normalized by `ingestor.ts`. State is held in atomic repositories (e.g., `matchesRepositoryAtom`) and persisted to IndexedDB via Dexie.js so data survives page refreshes.
2.  **Domain Logic (`src/domain`)**: Pure functions transform raw data into entities like `Scrims`, `Teamfights`, or `Stats`. These files contain *no* React or Jotai dependencies where possible.
3.  **Access (`src/hooks`)**: Custom hooks (e.g., `useMatches`, `useScrims`) bind the data atoms to the domain logic, providing a clean API for the UI.
4.  **Presentation (`src/components` / `src/pages`)**: UI components consume data exclusively via hooks.

See [docs/architecture.md](docs/architecture.md) for a deep dive.

---

## 🛠️ Tooling

* **Core**: React 19, Vite 6, TypeScript 5.7
* **Styling**: Tailwind CSS v4, daisyUI v5
* **State**: Jotai 2.12
* **Persistence**: Dexie.js (IndexedDB) — match data survives page refreshes
* **Testing**: Vitest 3, React Testing Library

Configuration is centralized in:
* `vite.config.ts` (Build & Plugins)
* `eslint.config.mjs` (Linting & Architecture Rules)
* `tsconfig.json` (Path Aliases & Strict Mode)