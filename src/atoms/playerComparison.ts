import { PlayerStatsNumericalKeys, playerStatsNumericalKeys, PlayerStats, PlayerStatsCategoryKeys } from '@atoms'; // Updated import
import { OverwatchRole } from '@library/hero'; // Updated import path
import { Metric, Grouped } from '@library/metricUtils'; // Added Grouped to import

// Define the parameters for the function
export interface PlayerComparisonParams {
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

/**
 * Pure function to compare a player's stats against benchmarks
 * 
 * @param params Player and hero to compare
 * @param playerStatsData The player's stats data
 * @param roleBenchmarks Average stats per role
 * @param heroBenchmarks Average stats per hero
 * @returns Array of metric comparisons
 */
export function generatePlayerComparison<T extends PlayerStatsCategoryKeys>(
  params: PlayerComparisonParams,
  playerStatsData: Metric<Grouped<PlayerStats, T, PlayerStatsNumericalKeys>, T, PlayerStatsNumericalKeys>,
  roleBenchmarks: Record<string, Record<string, number>>,
  heroBenchmarks: Record<string, Record<string, number>>
): MetricComparison[] {
  const { playerName, heroName } = params;

  // Find the specific player/hero row (should usually be just one)
  const playerRow = playerStatsData.rows.find(
    // Cast row to PlayerStats to access playerName and playerHero, as T might not include them
    (row) => (row as PlayerStats).playerName === playerName && (!heroName || (row as PlayerStats).playerHero === heroName)
  );

  if (!playerRow) {
    return []; // Player/Hero stats not found for this context
  }

  // Determine player's primary role
  // playerRole might not be in T, but it's added by onlyDominantRole and expected here.
  const playerRole = (playerRow as PlayerStats).playerRole as OverwatchRole | undefined;

  // Compare Metrics
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
