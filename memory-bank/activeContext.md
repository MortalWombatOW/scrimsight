# Active Context

*What is the current work focus? What were the recent changes? What are the immediate next steps? What active decisions and considerations are in play? What important patterns, preferences, learnings, or insights have emerged recently?*

---

### Recent Changes (2025-04-05)

*   **Created `Container` Component:** Implemented a reusable `Container` component (`src/components/Container/Container.tsx`) to provide consistent padding, background, border, and shadow for main page content areas.
*   **Integrated `Container`:** Wrapped the primary content of the following pages with the new `Container` component:
    *   `AddFilesPage`
    *   `HomePage`
    *   `MatchPage2`
    *   `PlayerPage`
    *   `PlayersPage`
    *   `ScrimPage`
    *   `ScrimsPage`
    *   `TeamPage`
    *   `TeamsPage`
*   **Path Alias Correction:** Corrected import paths in several page components to use the `~/*` alias defined in `tsconfig.json` instead of `@/*`.
*   **Build Fixes:** Resolved build errors by:
    *   Removing unused imports (`atom` in `scrimAtom.test.tsx`, `configDefaults` in `vite.config.ts`).
    *   Removing Material UI dependencies (`@mui/icons-material`, `@mui/material`) from Storybook files (`IconAndText.stories.tsx`, `IconAutocomplete.stories.tsx`) as MUI is not part of the core tech stack. Replaced icons with placeholders.

### Current Focus / Next Steps

*   Review the application visually to ensure the `Container` component is applied correctly and looks consistent across pages.
*   Consider if `Container` should be part of a higher-level `Layout` component.
