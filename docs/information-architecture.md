# Information Architecture

This document captures ScrimSight's **user-facing product structure** — how data is organized and presented to users. It complements [architecture.md](./architecture.md) (which covers code architecture) by documenting pages, navigation, data presentation, and gaps between domain capabilities and UI surfacing.

**Last verified:** February 2026

---

## 1. Site Map

```
/                               HomePage
├── /scrims                     ScrimsPage (list)
│   └── /scrims/:scrimId        ScrimPage (detail)
│       └── (links to matches)
├── /matches/:matchId           MatchPage (layout shell)
│   ├── (index)                 MatchOverviewPage
│   ├── /timeline               TimelinePage
│   ├── /players                MatchPlayersPage
│   └── /compare                MatchStatComparisonPage
├── /players                    PlayersPage (layout shell)
│   ├── (index)                 PlayersOverview
│   ├── /performance            PlayersPerformance
│   └── /heroes                 PlayersHeroes
├── /player/:playerName         PlayerPage (layout shell)
│   ├── (index)                 PlayerOverview
│   ├── /heroes                 PlayerHeroes
│   └── /matches                PlayerMatches
├── /teams                      TeamsPage (list)
├── /teams/:teamId              TeamPage (layout shell)
│   ├── (index)                 TeamOverview
│   ├── /players                TeamPlayers
│   ├── /matches                TeamMatches
│   └── /compositions           TeamCompositions
├── /analysis                   DetailedAnalysisPage
├── /metrics                    MetricsExplorerPage
└── /files                      AddFilesPage
```

### Route nesting
- `MatchPage`, `PlayersPage`, `PlayerPage`, and `TeamPage` are **layout routes** — they render a header + tab navigation + `<Outlet />`.
- Child routes render inside the `<Outlet />` and represent tabs within the parent page.
- `ScrimPage` is **not** a layout route — it renders team stats, player stats, and match list directly as sections.

---

## 2. Navigation Model

### Primary Navigation (Sidebar)
The sidebar (`src/components/navigation/Navigation.tsx`) has a fixed hierarchy:

| Sidebar Item | Route | Children |
|---|---|---|
| Home | `/` | None |
| Scrims | `/scrims` | Dynamic: one child per scrim → grandchildren per match |
| Players | `/players` | Dynamic: one child per player (with role icon) |
| Teams | `/teams` | Dynamic: one child per team |
| Metrics Explorer | `/metrics` | None |
| Files | `/files` | None |

**Dynamic children** are computed from loaded match data (scrims via `useScrims()`, players via `useStats()`, teams derived from match metadata).

### Tab Navigation (SubPageNavigation)
Pages with sub-routes use tab-style navigation:

| Parent Page | Tabs |
|---|---|
| Match (`/matches/:id`) | Overview, Timeline, Players, Compare |
| Players (`/players`) | Overview, Performance, Heroes |
| Player (`/player/:name`) | Overview, Heroes, Matches |
| Team (`/teams/:id`) | Overview, Players, Matches, Compositions |

### Cross-Links
- Home → links to Scrims, Teams, Players list pages
- Scrim cards → link to `/scrims/:scrimId`
- Match cards → link to `/matches/:matchId`
- Team cards → link to `/teams/:teamId`
- Player cards → generally not linked (TODO: some have `linkUrl`, some don't)

---

## 3. Data Presentation by Page

### Home (`/`)

| Section | Data Shown | User Question Answered |
|---|---|---|
| **Trend Analysis** | Interactive metric selector (Win Rate, TFWR, K/D, D/10, First Pick %, First Death %) with benchmark reference lines, for the auto-detected most-frequent team. Defaults to Win Rate + TFWR. | "How are we trending?" |
| **Recent Scrims** | Top 3 scrims by date — score (W-L-D), duration, map count | "What scrims have we played recently?" |
| **Top Teams** | Top 3 teams by win rate — win rate, games played | "Who's winning the most?" |
| **Top Players** | Top 3 players by KDA — KDA, role, team | "Who's performing best?" |
| **Zero State** | Upload prompt when no data exists | "How do I get started?" |

**Data sources:** `useTrendData()` (hook — computes TFWR, D/10, first pick/death rates, 5-match rolling averages), `useScrims()`, `useMatches()`, `useStats()`

### Scrims List (`/scrims`)

Shows all scrims sorted by date (newest first). Each card shows:
- Team matchup, date, score (W-L-D), duration, maps played

### Scrim Detail (`/scrims/:scrimId`)

| Section | Data Shown |
|---|---|
| Header | Team names, date, total duration, overall score |
| Team Performance | `ScrimTeamStats` cards for both teams |
| Player Performance | `ScrimPlayerStats` card for each player in both teams |
| Matches | `ScrimMatchList` — clickable match cards |

### Match Overview (`/matches/:matchId`)

| Section | Data Shown | User Question |
|---|---|---|
| Hero Section | Map image, score, team names, duration, date | "What happened in this match?" |
| Team Stats | Elims per team with links to team pages | "How did each team do overall?" |
| **Win Conditions** | Snowball Potential (win rate w/ first pick), Resilience (win rate against first pick), Neutral/Dry fight win rate — per team | "How do we win fights?" |
| Team Comparison | Side-by-side stat comparison | "How do stats compare?" |
| Kill Matrix | Who killed whom | "Who's targeting who?" |

**Key feature:** The `WinConditionCard` is the only component that auto-generates natural-language insights (e.g., "Matches are decided by the opening pick").

### Match Timeline (`/matches/:matchId/timeline`)

Delegates to `<Timeline />` component. Shows fight-by-fight breakdown with kill feed, ult usage, first pick highlighting.

### Match Players (`/matches/:matchId/players`)

Per-player stat cards (`PlayerStatsCard`) grouped by team, showing:
- Core stats (elims, deaths, damage, healing, accuracy)
- **Fight Impact** card (`PlayerImpactCard`): First Picks vs First Deaths ratio bar, Ult Value (team win rate when player uses ult)

This is the only place `PlayerImpactMetrics` (entry pick rate, first death rate, ult win rate) are displayed.

### Match Compare (`/matches/:matchId/compare`)

Side-by-side stat comparison between specific players or teams within the match.

### Players List (`/players`)

| Tab | Data Shown |
|---|---|
| Overview | Player summary cards |
| Performance | Comparative performance tables |
| Heroes | Hero usage across all players |

### Player Detail (`/player/:playerName`)

| Tab | Data Shown |
|---|---|
| Overview | PlayerCard (KDA, elims, deaths, assists, role, team), Performance Trends line chart (KDA, Win Rate, Avg Elims over time), Most Played Heroes bar chart, Performance Breakdown (Damage/10m, Healing/10m, Weapon Accuracy, Crit Rate), Match History Summary |
| Heroes | Hero-specific stat breakdowns |
| Matches | Per-match history |

**Note:** Player Overview already has **trend lines** via `usePlayerPerformanceTrends()` — this is per-player longitudinal data.

### Teams List (`/teams`)

Summary stats (total teams, games, wins, players), filterable/sortable team list.

### Team Detail (`/teams/:teamId`)

| Tab | Data Shown |
|---|---|
| Overview | TeamCard (win rate, games played, players), WinConditionCard (aggregated across all team fights), Win Rate by Map Type bar chart |
| Players | Team roster with stats |
| Matches | Match history for the team |
| Compositions | Full 5-hero comp strings with hero icons, playtime, win rate, frequency |

### Detailed Analysis (`/analysis`)

Research-backed hypotheses validated by the user's dataset. Three-part structure: (1) What matters (hypotheses from competitive OW research), (2) What good looks like (community benchmarks from Parsertime dataset), (3) How you compare (per-team comparison via benchmark gauges).

| Section | Data Shown | User Question |
|---|---|---|
| **Executive Summary** | Auto-ranked key findings across all sections by notability score | "What should I focus on?" |
| **First Pick** | First pick win rate, conversion rate, resilience, per-player first pick/death rates | "How important is first pick for us?" |
| **Ult Economy** | Fight type distribution/win rates, ult differential win rate (-5 to +5), hero ult effectiveness, role charge/hold time distributions, per-player ult metrics | "Are we spending ults wisely?" |
| **Survival (D/10)** | Team and per-player deaths/10 by role, trend direction | "Who's dying too much?" |
| **TFWR** | Per-match teamfight win rate distribution, cumulative TFWR | "Are we winning fights?" |
| **Strategy Profile** | Win rate by fight type (dry, ult-invested, all-in, stagger) | "What kind of fights do we win?" |
| **Target Focus** | Per-player FB/E ratio by role | "Are we finishing kills?" |
| **Composition** | Archetype win rates (Dive/Brawl/Poke/Mixed) with community benchmark overlay, hero pick rates (top 15, role-colored), hero win rates (min 3 matches) | "What comps work for us?" |

Each section includes benchmark comparison gauges (percentile position within community data) and progressive disclosure (collapsed by default, expandable).

**Data sources:** `useDetailedAnalysis()`, `useUltCycles()`, `useBenchmarks()`, `useCompositionAnalysis()`

### Metrics Explorer (`/metrics`)

Flexible analytics workbench:
- **Group by:** match, player, team, hero, role, round
- **Metrics:** 63 stats from `STAT_CONFIG` (base stats, per-10 rates, accuracy percentages)
- **Filters:** By match, player, team, hero, role
- **Visualizations:** Data table + charts (`MetricsChart`, `StatDistributionCard`)
- **URL state:** Filter/group/metric selections persisted in query params

### Files (`/files`)

File upload interface + clear data button (when matches exist).

---

## 4. Domain Capability Coverage Matrix

This matrix shows what the domain layer computes vs. what the UI actually displays.

### Teamfight Analysis

| Capability | Domain Location | UI Location | Status |
|---|---|---|---|
| Fight detection (12s clustering) | `domain/teamfights.ts` | Timeline, WinConditionCard | Displayed |
| Fight classification: `dry`, `ult-invested`, `all-in`, `stagger` | `domain/teamfights.ts:157-167` | WinConditionCard (dry only) | **Partially hidden** — types computed but only dry win rate is shown |
| First pick per fight | `Teamfight.firstPick` | WinConditionCard, Timeline | Displayed |
| Fight winner | `Teamfight.winner` | WinConditionCard | Displayed |
| Ults used per fight per team | `Teamfight.team1UltsUsed` / `team2UltsUsed` | Timeline (icon display) | Displayed |
| Fight type distribution | Computable from `Teamfight.type` | UltEconomySection, StrategyProfileSection | Displayed |
| Fight type win rates (per type) | Computable from `Teamfight.type` + `winner` | StrategyProfileSection, WinConditionCard (dry only) | Displayed |

### Ultimate Economy

| Capability | Domain Location | UI Location | Status |
|---|---|---|---|
| Ult cycle tracking (charge → hold → use) | `domain/economy.ts` `UltCycle` | UltEconomySection (per-player table) | Displayed |
| Average time to charge | `PlayerUltMetrics.avgTimeToCharge` | UltEconomySection (per-player table, role distributions) | Displayed |
| Average hold time | `PlayerUltMetrics.avgTimeHeld` | UltEconomySection (per-player table, role distributions) | Displayed |
| First ult rate | `PlayerUltMetrics.firstUltRate` | — | **Not displayed** (field exists but never populated) |
| Total ults earned/used | `PlayerUltMetrics.totalUltsEarned/Used` | UltEconomySection, Metrics Explorer | Displayed |
| Ult state per fight (available, used, charged) | `economy.ts:getUltCycleForFight()` | Timeline (which ults were used) | Partially displayed |
| Ult differential win rate | `computeUltEconomyAnalysis()` | UltEconomySection (bar chart) | Displayed |
| Hero ult effectiveness | `computeUltEconomyAnalysis()` | UltEconomySection (bar chart, min 5 uses) | Displayed |
| Role charge/hold distributions | `computeRoleDistributions()` | UltEconomySection (summary cards) | Displayed |
| Ultimate events with hold time | `ProcessedMatch.ultimateEvents` (`UltimateEvent` type) | — | **Not displayed** (raw events; aggregates shown via ult cycles) |

### Player Analysis

| Capability | Domain Location | UI Location | Status |
|---|---|---|---|
| Entry pick rate (% of fights with first pick) | `useFightAnalysis.getPlayerImpact()` | Match → Players tab (`PlayerImpactCard`) | Displayed (match-scoped only) |
| First death rate | `PlayerImpactMetrics.firstDeathRate` | Match → Players tab (`PlayerImpactCard`) | Displayed (match-scoped only) |
| Ult win rate (team win rate when player uses ult) | `PlayerImpactMetrics.ultWinRate` | Match → Players tab (`PlayerImpactCard`) | Displayed (match-scoped only) |
| Per-10 stats (63 metrics) | `STAT_CONFIG` + `useStats` | Metrics Explorer, Player Overview | Displayed |
| Performance trends (KDA, win rate, elims over time) | `usePlayerPerformanceTrends()` | Player Overview | Displayed |

### Team/Scrim Analysis

| Capability | Domain Location | UI Location | Status |
|---|---|---|---|
| Scrim detection (grouping matches by date/teams) | `domain/scrims.ts` | ScrimsPage, ScrimPage | Displayed |
| Win/loss/draw record | Computed in pages | TeamsPage, TeamOverview, HomePage | Displayed |
| Win rate by map type | Computed in TeamOverview | TeamOverview | Displayed |
| Trend data (win rate, TFWR, K/D, D/10, first pick/death rates) | `useTrendData()` | HomePage TrendSection (interactive metric selector) | Displayed |
| Composition analysis (full comp string, win rate, frequency) | Computed in TeamCompositions | TeamCompositions tab | Displayed |
| Composition archetypes (Dive/Brawl/Poke/Mixed) | `domain/composition.ts` `classifyComposition()` | CompositionSection on `/analysis` | Displayed |
| Hero pick/win rates | `computeCompositionAnalysis()` | CompositionSection (bar charts) | Displayed |
| Comp × map cross-analysis | — | — | **Not implemented** |

### Auto-Insights

| Capability | Location | Status |
|---|---|---|
| WinCondition insight generation | `WinConditionCard.getInsight()` | Displayed (4 insight variants) |
| Player-level insights | — | **Not implemented** |
| Scrim-level summary | — | **Not implemented** |
| Statistical outlier detection | — | **Not implemented** |

---

## 5. User Mental Model Mapping

### How the current IA maps to user questions

| User Question | Expected Navigation Path | Friction Level |
|---|---|---|
| "How did tonight go?" | Home → Scrims → find scrim → click in | **Medium** — no post-scrim summary, requires 3 clicks minimum |
| "Are we improving?" | Home (TrendSection shows win rate, TFWR, K/D, D/10, first pick/death % with benchmark lines) | **Low** — trend chart exists on Home with 6 selectable metrics |
| "Is [player] improving?" | Player → Overview → Performance Trends chart | **Low** — per-player trends exist |
| "Who's dying first?" | Match → Players tab (PlayerImpactCard shows first picks vs first deaths) + Timeline (first pick per fight) | **Low** — per-match data is good, but no cross-match aggregated view |
| "What comp should we run on [map]?" | Analysis → Composition section (archetype win rates, hero pick/win rates) OR Team → Compositions tab | **Medium** — archetype analysis exists, comp × map cross-analysis not yet built |
| "Did we waste ults?" | Analysis → Ult Economy section (ult differential, hero effectiveness, charge/hold times, role distributions) | **Low** — full ult economy analysis now surfaced |
| "How does [player] compare?" | Metrics Explorer (group by player, select metrics) | **Low** — Metrics Explorer is flexible |
| "Show me just dry fights" | Analysis → Strategy Profile (fight type win rates shown) | **Medium** — fight type stats displayed, but no per-fight filtering in timeline |
| "Are we winning neutral fights?" | Match → Overview → WinConditions → Neutral/Dry section | **Low** — WinConditionCard shows this |
| "How do we do when we get first pick?" | Match → Overview → WinConditions → Snowball section | **Low** — WinConditionCard shows this |

### Navigation model vs. mental model

The sidebar organizes by **entity** (Scrims, Players, Teams, Metrics, Files). User research suggests coaches think in **tasks**:

| Task Mental Model | Entity Mental Model (current) |
|---|---|
| "Review tonight's scrim" | Scrims → find the right one → click |
| "Track player improvement" | Players → find player → Overview (trends) |
| "Prepare for opponent" | No direct path — would need Metrics Explorer + Team Compositions |
| "Quick post-game debrief" | No direct path — must manually navigate |

---

## 6. Gaps Summary (Prioritized)

### Priority 1 — Cross-scrim aggregation
**Status:** Not implemented. Most metrics are per-match; the Training Path system needs rolling aggregates across the last N scrims.
- `PlayerImpactMetrics` (entry pick rate, first death rate, ult win rate) are shown on the Match → Players tab, but only for a single match — no cross-match aggregation
- The `/analysis` page aggregates across all loaded matches, but doesn't support windowed aggregation (last N scrims)

### Priority 2 — Extend auto-insight generation
**Status:** Pattern proven in WinConditionCard + Executive Summary, needs expansion.
- WinConditionCard generates 4 insight variants based on thresholds
- Executive Summary auto-ranks key findings by notability score
- Same pattern could apply to: player performance alerts, scrim summaries, statistical outliers

### Priority 3 — Composition depth
**Status:** Archetype classification and hero pick/win rates implemented. Needs enrichment.
- No comp × map cross-analysis
- No hero synergy matrix
- No swap analysis (data available via `events.heroSwap`)

### Priority 4 — Post-scrim summary experience
**Status:** Not implemented.
- After upload, user lands on Files page — no automatic routing to a summary
- No "tonight's scrim" aggregated view with auto-insights

### Priority 5 — Timeline fight filtering
**Status:** Not implemented.
- Fight type (dry/ult-invested/all-in/stagger) is shown in aggregate on `/analysis`, but the Timeline doesn't support filtering by fight type

---

## Maintenance

This document should be updated when:
- New pages or routes are added
- Navigation structure changes
- New domain capabilities are added (especially if not yet surfaced in UI)
- Existing capabilities are surfaced in new UI locations
