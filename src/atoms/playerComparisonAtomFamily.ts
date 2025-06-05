import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { getStatsAtom, getPlayerStatsFilter } from '@library';
import { 
  averageMetricPerRole, 
  averageMetricPerHero, 
  PlayerComparisonParams, 
  MetricComparison,
  playerStatsNumericalKeys,
  OverwatchRole
} from '@atoms';

// Atom family to compare player stats against benchmarks
export default atomFamily(
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
      const roleBenchmarks = await get(averageMetricPerRole.atom);
      const heroBenchmarks = await get(averageMetricPerHero.atom);

      // 3. Find the specific player/hero row
      const playerRow = playerStatsData.rows.find(
        (row) => 'playerName' in row && row.playerName === playerName && (!heroName || ('playerHero' in row && row.playerHero === heroName))
      );

      if (!playerRow) {
        return []; // Player/Hero stats not found for this context
      }

      // Determine player's primary role
      const playerRole = ('playerRole' in playerRow ? playerRow.playerRole : undefined) as OverwatchRole | undefined;

      // Compare Metrics
      const comparisons: MetricComparison[] = [];

      playerStatsNumericalKeys.forEach((metricKey) => {
        const playerValue = (metricKey in playerRow ? playerRow[metricKey] : 0) as number;

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
            percentDifference = Infinity;
          } else {
            percentDifference = 0;
          }
        }

        comparisons.push({
          metric: metricKey,
          playerValue: Number.isFinite(playerValue) ? playerValue : 0,
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
