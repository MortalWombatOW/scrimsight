# ScrimSight Handoff Document

*Last updated: Feb 14, 2026*

## Goal

Bring ScrimSight to MVP — a local-first web analytics tool for amateur competitive Overwatch teams, hosted at scrimsight.com. It ingests ScrimTime `.txt` log files client-side, aggregates stats, and surfaces actionable insights about team/player performance over time.

The owner (Andrew Gleeson, GitHub: MortalWombatOW) wants to:
- Ship an MVP that delivers real value to players/coaches
- Start with the amateur segment, then explore collegiate ("ScrimSight University") as a B2B play
- Eventually monetize (free tier for local analysis, paid tier for team collaboration/advanced features)
- Connect with players/coaches via r/OverwatchUniversity, OW Discord servers, and the ScrimTime community
- Keep the app local-first with strong privacy (no server-side data, no AI features in the product)

## Current Progress

### Codebase (as of Feb 14, 2026)
- React 19 + Vite 6 + TypeScript 5.7 (strict mode)
- Jotai (state), Dexie.js (IndexedDB persistence), Tailwind 4 + daisyUI 5 (styling), Recharts (charts), Zod (validation)
- Clean 3-layer architecture: Data (atoms/repos) → Domain (pure logic) → Hooks (facades) → UI
- **113 tests, all passing. Zero lint issues. Zero TS errors.**
- Build: ~170 KB gzip initial load + ~21KB DetailedAnalysisPage chunk
- Branch at time of writing: `feature/analysis-ui-benchmarks` (5 commits ahead of `next`)

### Completed Tasks
1. **Dexie Persistence** (Task 01) — IndexedDB persistence via Dexie.js, serialization helpers for Map/Set, hydration gate in App.tsx.
2. **Onboarding + Trust Signals** (Task 02) — First-time experience, privacy messaging.
3. **Lint Cleanup + Code Splitting** (Task 04) — Zero lint issues, all page routes lazy-loaded via `React.lazy()`, 66% gzip reduction.
4. **Detailed Analysis Page** — New `/analysis` page with 6 research-backed hypothesis sections + progressive disclosure.
5. **Analysis Pipeline Migration** — Migrated 10 Jupyter notebooks into a single runnable Python pipeline. See "Analysis Pipeline" section below.
6. **Benchmark Infrastructure + Analysis UI Enhancements** (this session) — 4 features in 5 commits. See details below.

### Features Already Built
- Log file ingestion + parsing with Zod validation
- Match/Scrim grouping and metadata extraction
- Teamfight detection (event clustering, 12s sustain window)
- Ultimate economy domain logic (charge times, hold times, ult lifecycle, **now with role distributions and ult differential win rates**)
- Player impact analysis (first pick rate, first death rate, ult win rate)
- Per-10-min stat normalization, accuracy rates
- Pages: Home (with trends), Files, Scrims, Matches (overview/timeline/compare/players), Players, Teams, Metrics Explorer, **Detailed Analysis**
- Metrics Explorer with faceted filtering + URL state sync + histograms
- Timeline with interactive fight details, kill matrices, hero playtime, composition analysis
- IndexedDB persistence — data survives page refreshes
- Route-level code splitting — 25 lazy-loaded route chunks

### Analysis UI Enhancements (NEW — Feb 14, 2026)

Implemented 4 features across 5 atomic commits on `feature/analysis-ui-benchmarks`:

**1. Benchmark Infrastructure (Part 3: "How You Compare")**
- Copied benchmark JSON (38KB, 24 concepts) to `src/data/benchmarks/`
- Full TypeScript interfaces for the JSON schema
- `computePercentilePosition()` with linear interpolation between p10/p25/p50/p75/p90 breakpoints
- `selectDistribution()` helper (role > overall fallback)
- `useBenchmarks()` hook with per-section typed accessors
- `BenchmarkComparison` gauge component — horizontal bar showing percentile zones with user's value marker and color-coded rating
- Wired into all 6 existing analysis sections

**2. Ult Economy Enhancement**
- Ult differential win rate computation (fight WR by ult advantage -5 to +5)
- Hero ult effectiveness (fight WR when hero uses ult, min 5 uses)
- Role-grouped charge/hold time distributions (`computeRoleDistributions()`)
- 3 new chart rows: ult differential bar chart, hero effectiveness chart, role charge/hold summary cards
- Extended stat cards row with avg ult differential and dry fight WR benchmark

**3. Composition Analysis (New Section)**
- Ported `classifyComposition()` from Python (Dive/Brawl/Poke/Mixed via signature matching)
- `computeCompositionAnalysis()` returns hero pick/win rates + archetype stats
- `CompositionSection` with archetype win rates (vs community benchmark), hero pick rate chart (top 15, role-colored), hero win rate chart (min 3 matches)
- 7th section on `/analysis` page

**4. Enriched Trend Views**
- Extended `TrendDataPoint` with: `tfwr`, `deathsPer10`, `firstPickRate`, `firstDeathRate`, `cumulativeTfwr`, `cumulativeDeathsPer10`, `tfwrRolling5`, `deathsPer10Rolling5`, `totalFights`, `fightsWon`
- Added benchmark reference line support to `TrendsChart`
- Replaced static metric list with interactive metric selector chips (6 metrics)
- Default: Win Rate + TFWR; benchmark lines show conditionally per active metric

**Cross-cutting: Fixed Doomfist role** — moved from `DAMAGE_HEROES` to `TANK_HEROES` in `src/lib/hero.ts`

### Analysis Pipeline

Migrated all 10 analysis Jupyter notebooks (00-09) into a single runnable Python pipeline that generates benchmarks and figures from the Parsertime dataset (~166MB of CSVs, ~4,800 matches).

**Run command:** `uv run --project analysis python -m analysis`

**Output:**
- `analysis/outputs/benchmarks/training_path_benchmarks.json` — 24 benchmark concepts, 37.2KB
- `analysis/outputs/figures/` — 55 PNG figures

**Pipeline structure:**
```
analysis/
  __init__.py                 # Package marker
  __main__.py                 # Entry: python -m analysis
  pipeline.py                 # Orchestrator: AnalysisContext + module runner
  pyproject.toml              # Dependencies (pandas, matplotlib, scipy, scikit-learn)
  analyses/                   # One module per domain
    __init__.py
    data_exploration.py       # NB 00 — dataset overview (diagnostic, no benchmarks)
    deaths_per_10.py          # NB 04 — D/10 distributions by role/hero (1 benchmark)
    first_death.py            # NB 01 — first pick/death analysis (4 benchmarks)
    ult_economy.py            # NB 02 — ult charge/hold/efficiency (5 benchmarks)
    combat_damage.py          # NB 06 — FB ratio, crit rates, abilities (2 benchmarks)
    hero_composition.py       # NB 03 — hero meta, archetypes, synergy, swaps (2 benchmarks)
    team_performance.py       # NB 07 — TFWR, win predictors, improvement (3 benchmarks)
    map_analysis.py           # NB 05 — map balance, momentum, mode analysis (2 benchmarks)
    hero_specific_events.py   # NB 08 — Mercy rez, D.Va remech, Echo dup (3 benchmarks)
    synthesis.py              # NB 09 — Big Three, hypothesis validation (2 benchmarks)
  src/                        # Utility layer (pre-existing, extended)
    data_loader.py            # CSV loading with category dtype optimization
    fight_detection.py        # Vectorized kill clustering (15s window, min 3 deaths)
    metrics.py                # Extended with percentile_benchmarks, per_10_series, etc.
    preprocessing.py          # HERO_ROLES, classify_composition, match winner logic
    visualization.py          # OW-themed matplotlib styling + save_fig
  data/                       # ~166MB of Parsertime CSVs (24 tables)
  outputs/                    # Generated figures + benchmarks
```

### Detailed Analysis Page

A top-level `/analysis` page presenting research-backed hypotheses validated by the user's dataset. All 3 parts of the vision are now complete:
1. **What matters** (hypotheses from competitive OW research) ✅
2. **What good looks like** (benchmarks from entire dataset) ✅
3. **How you compare** (per-team comparison via benchmark gauges) ✅

**7 Sections:** First Pick, Ult Economy, Survival (D/10), TFWR, Fight Type Distribution, Target Focus (FB/E ratio), **Composition Analysis** (new). Each with progressive disclosure, benchmark comparisons, and multiple chart types.

### Documentation
- `docs/information-architecture.md` — IA audit (needs update for /analysis page changes)
- `docs/design/training-path.md` — Training path system design (16 concepts across 6 tiers)
- `docs/tasks/` — 9 task files (01-09) covering roadmap
- `docs/research/` — Market research, user research, coaching workflows

### Strategic Decisions Made
- **Local-first web app** (not Tauri/Electron) — already hosted at scrimsight.com
- **Dexie.js for IndexedDB persistence** — client-side, no server
- **No AI features in the product** — AI used for development only
- **Rule-based insights** (not AI) for the "so what?" layer
- **Amateur-first, collegiate later**
- **uv** as Python package manager for the analysis pipeline

## What Worked

### Web App
- The 3-layer architecture is clean — domain analysis functions are purely testable
- `React.lazy()` with direct file imports for code splitting
- `WinConditionCard` pattern (rule-based insights + color-coded progress bars) scaled well
- Computing section "notability" scores for auto-ranking key findings
- `fake-indexeddb/auto` in test setup provides IndexedDB seamlessly
- **Benchmark JSON import at build time** — Vite handles JSON imports natively, TypeScript's `resolveJsonModule` already enabled. 38KB pre-gzip, ~8KB gzipped. No need for fetch/async loading.
- **Role > overall fallback** for percentile lookup — role-level distributions give more meaningful comparisons than overall, hero-level data only has median+n (not full curves)
- **Optional benchmark props** on section components — each section works fine without benchmarks, they're progressively enhanced when available
- **Ult differential from teamfight data** — team1UltsUsed/team2UltsUsed arrays on Teamfight type already contain exactly what's needed; no new data processing required
- **Composition classification port** was clean — Python's set-based signature matching maps directly to TypeScript Set operations

### Analysis Pipeline
- **AnalysisContext pattern**: Loading all data once and passing a shared context to each module avoids duplicate loading and keeps modules independent
- **Column pruning** (`usecols` in `load_csv`): Cuts memory 30-40% on large tables (Kill, PlayerStat)
- **Unified category dtypes**: 5-10x memory savings on team/player name columns. Must include "Draw" as a valid team category (fight_detection uses it as sentinel)
- **Per-match chunked processing**: The ult-fight join was a 226s cross-join disaster; rewriting to process per-match in chunks brought it to 35s
- **Match deduplication**: MatchStart/MatchEnd had duplicate MapDataIds (from reconnects). Must `drop_duplicates(subset="MapDataId", keep="last")` before the winner merge — without this, valid_kills exploded from 355K to 73M rows
- **String `is_critical_hit` values**: The CSV stores `"True"`/`"False"` as strings, not booleans. Use `.map({"True": 1, "true": 1, True: 1}).fillna(0).astype(int)` instead of `.astype(int)`
- **Category-safe fillna**: After an outer merge on categorical columns, `df.fillna(0)` fails because 0 isn't a valid category. Fill only numeric columns individually
- **Pivot table integer formatting**: Pivot tables produce floats even from integer data; use `.astype(int)` before `sns.heatmap(fmt="d")`

## What Didn't Work / Watch Out For

### Web App
- `playerStatusTimeline` is a `Map`, `PlayerStatusEntry` contains `Set` — not JSON-serializable. Serialization helpers handle conversion.
- Barrel exports defeat code splitting — import directly from source files for `React.lazy()`
- `StrategyProfile` winner/loser distributions show same percentages (each fight has one type shared by both teams)
- **Hero-level benchmark data only has `median + n`**, not full percentile curves — use role-level distributions for positioning, hero median as supplementary context only
- **`firstUltRate` field on `PlayerUltMetrics` is never populated** — left at 0, would need cross-player comparison logic to compute

### Analysis Pipeline
- `python` command not found — must use `uv run --project analysis python -m analysis`
- `No module named analysis` — needed `pyproject.toml` for uv to resolve the package
- `hero_time_played` not `time_played` — CSV column name mismatch
- Category mismatch errors are common with pandas categorical dtypes + team comparisons. Use `cat_eq()`/`cat_ne()` from preprocessing.py or `.astype(str)` for safe comparisons
- FutureWarnings about `observed=False` in groupby — not breaking but noisy; add `observed=True` to all groupby calls

## Next Steps (Priority Order)

### Immediate: Merge & Visual QA
- Merge `feature/analysis-ui-benchmarks` into `main` (or wherever the owner wants it)
- Visual check: load real data in browser → `/analysis` page should show benchmark gauges in each section, ult differential chart, composition section
- Visual check: `/` home page trends should show metric selector chips and TFWR with benchmark line
- Run through all 7 analysis sections expanded to verify chart rendering

### Ready to Start Now (no dependencies)
- **Task 03: Insight Engine Infrastructure** (`docs/tasks/03-insight-engine.md`) — Reusable insight types, rule runner, `useInsights()` hook
- **Unit tests for new domain logic** — `percentileLookup`, `classifyComposition`, ult differential computation (currently only type-checked, no dedicated unit tests)
- **Update `docs/information-architecture.md`** — Add composition section, benchmark gauges, trend metric selector
- **Composition Phase 2** — Map-hero heatmap (existing `HeatmapGrid` component), hero synergy matrix, swap analysis from `events.heroSwap`
- **Trend Phase 2** — Player drill-down (per-player TFWR/D10 trends), rolling average lines as separate metrics

### After Task 03
- **Task 07: Insight Rules & Auto-Summaries** — Coaching insight rules + scrim summaries

### After Composition Phase 2
- **Task 08: Enhanced Composition Analysis** — Archetype classification refinements, comp×map analysis

### After All Tasks
- **Task 09: Expert Feedback Round** — 3-5 expert testers

## Key Files Reference

### Web App — Benchmark Infrastructure (NEW)
- `src/data/benchmarks/types.ts` — Full TypeScript interfaces for benchmark JSON schema
- `src/data/benchmarks/percentileLookup.ts` — `computePercentilePosition()`, `selectDistribution()`
- `src/data/benchmarks/index.ts` — JSON import + re-exports
- `src/data/benchmarks/training_path_benchmarks.json` — 24 concepts, 38KB
- `src/hooks/useBenchmarks.ts` — Per-section typed accessors with position helpers
- `src/components/analysis/BenchmarkComparison.tsx` — Horizontal percentile gauge component

### Web App — Composition (NEW)
- `src/domain/composition.ts` — `classifyComposition()`, `computeCompositionAnalysis()`
- `src/hooks/useCompositionAnalysis.ts` — Hook wrapping domain logic
- `src/components/analysis/CompositionSection.tsx` — Full section with 3 charts

### Web App — Core
- `src/App.tsx` — Router + lazy imports + Suspense + hydration gate
- `src/data/repository.ts` — Jotai atoms + Dexie persistence
- `src/data/serialization.ts` — Map/Set ↔ JSON-safe helpers
- `src/data/ingestor.ts` — File parsing, event grouping
- `src/domain/analysis.ts` — 6 analysis computations + ult differential + hero ult effectiveness + insights + summaries
- `src/domain/economy.ts` — Ult cycle calculation + `computeRoleDistributions()`
- `src/domain/teamfights.ts` — Fight detection, classification
- `src/types/domain.ts` — ProcessedMatch, Teamfight, MatchEvents
- `src/lib/hero.ts` — Hero role mappings (Doomfist now correctly Tank)
- `src/hooks/useDetailedAnalysis.ts` — Hook for all analysis data
- `src/hooks/useUltCycles.ts` — Ult cycles + role distributions
- `src/hooks/useTrendData.ts` — Extended with TFWR, D/10, first pick/death rates, rolling averages
- `src/components/analysis/` — 9 analysis section components (7 sections + wrapper + executive summary)
- `src/components/trends/TrendSection.tsx` — Metric selector chips + benchmark lines
- `src/components/trends/TrendsChart.tsx` — Generic chart with ReferenceLine support
- `src/pages/DetailedAnalysisPage.tsx` — Orchestrates all sections + benchmarks + composition
- `docs/design/training-path.md` — Training path system (16 concepts, 6 tiers)

### Analysis Pipeline
- `analysis/pipeline.py` — Orchestrator with AnalysisContext, column pruning, category unification
- `analysis/pyproject.toml` — Python dependencies (use `uv`)
- `analysis/src/metrics.py` — `percentile_benchmarks()`, `per_10_series()`, `ult_hold_time()`, etc.
- `analysis/src/preprocessing.py` — `HERO_ROLES`, `classify_composition()`, `cat_eq()`/`cat_ne()`
- `analysis/src/fight_detection.py` — Vectorized kill clustering
- `analysis/src/visualization.py` — OW-themed matplotlib + `save_fig()`
- `analysis/analyses/*.py` — 10 analysis modules (see pipeline structure above)
- `analysis/outputs/benchmarks/training_path_benchmarks.json` — 24 concepts, 37.2KB
- `analysis/outputs/figures/` — 55 PNG figures
