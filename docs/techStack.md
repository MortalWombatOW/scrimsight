# Tech Stack

## Frontend
- **React:** JavaScript library for building user interfaces.
- **Jotai:** Primitive and flexible state management library for React, used for defining atoms.
- **DaisyUI & Tailwind CSS:** CSS framework and utility-first CSS framework for styling components.
- **Vite:** Next-generation frontend tooling for fast development.

## Testing
- **Vitest/Jest:** JavaScript testing frameworks for unit and integration tests.
- **Storybook:** UI development environment for components.
- **Chromatic:** Cloud-based tool for visual testing of Storybook components.

## Data Flow & Architecture
- **Jotai Atoms:** Centralized state management units, following a strict pattern for consistency and testability.
- **Event Extractors:** Atoms responsible for parsing raw log data into structured events.
- **Derived Atoms:** Atoms that compute derived state from other atoms, encapsulating business logic.
- **Utility Libraries (`src/lib/`):** Provide reusable functionality. `src/lib/playerMetricsUtils.ts` now contains functions for filtering, adding derived metrics, and determining dominant roles for player stats. `src/lib/eventExtractionUtils.ts` contains general event extraction helpers.

## Project Conventions
- **File Structure:** Organized into `atoms`, `components`, `pages`, and `lib` directories with strict conventions.
- **Atom Pattern:** Each atom has a dedicated file, with core logic in a named `Fn` export and the atom instance as the default export. Types are centralized in `src/atoms/index.ts`.
