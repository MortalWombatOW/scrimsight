# ScrimSight Handoff Document

*Last updated: Feb 9, 2026*

## Goal

Bring ScrimSight to MVP — a local-first web analytics tool for amateur competitive Overwatch teams, hosted at scrimsight.com. It ingests ScrimTime `.txt` log files client-side, aggregates stats, and surfaces actionable insights about team/player performance over time.

The owner (Andrew Gleeson, GitHub: MortalWombatOW) wants to:
- Ship an MVP that delivers real value to players/coaches
- Start with the amateur segment, then explore collegiate ("ScrimSight University") as a B2B play
- Eventually monetize (free tier for local analysis, paid tier for team collaboration/advanced features)
- Connect with players/coaches via r/OverwatchUniversity, OW Discord servers, and the ScrimTime community
- Keep the app local-first with strong privacy (no server-side data, no AI features in the product)

## Current Progress

### Codebase (as of Feb 9, 2026)
- React 19 + Vite 6 + TypeScript 5.7 (strict mode)
- Jotai (state), Dexie.js (IndexedDB persistence), Tailwind 4 + daisyUI 5 (styling), Recharts (charts), Zod (validation)
- Clean 3-layer architecture: Data (atoms/repos) → Domain (pure logic) → Hooks (facades) → UI
- **84 tests, all passing. Zero lint issues. Zero TS errors.**
- Build: ~174 KB gzip initial load (down from 517 KB after code splitting)
- Branch: `claude` (working branch off `main`)

### Completed Tasks
1. **Dexie Persistence** (Task 01) — IndexedDB persistence via Dexie.js, serialization helpers for Map/Set, hydration gate in App.tsx.
2. **Onboarding + Trust Signals** (Task 02) — First-time experience, privacy messaging.
3. **Lint Cleanup + Code Splitting** (Task 04) — Zero lint issues, all page routes lazy-loaded via `React.lazy()`, 66% gzip reduction.

### Features Already Built
- Log file ingestion + parsing with Zod validation
- Match/Scrim grouping and metadata extraction
- Teamfight detection (event clustering, 12s sustain window)
- Ultimate economy domain logic (charge times, hold times, ult lifecycle) — **domain layer exists but UI not yet wired up**
- Player impact analysis (first pick rate, first death rate, ult win rate)
- Per-10-min stat normalization, accuracy rates
- Pages: Home (with trends), Files, Scrims, Matches (overview/timeline/compare/players), Players, Teams, Metrics Explorer
- Metrics Explorer with faceted filtering + URL state sync + histograms
- Timeline with interactive fight details, kill matrices, hero playtime, composition analysis
- IndexedDB persistence — data survives page refreshes
- Route-level code splitting — 24 lazy-loaded route chunks

### Documentation
- `docs/information-architecture.md` — Comprehensive IA audit with site map, navigation model, data presentation by page, domain capability matrix, user mental model mapping, and gaps summary.
- `docs/tasks/` — 9 task files (01-09) covering the full roadmap from persistence through expert feedback.
- `docs/research/` — Market research (market-opportunity.md), external resources (external-resources.md), plus user research docs on coaching workflows, metrics, compositions, etc.
- `docs/architecture.md`, `docs/file-structure.md`, `docs/typescript-guidelines.md` — Technical docs.

### Strategic Decisions Made
- **Local-first web app** (not Tauri/Electron) — already hosted at scrimsight.com, lower distribution friction
- **Dexie.js for IndexedDB persistence** — client-side, no server, survives refreshes
- **Store full ProcessedMatch objects** with `schemaVersion` for future migration
- **No AI features in the product** — AI used for development only
- **Rule-based insights** (not AI) for the "so what?" layer
- **Amateur-first, collegiate later** — validate with amateur coaches, then explore institutional B2B

### Market Research Summary
- Full analysis in `docs/research/market-opportunity.md` (questions + detailed report)
- Key finding: collegiate esports programs ($200K+ facility budgets, $46M in scholarships) are the highest-value segment, but require cloud/collaboration features ScrimSight doesn't have yet
- **Parsertime** (open source, by luxdotdev) is the primary direct competitor — free, community-driven
- **DataStrike** (was a competitor) appears defunct as of 2025
- **Omnic.ai** (~$10/mo) uses computer vision on video — different approach, higher cost
- Revenue ceiling for single-game tool likely mid-six figures ARR; could expand via multi-game or coaching marketplace
- External resources documented in `docs/research/external-resources.md`:
  - `luxdotdev/dataset` — 1,900+ anonymized Parsertime matches (PostgreSQL/CSV), could replace sample data
  - `TeKrop/overfast-api` — unofficial OW2 REST API for hero/map/player data
  - DataStrike docs repo — archived reference

## What Worked
- The 3-layer architecture is clean — persistence slotted into `src/data/` without touching domain/hooks/UI
- `React.lazy()` with direct file imports (not barrel imports) was straightforward for code splitting
- Named-export components adapted for lazy loading via `.then(m => ({ default: m.ComponentName }))`
- Replacing `any` types with proper union types (`TeamfightEvent = KillLogEvent | UltimateStartLogEvent | MercyRezLogEvent`) plus type guard functions cleaned up the codebase significantly
- `fake-indexeddb/auto` in test setup provides IndexedDB for all tests seamlessly

## What Didn't Work / Watch Out For
- `playerStatusTimeline` in `ProcessedMatch` is a `Map`, `PlayerStatusEntry` contains `Set` — **not JSON-serializable**. Serialization helpers in `src/data/serialization.ts` handle Map↔Record and Set↔Array conversion.
- Barrel exports (`@pages`, `@components`) defeat code splitting — must import directly from source files for `React.lazy()`.
- The `Teamfight.events` field was `any[]` — now typed as `TeamfightEvent[]`. Downstream code accessing kill-specific fields needs type guards (`isKillEvent()`, `isUltStartEvent()`).
- There was a double-counting bug in `teamfights.ts` kill counter (both `attackerTeam` and `victimTeam` checks incrementing the same counter) — fixed by removing the redundant `attackerTeam` check.
- `calculateUltMetrics()` in `src/domain/economy.ts` is **dead code** — defined but never called from any hook. Task 05 will wire it up.
- `/compact` is a built-in CLI command, not a skill — don't try to invoke it via the Skill tool.
- The folder structure lint rule (`folderStructure.mjs`) only allows specific files in `src/` root — `test-setup.ts` had to be explicitly added.

## Next Steps (Priority Order)

All tasks are documented in detail in `docs/tasks/`. Read the specific task file before starting.

### Ready to Start Now (no dependencies)
- **Task 03: Insight Engine Infrastructure** (`docs/tasks/03-insight-engine.md`) — Build reusable insight types, rule runner, `useInsights()` hook, `InsightCard` component. Foundation for Task 07.
- **Task 05: Surface Ult Economy & Fight Types** (`docs/tasks/05-ult-economy-fight-types.md`) — Wire up existing dead-code domain logic (`calculateUltMetrics()`) to new hooks and UI. Pure UI + hook work. High-value differentiation from Parsertime.

### After Task 05
- **Task 06: Enrich Trend Views** (`docs/tasks/06-enrich-trend-views.md`) — Add TFWR, first death rate, ult metrics to existing trend infrastructure. Extend trends to Team and Player pages.

### After Task 03
- **Task 07: Insight Rules & Auto-Summaries** (`docs/tasks/07-insight-rules-auto-summaries.md`) — Implement specific coaching insight rules + scrim summary generation using the engine from Task 03.

### After Tasks 05 + 06
- **Task 08: Enhanced Composition Analysis** (`docs/tasks/08-enhanced-compositions.md`) — Archetype classification (Dive/Brawl/Poke), comp×map analysis, hero pick rates.

### After All Tasks
- **Task 09: Expert Feedback Round** (`docs/tasks/09-expert-feedback.md`) — Recruit 3-5 expert testers, collect structured feedback, synthesize into next steps.

### Bonus: Sample Data Upgrade
- The `luxdotdev/dataset` repo has 1,900+ real matches (anonymized, from Parsertime). Could replace the current 30 synthetic sample logs for much richer demos. Format is PostgreSQL/CSV (pre-parsed relational tables), so would need a CSV→ProcessedMatch adapter. See `docs/research/external-resources.md`.

## Key Files Reference
- `src/App.tsx` — Router + lazy imports + Suspense boundary + hydration gate
- `src/data/repository.ts` — Jotai atoms + loadFilesAction + Dexie persistence
- `src/data/db.ts` — Dexie database definition
- `src/data/serialization.ts` — Map/Set ↔ JSON-safe serialization helpers
- `src/data/ingestor.ts` — File parsing, event grouping, derived data calculation
- `src/domain/economy.ts` — Ult cycle calculation (dead code: `calculateUltMetrics()` never called)
- `src/domain/teamfights.ts` — Fight detection, classification, winner determination
- `src/types/domain.ts` — ProcessedMatch, Teamfight, TeamfightEvent, MatchEvents, etc.
- `src/types/logs.ts` — Raw log event type definitions (KillLogEvent, UltimateStartLogEvent, etc.)
- `src/hooks/useFightAnalysis.ts` — WinConditionMetrics, PlayerImpactMetrics + type guards
- `src/hooks/useTrendData.ts` — Trend computation (currently: win rate + K/D)
- `src/hooks/useRepository.ts` — Hook wrappers for atom access
- `src/components/analysis/WinConditionCard.tsx` — Pattern for auto-generated insights
- `src/components/team/TeamCompositions.tsx` — Existing comp display (no archetype classification yet)
- `docs/information-architecture.md` — IA audit with full gap analysis
- `docs/tasks/*.md` — All 9 task specifications
- `docs/research/*.md` — Market research + external resources + user research
