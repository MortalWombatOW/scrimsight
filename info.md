Okay, here is a detailed guide and checklist for building the V2 Overwatch Log Processing system based on the Medallion architecture and the previously discussed design principles. This guide assumes access only to the V1 codebase (for `LOG_SPEC` and understanding existing logic) and the V2 design document.

## V2 Overwatch Log Processor: Implementation Guide

**Objective:** Build a robust, testable, and maintainable log processing system using Medallion Architecture, Zod, Pandas.js, pure functions, and a configurable metrics engine, integrated with Jotai.

**Core Principles:**

1.  **Layered Data Flow:** Raw -> Bronze -> Silver -> Gold.
2.  **Schema Enforcement:** Use Zod for validation at layer boundaries.
3.  **Pure Logic:** Encapsulate all data transformation and calculation logic in pure, testable functions.
4.  **Efficient Processing:** Utilize Pandas.js for DataFrame operations where appropriate.
5.  **Reactivity:** Use Jotai to manage state and trigger updates based on data changes.
6.  **Flexibility:** Implement a configurable metrics system and aggregation engine.
7.  **Testability:** Prioritize unit testing of pure logic functions using Jest.

---

### Phase 1: Prerequisites & Project Setup

1.  **Environment:** Ensure Node.js (LTS recommended) and npm/yarn are installed.
2.  **Dependencies:** Install necessary packages:
    ```bash
    npm install jotai zod pandas-js # Core libraries
    npm install crypto-js # Or another hashing library for match_id
    npm install -D jest @types/jest ts-jest @types/node @types/react # Testing & Types
    npm install -D typescript @types/crypto-js # Dev dependencies
    # Ensure React/ReactDOM are already project dependencies if not
    ```
3.  **TypeScript Configuration:** Ensure `tsconfig.json` is set up for the project, enabling strict type checking (`strict: true`).
4.  **Jest Configuration:** Configure Jest (e.g., `jest.config.js`) to work with TypeScript (using `ts-jest`).

---

### Phase 2: Directory Structure (V2)

Create a dedicated directory for V2 to allow parallel development.

```
src/
├──atoms/                  # Existing V1 code (reference only)
├── v2/
│   ├── atoms/           # Jotai atoms calling pure logic functions
│   │   ├── bronzeAtoms.ts
│   │   ├── silverAtoms.ts
│   │   ├── goldAtoms.ts   # Includes the aggregation engine atom family
│   │   └── rawAtoms.ts
│   ├── layers/          # Pure logic functions for each layer's processing
│   │   ├── bronzeLogic.ts
│   │   ├── silverLogic.ts
│   │   └── goldLogic.ts   # Includes aggregation engine logic
│   ├── schemas/         # Zod schema definitions
│   │   ├── bronzeSchema.ts
│   │   ├── silverSchema.ts
│   │   └── metricsSchema.ts # Schemas for metrics configuration
│   ├── metrics/         # Metrics configuration and related utilities
│   │   └── metricsConfig.ts
│   ├── tests/           # Unit tests for pure logic functions
│   │   ├── layers/
│   │   └── metrics/
│   └── utils/           # Shared helper functions (e.g., hashing, date formatting)
├── lib/                 # Existing shared libs (e.g., hero roles, string hash if reused)
# ... other project files (components, styles, etc.)
```

---

### Phase 3: Raw Layer Implementation (`src/v2/atoms/rawAtoms.ts`)

1.  **Define Input/Output:** Interfaces or types for raw file input (`{ files: File[] }`) and loaded content (`{ fileName: string, fileContent: string, fileModified: number }`).
2.  **Input Atom:** Create `rawLogInputAtom` (similar to V1 `logFileInputAtom`).
3.  **Mutation Atom:** Create `rawLogInputMutationAtom` (similar to V1).
4.  **Content Loading Atom:** Create `rawLogContentAtom`.
    *   Depends on `rawLogInputAtom` and the V1 `sampleDataAtom` (or recreate a V2 version).
    *   Uses a pure helper function (potentially reusing V1's `readFileAsync`) to load content.
    *   Returns `Promise<{ fileName: string, fileContent: string, fileModified: number }[]>`.

---

### Phase 4: Bronze Layer Implementation

1.  **Define Zod Schemas (`src/v2/schemas/bronzeSchema.ts`):**
    *   Define `BronzeBaseSchema` including `match_id`, `event_type`, `match_time`, `source_filename`, `load_timestamp`.
    *   For **EACH** `event_type` defined in V1's `LOG_SPEC`:
        *   Create a Zod schema extending `BronzeBaseSchema`.
        *   Use `z.literal()` for `event_type`.
        *   Define fields precisely matching the `LOG_SPEC` columns and data types (referencing V1's `scrimtime.ts` and the Log Format Analysis). Use `z.string()`, `z.number()`, `z.boolean()`.
        *   Ensure correct field names based on the *log file format*, not necessarily V1's internal names yet.
        *   Export the schema and its inferred type (e.g., `export type KillEventBronze = z.infer<typeof KillEventBronzeSchema>`).
2.  **Implement Parsing Logic (`src/v2/layers/bronzeLogic.ts`):**
    *   **`parseLogLine` Function:**
        *   Input: `line: string`, `match_id: string`, `source_filename: string`, `load_timestamp: Date`, `logSpec: LogSpec` (pass V1's `LOG_SPEC`).
        *   Output: `{ eventType: string, data: Record<string, any> } | null` (or throw on error).
        *   Logic:
            *   Split line by comma.
            *   Extract timestamp -> `match_time`.
            *   Extract `event_type`.
            *   Find corresponding spec in `logSpec`. Handle not found error.
            *   Map remaining values to field names based on `logSpec` order.
            *   Parse values using Zod-compatible types (e.g., `parseFloat`, boolean checks).
            *   Return structured object `{ event_type, ...fields, match_id, match_time, source_filename, load_timestamp }`.
    *   **`processRawLogsToBronze` Function:**
        *   Input: `rawLogs: { fileName: string, fileContent: string, fileModified: number }[]`.
        *   Output: `Promise<Record<string, any[]>>` (object mapping event type string to array of parsed+validated events).
        *   Logic:
            *   Initialize result object (e.g., `bronzeData = {}`).
            *   Get current `load_timestamp`.
            *   For each `rawLog` in input:
                *   Generate `match_id` (e.g., using `crypto-js/sha256`).
                *   Split `fileContent` into lines.
                *   For each `line`:
                    *   Call `parseLogLine`. Handle errors gracefully (log/skip).
                    *   If successful, get the corresponding Zod schema from `bronzeSchema.ts` based on the returned `eventType`.
                    *   Use `schema.safeParse(parsedData)` to validate.
                    *   If validation succeeds (`.success === true`):
                        *   Ensure array exists: `if (!bronzeData[eventType]) bronzeData[eventType] = [];`
                        *   Push `parsedResult.data` to `bronzeData[eventType]`.
                    *   If validation fails, log detailed error (`parsedResult.error`).
            *   Return `bronzeData`.
3.  **Create Bronze Jotai Atom (`src/v2/atoms/bronzeAtoms.ts`):**
    *   Create `bronzeParsedEventsAtom`.
    *   Depends on `rawLogContentAtom`.
    *   Calls the `processRawLogsToBronze` pure function with the data from `rawLogContentAtom`.
    *   Returns the `Promise<Record<string, any[]>>`.

---

### Phase 5: Silver Layer Implementation

1.  **Define Zod Schemas (`src/v2/schemas/silverSchema.ts`):**
    *   Define Zod schemas for **all** target Silver structures (e.g., `MatchSchemaSilver`, `PlayerRoundStatsSchemaSilver`, `UnifiedInteractionEventSchemaSilver`, `TeamfightSchemaSilver`, `PlayerHeroRoundPlaytimeSchemaSilver`, `UltimateCycleSchemaSilver`, `PlayerLifeSchemaSilver`, etc.) based on the V2 design. These represent the conformed, integrated view. Ensure correct types and nullability.
2.  **Implement Transformation Logic (`src/v2/layers/silverLogic.ts`):**
    *   Create **pure functions** for each major transformation/derivation needed to get from Bronze to Silver. Use Pandas.js where beneficial (e.g., joins, filtering).
    *   **`calculateSilverMatches` Function:**
        *   Input: `bronzeData: Record<string, any[]>` (specifically `match_start`, `match_end`).
        *   Output: `MatchSilver[]`.
        *   Logic: Join start/end events on `match_id`. Calculate duration, determine winner. Validate output with `MatchSchemaSilver`. Use Pandas.js `merge` or equivalent.
    *   **`calculateSilverPlaytime` Function:**
        *   Input: `bronzeData: Record<string, any[]>` (specifically `hero_spawn`, `hero_swap`, `round_start`, `round_end`, `setup_complete`).
        *   Output: `PlayerHeroRoundPlaytimeSilver[]`.
        *   Logic: Replicate V1's `heroPlaytimeAtom` logic *purely*. Group events by player/match/round. Iterate chronologically, calculate time deltas between spawn/swap events within round boundaries (start/setup/end times). Validate output. Pandas.js `groupBy`, `sortValues`, `shift`, and arithmetic operations can help.
    *   **`calculateSilverPlayerRoundStats` Function:**
        *   Input: `bronzeData: Record<string, any[]>` (specifically `player_stat`), `playtimeData: PlayerHeroRoundPlaytimeSilver[]`.
        *   Output: `PlayerRoundStatsSilver[]`.
        *   Logic: Add `playerRole` using `getRoleFromHero`. Join/merge with `playtimeData` based on player/match/round/hero to add `playtime`. Validate output. Use Pandas.js `merge` and `map`.
    *   **`calculateUnifiedInteractionEvents` Function:**
        *   Input: `bronzeData: Record<string, any[]>` (kills, damage, healing, rez, demech).
        *   Output: `UnifiedInteractionEventSilver[]`.
        *   Logic: Map each relevant Bronze event type to the unified schema. Create incoming/outgoing pairs where necessary (like V1). Generate unique `event_id`. Sort by timestamp. Validate output.
    *   **`calculateSilverTeamfights` Function:**
        *   Input: `unifiedInteractions: UnifiedInteractionEventSilver[]`, `matches: MatchSilver[]`.
        *   Output: `TeamfightSilver[]`.
        *   Logic: Implement V1's teamfight detection logic purely. Filter interactions for deaths. Group by `match_id`. Sort by time. Identify gaps (`TEAMFIGHT_BUFFER_TIME`). Define start/end times (add `TEAMFIGHT_PADDING`). Count kills per team. Determine winner. Find first kill/death details. Generate `fight_id`. Validate output.
    *   **`calculateSilverUltimateCycles` Function:**
        *   Input: `bronzeData: Record<string, any[]>` (ultimate events).
        *   Output: `UltimateCycleSchemaSilver[]`.
        *   Logic: Replicate V1's `ultimateEventsAtom` logic purely. Find matching charged/start/end events based on player/match/hero/ID and time constraints. Validate output.
    *   **`calculateSilverPlayerLives` Function:**
        *   Input: `bronzeData: Record<string, any[]>` (spawns, swaps, deaths), `roundTimes: any[]` (derived from round start/end).
        *   Output: `PlayerLifeSchemaSilver[]`.
        *   Logic: Replicate V1's `playerLivesAtom` logic purely. Track active life per player, end on death/swap/round end. Validate output.
    *   *(Add functions for other Silver structures as needed, e.g., Unified Player Events).*
3.  **Create Silver Jotai Atoms (`src/v2/atoms/silverAtoms.ts`):**
    *   Create atoms for each Silver structure (e.g., `silverMatchesAtom`, `silverPlayerRoundStatsAtom`, `silverTeamfightsAtom`).
    *   Each atom depends on the necessary *Bronze* or other *Silver* atoms (e.g., `silverTeamfightsAtom` depends on `silverUnifiedInteractionEventsAtom`, which depends on `bronzeParsedEventsAtom`).
    *   Each atom calls its corresponding pure logic function from `silverLogic.ts`.

---

### Phase 6: Metrics Configuration & Engine

1.  **Implement Metrics Schemas (`src/v2/schemas/metricsSchema.ts`):**
    *   Define the Zod schemas exactly as specified in the V2 design document (`BaseMetricConfigSchema`, `SimpleMetricConfigSchema`, `RatioMetricConfigSchema`, `DerivedMetricConfigSchema`, `Per10MinMetricConfigSchema`, `MetricConfigSchema`).
2.  **Define Metric Configurations (`src/v2/metrics/metricsConfig.ts`):**
    *   Create the `metricConfigurations: MetricConfig[]` array, populating it with definitions for essential metrics (sums of base measures, key per-10 rates, common ratios like accuracy, KDA). Refer to V1 and the design doc examples.
    *   Create the `metricsConfigAtom` to provide easy access to a `Record<string, MetricConfig>`.
3.  **Implement Aggregation Engine Logic (`src/v2/layers/goldLogic.ts`):**
    *   Implement the `calculateAggregatedMetrics` pure function as designed. Pay close attention to:
        *   Handling Pandas.js DataFrames (`new pd.DataFrame`, `filter`, `groupBy`, `agg`, series operations `zipWith`, potentially `apply`).
        *   Implementing the `resolveMetricDependencies` helper function correctly.
        *   Calculating Simple, Ratio, Per10Min, and (basic) Derived metrics based on the aggregated data. Handle potential errors like division by zero.
        *   Cleaning final results (NaN/Infinity -> 0 or null).
        *   Returning data as an array of plain objects.
4.  **Create Aggregation Atom Family (`src/v2/atoms/goldAtoms.ts`):**
    *   Implement the `getAggregatedMetricsAtom = atomFamily(...)` as designed.
    *   Ensure the parameters (`AggregationParams`) and the equality check function are correctly defined for memoization.
    *   The atom should `get` the specified `sourceAtom` (e.g., `silverPlayerRoundStatsAtom`), `get` the `metricsConfigAtom`, and call `calculateAggregatedMetrics`.

---

### Phase 7: Testing (`src/v2/tests/`)

1.  **Setup:** Ensure Jest is configured (`jest.config.js`, `ts-jest`).
2.  **Focus on Pure Functions:** Create test files mirroring the `src/v2/layers/` structure (e.g., `bronzeLogic.test.ts`, `silverLogic.test.ts`, `goldLogic.test.ts`).
3.  **Test Data:** Create mock input data representing Bronze and Silver layer structures. Include diverse scenarios (empty files, single events, multiple matches, edge cases).
4.  **Bronze Layer Tests:**
    *   Test `parseLogLine` for various event types, correct parsing, timestamp conversion, and error handling.
    *   Test `processRawLogsToBronze` for correct grouping, `match_id` generation, Zod validation integration (test that invalid lines are skipped/logged), and metadata addition.
5.  **Silver Layer Tests:**
    *   Test **each** transformation function (`calculateSilverMatches`, `calculateSilverPlaytime`, `calculateUnifiedInteractionEvents`, `calculateSilverTeamfights`, etc.) with relevant mock Bronze/Silver input.
    *   Assert the output structure matches the Silver Zod schemas.
    *   Verify calculations (durations, playtime sums, kill counts, winner logic, first kill details). Test edge cases (no kills in fight, single-player interactions).
6.  **Gold Layer / Engine Tests:**
    *   Test `calculateAggregatedMetrics` extensively.
        *   Provide mock Silver data and various `AggregationParams` (different `groupBy` keys, filters, metric lists).
        *   Verify simple aggregations (sum, mean).
        *   Verify ratio calculations (including division by zero).
        *   Verify per-10-minute calculations.
        *   Verify basic derived metric calculations (if implemented).
        *   Test dependency resolution (`resolveMetricDependencies`).
        *   Test filtering logic.
        *   Test NaN/Infinity cleanup.
    *   Test `resolveMetricDependencies` directly.
7.  **Zod Schema Tests (Optional but Recommended):** Write tests that attempt to parse invalid data against your Zod schemas to ensure they catch errors as expected.

---

### Phase 8: Jotai Integration (`src/v2/atoms/`)

1.  Ensure all atoms defined in `rawAtoms.ts`, `bronzeAtoms.ts`, `silverAtoms.ts`, and `goldAtoms.ts` correctly use `atom` or `atomFamily`.
2.  Verify dependencies: Ensure each atom `get`s the correct upstream atoms (e.g., Silver atoms depend on Bronze/Silver, Gold atoms depend on Silver).
3.  Confirm atoms call the corresponding pure logic functions defined in `src/v2/layers/`.
4.  Ensure the `getAggregatedMetricsAtom` family correctly uses the `AggregationParams` interface and equality check.

---

### Phase 9: V1 Integration / Migration

1.  **Parallel Run:** Initially, keep V1 atoms. Introduce V2 atoms alongside. Components can use hooks to fetch data from either V1 or V2 atoms, potentially controlled by a feature flag.
2.  **Comparison:** Add temporary debug outputs or simple comparison components to verify that V2 outputs (especially in the Gold layer) match or logically align with V1 outputs where expected.
3.  **Incremental Replacement:** Once confidence in V2 is high for a specific piece of data (e.g., player stats), update components to solely use the V2 atom (`getAggregatedMetricsAtom` for stats).
4.  **Deprecate V1:** Gradually remove V1 atoms and logic as components are migrated.

---

### Exhaustive Checklist

**Phase 1: Setup**

*   [ ] Install `jotai`, `zod`, `pandas-js`, `crypto-js` (or alternative hash).
*   [ ] Install dev dependencies: `jest`, `@types/jest`, `ts-jest`, `typescript`, `@types/node`, `@types/react`, `@types/crypto-js`.
*   [ ] Configure `tsconfig.json` (strict mode).
*   [ ] Configure `jest.config.js` for TypeScript.

**Phase 2: Directory Structure**

*   [ ] Create `src/v2/` directory.
*   [ ] Create subdirectories: `atoms/`, `layers/`, `schemas/`, `metrics/`, `tests/`, `utils/`.

**Phase 3: Raw Layer**

*   [ ] Define input/output types/interfaces.
*   [ ] Create `rawLogInputAtom`.
*   [ ] Create `rawLogInputMutationAtom`.
*   [ ] Create `rawLogContentAtom` (incl. sample data handling).

**Phase 4: Bronze Layer**

*   [ ] **Schemas (`bronzeSchema.ts`):**
    *   [ ] Define `BronzeBaseSchema`.
    *   [ ] Define Zod schema + type export for `match_start`.
    *   [ ] Define Zod schema + type export for `match_end`.
    *   [ ] Define Zod schema + type export for `round_start`.
    *   [ ] Define Zod schema + type export for `round_end`.
    *   [ ] Define Zod schema + type export for `setup_complete`.
    *   [ ] Define Zod schema + type export for `objective_updated`.
    *   [ ] Define Zod schema + type export for `objective_captured`.
    *   [ ] Define Zod schema + type export for `point_progress`.
    *   [ ] Define Zod schema + type export for `payload_progress`.
    *   [ ] Define Zod schema + type export for `hero_spawn`.
    *   [ ] Define Zod schema + type export for `hero_swap`.
    *   [ ] Define Zod schema + type export for `ability_1_used`.
    *   [ ] Define Zod schema + type export for `ability_2_used`.
    *   [ ] Define Zod schema + type export for `offensive_assist`.
    *   [ ] Define Zod schema + type export for `defensive_assist`.
    *   [ ] Define Zod schema + type export for `ultimate_charged`.
    *   [ ] Define Zod schema + type export for `ultimate_start`.
    *   [ ] Define Zod schema + type export for `ultimate_end`.
    *   [ ] Define Zod schema + type export for `kill`.
    *   [ ] Define Zod schema + type export for `damage`.
    *   [ ] Define Zod schema + type export for `healing`.
    *   [ ] Define Zod schema + type export for `mercy_rez`.
    *   [ ] Define Zod schema + type export for `echo_duplicate_start`.
    *   [ ] Define Zod schema + type export for `echo_duplicate_end`.
    *   [ ] Define Zod schema + type export for `dva_demech`.
    *   [ ] Define Zod schema + type export for `dva_remech`.
    *   [ ] Define Zod schema + type export for `remech_charged`.
    *   [ ] Define Zod schema + type export for `player_stat`.
*   [ ] **Logic (`bronzeLogic.ts`):**
    *   [ ] Implement `parseLogLine` function (using V1 `LOG_SPEC`).
    *   [ ] Implement `processRawLogsToBronze` function (incl. hashing, line parsing, Zod validation, grouping by type).
*   [ ] **Atom (`bronzeAtoms.ts`):**
    *   [ ] Create `bronzeParsedEventsAtom`.

**Phase 5: Silver Layer**

*   [ ] **Schemas (`silverSchema.ts`):**
    *   [ ] Define `MatchSchemaSilver`.
    *   [ ] Define `PlayerHeroRoundPlaytimeSchemaSilver`.
    *   [ ] Define `PlayerRoundStatsSchemaSilver`.
    *   [ ] Define `UnifiedInteractionEventSchemaSilver`.
    *   [ ] Define `UnifiedPlayerEventSchemaSilver` (design based on V1).
    *   [ ] Define `UltimateCycleSchemaSilver`.
    *   [ ] Define `TeamfightSchemaSilver`.
    *   [ ] Define `PlayerLifeSchemaSilver`.
    *   [ ] Define schemas for other dimensions (Players, Teams, Heroes) if creating explicit tables.
*   [ ] **Logic (`silverLogic.ts`):**
    *   [ ] Implement `calculateSilverMatches`.
    *   [ ] Implement `calculateSilverPlaytime` (pure version).
    *   [ ] Implement `calculateSilverPlayerRoundStats` (incl. role mapping, join playtime).
    *   [ ] Implement `calculateUnifiedInteractionEvents`.
    *   [ ] Implement `calculateUnifiedPlayerEvents` (similar structure).
    *   [ ] Implement `calculateSilverUltimateCycles`.
    *   [ ] Implement `calculateSilverTeamfights` (incl. first kill/death).
    *   [ ] Implement `calculateSilverPlayerLives`.
*   [ ] **Atoms (`silverAtoms.ts`):**
    *   [ ] Create `silverMatchesAtom`.
    *   [ ] Create `silverPlayerRoundStatsAtom`.
    *   [ ] Create `silverUnifiedInteractionEventsAtom`.
    *   [ ] Create `silverUnifiedPlayerEventsAtom`.
    *   [ ] Create `silverUltimateCyclesAtom`.
    *   [ ] Create `silverTeamfightsAtom`.
    *   [ ] Create `silverPlayerLivesAtom`.
    *   [ ] Create other silver atoms as needed.

**Phase 6: Metrics Configuration & Engine**

*   [ ] **Schemas (`metricsSchema.ts`):**
    *   [ ] Implement `BaseMetricConfigSchema`.
    *   [ ] Implement `SimpleMetricConfigSchema`.
    *   [ ] Implement `RatioMetricConfigSchema`.
    *   [ ] Implement `DerivedMetricConfigSchema`.
    *   [ ] Implement `Per10MinMetricConfigSchema`.
    *   [ ] Implement `MetricConfigSchema` (discriminated union).
*   [ ] **Config (`metricsConfig.ts`):**
    *   [ ] Define `metricConfigurations` array with initial metrics.
    *   [ ] Create `metricsConfigAtom`.
*   [ ] **Engine Logic (`goldLogic.ts`):**
    *   [ ] Implement `resolveMetricDependencies` helper.
    *   [ ] Implement `calculateAggregatedMetrics` function (incl. filtering, grouping, simple agg, ratio, per10, derived placeholder, dependency resolution, NaN cleanup).
*   [ ] **Atom (`goldAtoms.ts`):**
    *   [ ] Implement `getAggregatedMetricsAtom = atomFamily(...)`.

**Phase 7: Testing**

*   [ ] Set up Jest config.
*   [ ] Create mock data for Bronze inputs (covering different event types).
*   [ ] Create mock data for Silver inputs (for testing Gold).
*   [ ] Write unit tests for `bronzeLogic.ts`: `parseLogLine`, `processRawLogsToBronze`.
*   [ ] Write unit tests for `silverLogic.ts`:
    *   [ ] `calculateSilverMatches`
    *   [ ] `calculateSilverPlaytime`
    *   [ ] `calculateSilverPlayerRoundStats`
    *   [ ] `calculateUnifiedInteractionEvents`
    *   [ ] `calculateSilverTeamfights`
    *   [ ] `calculateSilverUltimateCycles`
    *   [ ] `calculateSilverPlayerLives`
    *   [ ] (Others as implemented)
*   [ ] Write unit tests for `goldLogic.ts`: `calculateAggregatedMetrics` (various scenarios), `resolveMetricDependencies`.
*   [ ] (Optional) Write tests verifying Zod schema parsing.

**Phase 8: Jotai Integration**

*   [ ] Review all atoms in `src/v2/atoms/` for correct dependencies.
*   [ ] Ensure atoms call the correct pure logic functions.
*   [ ] Verify `atomFamily` usage and equality checks.

**Phase 9: Migration & Documentation**

*   [ ] Implement feature flags or routing to use V2 atoms/components.
*   [ ] Compare V1 and V2 outputs for key metrics/views.
*   [ ] Update components incrementally to use V2 data sources.
*   [ ] Add JSDoc comments to pure functions, schemas, and complex atoms.
*   [ ] Update project README with V2 architecture details.
*   [ ] Remove V1 code once fully migrated and validated.

