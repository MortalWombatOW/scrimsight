## Scrimsight

Scrimsight ingests Overwatch scrim exports and turns them into interactive dashboards.
The front-end is a React 19 application styled with Tailwind and daisyUI, backed by a
large collection of Jotai atoms that transform raw log data into player, team, and
match level insights.

---

## Quick start

```bash
npm install            # install dependencies
npm run dev            # launch Vite on http://localhost:5173
npm run storybook      # optional: component sandbox on http://localhost:6006
```

Quality checks can be run locally:

```bash
npm run lint           # ESLint with project-structure rules
npm run type-check     # tsc --noEmit
npm run test           # Vitest test suite (single run)
npm run test:watch     # Vitest watch mode
npm run build          # type-checks + optimized production build
```

`./check-lint-build-errors.sh <path>` is available for targeted lint/type/test runs when
working on a specific folder (for example `./check-lint-build-errors.sh src/atoms`).

See [docs/README.md](docs/README.md) for deeper workflow guidance.

---

## Project layout

```
src/
  atoms/        ── domain state and derived metrics built with Jotai
  components/   ── re-usable UI components and their Storybook stories
  pages/        ── route-level screens rendered from the router in App.tsx
  lib/          ── pure TypeScript utilities that power parsing and metrics
  icons/        ── icon components and SVG assets
```

Strict folder and filename rules are enforced by `eslint-plugin-project-structure`.
The rule summary lives in [docs/file-structure.md](docs/file-structure.md).

---

## State and data pipeline

1. **File ingestion** – atoms such as `logFileLoaderAtom` and `logFileParserAtom` read
   uploaded log files and normalise the payload.
2. **Event extraction** – utilities in `src/lib/eventExtractionUtils.ts` and related
   atoms build typed event collections (kills, spawns, ultimate usage, etc.).
3. **Derived metrics** – atoms in `src/atoms` and helpers like
   `src/lib/playerMetricsUtils.ts` compute per-player, per-team, and per-map summaries.
4. **Presentation** – React components in `src/components` and pages in `src/pages`
   query the atoms to render dashboards, comparisons, and timelines.

Each atom file exports a `{name}Fn` helper for testability plus a default Jotai atom.
Stories live beside their components to keep UI development co-located.

---

## Tooling highlights

* **React 19** + **Vite 6** for fast local development.
* **Vitest** for unit tests with `@testing-library/react` helpers.
* **Storybook 9** for isolated component development.
* **ESLint 9** (flat config) with `project-structure` rules to enforce layout,
  composition, and dependency boundaries.
* **TypeScript strict mode** with path aliases for atoms, components, pages, and libs.

Configuration files such as `vite.config.ts`, `eslint.config.mjs`, and `tsconfig.json`
are documented in [docs/README.md](docs/README.md).

---

## Documentation map

* [docs/README.md](docs/README.md) – entry point and contributor workflow
* [docs/file-structure.md](docs/file-structure.md) – folder rules & architecture
* [docs/atom-patterns.md](docs/atom-patterns.md) – atom blueprints & ESLint limits
* [docs/testing.md](docs/testing.md) – Vitest and Storybook testing guidance
* [docs/linting.md](docs/linting.md) – ESLint configuration and usage
* [docs/typescript-guidelines.md](docs/typescript-guidelines.md) – typing conventions
* [docs/ui-guidelines.md](docs/ui-guidelines.md) – styling and Storybook tips
* [docs/troubleshooting.md](docs/troubleshooting.md) – quick fixes for common issues
