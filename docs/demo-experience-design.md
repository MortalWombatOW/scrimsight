# Demo Experience Design

## Codebase exploration summary

### Application shell and routing
- `src/index.tsx` boots a React 19 + Vite SPA with a root-level `<Suspense>` boundary before rendering `App`. All top-level data fetching therefore relies on React suspense semantics.
- `src/App.tsx` wires the router, OIDC auth provider, and the global layout. Routes currently cover the marketing-style home dashboard, scrim/match deep dives, metrics explorer, schema visualiser, and file ingestion flows.
- The `Layout` component (`src/components/Layout.tsx`) encapsulates the chrome: navigation rail, header with Discord + auth controls, and theming toggles. It also exposes the sample-data toggle used throughout the app.
- `Navigation` (`src/components/Navigation.tsx`) builds a hierarchical menu from live atom data. It already links to several sections that reuse domain atoms (`scrims`, `teamNames`, `matchData`) and includes placeholder entries like `/v2` that do not yet exist in the router.

### State management and data flow
- Jotai provides the primary state layer. Atoms live in `src/atoms/` with paired `*.test.ts` files and pure helper functions (`{name}Fn`) that aid unit testing and composability.
- Data ingestion starts with `logFileInputAtom.ts` (user-provided files) and `sampleData.ts` (five pre-packaged log exports stored in `src/lib/sampledata/`). `logFileLoaderAtom.ts` reads raw file contents and `logFileParserAtom.ts` stitches user uploads with the sample bundle, generating structured match logs via `parseFile` from `src/lib/eventExtractionUtils.ts`.
- Downstream atoms (e.g. `matchDataAtom.ts`, `scrimAtom.ts`, `listSummaryAtoms.ts`) aggregate the parsed events into match-, scrim-, team-, and player-level summaries used across the UI. These atoms typically return Promises so they can compose async dependencies inside Suspense.
- Metrics-heavy selectors such as `useStats` (defined in `src/lib/playerMetricsUtils.ts`) layer additional grouping/sorting on top of the base atoms, powering components like `ScrimsMatchCard` and `PlayersOverview`.

### UI component system
- Shared UI sits under `src/components/` and is barrel-exported via `src/components/index.ts`. Cards (`CardBase`, `ScrimCard`, `TeamCard`, `PlayerCard`, `MatchCard`) provide reusable summary surfaces built with Tailwind + daisyUI primitives.
- Domain-specific visualisations include the match timeline suite (`TimelineProvider`, `TimelineTable`, `TimelineEvents`, `TimelineControls`) and team/player comparison widgets.
- Page-level React components under `src/pages/` compose these pieces behind the router entries. They rely on the `@components` and `@library` aliases enforced by the custom ESLint project-structure rules referenced in `docs/file-structure.md`.

### Observations and opportunities
- Sample data is always enabled by default (`sampleDataEnabled.ts`), but the only UI that surfaces it is the toggle on the file-ingest page. A first-run/demo experience could lean on this to offer a no-setup tour.
- Navigation lists a `/v2` entry without a corresponding route in `App.tsx`, indicating an opportunity to repurpose that slot for an actual demo showcase.
- Existing cards and tables already encapsulate the core Overwatch coach viewpoints (scrim summaries, team win rates, player hero usage), so a curated demo can assemble them without inventing new data transforms.

## Demo goals
- Present a narrative walkthrough that proves value to Overwatch coaches using the bundled sample logs.
- Highlight three pillars: scrim summary, standout teams, and player performance, with direct links into deeper dashboards.
- Offer an interactive element (match selector + timeline) so coaches can explore flow of play without importing their own files.
- Reinforce calls to action (e.g., “Share feedback”) to collect product input during demos.

## Proposed /demo experience
1. **Hero + orientation**: Explain the data provenance (sampled scrims) and what insights the viewer will gain. Surface quick stats (maps analysed, teams covered, standout hero).
2. **Featured scrim spotlight**: Use `ScrimCard` alongside aggregated metrics to show the headline matchup, including record and duration.
3. **Team performance highlights**: Showcase top-two teams from `teamListSummaryAtom` via `TeamCard`, emphasising win rate and games played. Provide deep links to `/teams/{id}`.
4. **Player spotlights**: Compute standout KDA / hero combos from `playerListSummaryAtom` and render `PlayerCard` entries that jump into player detail routes.
5. **Interactive match timeline**: Present buttons or pills for each map in the featured scrim, render a `MatchCard` summary, and mount the existing `Timeline` component under a Suspense boundary for the selected match.
6. **Coach call-to-action**: Conclude with a prompt linking to the feedback channel (e.g., Discord) and the file ingestion page to encourage next steps.

## Technical approach
- Consume async atoms via `useAtomValue` within the Suspense-wrapped router. Derive featured scrim IDs by matching `scrimListSummaryAtom` outputs against full `scrims.atom` entries.
- Reuse formatting helpers from `@library` (`formatTime`, `formatPercentage`, `prettyFormat`, `listToNaturalLanguage`) to keep presentation consistent with existing pages.
- Maintain responsiveness with the established Tailwind utility patterns (e.g., grid layouts, `rounded-box`, `bg-base-*`, `card` classes).
- Guard against absent data by short-circuiting to a friendly message if the sample bundle fails to load or is toggled off.

## TODO checklist
- [x] Create a routed `DemoPage` under `src/pages/` that composes the hero, featured scrim, team highlights, player spotlights, timeline, and CTA using existing atoms/components.
- [x] Register the `/demo` route inside `src/App.tsx` and expose it via the `@pages` barrel.
- [x] Add a first-class navigation entry labelled “Demo” in `src/components/Navigation.tsx`, replacing the unused `/v2` placeholder.
- [x] Ensure the demo gracefully handles empty data by showing a recovery message directing viewers to enable sample data or upload logs.
- [ ] Optionally capture follow-up metrics (e.g., track engagement) in a future iteration by introducing analytics hooks.
