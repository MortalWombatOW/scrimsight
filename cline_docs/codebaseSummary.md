# Codebase Summary

## Key Components and Their Interactions

### Atoms (`src/atoms/`)
- **Purpose:** Define the application's data flow and business logic using Jotai.
- **Structure:** Each atom is intended to reside in its own file (`{atomName}Atom.ts`), exporting its core logic as a named `{atomName}Fn` function and the Jotai atom instance as the default export.
- **Interactions:** Atoms can depend on other atoms (via `get` in Jotai's `atom` function) and utility libraries (`src/lib/`). They provide data to React components.
- **Current State:** Undergoing a refactoring process to standardize their structure and improve maintainability. Key atoms like `playerStatsBaseAtom` and `uniqueCategoryValuesAtom` have been moved and registered.

### Components (`src/components/`)
- **Purpose:** Define the user interface (UI) using React, styled with DaisyUI and Tailwind CSS.
- **Interactions:** Components consume data from Jotai atoms and can depend on other components or utility libraries. They are designed to be as "dumb" as possible, fetching minimal props.

### Pages (`src/pages/`)
- **Purpose:** Define the top-level UI views of the application.
- **Interactions:** Pages primarily depend on components and utility libraries, receiving props from the URL.

### Libraries (`src/lib/`)
- **Purpose:** Provide reusable functionality that can be consumed by atoms, components, pages, or other libraries.
- **Current State:** `src/lib/playerMetricsUtils.ts` now contains functions for filtering, adding derived metrics, and determining dominant roles for player stats. `src/lib/eventExtractionUtils.ts` contains general event extraction helpers. The old `src/lib/playerMetricsAtoms.ts` has been removed.

## Data Flow
- Raw log files are loaded (`logFileLoaderAtom`) and parsed (`logFileParserAtom`).
- Extractor atoms (e.g., `killExtractorAtom`, `heroSpawnExtractorAtom`) process parsed logs into specific event types, now leveraging `src/lib/eventExtractionUtils.ts`.
- Derived atoms (e.g., `playerStatsBaseAtom`, `teamfightsAtom`) aggregate and transform these events into meaningful metrics and insights, now leveraging `src/lib/playerMetricsUtils.ts`.
- UI components and pages consume these derived atoms to display data.

## External Dependencies
- **Jotai:** For state management.
- **Vitest/Jest:** For unit testing.
- **Storybook/Chromatic:** For UI component development and visual testing.
- **DaisyUI/Tailwind CSS:** For styling.

## Recent Significant Changes
- Major refactoring of Jotai atoms to enforce a consistent pattern across the codebase. This involves:
    - Extracting core logic into `Fn` functions.
    - Standardizing default exports for atom instances.
    - Centralizing type definitions and atom registrations in `src/atoms/index.ts`.
    - Relocating utility functions from `src/atoms/` to `src/lib/`.
    - Refactoring `src/lib/playerMetricsAtoms.ts` to separate atom definitions from utility functions, resulting in its deletion and creation of `src/lib/playerMetricsUtils.ts`.
    - Moving event extraction helpers from `src/atoms/extractEventHelpers.ts` to `src/lib/eventExtractionUtils.ts`.

## User Feedback Integration and Its Impact on Development
- N/A (No specific user feedback integrated in this current task, but the refactoring aims to improve developer experience and maintainability for future features).

## Development Conventions and Learnings

### Path Alias Resolution
- Standard path aliases (`@atoms`, `@library`, `@components`, `@pages`) should be used consistently for imports.
- Avoid using `~/` as it's not a standard configured alias in this project.
- Be mindful of distinguishing import sources:
    - Types defined in `src/atoms/index.ts` are imported via `@atoms`.
    - Atom instances (default exports) are imported from their specific files (e.g., `import myAtom from '@atoms/myAtom';`) during registration in `src/atoms/index.ts`.

### TypeScript Best Practices
- **Explicit Typing:** Explicitly type function parameters and return values where inference might be ambiguous or to catch errors earlier.
- **`unknown` vs. `any`:** Prefer `unknown` over `any` for variables with truly dynamic or uncertain types, forcing type checks or assertions at the point of use. `any` may be a pragmatic choice for highly generic structures like caches if precise typing is overly complex.
- **Default vs. Named Imports:** Always verify how a module exports its members to use the correct import syntax and avoid module resolution errors.

### Tooling Notes
- **`replace_in_file` Tool:** Requires exact character-for-character matches in the `SEARCH` block. It's crucial to use `read_file` to get the absolute latest version of a file before attempting complex replacements, especially if the file has been modified recently. For extensive changes or repeated failures, `write_to_file` (providing the complete intended file content) can be a more reliable alternative.
- **Iterative Debugging:** Fixing TypeScript errors, especially those related to type mismatches, path aliases, or import issues, is often an iterative process.

