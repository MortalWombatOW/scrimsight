# Tech Stack

## Frontend
- **React:** UI framework (React 19) for the dashboard.
- **Jotai:** Atom-based state management used across the data model.
- **Tailwind CSS & daisyUI:** Utility-first styling plus themed components.
- **Vite:** Development server and build tool with fast HMR.

## Testing
- **Vitest:** Unit and integration tests with Testing Library helpers.
- **Storybook:** Component playground used for manual visual checks.

## Data Flow & Architecture
- **Jotai Atoms:** State units that transform raw scrim data into derived metrics.
- **Event Extractors:** Atoms and helpers that turn log entries into structured events
  via utilities such as `src/lib/eventExtractionUtils.ts`.
- **Derived Atoms:** Aggregations (for example `playerStatsBaseAtom`) that compute player
  and team level stats.
- **Utility Libraries (`src/lib/`):** Shared helpers used by atoms, components, and
  pages. `src/lib/playerMetricsUtils.ts` contains metric calculations, while
  `src/lib/eventExtractionUtils.ts` handles log parsing.

## Project Conventions
- **File Structure:** `atoms`, `components`, `pages`, `lib`, and `icons` folders with
  lint-enforced naming and companion-file rules.
- **Atom Pattern:** Each atom exposes a `{name}Fn` helper for tests and a default atom
  export. Types that need sharing are collected in `src/atoms/index.ts`.
