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
- **84 tests, all passing. Zero lint issues. Zero TS errors.**
- Build: ~174 KB gzip initial load
- Branch at time of writing: `next` (check `git branch` for current)

### Completed Tasks
1. **Dexie Persistence** (Task 01) — IndexedDB persistence via Dexie.js, serialization helpers for Map/Set, hydration gate in App.tsx.
2. **Onboarding + Trust Signals** (Task 02) — First-time experience, privacy messaging.
3. **Lint Cleanup + Code Splitting** (Task 04) — Zero lint issues, all page routes lazy-loaded via `React.lazy()`, 66% gzip reduction.
4. **Detailed Analysis Page** — New `/analysis` page with 6 research-backed hypothesis sections + progressive disclosure.
5. **Analysis Pipeline Migration** (this session) — Migrated 10 Jupyter notebooks into a single runnable Python pipeline. See "Analysis Pipeline" section below.

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
- Route-level code splitting — 25 lazy-loaded route chunks

### Analysis Pipeline (NEW — Feb 14, 2026)

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

**Key design decisions:**
- **AnalysisContext dataclass**: Loads all CSVs once, preprocesses once, passes to all modules
- **Module contract**: Each `analyses/*.py` exposes `run(ctx) -> dict` returning benchmark entries
- **Percentile distributions**: Every metric produces p10/p25/p50/p75/p90 + n for player and team levels
- **Memory optimizations**: Column pruning (`usecols`), unified category dtypes, per-match chunked joins, lazy loading for hero event tables
- **Performance**: 62 seconds total, most time in ult_economy (36s) due to fight-ult joining

**24 benchmark concepts include:**
- deaths_per_10, first_pick_win_rate, entry_pick_rate, first_death_rate, time_to_first_blood
- ult_charge_time, ult_hold_time, ult_efficiency, dry_fight_win_rate, fight_win_rate_by_ult_differential
- fb_elim_ratio, crit_kill_rate
- hero_meta, composition_archetypes
- team_fight_win_rate, team_performance_predictors, first_pick_rate_team
- map_balance, round_1_momentum
- mercy_rez, dva_remech, echo_duplicate
- hypothesis_validation, sample_size_guide

### Detailed Analysis Page (Feb 11, 2026)

A top-level `/analysis` page presenting research-backed hypotheses validated by the user's dataset. Parts 1 and 2 of a 3-part vision:
1. **What matters** (hypotheses from competitive OW research) ✅
2. **What good looks like** (benchmarks from entire dataset) ✅
3. **How you compare** (per-team comparison) — NOT YET BUILT

**6 Hypothesis Sections:** First Pick, Ult Economy, Survival (D/10), TFWR, Fight Type Distribution, Target Focus (FB/E ratio). Each with progressive disclosure (collapsed by default, hero stat + one-line insight visible).

### Documentation
- `docs/information-architecture.md` — IA audit (needs update for /analysis page)
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
- `calculateUltMetrics()` in `src/domain/economy.ts` is **dead code** — never called from any hook
- `StrategyProfile` winner/loser distributions show same percentages (each fight has one type shared by both teams)

### Analysis Pipeline
- `python` command not found — must use `uv run --project analysis python -m analysis`
- `No module named analysis` — needed `pyproject.toml` for uv to resolve the package
- `hero_time_played` not `time_played` — CSV column name mismatch
- Category mismatch errors are common with pandas categorical dtypes + team comparisons. Use `cat_eq()`/`cat_ne()` from preprocessing.py or `.astype(str)` for safe comparisons
- FutureWarnings about `observed=False` in groupby — not breaking but noisy; add `observed=True` to all groupby calls

## Next Steps (Priority Order)

### Immediate: Wire Benchmarks into the Web App
The analysis pipeline now produces `training_path_benchmarks.json` with 24 concepts. The web app's Detailed Analysis page needs to consume this data:
- Import the JSON (or a subset) into the web app's bundle or serve it as a static asset
- Wire benchmark distributions into the existing analysis sections so they show "Your team: X | Dataset median: Y | Percentile: Z%"
- This completes Part 3 of the analysis arc ("How You Compare")

### Ready to Start Now (no dependencies)
- **Task 03: Insight Engine Infrastructure** (`docs/tasks/03-insight-engine.md`) — Reusable insight types, rule runner, `useInsights()` hook
- **Task 05: Surface Ult Economy & Fight Types** (`docs/tasks/05-ult-economy-fight-types.md`) — Wire up dead-code `calculateUltMetrics()` to UI
- **Update `docs/information-architecture.md`** — Add `/analysis` page
- **Commit the analysis pipeline** — All 10 modules are written and tested but not yet committed

### After Task 05
- **Task 06: Enrich Trend Views** — Add TFWR, first death rate, ult metrics to trends

### After Task 03
- **Task 07: Insight Rules & Auto-Summaries** — Coaching insight rules + scrim summaries

### After Tasks 05 + 06
- **Task 08: Enhanced Composition Analysis** — Archetype classification, comp×map analysis

### After All Tasks
- **Task 09: Expert Feedback Round** — 3-5 expert testers

## Key Files Reference

### Web App
- `src/App.tsx` — Router + lazy imports + Suspense + hydration gate
- `src/data/repository.ts` — Jotai atoms + Dexie persistence
- `src/data/serialization.ts` — Map/Set ↔ JSON-safe helpers
- `src/data/ingestor.ts` — File parsing, event grouping
- `src/domain/analysis.ts` — 6 analysis computations + insights + summaries
- `src/domain/economy.ts` — Ult cycle calculation (dead code: `calculateUltMetrics()`)
- `src/domain/teamfights.ts` — Fight detection, classification
- `src/types/domain.ts` — ProcessedMatch, Teamfight, MatchEvents
- `src/hooks/useDetailedAnalysis.ts` — Hook for all analysis data
- `src/components/analysis/` — 8 analysis section components
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
