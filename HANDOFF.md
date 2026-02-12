# ScrimSight Handoff Document

*Last updated: Feb 11, 2026*

## Goal

Bring ScrimSight to MVP — a local-first web analytics tool for amateur competitive Overwatch teams, hosted at scrimsight.com. It ingests ScrimTime `.txt` log files client-side, aggregates stats, and surfaces actionable insights about team/player performance over time.

The owner (Andrew Gleeson, GitHub: MortalWombatOW) wants to:
- Ship an MVP that delivers real value to players/coaches
- Start with the amateur segment, then explore collegiate ("ScrimSight University") as a B2B play
- Eventually monetize (free tier for local analysis, paid tier for team collaboration/advanced features)
- Connect with players/coaches via r/OverwatchUniversity, OW Discord servers, and the ScrimTime community
- Keep the app local-first with strong privacy (no server-side data, no AI features in the product)

## Current Progress

### Codebase (as of Feb 11, 2026)
- React 19 + Vite 6 + TypeScript 5.7 (strict mode)
- Jotai (state), Dexie.js (IndexedDB persistence), Tailwind 4 + daisyUI 5 (styling), Recharts (charts), Zod (validation)
- Clean 3-layer architecture: Data (atoms/repos) → Domain (pure logic) → Hooks (facades) → UI
- **84 tests, all passing. Zero lint issues. Zero TS errors.**
- Build: ~174 KB gzip initial load
- Branch: `next` (working branch off `main`)

### Completed Tasks
1. **Dexie Persistence** (Task 01) — IndexedDB persistence via Dexie.js, serialization helpers for Map/Set, hydration gate in App.tsx.
2. **Onboarding + Trust Signals** (Task 02) — First-time experience, privacy messaging.
3. **Lint Cleanup + Code Splitting** (Task 04) — Zero lint issues, all page routes lazy-loaded via `React.lazy()`, 66% gzip reduction.
4. **Detailed Analysis Page** (this session) — New `/analysis` page with 6 research-backed hypothesis sections + progressive disclosure. See below.

### Features Already Built
- Log file ingestion + parsing with Zod validation
- Match/Scrim grouping and metadata extraction
- Teamfight detection (event clustering, 12s sustain window)
- Ultimate economy domain logic (charge times, hold times, ult lifecycle) — **domain layer exists but UI not yet wired up**
- Player impact analysis (first pick rate, first death rate, ult win rate)
- Per-10-min stat normalization, accuracy rates
- Pages: Home (with trends), Files, Scrims, Matches (overview/timeline/compare/players), Players, Teams, Metrics Explorer, **Detailed Analysis**
- Metrics Explorer with faceted filtering + URL state sync + histograms
- Timeline with interactive fight details, kill matrices, hero playtime, composition analysis
- IndexedDB persistence — data survives page refreshes
- Route-level code splitting — 25 lazy-loaded route chunks (including new analysis page)

### Detailed Analysis Page (NEW — Feb 11, 2026)

A top-level `/analysis` page that presents a "data science report" — research-backed hypotheses about competitive Overwatch, validated by the user's own dataset. This is parts 1 and 2 of a 3-part vision:
1. **What matters** (hypotheses from competitive OW research)
2. **What good looks like** (benchmarks computed from the entire dataset)
3. **How you compare** (per-team comparison — NOT YET BUILT)

**6 Hypothesis Sections:**
1. **First Pick Determines Fight Outcomes** — Global first-pick win rate vs 75% benchmark, per-team conversion bar chart
2. **Ultimate Economy Wins Games** — Avg ults per win vs loss, fight type distribution (dry/ult-invested/all-in/stagger)
3. **Survival Correlates with Winning** — Deaths/10 distribution histogram + scatter plot vs win rate by role, quartile benchmarks
4. **Teamfight Win Rate Predicts Map Success** — TFWR scatter (wins green, losses red), 55% benchmark line
5. **Fight Type Distribution Reveals Strategy** — Grouped bars comparing winner vs loser fight type distributions
6. **Target Focus Indicates Coordination** — FB/E ratio per team with dataset average reference line

**Progressive Disclosure:**
- **Executive Summary banner** at the top — auto-selects the 3 most notable findings (ranked by deviation from benchmarks)
- **All sections collapsed by default** — each shows: icon + title + one-line insight + hero stat. Click to expand full stat cards + charts.
- Uses `AnalysisSectionWrapper` component for the collapse/expand pattern
- Each section has a `SectionSummary` with notability scoring (`high`/`medium`/`low`)

**Files created:**
- `src/domain/analysis.ts` — 6 pure computation functions, 6 insight generators, 6 summary generators, `generateKeyFindings()`
- `src/hooks/useDetailedAnalysis.ts` — Single hook returning all 6 analyses + metadata
- `src/pages/DetailedAnalysisPage.tsx` — Page shell with ExecutiveSummary + 6 collapsed sections
- `src/components/analysis/AnalysisSectionWrapper.tsx` — Collapsible section wrapper
- `src/components/analysis/ExecutiveSummary.tsx` — Key findings banner
- `src/components/analysis/FirstPickSection.tsx`
- `src/components/analysis/UltEconomySection.tsx`
- `src/components/analysis/SurvivalSection.tsx`
- `src/components/analysis/TFWRSection.tsx`
- `src/components/analysis/StrategyProfileSection.tsx`
- `src/components/analysis/TargetFocusSection.tsx`

**Files modified:**
- `src/App.tsx` — Added lazy import + `/analysis` route
- `src/components/navigation/Navigation.tsx` — Added "Detailed Analysis" sidebar item with `TbReportAnalytics` icon

### Documentation
- `docs/information-architecture.md` — Comprehensive IA audit with site map, navigation model, data presentation by page, domain capability matrix, user mental model mapping, and gaps summary. **Needs update to include /analysis page.**
- `docs/tasks/` — 9 task files (01-09) covering the full roadmap from persistence through expert feedback.
- `docs/research/` — Market research, external resources, plus user research docs on coaching workflows, metrics, compositions, etc. These research docs were used to derive the 6 hypotheses for the Detailed Analysis page.
- `docs/architecture.md`, `docs/file-structure.md`, `docs/typescript-guidelines.md` — Technical docs.

### Strategic Decisions Made
- **Local-first web app** (not Tauri/Electron) — already hosted at scrimsight.com, lower distribution friction
- **Dexie.js for IndexedDB persistence** — client-side, no server, survives refreshes
- **Store full ProcessedMatch objects** with `schemaVersion` for future migration
- **No AI features in the product** — AI used for development only
- **Rule-based insights** (not AI) for the "so what?" layer
- **Amateur-first, collegiate later** — validate with amateur coaches, then explore institutional B2B
- **Progressive disclosure for analysis** — collapsed sections with hero stats, executive summary banner, expand for details

### Market Research Summary
- Full analysis in `docs/research/market-opportunity.md`
- Key finding: collegiate esports programs ($200K+ facility budgets, $46M in scholarships) are the highest-value segment, but require cloud/collaboration features ScrimSight doesn't have yet
- **Parsertime** (open source, by luxdotdev) is the primary direct competitor
- Revenue ceiling for single-game tool likely mid-six figures ARR; could expand via multi-game or coaching marketplace
- External resources documented in `docs/research/external-resources.md`

## What Worked
- The 3-layer architecture is clean — domain analysis functions (`src/domain/analysis.ts`) contain zero React/Jotai dependencies and are purely testable
- `React.lazy()` with direct file imports (not barrel imports) was straightforward for code splitting
- Named-export components adapted for lazy loading via `.then(m => ({ default: m.ComponentName }))`
- The `WinConditionCard` pattern (rule-based `getInsight()` + color-coded progress bars) scaled well — we extended it to 6 analysis sections via the `SectionSummary` type and `AnalysisSectionWrapper`
- Computing section "notability" scores (deviation from research benchmarks) works well for auto-ranking key findings
- The progressive disclosure wrapper (`AnalysisSectionWrapper`) cleanly separates section chrome (title, insight, hero stat) from section content (stat cards, charts)
- Using all existing Recharts patterns from `TrendsChart` and `MetricsChart` — no new chart library needed
- `fake-indexeddb/auto` in test setup provides IndexedDB for all tests seamlessly

## What Didn't Work / Watch Out For
- `playerStatusTimeline` in `ProcessedMatch` is a `Map`, `PlayerStatusEntry` contains `Set` — **not JSON-serializable**. Serialization helpers in `src/data/serialization.ts` handle Map↔Record and Set↔Array conversion.
- Barrel exports (`@pages`, `@components`) defeat code splitting — must import directly from source files for `React.lazy()`. Also, files re-exported by a barrel must NOT import from that same barrel (circular dependency rule in `docs/architecture.md`).
- `calculateUltMetrics()` in `src/domain/economy.ts` is **dead code** — defined but never called from any hook. Task 05 will wire it up.
- The Recharts `Cell` component uses Tailwind `fill-*` classes (e.g., `fill-success`, `fill-warning`) for bar coloring. For oklch theme variables (e.g., `oklch(var(--su))`), pass them as `fill` props on `Bar`/`Scatter` components instead.
- The TFWR scatter chart uses a hidden Y-axis (`dataKey="tfwr"` with `hide`) to spread dots vertically — since match result is binary, pure Y-axis positioning would stack all dots on two lines.
- The `StrategyProfile` winner/loser distributions currently show the same percentages because each fight has one fight type shared by both teams — it's the same distribution. The comparison is more useful when scoped per-team (future work in part 3).

## Next Steps (Priority Order)

### Immediate: Part 3 of the Analysis Arc
The Detailed Analysis page currently covers parts 1 (what matters) and 2 (what good looks like). The next step is:
- **Part 3: "How You Compare"** — Add a team selector to the analysis page (or make it a sub-route `/analysis/:teamId`) that shows each team's values compared against the dataset benchmarks. Each section would show "Your team: X% | Dataset: Y% | Benchmark: Z%".

### Ready to Start Now (no dependencies)
- **Task 03: Insight Engine Infrastructure** (`docs/tasks/03-insight-engine.md`) — Build reusable insight types, rule runner, `useInsights()` hook, `InsightCard` component. Foundation for Task 07.
- **Task 05: Surface Ult Economy & Fight Types** (`docs/tasks/05-ult-economy-fight-types.md`) — Wire up existing dead-code domain logic (`calculateUltMetrics()`) to new hooks and UI. Pure UI + hook work. High-value differentiation from Parsertime.
- **Update `docs/information-architecture.md`** — Add the `/analysis` page to the site map, navigation model, and data presentation sections.

### After Task 05
- **Task 06: Enrich Trend Views** (`docs/tasks/06-enrich-trend-views.md`) — Add TFWR, first death rate, ult metrics to existing trend infrastructure.

### After Task 03
- **Task 07: Insight Rules & Auto-Summaries** (`docs/tasks/07-insight-rules-auto-summaries.md`) — Implement specific coaching insight rules + scrim summary generation.

### After Tasks 05 + 06
- **Task 08: Enhanced Composition Analysis** (`docs/tasks/08-enhanced-compositions.md`) — Archetype classification (Dive/Brawl/Poke), comp×map analysis.

### After All Tasks
- **Task 09: Expert Feedback Round** (`docs/tasks/09-expert-feedback.md`) — Recruit 3-5 expert testers, collect structured feedback.

## Key Files Reference
- `src/App.tsx` — Router + lazy imports + Suspense boundary + hydration gate
- `src/data/repository.ts` — Jotai atoms + loadFilesAction + Dexie persistence
- `src/data/db.ts` — Dexie database definition
- `src/data/serialization.ts` — Map/Set ↔ JSON-safe serialization helpers
- `src/data/ingestor.ts` — File parsing, event grouping, derived data calculation
- `src/domain/analysis.ts` — **NEW** — 6 analysis computations + insights + summaries + key findings
- `src/domain/economy.ts` — Ult cycle calculation (dead code: `calculateUltMetrics()` never called)
- `src/domain/teamfights.ts` — Fight detection, classification, winner determination
- `src/types/domain.ts` — ProcessedMatch, Teamfight, TeamfightEvent, MatchEvents, etc.
- `src/types/stats.ts` — PlayerStatsBase, PlayerStats, key types
- `src/hooks/useDetailedAnalysis.ts` — **NEW** — Single hook for all analysis data
- `src/hooks/useFightAnalysis.ts` — WinConditionMetrics, PlayerImpactMetrics
- `src/hooks/useTrendData.ts` — Trend computation (win rate + K/D)
- `src/hooks/useRepository.ts` — Hook wrappers for atom access
- `src/hooks/useStats.ts` — Stats access with filtering + derived metrics
- `src/components/analysis/WinConditionCard.tsx` — Original pattern for auto-generated insights
- `src/components/analysis/AnalysisSectionWrapper.tsx` — **NEW** — Collapsible section wrapper
- `src/components/analysis/ExecutiveSummary.tsx` — **NEW** — Key findings banner
- `src/components/analysis/FirstPickSection.tsx` — **NEW** (+ 5 more section components)
- `src/components/navigation/Navigation.tsx` — Sidebar navigation (now includes Detailed Analysis)
- `docs/information-architecture.md` — IA audit with full gap analysis
- `docs/tasks/*.md` — All 9 task specifications
- `docs/research/*.md` — Market research + external resources + user research (source of analysis hypotheses)
