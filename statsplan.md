# Plan for Improving Data Model Building

## Current State Overview

The current data model computation follows a three-stage process:
1.  **Stage 1: Base Stats Collection (`PlayerStatsBase`)**: Raw, summable values (e.g., `eliminations`, `finalBlows`, `deaths`, `playtime`) are collected from `PlayerStatLogEvent` and `playerLives`.
2.  **Stage 2: Aggregation (`PlayerStatsAggregatedBase`)**: Base stats are summed up based on various grouping criteria (player, team, hero, etc.).
3.  **Stage 3: Derived Stats Computation (`PlayerStatsNumerical`)**: Ratios and per-time metrics (e.g., `kdr`, `eliminationsPer10Minutes`, `teamfightWinRate`) are calculated from the aggregated base stats.

The limitation of this approach is that derived metrics are only computed *after* aggregation. This prevents the aggregation of certain derived metrics (e.g., summing `teamfightsWon` across multiple players or heroes to get a total for a team or a specific hero across all players).

## Proposed New Data Flow

The new data flow will introduce an intermediate step for "derived measures" to allow for their aggregation.

1.  **Stage 1: Base Stats + Derived Measures Collection**:
    *   Collect raw, summable base stats.
    *   Calculate and include "derived measures" at this most granular level (e.g., per `PlayerStatLogEvent` or `PlayerLife`). These are values that can be meaningfully summed.
2.  **Stage 2: Aggregation**:
    *   Aggregate all stats collected in Stage 1 (base stats and derived measures) based on grouping criteria.
3.  **Stage 3: Derived Ratios Computation**:
    *   Calculate "derived ratios" from the aggregated data. These are values that are calculated by division and should not be summed directly.

## Categorization of Derived Stats

Here's the proposed categorization of existing `playerStatsDerivedNumericalKeys` into `Measures` and `Ratios`.

### Derived Measures (Summable)

These metrics represent counts or totals that can be meaningfully summed across different granularities (e.g., summing `ultKills` for all players on a team).

*   `ultsUsed`
*   `ultKills`
*   `teamfightsParticipated`
*   `teamfightsWithFirstKill`
*   `teamfightsWithFirstDeath`
*   `teamfightsWon`
*   `teamfightsWonWithUlt`
*   `teamfightsWonWithoutUlt`
*   `teamfightsWonWithFirstKill`
*   `teamfightsWonWithFirstDeath`
*   `deathsWithUltAvailable`
*   `tankKills`
*   `damageKills`
*   `supportKills`
*   `totalAssists`

### Derived Ratios (Non-Summable)

These metrics represent rates, percentages, or ratios that should *not* be summed directly. They must be re-calculated after aggregation.

*   `eliminationsPer10Minutes`
*   `finalBlowsPer10Minutes`
*   `deathsPer10Minutes`
*   `allDamageDealtPer10Minutes`
*   `barrierDamageDealtPer10Minutes`
*   `heroDamageDealtPer10Minutes`
*   `healingDealtPer10Minutes`
*   `healingReceivedPer10Minutes`
*   `selfHealingPer10Minutes`
*   `damageTakenPer10Minutes`
*   `damageBlockedPer10Minutes`
*   `defensiveAssistsPer10Minutes`
*   `offensiveAssistsPer10Minutes`
*   `ultimatesEarnedPer10Minutes`
*   `ultimatesUsedPer10Minutes`
*   `multikillsPer10Minutes`
*   `soloKillsPer10Minutes`
*   `objectiveKillsPer10Minutes`
*   `environmentalKillsPer10Minutes`
*   `environmentalDeathsPer10Minutes`
*   `criticalHitsPer10Minutes`
*   `shotsFiredPer10Minutes`
*   `shotsHitPer10Minutes`
*   `shotsMissedPer10Minutes`
*   `scopedShotsFiredPer10Minutes`
*   `scopedShotsHitPer10Minutes`
*   `weaponAccuracy`
*   `scopedWeaponAccuracy`
*   `criticalHitRate`
*   `killsPerUltimate`
*   `firstKillRate`
*   `firstDeathRate`
*   `teamfightWinRate`
*   `teamfightWinRateWithUlt`
*   `teamfightWinRateWithoutUlt`
*   `teamfightWinRateWithFirstKill`
*   `teamfightWinRateWithFirstDeath`
*   `ultimateChargeTime`
*   `ultimateHoldTime`
*   `ultimateUseTime`
*   `tankFocusRate`
*   `damageFocusRate`
*   `supportFocusRate`
*   `averageLifeDuration`
*   `totalAssistsPer10Minutes`
*   `damagePerKill`
*   `damageDonePerHealingReceived`
*   `kdr`

## Proposed Changes to TypeScript Typings (`src/lib/ScrimsightDataModel.ts`)

To reflect the new data flow, the following changes will be made to the TypeScript interfaces:

```typescript
// New types for categorization
export const playerStatsDerivedMeasuresKeys = [
  'ultsUsed',
  'ultKills',
  'teamfightsParticipated',
  'teamfightsWithFirstKill',
  'teamfightsWithFirstDeath',
  'teamfightsWon',
  'teamfightsWonWithUlt',
  'teamfightsWonWithoutUlt',
  'teamfightsWonWithFirstKill',
  'teamfightsWonWithFirstDeath',
  'deathsWithUltAvailable',
  'tankKills',
  'damageKills',
  'supportKills',
  'totalAssists',
] as const;
export type PlayerStatsDerivedMeasuresKeys = typeof playerStatsDerivedMeasuresKeys[number];

export const playerStatsDerivedRatiosKeys = [
  'eliminationsPer10Minutes',
  'finalBlowsPer10Minutes',
  'deathsPer10Minutes',
  'allDamageDealtPer10Minutes',
  'barrierDamageDealtPer10Minutes',
  'heroDamageDealtPer10Minutes',
  'healingDealtPer10Minutes',
  'healingReceivedPer10Minutes',
  'selfHealingPer10Minutes',
  'damageTakenPer10Minutes',
  'damageBlockedPer10Minutes',
  'defensiveAssistsPer10Minutes',
  'offensiveAssistsPer10Minutes',
  'ultimatesEarnedPer10Minutes',
  'ultimatesUsedPer10Minutes',
  'multikillsPer10Minutes',
  'soloKillsPer10Minutes',
  'objectiveKillsPer10Minutes',
  'environmentalKillsPer10Minutes',
  'environmentalDeathsPer10Minutes',
  'criticalHitsPer10Minutes',
  'shotsFiredPer10Minutes',
  'shotsHitPer10Minutes',
  'shotsMissedPer10Minutes',
  'scopedShotsFiredPer10Minutes',
  'scopedShotsHitPer10Minutes',
  'weaponAccuracy',
  'scopedWeaponAccuracy',
  'criticalHitRate',
  'killsPerUltimate',
  'firstKillRate',
  'firstDeathRate',
  'teamfightWinRate',
  'teamfightWinRateWithUlt',
  'teamfightWinRateWithoutUlt',
  'teamfightWinRateWithFirstKill',
  'teamfightWinRateWithFirstDeath',
  'ultimateChargeTime',
  'ultimateHoldTime',
  'ultimateUseTime',
  'tankFocusRate',
  'damageFocusRate',
  'supportFocusRate',
  'averageLifeDuration',
  'totalAssistsPer10Minutes',
  'damagePerKill',
  'damageDonePerHealingReceived',
  'kdr',
] as const;
export type PlayerStatsDerivedRatiosKeys = typeof playerStatsDerivedRatiosKeys[number];

// Update PlayerStatsDerivedNumericalKeys
export const playerStatsDerivedNumericalKeys = [
  ...playerStatsDerivedMeasuresKeys,
  ...playerStatsDerivedRatiosKeys,
] as const;
export type PlayerStatsDerivedNumericalKeys = typeof playerStatsDerivedNumericalKeys[number];

// Stage 1: Raw base stats with categorization info + Derived Measures
// This type will now include both base numerical keys and derived measures keys
export type PlayerStatsBase = {
  // Categorization fields (unchanged)
  matchId: MatchID;
  roundNumber: string;
  playerTeam: TeamName;
  playerName: PlayerName;
  playerHero: Hero;
  playerRole: Role;
} & Record<PlayerStatsBaseNumericalKeys | PlayerStatsDerivedMeasuresKeys, number>;

// Stage 2: Aggregated base stats (now includes aggregated derived measures)
export type PlayerStatsAggregatedBase = Record<PlayerStatsBaseNumericalKeys | PlayerStatsDerivedMeasuresKeys, number>;

// Stage 3: Final stats with derived ratios
export type PlayerStatsFinal = PlayerStatsAggregatedBase & Record<PlayerStatsDerivedRatiosKeys, number>;

// Helper interface for numerical stats only (used in intersection types)
// This will now be a union of base, derived measures, and derived ratios
export type PlayerStatsNumerical = Record<PlayerStatsBaseNumericalKeys | PlayerStatsDerivedMeasuresKeys | PlayerStatsDerivedRatiosKeys, number>;

// Update playerStatsNumericalKeys constant
export const playerStatsNumericalKeys = [
  ...playerStatsBaseNumericalKeys,
  ...playerStatsDerivedMeasuresKeys,
  ...playerStatsDerivedRatiosKeys,
] as PlayerStatsNumericalKeys[];
```

## Proposed Changes to Logic (`src/lib/buildDataModel.ts`)

The core logic within `buildDataModel.ts` will be modified to align with the new three-stage process.

### `buildPlayerStatBreakdown` Function

This function is the entry point for the three-stage computation.

#### STAGE 1: Base Stats + Derived Measures Collection

The `basePlayerStats` array will be enriched with derived measures. This requires access to `dataModel` (for `playerLives`, `teamfights`, `kill` events, etc.) at this granular level.

```typescript
// Inside buildPlayerStatBreakdown
const basePlayerStats: ScrimsightDataModel.PlayerStatsBase[] = R.pipe(
  dataModel.playerStat,
  R.map((statEvent): ScrimsightDataModel.PlayerStatsBase => {
    const playtime = calculatePlaytime(statEvent.matchId, statEvent.roundNumber, statEvent.playerName);

    // --- NEW: Calculate Derived Measures here ---
    // These calculations will need access to dataModel and the current statEvent's context
    // Example: teamfightsWon, ultKills, etc.
    // This will require passing dataModel and relevant context (matchId, playerName, etc.)
    // into a new helper function or directly calculating them here.

    // Placeholder for new derived measure calculations
    const ultsUsed = statEvent.ultimatesUsed; // Example: directly from statEvent

    // Refined Teamfight Measures Calculation:
    // We need to filter teamfights based on all available context (player, team, hero, role, match, scrim)
    const relevantTeamfightsForMeasures = R.filter(dataModel.teamfights, fight => {
      // Always filter by matchId if present in context
      if (statEvent.matchId && fight.matchId !== statEvent.matchId) return false;

      // If player context is available, check if the player participated in the teamfight
      if (statEvent.playerName) {
        const allParticipants = [...fight.start.team1.alivePlayers, ...fight.end.team1.kills, ...fight.start.team2.alivePlayers, ...fight.end.team2.kills];
        if (!allParticipants.includes(statEvent.playerName)) return false;

        // If playerHero or playerRole context is available, verify the player was playing that hero/role
        // during the teamfight's duration. This requires checking playerLives.
        if (statEvent.playerHero || statEvent.playerRole) {
          const playerLifeDuringFight = R.find(dataModel.playerLives, life =>
            life.player === statEvent.playerName &&
            life.matchId === fight.matchId &&
            life.startTime <= fight.endTime &&
            life.endTime >= fight.startTime &&
            (statEvent.playerHero ? life.hero === statEvent.playerHero : true) &&
            (statEvent.playerRole ? getRoleFromHero(life.hero) === statEvent.playerRole : true)
          );
          if (!playerLifeDuringFight) return false;
        }
      }

      // If playerTeam context is available, check if the team participated
      if (statEvent.playerTeam) {
        if (fight.start.team1.teamName !== statEvent.playerTeam &&
            fight.start.team2.teamName !== statEvent.playerTeam) return false;
      }

      // If scrim context is available, check if the teamfight belongs to the scrim
      // This requires linking matchId to scrimId, which is done via dataModel.matches
      if (statEvent.scrim) { // Assuming scrim is available in statEvent or can be derived
        const matchRelation = dataModel.matches.find(match => match.match === fight.matchId);
        if (matchRelation?.scrim !== statEvent.scrim) return false;
      }

      return true;
    });

    const teamfightsParticipated = relevantTeamfightsForMeasures.length;
    const teamfightsWon = R.filter(relevantTeamfightsForMeasures, fight => {
      // Determine if the player's team won the teamfight
      const playerTeamInFight = statEvent.playerTeam ||
        (fight.start.team1.alivePlayers.includes(statEvent.playerName) ? fight.start.team1.teamName : fight.start.team2.teamName);
      return fight.winner === playerTeamInFight;
    }).length;

    // ... and so on for all other derived measures that rely on teamfights
    // For example, teamfightsWonWithUlt, teamfightsWonWithFirstKill, etc.
    // These will also need to use relevantTeamfightsForMeasures and apply additional conditions.

    return {
      // Categorization fields (unchanged)
      matchId: statEvent.matchId,
      roundNumber: statEvent.roundNumber,
      playerTeam: statEvent.playerTeam,
      playerName: statEvent.playerName,
      playerHero: statEvent.playerHero,
      playerRole: getRoleFromHero(statEvent.playerHero),

      // Base numerical fields (unchanged)
      playtime,
      eliminations: statEvent.eliminations,
      finalBlows: statEvent.finalBlows,
      deaths: statEvent.deaths,
      allDamageDealt: statEvent.allDamageDealt,
      barrierDamageDealt: statEvent.barrierDamageDealt,
      heroDamageDealt: statEvent.heroDamageDealt,
      healingDealt: statEvent.healingDealt,
      healingReceived: statEvent.healingReceived,
      selfHealing: statEvent.selfHealing,
      damageTaken: statEvent.damageTaken,
      damageBlocked: statEvent.damageBlocked,
      defensiveAssists: statEvent.defensiveAssists,
      offensiveAssists: statEvent.offensiveAssists,
      ultimatesEarned: statEvent.ultimatesEarned,
      ultimatesUsed: statEvent.ultimatesUsed,
      multikills: statEvent.multikills,
      soloKills: statEvent.soloKills,
      objectiveKills: statEvent.objectiveKills,
      environmentalKills: statEvent.environmentalKills,
      environmentalDeaths: statEvent.environmentalDeaths,
      criticalHits: statEvent.criticalHits,
      shotsFired: statEvent.shotsFired,
      shotsHit: statEvent.shotsHit,
      shotsMissed: statEvent.shotsMissed,
      scopedShotsFired: statEvent.scopedShotsFired,
      scopedShotsHit: statEvent.scopedShotsHit,

      // --- NEW: Include Derived Measures here ---
      ultsUsed, // Example
      teamfightsParticipated, // Example
      teamfightsWon, // Example
      // ... all other derived measures
    };
  })
);
```

**New Helper Functions for Derived Measures (to be created/refactored):**

Many of the current calculations in `computeDerivedStats` that are now categorized as "measures" will need to be extracted into new helper functions that operate on the granular `statEvent` level and have access to the `dataModel`.

*   `calculateUltKills(dataModel, matchId, playerName, ultId)`
*   `calculateTeamfightsParticipated(dataModel, matchId, playerName, playerTeam, playerHero, playerRole)` (This will use the new filtering logic)
*   `calculateTeamfightsWon(dataModel, matchId, playerName, playerTeam, playerHero, playerRole)` (This will use the new filtering logic)
*   `calculateTeamfightsWonWithUlt(dataModel, matchId, playerName, playerTeam, playerHero, playerRole)`
*   `calculateTeamfightsWonWithoutUlt(...)`
*   `calculateTeamfightsWonWithFirstKill(...)`
*   `calculateTeamfightsWonWithFirstDeath(...)`
*   `calculateDeathsWithUltAvailable(...)`
*   `calculateTankKills(...)`, `calculateDamageKills(...)`, `calculateSupportKills(...)`
*   `calculateTotalAssists(...)` (if not already a base stat)

#### STAGE 2: Base Stats Aggregation

The `aggregateBaseStats` function will remain largely the same. It will now sum all numerical keys present in the `PlayerStatsBase` type, which will implicitly include the newly added derived measures.

```typescript
// Inside buildPlayerStatBreakdown
const aggregateBaseStats = (records: ScrimsightDataModel.PlayerStatsBase[]): ScrimsightDataModel.PlayerStatsAggregatedBase => {
  // This function will now sum all keys in PlayerStatsBase, which includes
  // both original base stats and the new derived measures.
  return R.pipe(
    [...ScrimsightDataModel.playerStatsBaseNumericalKeys, ...ScrimsightDataModel.playerStatsDerivedMeasuresKeys], // Updated keys
    R.map(key => [key, R.sumBy(records, record => record[key as keyof ScrimsightDataModel.PlayerStatsBase] as number)] as const),
    R.fromEntries()
  ) as ScrimsightDataModel.PlayerStatsAggregatedBase;
};
```

#### STAGE 3: Derived Ratios Computation

The `computeDerivedStats` function will be refactored to *only* calculate derived *ratios*. It will operate on the `aggregatedBase` data, which now contains the sums of base stats and derived measures.

```typescript
// Inside buildPlayerStatBreakdown
const computeDerivedStats = (
  aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase,
  dataModel: ScrimsightDataModel.ScrimsightDataModel, // Still needed for some context-dependent ratio calculations
  filterContext: { playerName?: string; playerTeam?: string; matchId?: string; playerHero?: ScrimsightDataModel.Hero; playerRole?: ScrimsightDataModel.Role; scrim?: string; }
): ScrimsightDataModel.PlayerStatsNumerical => {
  const playtimeMinutes = aggregatedBase.playtime / 60;
  const per10MinuteMultiplier = playtimeMinutes > 0 ? (10 * 60) / aggregatedBase.playtime : 0;

  // --- NEW: Only calculate Derived Ratios here ---

  // Per-10-minute metrics (rate calculations) - unchanged logic, but now uses aggregatedBase
  const eliminationsPer10Minutes = aggregatedBase.eliminations * per10MinuteMultiplier;
  // ... all other per-10-minute stats

  // Percentage/ratio metrics (accuracy calculations) - unchanged logic, but now uses aggregatedBase
  const weaponAccuracy = aggregatedBase.shotsFired > 0 ? (aggregatedBase.shotsHit / aggregatedBase.shotsFired) * 100 : 0;
  // ... all other accuracy stats

  // Ultimate-related derived ratios
  const killsPerUltimate = aggregatedBase.ultsUsed > 0 ? aggregatedBase.ultKills / aggregatedBase.ultsUsed : 0; // Now uses aggregated ultKills and ultsUsed
  const ultimateChargeTime = /* ... calculation using dataModel and filterContext ... */; // May need to be re-evaluated if it relies on granular events
  // ... other ultimate timing ratios

  // Teamfight ratios
  const teamfightWinRate = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWon / aggregatedBase.teamfightsParticipated : 0; // Uses aggregated measures
  // ... other teamfight win rates and first kill/death rates

  // Kill-by-role ratios
  const totalEliminations = aggregatedBase.eliminations;
  const tankFocusRate = totalEliminations > 0 ? aggregatedBase.tankKills / totalEliminations : 0; // Uses aggregated measures
  // ... other focus rates

  // Additional derived ratios
  const averageLifeDuration = /* ... calculation using dataModel and filterContext ... */; // May need re-evaluation
  const totalAssistsPer10Minutes = aggregatedBase.totalAssists * per10MinuteMultiplier; // Uses aggregated measure
  const damagePerKill = aggregatedBase.eliminations > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.eliminations : 0;
  const damageDonePerHealingReceived = aggregatedBase.healingReceived > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.healingReceived : 0;
  const kdr = aggregatedBase.deaths > 0 ? aggregatedBase.finalBlows / aggregatedBase.deaths : aggregatedBase.finalBlows;

  return {
    // Base stats and derived measures (from aggregatedBase)
    ...aggregatedBase,
    // Derived ratios (calculated here)
    eliminationsPer10Minutes,
    // ... all other derived ratios
  };
};
```

### Impact on `filterContext`

The `filterContext` parameter in `computeDerivedStats` will still be necessary for certain ratio calculations that require filtering the raw `dataModel` events (e.g., `ultimateChargeTime`, `averageLifeDuration`, which might still need to look at individual `playerLives` or `ultimateCharged` events within the specific context). However, many calculations will now directly use the aggregated values from `aggregatedBase`.

## Verification

After implementing these changes, thorough testing will be crucial:

*   **Unit Tests:** Ensure all new helper functions for derived measures are correctly calculating values at the granular level.
*   **Integration Tests:** Verify that the aggregation step correctly sums the new derived measures.
*   **End-to-End Tests:** Confirm that the final derived ratios are correctly calculated from the aggregated data and that all existing stats still display correctly in the UI.
*   **Type Checking:** Ensure all TypeScript types are consistent and no `any` or `as` assertions are introduced without strong justification.

This plan aims to improve the statistical soundness of the data model by allowing for meaningful aggregation of derived measures, while maintaining the correct calculation of ratios.