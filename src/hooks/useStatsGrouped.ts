import { useMemo } from 'react';
import { useStatsWithDerived, StatsFilters, addDerivedMetrics } from './useStats';
import {
  PlayerStatsCategoryKeys,
  PlayerStatsBaseNumericalKeys,
  PlayerStatsDerivedNumericalKeys,
  PlayerStats,
  PlayerStatsBase,
  playerStatsBaseNumericalKeys,
  playerStatsDerivedNumericalKeys,
} from '../types';
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

// Type-safe helper to get a value from an object with a dynamic key
function getStatValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Type-safe helper to set a value on an object with a dynamic key
function setStatValue(obj: Record<string, unknown>, key: string, value: unknown): void {
  obj[key] = value;
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

    // Aggregate each group - build base stats first, then derive
    const aggregatedRows: GroupedStats<G>[] = [];

    for (const group of groupMap.values()) {
      // Start with a base stats object
      const baseAggregated: Record<string, string | number> = {};

      // Copy category values from first row (they're all the same in this group)
      for (const categoryKey of groupBy) {
        setStatValue(baseAggregated, categoryKey, getStatValue(group[0], categoryKey));
      }

      // Add all category keys with default values (needed for PlayerStatsBase type)
      const allCategoryKeys: PlayerStatsCategoryKeys[] = [
        'matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'
      ];
      for (const catKey of allCategoryKeys) {
        if (!(catKey in baseAggregated)) {
          setStatValue(baseAggregated, catKey, group[0][catKey]);
        }
      }

      // Sum all base numerical values
      for (const numKey of playerStatsBaseNumericalKeys) {
        let sum = 0;
        for (const stat of group) {
          sum += getStatValue(stat, numKey);
        }
        setStatValue(baseAggregated, numKey, sum);
      }

      // Cast to PlayerStatsBase and add derived metrics
      const baseStatsArray = [baseAggregated as unknown as PlayerStatsBase];
      const withDerived = addDerivedMetrics(baseStatsArray)[0];

      aggregatedRows.push(withDerived as GroupedStats<G>);
    }

    // Sort if requested
    if (sortBy && aggregatedRows.length > 0) {
      const allNumericalKeys = [...playerStatsBaseNumericalKeys, ...playerStatsDerivedNumericalKeys];
      const isNumerical = allNumericalKeys.includes(sortBy as PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys);

      aggregatedRows.sort((a, b) => {
        const aRecord = a as Record<string, string | number>;
        const bRecord = b as Record<string, string | number>;
        const valA = aRecord[sortBy];
        const valB = bRecord[sortBy];

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
