/**
 * Player comparison utility functions
 */

// Define parameter types for external use
export interface PlayerComparisonParams {
  playerName: string;
  heroName?: string; // Optional: Compare stats for a specific hero
}

export interface MetricComparison {
  metric: string; // Will be constrained by caller
  playerValue: number;
  benchmarkValue?: number; // Benchmark might not exist for all metrics/contexts
  benchmarkType: 'Role Average' | 'Hero Average' | 'N/A';
  delta?: number; // Difference between player and benchmark
  percentDifference?: number; // Percentage difference
}

/**
 * Function to determine filter for player stats based on player name and optional hero
 */
export function getPlayerStatsFilter(playerName: string, heroName?: string) {
  if (heroName) {
    const groupByKeys = ['playerName', 'playerHero'] as const;
    const filter: Record<typeof groupByKeys[number], string[]> = { 
      playerName: [playerName], 
      playerHero: [heroName] 
    };
    return { groupByKeys, filter };
  } else {
    const groupByKeys = ['playerName'] as const;
    const filter: Record<typeof groupByKeys[number], string[]> = { 
      playerName: [playerName] 
    };
    return { groupByKeys, filter };
  }
}

/**
 * Pure function to compare a player's stats against benchmarks
 * Generic implementation that works with any stats structure
 */
export function generatePlayerComparison<TStats, TNumericalKeys extends string>(
  params: PlayerComparisonParams,
  playerStatsData: {
    rows: TStats[];
  },
  roleBenchmarks: Record<string, Record<string, number>>,
  heroBenchmarks: Record<string, Record<string, number>>,
  numericalKeys: TNumericalKeys[],
  getPlayerName: (row: TStats) => string,
  getPlayerHero: (row: TStats) => string,
  getPlayerRole: (row: TStats) => string | undefined,
  getMetricValue: (row: TStats, metric: TNumericalKeys) => number
): MetricComparison[] {
  const { playerName, heroName } = params;

  // Find the specific player/hero row (should usually be just one)
  const playerRow = playerStatsData.rows.find(
    (row) => getPlayerName(row) === playerName && (!heroName || getPlayerHero(row) === heroName)
  );

  if (!playerRow) {
    return []; // Player/Hero stats not found for this context
  }

  // Determine player's primary role
  const playerRole = getPlayerRole(playerRow);

  // Compare Metrics
  const comparisons: MetricComparison[] = [];

  numericalKeys.forEach((metricKey) => {
    const playerValue = getMetricValue(playerRow, metricKey) ?? 0;

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
}