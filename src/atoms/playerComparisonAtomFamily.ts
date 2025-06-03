import { atom, Getter } from 'jotai'; // atom is used by atomFamily's callback
import { atomFamily } from 'jotai/utils';
import { getStatsAtom } from '@library'; // This is fine as it's from @library

// Imports from @atoms (will be from src/atoms/index.ts)
import {
  averageMetricPerRole, // This is the ScrimsightAtom wrapper
  averageMetricPerHero, // This is the ScrimsightAtom wrapper
  generatePlayerComparison,
  getPlayerStatsFilter,
  type PlayerComparisonParams, // Type for parameters
  type MetricComparison,       // Type for the result
  type AverageMetricPerRole,   // Type for role benchmarks
  type AverageMetricPerHeroType, // Type for hero benchmarks (assuming this is its name in index.ts)
  // Actually, index.ts exports AverageMetricPerHeroType
} from '@atoms';
import { Atom } from 'jotai'; // Import Atom type

// Default export the core atomFamily logic
export default atomFamily<PlayerComparisonParams, Atom<Promise<MetricComparison[]>>>( // Corrected atom to Atom
  (params: PlayerComparisonParams) =>
    atom(async (get: Getter): Promise<MetricComparison[]> => {
      const { playerName, heroName } = params;

      // 1. Get Player Stats
      // getPlayerStatsFilter and generatePlayerComparison are pure functions imported from @atoms (index.ts)
      const { groupByKeys, filter } = getPlayerStatsFilter(playerName, heroName);
      const playerStatsAtomInstance = getStatsAtom<typeof groupByKeys[number]>( // getStatsAtom is from @library
        [...groupByKeys],
        filter
      );
      const playerStatsData = await get(playerStatsAtomInstance); // This atom is dynamically created, not from ScrimsightAtom wrapper

      // 2. Get Benchmarks
      // averageMetricPerRole and averageMetricPerHero are ScrimsightAtom wrappers from @atoms (index.ts)
      const roleBenchmarksData: AverageMetricPerRole = await get(averageMetricPerRole.atom);
      const heroBenchmarksData: AverageMetricPerHeroType = await get(averageMetricPerHero.atom);

      // 3. Use pure logic function to generate comparisons
      return generatePlayerComparison(
        params,
        playerStatsData,
        roleBenchmarksData,
        heroBenchmarksData
      );
    }),
  (a: PlayerComparisonParams, b: PlayerComparisonParams) =>
    a.playerName === b.playerName && a.heroName === b.heroName // Equality check
);
