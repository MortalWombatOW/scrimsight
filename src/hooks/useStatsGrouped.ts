import { useMemo } from 'react';
import { useStatsWithDerived, StatsFilters } from './useStats';
import {
  PlayerStatsCategoryKeys,
  PlayerStatsBaseNumericalKeys,
  PlayerStatsDerivedNumericalKeys,
  PlayerStats,
  playerStatsBaseNumericalKeys,
  playerStatsDerivedNumericalKeys,
} from '../data/types';
import { PlayerStatKey } from '@library';

/**
 * Type representing grouped/aggregated player stats
 */
export type GroupedStats<G extends PlayerStatsCategoryKeys> = Pick<
  PlayerStats,
  G | PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys
>;

/**
 * Result from useStatsGrouped with metadata about grouping
 */
export interface GroupedStatsResult<G extends PlayerStatsCategoryKeys> {
  categoryKeys: G[];
  numericalKeys: (PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys)[];
  rows: GroupedStats<G>[];
}

/**
 * Groups player stats by specified category keys and aggregates numerical values.
 * Similar to the old groupByAtom functionality.
 *
 * @param groupBy - Array of category keys to group by (e.g., ['playerName'], ['playerName', 'playerHero'])
 * @param filter - Optional filters to apply before grouping
 * @param sortBy - Optional key to sort by (category or numerical)
 * @param sortDirection - Sort direction ('asc' or 'desc')
 * @returns Grouped and aggregated stats with metadata
 *
 * @example
 * // Group by player name to get per-player totals
 * const stats = useStatsGrouped(['playerName']);
 *
 * @example
 * // Group by player and hero to get per-player-per-hero stats
 * const stats = useStatsGrouped(['playerName', 'playerHero'], { playerTeam: 'Team A' });
 */
export function useStatsGrouped<G extends PlayerStatsCategoryKeys>(
  groupBy: G[],
  filter?: StatsFilters,
  sortBy?: PlayerStatsCategoryKeys | PlayerStatKey,
  sortDirection?: 'asc' | 'desc'
): GroupedStatsResult<G> {
  // Fetch base stats with derived metrics
  const allStats = useStatsWithDerived(filter);

  return useMemo(() => {
    if (allStats.length === 0 || groupBy.length === 0) {
      return {
        categoryKeys: groupBy,
        numericalKeys: [...playerStatsBaseNumericalKeys, ...playerStatsDerivedNumericalKeys],
        rows: [],
      };
    }

    // Group stats by the specified category keys
    const groupMap = new Map<string, PlayerStats[]>();

    for (const stat of allStats) {
      // Create unique key by joining all groupBy values
      const groupKey = groupBy.map((key) => stat[key]).join('|||');

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(stat);
    }

    // Aggregate each group
    const aggregatedRows: GroupedStats<G>[] = [];

    for (const group of groupMap.values()) {
      const aggregated: Partial<GroupedStats<G>> = {};

      // Copy category values from first row (they're all the same in this group)
      for (const categoryKey of groupBy) {
        (aggregated as any)[categoryKey] = group[0][categoryKey];
      }

      // Sum all base numerical values
      for (const numKey of playerStatsBaseNumericalKeys) {
        let sum = 0;
        for (const stat of group) {
          sum += stat[numKey];
        }
        (aggregated as any)[numKey] = sum;
      }

      // Recalculate derived metrics based on aggregated base stats
      const playtime = (aggregated as any).playtime || 0;
      const per10Min = playtime > 0 ? 600 / playtime : 0;

      (aggregated as any).eliminationsPer10Minutes = ((aggregated as any).eliminations || 0) * per10Min;
      (aggregated as any).finalBlowsPer10Minutes = ((aggregated as any).finalBlows || 0) * per10Min;
      (aggregated as any).deathsPer10Minutes = ((aggregated as any).deaths || 0) * per10Min;
      (aggregated as any).allDamageDealtPer10Minutes = ((aggregated as any).allDamageDealt || 0) * per10Min;
      (aggregated as any).barrierDamageDealtPer10Minutes = ((aggregated as any).barrierDamageDealt || 0) * per10Min;
      (aggregated as any).heroDamageDealtPer10Minutes = ((aggregated as any).heroDamageDealt || 0) * per10Min;
      (aggregated as any).healingDealtPer10Minutes = ((aggregated as any).healingDealt || 0) * per10Min;
      (aggregated as any).healingReceivedPer10Minutes = ((aggregated as any).healingReceived || 0) * per10Min;
      (aggregated as any).selfHealingPer10Minutes = ((aggregated as any).selfHealing || 0) * per10Min;
      (aggregated as any).damageTakenPer10Minutes = ((aggregated as any).damageTaken || 0) * per10Min;
      (aggregated as any).damageBlockedPer10Minutes = ((aggregated as any).damageBlocked || 0) * per10Min;
      (aggregated as any).defensiveAssistsPer10Minutes = ((aggregated as any).defensiveAssists || 0) * per10Min;
      (aggregated as any).offensiveAssistsPer10Minutes = ((aggregated as any).offensiveAssists || 0) * per10Min;
      (aggregated as any).ultimatesEarnedPer10Minutes = ((aggregated as any).ultimatesEarned || 0) * per10Min;
      (aggregated as any).ultimatesUsedPer10Minutes = ((aggregated as any).ultimatesUsed || 0) * per10Min;
      (aggregated as any).multikillsPer10Minutes = ((aggregated as any).multikills || 0) * per10Min;
      (aggregated as any).soloKillsPer10Minutes = ((aggregated as any).soloKills || 0) * per10Min;
      (aggregated as any).objectiveKillsPer10Minutes = ((aggregated as any).objectiveKills || 0) * per10Min;
      (aggregated as any).environmentalKillsPer10Minutes = ((aggregated as any).environmentalKills || 0) * per10Min;
      (aggregated as any).environmentalDeathsPer10Minutes = ((aggregated as any).environmentalDeaths || 0) * per10Min;
      (aggregated as any).criticalHitsPer10Minutes = ((aggregated as any).criticalHits || 0) * per10Min;
      (aggregated as any).shotsFiredPer10Minutes = ((aggregated as any).shotsFired || 0) * per10Min;
      (aggregated as any).shotsHitPer10Minutes = ((aggregated as any).shotsHit || 0) * per10Min;
      (aggregated as any).shotsMissedPer10Minutes = ((aggregated as any).shotsMissed || 0) * per10Min;
      (aggregated as any).scopedShotsFiredPer10Minutes = ((aggregated as any).scopedShotsFired || 0) * per10Min;
      (aggregated as any).scopedShotsHitPer10Minutes = ((aggregated as any).scopedShotsHit || 0) * per10Min;

      // Calculate accuracy metrics
      const shotsFired = (aggregated as any).shotsFired || 0;
      const scopedShotsFired = (aggregated as any).scopedShotsFired || 0;

      (aggregated as any).weaponAccuracy = shotsFired > 0
        ? ((aggregated as any).shotsHit || 0) / shotsFired
        : 0;
      (aggregated as any).scopedWeaponAccuracy = scopedShotsFired > 0
        ? ((aggregated as any).scopedShotsHit || 0) / scopedShotsFired
        : 0;
      (aggregated as any).criticalHitRate = shotsFired > 0
        ? ((aggregated as any).criticalHits || 0) / shotsFired
        : 0;

      aggregatedRows.push(aggregated as GroupedStats<G>);
    }

    // Sort if requested
    if (sortBy && aggregatedRows.length > 0) {
      const isNumerical = [...playerStatsBaseNumericalKeys, ...playerStatsDerivedNumericalKeys].includes(
        sortBy as any
      );

      aggregatedRows.sort((a, b) => {
        const valA = (a as any)[sortBy];
        const valB = (b as any)[sortBy];

        // Handle null/undefined
        if (valA == null && valB == null) return 0;
        if (valA == null) return sortDirection === 'asc' ? -1 : 1;
        if (valB == null) return sortDirection === 'asc' ? 1 : -1;

        let comparison = 0;
        if (isNumerical) {
          comparison = (valA as number) - (valB as number);
        } else {
          comparison = String(valA).localeCompare(String(valB));
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return {
      categoryKeys: groupBy,
      numericalKeys: [...playerStatsBaseNumericalKeys, ...playerStatsDerivedNumericalKeys],
      rows: aggregatedRows,
    };
  }, [allStats, groupBy, sortBy, sortDirection]);
}
