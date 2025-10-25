# Codebase Summary

## Key Components and Their Interactions

### Atoms (`src/atoms/`)
- **Purpose:** Define the application's data flow and business logic using Jotai.
- **Structure:** Each atom resides in its own file (`{atomName}.ts`), exporting its core
  logic as a named `{atomName}Fn` function and the Jotai atom instance as the default
  export.
- **Interactions:** Atoms depend on other atoms (via `get`) and utility libraries
  (`src/lib/`). They provide data to React components.

### Components (`src/components/`)
- **Purpose:** Define the user interface (UI) using React, styled with daisyUI and
  Tailwind CSS.
- **Interactions:** Components consume data from Jotai atoms and can depend on other
  components or utility libraries. They are designed to receive minimal props and derive
  the rest from atoms or helpers.

### Pages (`src/pages/`)
- **Purpose:** Define the top-level UI views of the application.
- **Interactions:** Pages compose components and focus on routing concerns.

### Libraries (`src/lib/`)
- **Purpose:** Provide reusable functionality that can be consumed by atoms, components,
  pages, or other libraries.
- **Current State:** `src/lib/playerMetricsUtils.ts` contains functions for filtering,
  adding derived metrics, and determining dominant roles for player stats.
  `src/lib/eventExtractionUtils.ts` contains general event extraction helpers.

## Data Flow
- Raw log files are loaded (`logFileLoaderAtom`) and parsed (`logFileParserAtom`).
- Extractor atoms (e.g., `killExtractorAtom`, `heroSpawnExtractorAtom`) process parsed
  logs into specific event types, leveraging `src/lib/eventExtractionUtils.ts`.
- Derived atoms (e.g., `playerStatsBaseAtom`, `teamfightsAtom`) aggregate and transform
  these events into meaningful metrics and insights, using
  `src/lib/playerMetricsUtils.ts`.
- UI components and pages consume these derived atoms to display data.

## External Dependencies
- **Jotai:** State management.
- **Vitest:** Unit and integration testing.
- **Storybook:** UI component development.
- **Tailwind CSS/daisyUI:** Styling.
- **React Router / react-oidc-context:** Routing and authentication wiring.

## Development Conventions and Learnings

### Path Alias Resolution
- Standard path aliases (`@atoms`, `@library`, `@components`, `@pages`, `@icons`) should
  be used consistently.
- Types defined in `src/atoms/index.ts` are imported via `@atoms`.
- Atom instances (default exports) are imported from their specific files (for example,
  `import playerStatsAtom from '@atoms/playerStatsAtom';`) when wiring them into the
  index file.

### TypeScript Best Practices
- Explicitly type function parameters and return values where inference is ambiguous.
- Prefer `unknown` over `any` for dynamic data and narrow as soon as possible.
- Double-check whether a module exports a default or named symbol before importing.

### Tooling Notes
- `check-lint-build-errors.sh` runs ESLint, TypeScript, and Vitest for targeted files or
  directories. Pass the paths you want to check as arguments.
- For larger refactors, update the relevant barrel files (`src/atoms/index.ts`,
  `src/components/index.ts`, etc.) immediately so lint rules keep imports valid.
