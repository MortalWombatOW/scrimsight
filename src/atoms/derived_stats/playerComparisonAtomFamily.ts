import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { getStatsAtom } from '../metrics/playerMetricsAtoms';
import { averageMetricPerRoleAtom } from './averageMetricPerRoleAtom';
import { averageMetricPerHeroAtom } from './averageMetricPerHeroAtom';
import { 
  generatePlayerComparison, 
  getPlayerStatsFilter,
  type PlayerComparisonParams,
  type MetricComparison
} from './playerComparison';

// Atom family to compare player stats against benchmarks
export const playerComparisonAtomFamily = atomFamily(
  (params: PlayerComparisonParams) =>
    atom(async (get): Promise<MetricComparison[]> => {
      const { playerName, heroName } = params;

      // 1. Get Player Stats
      const { groupByKeys, filter } = getPlayerStatsFilter(playerName, heroName);
      const playerStatsAtom = getStatsAtom(groupByKeys as any, filter as any);
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