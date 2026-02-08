# ScrimSight Handoff Document

## Goal

Bring ScrimSight to MVP — a local-first web analytics tool for amateur competitive Overwatch teams, hosted at scrimsight.com. It ingests ScrimTime `.txt` log files client-side, aggregates stats, and surfaces actionable insights about team/player performance over time.

The owner (Andrew Gleeson, GitHub: MortalWombatOW) wants to:
- Ship an MVP that delivers real value to players/coaches
- Eventually monetize (free tier for local analysis, paid tier for team collaboration/advanced features)
- Connect with players/coaches via r/OverwatchUniversity, OW Discord servers, and the ScrimTime community for user testing
- Keep the app local-first with strong privacy (no server-side data, no AI features in the product)

## Current Progress

### Codebase (as of Feb 2026)
- ~9,100 LOC across ~120 source files, React 19 + Vite 6 + TypeScript 5.7 (strict)
- Jotai (state), Tailwind 4 + daisyUI 5 (styling), Recharts (charts), Zod (validation)
- Clean 3-layer architecture: Data (atoms/repos) → Domain (pure logic) → Hooks (facades) → UI
- 62 tests, all passing. No TS errors. 71 lint issues (mostly auto-fixable indentation)
- Build: 482 KB gzip

### Features Already Built
- Log file ingestion + parsing with Zod validation
- Match/Scrim grouping and metadata extraction
- Teamfight detection (event clustering, 12s sustain window)
- Ultimate economy tracking, player impact analysis
- Per-10-min stat normalization, accuracy rates
- Pages: Home, Files, Scrims, Matches (overview/timeline/compare/players), Players, Teams, Metrics Explorer
- Metrics Explorer with faceted filtering + URL state sync + histograms
- Timeline with interactive fight details, kill matrices, hero playtime, composition analysis

### Strategic Decisions Made
- **Stay with web app** (not Tauri/Electron) — already hosted at scrimsight.com, lower distribution friction, browser File API handles local imports fine
- **Add Dexie.js for IndexedDB persistence** — currently all data lives in Jotai atoms (in-memory), lost on page refresh. Dexie keeps everything client-side/local while persisting across sessions
- **Store full ProcessedMatch objects** (Option A, not raw-events-only) — simpler, minimal hook/UI changes, add `schemaVersion` for future migration if calculation logic changes
- **No AI features in the product** — AI used for development only
- **Rule-based insights** (not AI) for the "so what?" layer — surface patterns like "your team wins 80% of fights with first pick"

## What Worked
- The existing architecture is clean and well-separated — persistence slots into the `src/data/` layer without touching domain/hooks/UI
- `loadFilesAction` in repository.ts is already async, so adding Dexie writes there is natural
- Hydrating atoms from Dexie on startup keeps all downstream reads synchronous (no async refactor needed for hooks)

## What Didn't Work / Watch Out For
- `playerStatusTimeline` in `ProcessedMatch` is a JavaScript `Map` — **not JSON-serializable**. Must convert to/from plain object or array at the Dexie persistence boundary
- Don't over-normalize into separate tables (events, stats, etc.) at this stage — store the full `ProcessedMatch` per match, optimize later if needed
- Don't make atoms async — hydrate once on startup, keep reads synchronous
- `jotai-optics` was incorrectly considered for persistence — it's for lens-based derived state, unrelated to IndexedDB

## Next Steps (Priority Order)

### 1. Add Dexie.js Persistence (immediate)
- `npm install dexie`
- Create `src/data/db.ts` — Dexie database definition with a `matches` table (key: `matchId`, store full `ProcessedMatch`)
- Add serialization helpers for `Map` ↔ plain object conversion (`playerStatusTimeline`)
- Modify `src/data/repository.ts` — persist to Dexie in `loadFilesAction` after ingestion, add hydration function
- Add startup hydration in `App.tsx` (or provider wrapper) — load all matches from Dexie into atoms before app renders
- Add a "clear all data" action for user control
- Mock Dexie with `fake-indexeddb` in tests
- **Files that change:** `repository.ts`, `App.tsx` (or new provider). Hooks/domain/UI stay untouched.

### 2. Onboarding + Trust Signals
- First-time experience walking users through importing logs
- "Your data stays on your device" messaging in the UI

### 3. Rule-Based Insights Layer
- Surface actionable patterns from existing computed stats
- E.g., "Player Y dies first in 40% of lost fights", "Win rate on Control maps is 30% below average"

### 4. Lint Cleanup + Code Splitting
- Fix 71 lint issues (`npm run lint:fix` handles most)
- Lazy-load routes to reduce initial bundle size

### 5. Beta Launch
- Ship at scrimsight.com
- Post to r/OverwatchUniversity, OW Discord servers, ScrimTime community
- Collect feedback from 3-5 real teams

## Key Files Reference
- `src/data/repository.ts` — Jotai atoms + loadFilesAction (main persistence integration point)
- `src/data/ingestor.ts` — File parsing, event grouping, derived data calculation
- `src/data/schemas.ts` — Zod validation schemas for all event types
- `src/types/domain.ts` — ProcessedMatch, MatchMetadata, MatchEvents, Teamfight, etc.
- `src/types/logs.ts` — Raw log event type definitions
- `src/hooks/useRepository.ts` — Hook wrappers for atom access
- `src/App.tsx` — Router + app entry point
- `src/hooks/useSampleData.ts` — Sample data loading (17 files in src/lib/sampledata/)
