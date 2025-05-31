import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { getStatsAtom } from '@library/playerMetricsUtils'; // Updated import path
import averageMetricPerRoleAtom from '@atoms/averageMetricPerRoleAtom'; // Updated import path
import averageMetricPerHeroAtom from '@atoms/averageMetricPerHeroAtom'; // Updated import path
import { 
  generatePlayerComparison, 
  getPlayerStatsFilter,
  type PlayerComparisonParams,
  type MetricComparison
} from '@atoms/playerComparison'; // Updated import path

// Atom family to compare player stats against benchmarks
export const playerComparisonAtomFamily = atomFamily(
  (params: PlayerComparisonParams) =>
    atom(async (get): Promise<MetricComparison[]> => {
      const { playerName, heroName } = params;

      // 1. Get Player Stats
      const { groupByKeys, filter } = getPlayerStatsFilter(playerName, heroName);
      const playerStatsAtom = getStatsAtom<typeof groupByKeys[number]>(
        [...groupByKeys], // Spread to make it a mutable array
        filter
      );
      const playerStatsData = await get(playerStatsAtom);

      // 2. Get Benchmarks
      const roleBenchmarks = await get(averageMetricPerRoleAtom);
      const heroBenchmarks = await get(averageMetricPerHeroAtom);

      // 3. Use pure logic function to generate comparisons
      return generatePlayerComparison(
        params,
        playerStatsData,
        roleBenchmarks,
        heroBenchmarks
      );
    }),
  (a: PlayerComparisonParams, b: PlayerComparisonParams) =>
    a.playerName === b.playerName && a.heroName === b.heroName // Equality check
);
