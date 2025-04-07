# Progress

*What currently works? What is left to build? What is the overall status? Are there known issues? How have project decisions evolved?*

---


### Current Status & What Needs to Be Built (v1 Target State)

The following Functional Requirements (FR) define the target state for Scrimsight v1.

#### 3.1 File Input & Management
*   **FR-3.1.1:** Select multiple `.txt` files.
*   **FR-3.1.2:** Select directory (Chrome-based).
*   **FR-3.1.3:** Indicator for unsupported directory selection.
*   **FR-3.1.4:** Drag and drop files/folders.
*   **FR-3.1.5:** Display loaded files list.
*   **FR-3.1.6:** Remove individual files.
*   **FR-3.1.7:** Toggle sample data inclusion.
*   **FR-3.1.8:** Loading/processing feedback.
*   **FR-3.1.9:** Session-only data persistence (no cross-session saving).

#### 3.2 Data Processing & Parsing
*   **FR-3.2.1:** Parse ScrimTime `.txt` logs (`LOG_SPEC`).
*   **FR-3.2.2:** Create structured event objects.
*   **FR-3.2.3:** Generate unique `matchId` per file.
*   **FR-3.2.4:** Parse timestamps to seconds (`matchTime`).
*   **FR-3.2.5:** Basic error handling for parsing.

#### 3.3 Core Data Aggregation & State
*   **FR-3.3.1:** Calculate match start/end times (`mapTimesAtom`).
*   **FR-3.3.2:** Calculate round start/setup/end times (`roundTimesAtom`).
*   **FR-3.3.3:** Aggregate match summary data (`matchDataAtom`).
*   **FR-3.3.4:** Group matches into Scrims (`scrimAtom`).
*   **FR-3.3.5:** Identify unique team names (`teamNamesAtom`).
*   **FR-3.3.6:** Identify unique player names (`uniquePlayerNamesAtom`).
*   **FR-3.3.7:** Identify unique map names/modes (`uniqueMapNamesAtom`, `uniqueGameModesAtom`).
*   **FR-3.3.8:** Calculate overall team stats (`teamStatsAtom`, `allPlayersForTeamAtom`).

#### 3.4 Player Statistics & Analysis
*   **FR-3.4.1:** Calculate standard player stats per context (`playerStatExpandedAtom`).
*   **FR-3.4.2:** Calculate hero playtime (`heroPlaytimeAtom`), merge with stats (`playerStatsBaseAtom`).
*   **FR-3.4.3:** Calculate per-10-minute stats (`getStatsAtom`, `addDerivedMetrics`).
*   **FR-3.4.4:** Calculate KDA.
*   **FR-3.4.5:** Calculate Accuracy/Crit Rate (log dependent).
*   **FR-3.4.6:** Track player lives (`playerLivesAtom`).
*   **FR-3.4.7:** Track ultimate timings; Calculate avg. time-to-ult.
*   **FR-3.4.8:** Standardize player interactions (`playerInteractionEventsAtom`).
*   **FR-3.4.9:** Calculate First Kill/Death Rate. **(Completed 2025-04-06: Implemented via `firstKillImpactAtom` and `playerFirstKillDeathRateAtom`)**
*   **FR-3.4.10:** Aggregate stats across contexts (`contextualStatAtoms`, `getStatsAtom`).

#### 3.5 Team Statistics & Analysis
*   **FR-3.5.1:** Calculate Team Win Rate by Map Type (`teamMapTypeStatsAtom`).
*   **FR-3.5.2:** Track Team Compositions (playtime, win rate, frequency) (`detailedTeamCompositionsAtom`). **(Enhanced 2025-04-06: Added detailed matchup analysis - performance vs specific opponent compositions)**
*   **FR-3.5.3:** Calculate ultimate impact metrics. **(Completed 2025-04-06: Implemented via `ultimateImpactAtom`, focusing on individual player ult impact within fights - kills during ult, fight win rate with ult)**

#### 3.6 Match Analysis
*   **FR-3.6.1:** Identify teamfights (`teamfightsAtom`). **(Refined 2025-04-06: Added `fightId`, team names, winner)**
*   **FR-3.6.2:** Calculate kills per team per fight (`teamfightsAtom`). **(Refined 2025-04-06: Used for winner calculation)**
*   **(New 2025-04-06):** Calculate teamfight participation (`teamfightParticipationAtom`).
*   **FR-3.6.3:** Track ultimate usage within/around fights (`teamfightsAtom`). **(Existing logic maintained)**
*   **FR-3.6.4:** Generate player Kill Matrix (`killMatrixAtomFamily`).

#### 3.7 Visualization & UI Pages
*   **FR-3.7.1:** Homepage (`/`) with ZeroState/Summary.
*   **FR-3.7.2:** Scrims List (`/scrims`).
*   **FR-3.7.3:** Scrim Detail (`/scrims/:scrimId`).
*   **FR-3.7.4:** Teams List (`/teams`) with filtering/sorting.
*   **FR-3.7.5:** Team Detail (`/teams/:teamId`) with sub-nav (Overview, Players, Matches, Compositions).
*   **FR-3.7.6:** Players List (`/players`) with sub-nav (Overview, Performance, Heroes) and filtering/sorting.
*   **FR-3.7.7:** Player Detail (`/player/:playerName`) with sub-nav (Overview, Heroes, Matches).
*   **FR-3.7.8:** Match Detail (`/matches/:matchId`) with sub-nav (Overview, Timeline, Compare).
*   **FR-3.7.9:** Authentication Pages (`CallbackPage`, Login/Logout triggers).

#### 3.8 Authentication
*   **FR-3.8.1:** Discord OIDC authentication.
*   **FR-3.8.2:** Handle `/callback` redirect.
*   **FR-3.8.3:** Display user info upon login.
*   **FR-3.8.4:** Logout mechanism.
*   **FR-3.8.5:** OIDC config via environment variables.
*   **FR-3.8.6:** (Optional) Route protection for authenticated users.

#### 3.9 Subscriptions
*   **FR-3.9.1:** Stripe integration for payment processing.
*   **FR-3.9.2:** User subscription management.

**(Completed 2025-04-06): Data Aggregation & Contextualization (Project 5)**
*   Refined list summary atoms (`playerListSummaryAtom`, `teamListSummaryAtom`) to include newer metrics.
*   Implemented benchmark atoms (`averageMetricPerRoleAtom`, `averageMetricPerHeroAtom`, `averageMetricPerMapAtom`) to provide context for player stats.
*   Implemented comparison atom (`playerComparisonAtomFamily`) to compare player stats against benchmarks.
*   This completes the core data processing and analysis backend work outlined in the initial projects, making data ready for UI presentation.

### Known Issues / Risks / Open Questions (v1)

*   **Performance:** Client-side handling of large log volumes needs testing.
*   **Accuracy:** Parsing logic (`LOG_SPEC`, `scrimtime.ts`) needs validation against current ScrimTime output. Complex derived atom logic (compositions, teamfights, playtime) needs edge case validation.
*   **Timeline Visualization:** Implementation complexity and effort are potentially high.
*   **Browser Compatibility:** File System Access API limits directory selection outside Chrome; fallbacks need testing.
*   **Log Data Reliability:** Accuracy of stats like weapon accuracy depends on log data quality.
