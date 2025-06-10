# Scrimsight Atom Data Flow Architecture Analysis

## Executive Summary

This document provides a comprehensive analysis of the Scrimsight application's atom-based data architecture. The system uses **68 Jotai atoms** organized into 6 functional layers that transform raw Overwatch log files into rich analytics and visualizations. The architecture demonstrates sophisticated state management with atomic granularity, efficient dependency tracking, and powerful abstraction layers for UI consumption.

## Table of Contents

1. [Data Pipeline Overview](#data-pipeline-overview)
2. [Complete Atom Inventory](#complete-atom-inventory)
3. [Layer-by-Layer Analysis](#layer-by-layer-analysis)
4. [Consumption Patterns](#consumption-patterns)
5. [Performance & Optimization](#performance--optimization)
6. [Dependency Graphs](#dependency-graphs)
7. [Architectural Insights](#architectural-insights)
8. [Recommendations](#recommendations)

---

## Data Pipeline Overview

The Scrimsight data pipeline follows a clear 6-layer architecture:

```
Raw Log Files → Data Loading → Event Extraction → Organization → Analytics → UI Consumption
      ↓              ↓              ↓              ↓           ↓            ↓
   User Upload → File Parsing → Game Events → Match Data → Statistics → Components
```

### Core Data Flow

1. **Input Layer**: Users upload log files or use sample data
2. **Loading Layer**: Files are read and content extracted
3. **Parsing Layer**: Raw text is converted to structured events
4. **Event Extraction**: 19 different game event types are isolated
5. **Organization**: Events are grouped, matched, and contextualized
6. **Analytics**: Statistics, metrics, and insights are calculated
7. **Consumption**: UI components receive optimized data shapes

---

## Complete Atom Inventory

### Summary Statistics

- **Total Atoms**: 68 implementation files
- **Event Types**: 19 game event extractors
- **Analytics Atoms**: 22 analysis and aggregation atoms
- **Utility Atoms**: 14 supporting and infrastructure atoms
- **Atom Families**: 8 parameterized atoms for contextual data
- **Most Dependencies**: `matchDataAtom` (6 direct dependencies)
- **Most Consumed**: `playerStatsBase.atom` (used in 30+ components)

---

## Layer-by-Layer Analysis

### Layer 1: Data Input & Loading (6 atoms)

The foundation layer handles file input and content extraction:

#### `logFileInputAtom` (Input Atom)
- **Data Type**: `LogFileInputType`
- **Purpose**: Writable atom for file uploads with read/write interface
- **Dependencies**: None (entry point)
- **Pattern**: Input atom with internal state management

**Exact Field Structure:**
```typescript
{
  files: File[]  // Array of browser File objects
}
```

#### `logFileLoaderAtom` (Standard Atom)
- **Data Type**: `Promise<LogFileLoaderType>`
- **Purpose**: Asynchronously loads file content from uploaded files
- **Calculation**: Concurrent file reading using `Promise.all` and `readFileAsync`
- **Dependencies**: `logFileInput.atom`

**Exact Field Structure:**
```typescript
Array<{
  fileName: string;        // Name of the uploaded file
  fileModified: number;    // Unix timestamp of file modification
  fileContent: string;     // Raw text content of the log file
}>
```

#### `logFileParserAtom` (Standard Atom)
- **Data Type**: `Promise<LogFileParserOutput[]>`
- **Purpose**: Parses loaded files into game events and generates unique match identifiers
- **Calculation**: Combines files with sample data, uses `parseFile` utility, generates `matchId` with `stringHash`
- **Dependencies**: `logFileLoader.atom`, `sampleData.atom`

**Exact Field Structure:**
```typescript
Array<{
  fileName: string;        // Name of the source file
  matchId: string;         // Unique hash-based identifier for the match
  fileModified: number;    // Unix timestamp of file modification
  logs: Array<{
    specName: string;      // Event type name (e.g., "kill", "hero_spawn")
    data: object[];        // Array of parsed event objects for that type
  }>;
}>
```

#### `sampleData` (Standard Atom)
- **Data Type**: `LogFileLoaderType`
- **Purpose**: Provides demonstration data when enabled
- **Calculation**: Conditional return based on `sampleDataEnabled` flag
- **Dependencies**: `sampleDataEnabled.atom`

**Exact Field Structure:**
```typescript
Array<{
  fileName: string;        // Pre-defined sample file names
  fileModified: number;    // Pre-defined timestamps
  fileContent: string;     // Raw log file content from samples
}>
```

**Sample Files Included:**
1. "Log-2023-08-28-17-05-38.txt"
2. "Log-2023-08-28-17-29-57.txt"
3. "Log-2023-08-28-17-52-17.txt"
4. "Log-2023-08-28-18-28-25.txt"
5. "Log-2023-08-28-18-40-39.txt"

#### `sampleDataEnabled` (Standard Atom)
- **Data Type**: `boolean`
- **Purpose**: Configuration flag for sample data inclusion
- **Calculation**: Direct value assignment (defaults to `true`)
- **Dependencies**: None

#### `setupComplete` (Standard Atom)
- **Data Type**: `Promise<SetupCompleteType>`
- **Purpose**: Extracts round setup completion events
- **Calculation**: Uses `extractEventsFromFiles` with 'setup_complete' type
- **Dependencies**: `logFileParser.atom`

**Exact Field Structure:**
```typescript
Array<{
  matchId: string;              // Unique match identifier
  type: string;                 // Always "setup_complete"
  matchTime: number;            // Seconds from match start
  roundNumber: number;          // Round number (1, 2, 3, etc.)
  matchTimeRemaining: number;   // Seconds remaining in match/round
}>
```

### Layer 2: Event Extraction (19 atoms)

This layer extracts specific game events from parsed log files. All follow the same pattern:

**Common Pattern**:
- **Data Type**: `Promise<{EventType}Type>` where EventType varies
- **Calculation**: Uses `extractEventsFromFiles` utility with specific event type string
- **Dependencies**: `logFileParser.atom`
- **Pattern**: Standard atom with async function

**Common Fields (All Events)**:
- `matchId` (string): Unique match identifier
- `type` (string): Event type name
- `matchTime` (number): Seconds from match start

## Complete Event Type Reference

### Combat Events

#### `kill` → `KillLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}
```

#### `damage` → `DamageLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}
```

#### `healing` → `HealingLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  healerTeam: string;
  healerName: string;
  healerHero: string;
  healeeTeam: string;
  healeeName: string;
  healeeHero: string;
  eventAbility: string;
  eventHealing: number;
  isHealthPack: boolean;
}
```

#### `defensiveAssist` / `offensiveAssist` → `AssistLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}
```

### Hero Events

#### `heroSpawn` / `heroSwap` → `HeroEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}
```

#### `dvaDemech` → `DvaDemechLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}
```

#### `dvaRemech` → `DvaRemechLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}
```

#### `mercyRez` → `MercyRezLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  mercyTeam: string;
  mercyName: string;
  revivedTeam: string;
  revivedName: string;
  revivedHero: string;
  eventAbility: string;
}
```

### Ultimate Events

#### `ultimateCharged` / `ultimateStart` / `ultimateEnd` → `UltimateEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}
```

### Ability Events

#### `ability1Used` / `ability2Used` → `AbilityEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}
```

### Match/Round Events

#### `matchStart` → `MatchStartLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
}
```

#### `matchEnd` → `MatchEndLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  team1Score: number;
  team2Score: number;
}
```

#### `roundStart` → `RoundStartLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
}
```

#### `roundEnd` → `RoundEndLogEvent[]`
```typescript
{
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
  controlTeam1Progress: number;
  controlTeam2Progress: number;
  matchTimeRemaining: number;
}
```

**Special Cases:**
- **`mercyRez.ts`**: Only event extractor with custom field mapping
- **`damage.ts` & `defensiveAssist.ts`**: Include detailed JSDoc documentation

### Layer 3: Data Organization & Processing (6 atoms)

These atoms transform raw events into structured, analysis-ready formats:

#### `groupedEventsAtom` (Standard Atom)
- **Data Type**: `Promise<GroupedKillOffensiveAssistEvent[]>`
- **Purpose**: Groups kills and assists by time/match for coordinated action analysis
- **Calculation**: Creates Map with `${matchId}-${matchTime}` keys, combines simultaneous events
- **Dependencies**: `kill.atom`, `offensiveAssist.atom`

**Exact Field Structure:**
```typescript
Array<{
  matchId: string;
  matchTime: number;
  kills: KillLogEvent[];         // Array of kill events at this timestamp
  assists: OffensiveAssistLogEvent[]; // Array of offensive assists at this timestamp
}>
```

#### `matchDataAtom` (Standard Atom)
- **Data Type**: `Promise<MatchData[]>`
- **Purpose**: Comprehensive match objects with teams, scores, players, outcomes
- **Calculation**: Enriches match info with start/end events, player rosters, duration, winner determination
- **Dependencies**: `matchExtractor.atom`, `matchStart.atom`, `matchEnd.atom`, `playerStat.atom`, `mapTimes.atom`, `roundEnd.atom`

**Exact Field Structure:**
```typescript
Array<{
  matchId: string;
  fileName: string;
  fileModified: number;
  dateString: string;           // Formatted as "YYYY-M-D"
  map: string;                  // From MatchStartLogEvent
  mode: string;                 // From MatchStartLogEvent (mapType)
  team1Name: string;
  team2Name: string;
  team1Score: number;           // Final score from MatchEndLogEvent
  team2Score: number;           // Final score from MatchEndLogEvent
  team1Players: string[];       // Unique players derived from PlayerStatLogEvent
  team2Players: string[];       // Unique players derived from PlayerStatLogEvent
  duration: number;             // From MapTimes data
  roundWinners: ('team1' | 'team2' | 'draw')[]; // Calculated from RoundEndLogEvent
  winner: string | null;        // Team name or null for draws
}>
```

#### `matchExtractorAtom` (Standard Atom)
- **Data Type**: `Promise<MatchFileInfo[]>`
- **Purpose**: Basic match metadata extraction with formatted dates/times
- **Calculation**: Maps parsed files to extract matchId, fileName, formatted timestamps
- **Dependencies**: `logFileParser.atom`

**Exact Field Structure:**
```typescript
Array<{
  matchId: string;
  name: string;                 // Original fileName
  fileModified: number;         // Unix timestamp
  dateString: string;           // "YYYY-M-D" format
  timeString: string;           // "H:M:S" format
}>
```

#### `playerEventsAtom` (Standard Atom)
- **Data Type**: `Promise<PlayerEventWithType[]>`
- **Purpose**: Unified timeline of player actions with event type labels
- **Calculation**: Combines multiple event types, adds `eventType` field, sorts chronologically
- **Dependencies**: `defensiveAssist.atom`, `offensiveAssist.atom`, `heroSpawn.atom`, `heroSwap.atom`, `ability1Used.atom`, `ability2Used.atom`

**Exact Field Structure:**
```typescript
type PlayerEventWithType = 
  | (DefensiveAssistLogEvent & { eventType: 'defensiveAssist' })
  | (OffensiveAssistLogEvent & { eventType: 'offensiveAssist' })
  | (HeroSpawnLogEvent & { eventType: 'heroSpawn' })
  | (HeroSwapLogEvent & { eventType: 'heroSwap' })
  | (Ability1UsedLogEvent & { eventType: 'ability1Used' })
  | (Ability2UsedLogEvent & { eventType: 'ability2Used' });
```

#### `playerInteractionEventsAtom` (Standard Atom)
- **Data Type**: `Promise<PlayerInteractionEvent[]>`
- **Purpose**: Standardized bidirectional player interactions (kills, damage, healing)
- **Calculation**: Converts events to common format, creates directional relationships, assigns unique IDs
- **Dependencies**: `mercyRez.atom`, `dvaDemech.atom`, `dvaRemech.atom`, `kill.atom`, `damage.atom`, `healing.atom`

**Exact Field Structure:**
```typescript
Array<{
  id: string;                              // Unique identifier
  matchId: string;
  playerName: string;                      // The player this record is about
  playerTeam: string;
  playerHero: string;
  otherPlayerName: string;                 // The other player involved
  playerInteractionEventTime: number;      // matchTime
  playerInteractionEventType: string;      // Type of interaction
  direction: 'incoming' | 'outgoing';      // Perspective relative to playerName
}>
```

**Supported Interaction Types:**
- **Mercy Resurrect**: 'Resurrect' (outgoing), 'Resurrected' (incoming)
- **D.Va Demech**: 'Demech player' (outgoing), 'Demeched' (incoming)
- **D.Va Remech**: 'Remech' (outgoing, no other player)
- **Kills**: 'Killed player' (outgoing), 'Killed by player' (incoming)
- **Damage**: 'Damage to player' (outgoing), 'Damage from player' (incoming)
- **Healing**: 'Healing to player' (outgoing), 'Healing from player' (incoming)

#### `scrimAtom` (Standard Atom)
- **Data Type**: `Promise<Scrim[]>`
- **Purpose**: Groups matches into scrimmage sessions with aggregate statistics
- **Calculation**: Groups by date-team combination, calculates win/loss records, total duration
- **Dependencies**: `matchData.atom`

**Exact Field Structure:**
```typescript
Array<{
  dateString: string;           // Date of the scrim session
  team1Name: string;
  team2Name: string;
  team1Players: string[];       // From first match in the scrim
  team2Players: string[];       // From first match in the scrim
  team1Wins: number;            // Count of matches won by team1
  team2Wins: number;            // Count of matches won by team2
  draws: number;                // Count of drawn matches
  duration: number;             // Total duration of all matches in seconds
  matchIds: string[];           // Array of all match IDs in this scrim
}>
```

### Layer 4: Player Analytics (10 atoms)

Focused on individual player performance analysis:

#### `playerStatsBaseAtom` (Standard Atom) ⭐ **CRITICAL**
- **Data Type**: `Promise<Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>>`
- **Purpose**: Most granular player statistics merged with playtime data
- **Calculation**: Merges player stat events with hero playtime, creates complete PlayerStatsBase objects
- **Dependencies**: `playerStat.atom`, `heroPlaytime.atom`
- **Note**: Foundation for most metrics views, used in 30+ components

**Exact Field Structure:**
```typescript
{
  categoryKeys: ['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'];
  numericalKeys: PlayerStatsBaseNumericalKeys[]; // 26 base fields
  rows: PlayerStatsBase[];
}

interface PlayerStatsBase {
  // Category Fields
  matchId: string;
  roundNumber: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  playerRole: string;           // Computed from hero using getRoleFromHero
  
  // Base Numerical Fields (26 total)
  playtime: number;
  eliminations: number;
  finalBlows: number;
  deaths: number;
  allDamageDealt: number;
  barrierDamageDealt: number;
  heroDamageDealt: number;
  healingDealt: number;
  healingReceived: number;
  selfHealing: number;
  damageTaken: number;
  damageBlocked: number;
  defensiveAssists: number;
  offensiveAssists: number;
  ultimatesEarned: number;
  ultimatesUsed: number;
  multikills: number;
  soloKills: number;
  objectiveKills: number;
  environmentalKills: number;
  environmentalDeaths: number;
  criticalHits: number;
  shotsFired: number;
  shotsHit: number;
  shotsMissed: number;
  scopedShotsFired: number;
  scopedShotsHit: number;
}
```

#### `playerComparisonAtomFamily` (Atom Family)
- **Data Type**: `AtomFamily<Promise<MetricComparison[]>, PlayerComparisonParams>`
- **Purpose**: Compares player stats against role/hero benchmarks
- **Calculation**: Retrieves filtered stats, gets averages, calculates deltas and percentages
- **Parameters**: `{ playerName: string, heroName?: string }`
- **Dependencies**: `getStatsAtom`, `averageMetricPerRole.atom`, `averageMetricPerHero.atom`

**Exact Field Structure:**
```typescript
Array<{
  metric: PlayerStatsNumericalKeys;    // The stat being compared
  playerValue: number;                 // Player's actual value
  benchmarkValue?: number;             // Role/Hero average (optional)
  benchmarkType: 'Role Average' | 'Hero Average' | 'N/A';
  delta?: number;                      // Difference from benchmark
  percentDifference?: number;          // Percentage difference
}>
```

#### `playerFirstKillDeathRateAtom` (Standard Atom)
- **Data Type**: `Promise<Record<string, PlayerFirstKillDeathRateStats>>`
- **Purpose**: First kill/death rates across teamfights
- **Calculation**: Aggregates from teamfight data, calculates participation rates
- **Dependencies**: `teamfights.atom`, `teamfightParticipation.atom`, `uniquePlayerNames.atom`

**Exact Field Structure:**
```typescript
Record<string, {  // Key: playerName
  playerName: string;
  firstKills: number;              // Count of teamfights where player got first kill
  firstDeaths: number;             // Count of teamfights where player died first
  teamfightsParticipated: number;  // Total teamfights participated in
  firstKillRate: number;           // firstKills / teamfightsParticipated
  firstDeathRate: number;          // firstDeaths / teamfightsParticipated
}>
```

#### `playerListSummary` (Standard Atom)
- **Data Type**: `Promise<PlayerListSummary[]>`
- **Purpose**: High-level player overview with top hero/role, team, key metrics
- **Calculation**: Groups stats by player, determines top hero/role by playtime, primary team
- **Dependencies**: `playerStatsBase.atom`, `heroPlaytime.atom`, `playerFirstKillDeathRate.atom`

**Exact Field Structure:**
```typescript
Array<{
  playerName: string;
  teamName: string;         // Primary team (most playtime)
  topHero: string;          // Hero with most playtime
  eliminations: number;     // Total eliminations
  deaths: number;           // Total deaths
  assists: number;          // offensive + defensive assists
  role: OverwatchRole;      // Primary role (most playtime)
  firstKillRate: number;    // First kill rate in teamfights
}>
```

#### `playerLivesAtom` (Standard Atom)
- **Data Type**: `Promise<PlayerLife[]>`
- **Purpose**: Tracks individual lives from spawn to death including hero swaps
- **Calculation**: Chronological event processing with active life tracking
- **Dependencies**: `playerInteractionEvents.atom`, `playerEvents.atom`, `roundTimes.atom`

**Exact Field Structure:**
```typescript
Array<{
  matchId: string;
  playerName: string;
  playerHero: string;
  startTime: number;        // When life started (spawn/hero swap)
  endTime: number;          // When life ended (death/hero swap/round end)
}>
```

#### `playerMatchHistoryAtom` (Atom Factory)
- **Data Type**: `(playerName: string) => Atom<Promise<PlayerMatch[]>>`
- **Purpose**: Match history for specific player with win/loss records
- **Calculation**: Filters by player name, combines match data, determines outcomes
- **Dependencies**: `playerStat.atom`, `matchStart.atom`, `matchEnd.atom`, `matchExtractor.atom`

**Exact Field Structure:**
```typescript
Array<{
  matchId: string;
  matchTime: number;        // For sorting
  date: string;             // Human-readable date
  time: string;             // Human-readable time
  mapName: string;
  mapType: string;
  playerTeam: string;
  won: boolean;             // Did player's team win
}>
```

#### `playerStat` (Standard Atom) - Raw Extraction
- **Data Type**: `Promise<PlayerStatType>`
- **Purpose**: Raw player statistics extracted from log files
- **Calculation**: Direct extraction using `extractEventsFromFiles`
- **Dependencies**: `logFileParser.atom`

**Exact Field Structure:**
```typescript
Array<{
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: string;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  // All 26 base numerical fields plus:
  eliminations: number;
  finalBlows: number;
  deaths: number;
  // ... (complete list matches PlayerStatsBaseNumericalKeys)
  weaponAccuracy: number;   // Only in raw, calculated separately in derived
}>
```

#### `playerStatExpandedAtom` (Standard Atom)
- **Data Type**: `Promise<PlayerStatsExpanded[]>`
- **Purpose**: Player stats enhanced with derived role information
- **Calculation**: Maps stats adding `playerRole` from `getRoleFromHero`
- **Dependencies**: `playerStat.atom`

**Exact Field Structure:**
```typescript
Array<PlayerStatLogEvent & {
  playerRole: string;       // Added computed field
}>
```

#### `playerStatusTimelineAtom` (Standard Atom)
- **Data Type**: `Promise<Map<string, PlayerStatusTimeline>>`
- **Purpose**: Tracks alive/active players at each timestamp for composition analysis
- **Calculation**: Processes spawn/death events, maintains team sets, creates timeline entries
- **Dependencies**: `logFileParser.atom`, `matchData.atom`

**Exact Field Structure:**
```typescript
Map<string, Array<{       // Key: matchId
  timestamp: number;
  team1Players: Set<string>;  // Active players on team 1
  team2Players: Set<string>;  // Active players on team 2
}>>
```

### Layer 5: Team Analytics (8 atoms)

Team-level performance analysis and composition tracking:

#### `teamCompositionsAtom` (Standard Atom)
- **Data Type**: `TeamComposition[]`
- **Purpose**: Track 5-hero compositions and playtime durations
- **Calculation**: Combines spawn/swap events, tracks composition changes, calculates durations
- **Dependencies**: `heroSpawn.atom`, `heroSwap.atom`, `mapTimes.atom`

**Exact Field Structure:**
```typescript
Array<{
  teamName: string;     // Name of the team
  heroes: string[];     // Array of 5 hero names (sorted alphabetically)
  timePlayed: number;   // Total time this composition was active (seconds)
}>
```

#### `detailedTeamCompositionsAtom` (Atom Family)
- **Data Type**: `DetailedComposition[]`
- **Purpose**: Comprehensive composition analytics for specific team
- **Calculation**: Tracks friendly/opponent compositions, calculates win rates, matchup analysis
- **Parameters**: Team ID
- **Dependencies**: `matchData.atom`, `heroSpawn.atom`, `heroSwap.atom`, `mapTimes.atom`

#### `teamMapTypeStatsAtom` (Atom Family)
- **Data Type**: `Record<string, MapModeStats>`
- **Purpose**: Team performance by map mode/type
- **Calculation**: Groups results by map mode, counts wins/losses/draws
- **Parameters**: Team ID
- **Dependencies**: `matchData.atom`

#### `teamNamesAtom` (Standard Atom)
- **Data Type**: `string[]`
- **Purpose**: Deduplicated list of all team names
- **Calculation**: Extracts from match start events, uses Set for deduplication
- **Dependencies**: `matchStart.atom`

#### `teamPlayers` (Standard Atom)
- **Data Type**: `TeamPlayersType[]`
- **Purpose**: Maps teams to complete player rosters
- **Calculation**: Iterates match data, creates player sets per team
- **Dependencies**: `matchData.atom`

#### `teamStatsAtom` (Standard Atom)
- **Data Type**: `TeamStats[]`
- **Purpose**: Comprehensive team statistics with win/loss, games played, recent activity
- **Calculation**: Filters matches per team, counts outcomes, finds recent games
- **Dependencies**: `teamPlayers.atom`, `matchData.atom`

#### `teamfightParticipationAtom` (Standard Atom)
- **Data Type**: `Map<string, TeamfightParticipation>`
- **Purpose**: Player participation in each teamfight
- **Calculation**: Groups interactions by match, identifies participants within fight windows
- **Dependencies**: `teamfights.atom`, `playerInteractionEvents.atom`

#### `teamfightsAtom` (Standard Atom)
- **Data Type**: `Teamfight[]`
- **Purpose**: Identifies and analyzes teamfights with winner determination, ultimate usage
- **Calculation**: 10-second buffer grouping, kill counting, ultimate tracking, first kill/death recording
- **Dependencies**: `playerInteractionEvents.atom`, `ultimateEvents.atom`, `matchData.atom`

### Layer 6: Time & Aggregation Analytics (15 atoms)

#### Time Analysis (3 atoms)

#### `heroPlaytimeAtom` (Standard Atom)
- **Data Type**: `Metric<HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys>`
- **Purpose**: Time each player spent on each hero per round
- **Calculation**: Tracks spawn/swap events chronologically, calculates durations between changes
- **Dependencies**: `playerEvents.atom`, `roundTimes.atom`

#### `mapTimesAtom` (Standard Atom)
- **Data Type**: `MapTimes[]`
- **Purpose**: Match start/end times and duration calculation
- **Calculation**: Matches start/end events by matchId, calculates duration
- **Dependencies**: `matchStart.atom`, `matchEnd.atom`

#### `roundTimesAtom` (Standard Atom)
- **Data Type**: `RoundTimes[]`
- **Purpose**: Comprehensive round timing including setup phase
- **Calculation**: Matches start/setup/end events, calculates round duration
- **Dependencies**: `roundStart.atom`, `setupComplete.atom`, `roundEnd.atom`

#### Aggregation & Summary (12 atoms)

#### `averageMetricPerHeroAtom` (Standard Atom)
- **Data Type**: `AverageMetricPerHeroType`
- **Purpose**: Average performance statistics per hero across all matches
- **Calculation**: Aggregates numerical stats by hero, calculates per-10-minute rates and accuracy
- **Dependencies**: `playerStatsBase.atom`, `uniqueHeroNames.atom`

#### `averageMetricPerMapAtom` (Standard Atom)
- **Data Type**: `AverageMetricPerMap`
- **Purpose**: Average performance statistics per map
- **Calculation**: Creates matchId-to-map lookup, aggregates stats by map
- **Dependencies**: `playerStatsBase.atom`, `matchData.atom`, `uniqueMapNames.atom`

#### `averageMetricPerRoleAtom` (Standard Atom)
- **Data Type**: `AverageMetricPerRole`
- **Purpose**: Average performance statistics per Overwatch role
- **Calculation**: Groups by role (tank/damage/support), calculates per-10-minute rates
- **Dependencies**: `playerStatsBase.atom`

#### `contextualStatAtoms` (Atom Family)
- **Data Type**: Various contextual stat objects
- **Purpose**: Contextual statistics for specific combinations (player in match, team in scrim)
- **Calculation**: Uses `atomFamily` with `getStatsAtom` for filtered contexts
- **Dependencies**: `scrims.atom`, `matchData.atom`, various stat atoms

#### `firstKillImpactAtom` (Standard Atom)
- **Data Type**: `FirstKillImpactStats`
- **Purpose**: Analyzes impact of first kills/deaths on teamfight outcomes
- **Calculation**: Processes teamfight data, calculates win rates with/without first kills
- **Dependencies**: `teamfights.atom`

#### `killMatrix` & `killMatrixAtom` (Atom Families)
- **Data Type**: `KillMatrixData | null`
- **Purpose**: Who-killed-whom matrices for specific matches
- **Calculation**: Filters interactions, creates kill matrices, calculates totals
- **Parameters**: Match ID
- **Dependencies**: `matchData.atom`, `playerInteractionEvents.atom`

#### `listSummaryAtoms` (Complex Proxy Pattern)
- **Data Type**: Various summary arrays
- **Purpose**: Summary information for players, scrims, teams with top heroes, win rates
- **Calculation**: Complex helper functions, proxy pattern for dynamic atom access
- **Dependencies**: Multiple atoms including `playerStatsBase.atom`, `heroPlaytime.atom`, `scrims.atom`

#### `segmentStatsAtomFamily` (Atom Family)
- **Data Type**: `SegmentStats | null`
- **Purpose**: Statistics for time segments (teamfights, rounds, maps)
- **Calculation**: Filters events within time windows, tracks player counts, extracts teamfight stats
- **Parameters**: `{ matchId, startTime, endTime, type }`
- **Dependencies**: `playerInteractionEvents.atom`, `ultimateEvents.atom`, `teamfights.atom`, `playerStatusTimeline.atom`

#### `ultimateEventsAtom` (Standard Atom)
- **Data Type**: `UltimateEvent[]`
- **Purpose**: Complete ultimate usage records with timing and hold duration
- **Calculation**: Matches charged→start→end events, calculates hold time
- **Dependencies**: `ultimateCharged.atom`, `ultimateStart.atom`, `ultimateEnd.atom`

#### `ultimateImpactAtom` (Standard Atom)
- **Data Type**: `UltimateImpactStats`
- **Purpose**: Ultimate effectiveness analysis with kills during ultimates and teamfight win rates
- **Calculation**: Finds overlapping teamfights/kills, tracks wins when ultimates used
- **Dependencies**: `teamfights.atom`, `ultimateEvents.atom`, `kill.atom`, `uniquePlayerNames.atom`

### Layer 7: Unique Value Extraction (5 atoms)

These atoms provide filter options and categorization values:

#### `uniqueCategoryValuesAtom` (Standard Atom) ⭐ **CRITICAL**
- **Data Type**: `Promise<Record<PlayerStatsCategoryKeys, string[]>>`
- **Purpose**: Unique values for each category key for filter dropdowns
- **Calculation**: Uses Sets to collect unique values, converts to sorted arrays
- **Dependencies**: `playerStatsBase.atom`
- **Note**: Essential for interactive filtering across the UI

#### `uniqueGameModesAtom` (Standard Atom)
- **Data Type**: `Promise<UniqueGameMode[]>`
- **Purpose**: Unique game modes (map types) for filtering
- **Calculation**: Extracts mapType values, deduplicates with Set
- **Dependencies**: `matchStart.atom`

#### `uniqueHeroNamesAtom` (Standard Atom)
- **Data Type**: `Promise<string[]>`
- **Purpose**: Unique hero names for hero-based filtering
- **Calculation**: Collects playerHero values, converts to sorted array
- **Dependencies**: `playerStatsBase.atom`

#### `uniqueMapNamesAtom` (Standard Atom)
- **Data Type**: `Promise<string[]>`
- **Purpose**: Unique map names for map-based filtering
- **Calculation**: Extracts mapName values, deduplicates
- **Dependencies**: `matchStart.atom`

#### `uniquePlayerNamesAtom` (Standard Atom)
- **Data Type**: `Promise<string[]>`
- **Purpose**: Unique player names for player-based filtering
- **Calculation**: Extracts playerName from events, deduplicates
- **Dependencies**: `playerStat.atom`

---

## Consumption Patterns

### Primary Data Sources for UI

**Most Frequently Used Atoms (30+ components each):**
1. **`matchData.atom`** - Central match information, used across navigation and detail views
2. **`playerStatsBase.atom`** - Foundation for all metrics-related components
3. **`uniqueCategoryValues.atom`** - Essential for filter dropdowns throughout UI

**Dashboard & Summary Atoms:**
- **`playerListSummaryAtom`** - Powers player overview pages and lists
- **`teamListSummaryAtom`** - Central to team-related views and navigation
- **`scrimListSummaryAtom`** - Core for scrim navigation and summary cards

### Multi-Atom Combination Patterns

Components frequently combine 3-5+ atoms for rich data views:

```typescript
// Typical pattern from MetricsExplorerPage
const matchDataValue = useAtomValue(matchData.atom);
const categoryValues = useAtomValue(uniqueCategoryValues.atom);
const stats = useStats(["playerName", "playerTeam"], filters);
// + internal state management and transformations
```

**Common Combination Types:**
- **Match + Player Stats + Filters**: For detailed analysis views
- **Summary + Category Values + Sorting**: For list and overview pages
- **Events + Match Data + Timelines**: For timeline and interaction views
- **Team Stats + Player Stats + Compositions**: For team analysis pages

### Atom Families Usage Patterns

**Contextual Data Access:**
```typescript
// Team-specific analysis
const teamMapStats = useAtomValue(teamMapTypeStatsAtom(teamId));
const teamComps = useAtomValue(detailedTeamCompositionsAtom(teamId));

// Player benchmarking
const comparison = useAtomValue(playerComparisonAtomFamily({ 
  playerName: "PlayerName", 
  heroName: "Tracer" 
}));

// Time segment analysis
const segmentStats = useAtomValue(segmentStatsAtomFamily({
  matchId: "match123",
  startTime: 1000,
  endTime: 2000,
  type: "teamfight"
}));
```

### Hook-Based Abstraction Layers

#### `useStats` Hook - Primary Data Access Pattern
```typescript
// Sophisticated filtering, grouping, and sorting with caching
const stats = useStats(
  groupBy: ["playerName", "playerTeam"],
  filter: { playerName: "SelectedPlayer" },
  sortBy: "eliminations",
  sortDirection: "desc"
);
```

**Key Features:**
- **Intelligent Caching**: Map-based cache with JSON.stringify keys
- **Dynamic Atom Creation**: Creates configured atoms on-demand
- **Performance Optimization**: Avoids unnecessary re-computation
- **Type Safety**: Strongly typed parameters and return values

### Component Categorization by Consumption

**Heavy Consumers (5+ atoms):**
- `MetricsExplorerPage` - Complex metrics analysis with filtering
- `AllPlayerComparison` - Multi-source data combination and benchmarking
- `TeamOverview` - Comprehensive team analysis with multiple data sources

**Medium Consumers (2-4 atoms):**
- `PlayersOverview`, `TeamsPage`, `ScrimsPage` - Summary views with filtering
- `TimelineEvents` - Event timelines with match context
- `PlayerStatsComparison` - Player benchmarking and comparison

**Light Consumers (1-2 atoms):**
- `HomePage` - Dashboard with summary statistics
- `PlayerList`, `TeamsList` - Pure presentation components
- Navigation components - Minimal atom usage for routing/state

---

## Performance & Optimization

### Multi-Level Caching Strategy

**1. Jotai's Built-in Atom Caching**
- Automatic dependency graph caching
- Prevents unnecessary re-computation of atom dependencies
- Efficient subscription management for UI updates

**2. Custom Hook Caching (`useStats`)**
```typescript
const statsAtomCache = new Map<string, Atom<...>>();
const cacheKey = JSON.stringify({ groupBy, filter, sortBy, sortDirection });

if (!statsAtomCache.has(cacheKey)) {
  statsAtomCache.set(cacheKey, createConfiguredStatsAtom(config));
}
```

**3. Component-level Memoization**
Strategic use of `useMemo` for expensive transformations and derived calculations.

### Lazy Evaluation & Initialization

**Smart Initialization Pattern:**
```typescript
const initializeListSummaryAtoms = () => {
  if (!playerListSummaryAtom) {
    try {
      playerListSummaryAtom = listSummaryAtoms.playerListSummaryAtom;
      // ... additional initialization with error handling
    } catch (error) {
      console.error("Failed to initialize summary atoms:", error);
    }
  }
};
```

### Post-Processing & Transformation Utilities

**Core Transformation Library:**
- **`playerMetricsUtils.ts`** - Filtering, grouping, derived metrics calculation
- **`getStatsAtom` function** - Central factory for configured stats atoms
- **`useAtomData` hook** - Abstraction for atom data access with error handling

**Transformation Pipeline:**
1. **Filtering**: `filterBaseAtom` applies category-based filters
2. **Role Dominance**: `onlyDominantRole` selects primary roles per player
3. **Grouping**: `groupByAtom` aggregates by specified categories
4. **Derived Metrics**: `addDerivedMetrics` calculates per-10-minute stats and percentages

---

## Dependency Graphs

### Critical Dependency Paths

**Core Data Pipeline:**
```
logFileInputAtom → logFileLoaderAtom → logFileParserAtom → Event Extractors → Analytics
```

**Most Complex Dependencies:**
- **`matchDataAtom`**: 6 direct dependencies (matchExtractor, matchStart, matchEnd, playerStat, mapTimes, roundEnd)
- **`playerStatsBaseAtom`**: Foundation for most analytics (30+ dependent atoms/components)
- **`teamfightsAtom`**: Complex analysis with multiple event sources

### Atom Family Dependencies

**Parameterized Data Access:**
```
playerComparisonAtomFamily(params) → getStatsAtom → averageMetric atoms
segmentStatsAtomFamily(params) → multiple event atoms + timeline atoms
contextualStatAtoms(params) → getStatsAtom → various context atoms
```

### Performance-Critical Paths

**High-Impact Atoms (Changes affect many components):**
1. `playerStatsBase.atom` - Affects all metrics views
2. `matchData.atom` - Affects all match-related displays
3. `uniqueCategoryValues.atom` - Affects all filter interfaces
4. Summary atoms - Affect dashboard and navigation

---

## Architectural Insights

### Design Strengths

**1. Excellent Separation of Concerns**
- Clear layer boundaries with specific responsibilities
- Raw data processing isolated from UI consumption
- Business logic contained within atoms, not components

**2. Atomic Granularity**
- Precise dependency tracking prevents unnecessary updates
- Individual events and calculations can be optimized independently
- Fine-grained reactivity for optimal UI performance

**3. Type-Safe Data Flows**
- Comprehensive TypeScript integration throughout atom layer
- Category vs numerical key separation ensures proper aggregation
- Parameterized types for atom families enable safe dynamic access

**4. Sophisticated Aggregation**
- SQL-like capabilities (GROUP BY, WHERE, ORDER BY) via `useStats`
- Multi-level derived metrics (base → per-10-min → percentages)
- Contextual data slicing through atom families

**5. Performance Optimization**
- Strategic caching at multiple levels
- Summary atoms provide optimized data shapes for UI
- Lazy evaluation prevents circular dependencies

### Design Patterns

**1. Event Sourcing Pattern**
- Raw events are preserved and never mutated
- All analytics derived from immutable event streams
- Enables replay, debugging, and alternative analysis paths

**2. Layered Architecture**
- Clear data transformation layers with defined interfaces
- Each layer has specific responsibilities and dependencies
- Enables independent testing and optimization

**3. Factory Pattern (Atom Families)**
- Parameterized atoms for contextual data access
- Dynamic atom creation with caching
- Type-safe parameter validation

**4. Observer Pattern (Jotai)**
- Reactive updates propagate through dependency graph
- Components automatically re-render on relevant data changes
- Efficient subscription management

### Scalability Considerations

**Strengths:**
- Atom dependency graphs prevent cascading updates
- Component prop patterns minimize unnecessary atom subscriptions
- Liberal use of derived atoms keeps raw data atoms stable
- Caching strategies handle increasing data volume

**Potential Concerns:**
- 68 atoms create complex dependency management
- Some atoms have broad dependency trees (e.g., `matchDataAtom`)
- Memory usage could grow with large numbers of matches
- Complex atom family caching strategies

---

## Recommendations

### Architecture Improvements

**1. Dependency Optimization**
- Consider splitting `matchDataAtom` into smaller, focused atoms
- Evaluate opportunity for lazy loading of less-critical analytics
- Implement atom cleanup for memory management with large datasets

**2. Performance Monitoring**
- Add instrumentation to track atom computation times
- Monitor memory usage patterns for atom families with large parameter spaces
- Consider implementing progressive loading for historical data

**3. Documentation & Tooling**
- Generate automated dependency graphs for visualization
- Create debugging tools for atom dependency tracking
- Implement atom testing utilities for complex dependency chains

### Code Organization

**1. Atom Grouping**
- Consider sub-modules within atoms directory for better organization
- Group related atoms (e.g., all ultimate-related atoms)
- Standardize naming conventions across atom families

**2. Type Safety Improvements**
- Strengthen parameter types for atom families
- Add runtime validation for critical atom parameters
- Implement better error handling for missing dependencies

**3. Testing & Validation**
- Ensure comprehensive test coverage for all 68 atoms
- Implement integration tests for complex dependency chains
- Add performance regression testing for critical atoms

### Future Enhancements

**1. Real-time Data Support**
- Architecture is well-positioned for real-time log streaming
- Atom granularity enables efficient incremental updates
- Consider WebSocket integration for live match analysis

**2. Advanced Analytics**
- Current foundation supports machine learning integration
- Player clustering and performance prediction capabilities
- Advanced statistical analysis and trend detection

**3. Multi-game Support**
- Atom architecture could extend to other esports games
- Generic event extraction patterns
- Configurable analytics pipelines

---

## Conclusion

The Scrimsight atom architecture represents a sophisticated and well-designed state management system. With 68 atoms organized into clear functional layers, it successfully transforms raw Overwatch log data into rich analytics and visualizations. The system demonstrates excellent separation of concerns, type safety, and performance optimization while maintaining flexibility for future enhancements.

The combination of atomic granularity, strategic caching, and powerful abstraction layers creates an efficient and maintainable foundation for complex esports analytics. The architecture's strengths significantly outweigh its complexity, providing a solid foundation for continued development and feature enhancement.

---

*This analysis was conducted on the Scrimsight codebase as of June 10, 2025. The system architecture demonstrates mature state management practices and sophisticated data flow design suitable for complex analytics applications.*