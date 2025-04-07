import { atom } from 'jotai';
 import { atomFamily } from 'jotai/utils';
 import {
   getStatsAtom,
   // Removed unused: PlayerStats,
   PlayerStatsNumericalKeys,
   playerStatsNumericalKeys,
 } from '../metrics/playerMetricsAtoms';
import { averageMetricPerRoleAtom } from './averageMetricPerRoleAtom';
import { averageMetricPerHeroAtom } from './averageMetricPerHeroAtom';
import { OverwatchRole } from '../../lib/hero';

// Define the parameters for the atom family
interface PlayerComparisonParams {
  playerName: string;
  heroName?: string; // Optional: Compare stats for a specific hero
}

// Define the output structure for a single metric comparison
export interface MetricComparison {
  metric: PlayerStatsNumericalKeys;
  playerValue: number;
  benchmarkValue?: number; // Benchmark might not exist for all metrics/contexts
  benchmarkType: 'Role Average' | 'Hero Average' | 'N/A';
  delta?: number; // Difference between player and benchmark
  percentDifference?: number; // Percentage difference
}

// Atom family to compare player stats against benchmarks
export const playerComparisonAtomFamily = atomFamily(
  (params: PlayerComparisonParams) =>
    atom(async (get): Promise<MetricComparison[]> => {
      const { playerName, heroName } = params;

      // 1. Get Player Stats
      // Determine grouping based on whether a specific hero is requested
      const groupByKeys = heroName ? ['playerName', 'playerHero'] : ['playerName'];
      const filter = heroName
        ? { playerName: [playerName], playerHero: [heroName] }
        : { playerName: [playerName] };

      const playerStatsAtom = getStatsAtom(groupByKeys as any, filter as any); // Use 'as any' for simplicity with complex types
      const playerStatsData = await get(playerStatsAtom);

      // Find the specific player/hero row (should usually be just one)
      const playerRow = playerStatsData.rows.find(
        (row: any) => row.playerName === playerName && (!heroName || row.playerHero === heroName)
      );

      if (!playerRow) {
        return []; // Player/Hero stats not found for this context
      }

      // 2. Get Benchmarks
      const roleBenchmarks = await get(averageMetricPerRoleAtom);
      const heroBenchmarks = await get(averageMetricPerHeroAtom);

      // Determine player's primary role if comparing overall stats
      // For simplicity, we'll use the role from the playerRow if available,
      // otherwise, this might need a more robust role determination logic.
      const playerRole = playerRow.playerRole as OverwatchRole | undefined;

      // 3. Compare Metrics
      const comparisons: MetricComparison[] = [];

      playerStatsNumericalKeys.forEach((metricKey) => {
        const playerValue = playerRow[metricKey] ?? 0;

        let benchmarkValue: number | undefined = undefined;
        let benchmarkType: MetricComparison['benchmarkType'] = 'N/A';

        // Prioritize hero benchmark if heroName is provided
        if (heroName && heroBenchmarks[heroName]?.[metricKey] !== undefined) {
          benchmarkValue = heroBenchmarks[heroName]?.[metricKey];
          benchmarkType = 'Hero Average';
        }
        // Fallback to role benchmark if playerRole is known
        else if (playerRole && roleBenchmarks[playerRole]?.[metricKey] !== undefined) {
          benchmarkValue = roleBenchmarks[playerRole]?.[metricKey];
          benchmarkType = 'Role Average';
        }

        // Calculate differences if benchmark exists
        let delta: number | undefined = undefined;
        let percentDifference: number | undefined = undefined;
        if (benchmarkValue !== undefined && Number.isFinite(playerValue) && Number.isFinite(benchmarkValue)) {
           delta = playerValue - benchmarkValue;
           if (benchmarkValue !== 0) {
               percentDifference = (delta / benchmarkValue) * 100;
           } else if (playerValue !== 0) {
               percentDifference = Infinity; // Or handle as a special case
           } else {
               percentDifference = 0;
           }
        }


        comparisons.push({
          metric: metricKey,
          playerValue: Number.isFinite(playerValue) ? playerValue : 0, // Ensure finite value
          benchmarkValue: benchmarkValue !== undefined && Number.isFinite(benchmarkValue) ? benchmarkValue : undefined,
          benchmarkType,
          delta: delta !== undefined && Number.isFinite(delta) ? delta : undefined,
          percentDifference: percentDifference !== undefined && Number.isFinite(percentDifference) ? percentDifference : undefined,
        });
      });

      return comparisons;
    }),
  (a: PlayerComparisonParams, b: PlayerComparisonParams) =>
    a.playerName === b.playerName && a.heroName === b.heroName // Equality check
);
