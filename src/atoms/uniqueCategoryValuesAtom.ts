import { atom, Getter } from 'jotai';
import { Metric } from '@library/metricUtils'; // Import Metric
import { 
  playerStatsBase, // Use the registered atom
  PlayerStatsCategoryKeys, 
  PlayerStatsBase, // Re-add PlayerStatsBase for typing
  PlayerStatsBaseNumericalKeys // Re-add PlayerStatsBaseNumericalKeys for typing
} from '@atoms'; 

/**
 * Pure function to extract unique values for each category key from player stats data.
 * This function can be tested independently.
 */
export const uniqueCategoryValuesAtomFn = async (
  get: Getter
): Promise<Record<PlayerStatsCategoryKeys, string[]>> => {
  const playerStatsBaseData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = await get(playerStatsBase.atom);
  const { rows, categoryKeys } = playerStatsBaseData;

  const uniqueValues: Record<PlayerStatsCategoryKeys, Set<string>> = {} as Record<PlayerStatsCategoryKeys, Set<string>>;

  // Initialize sets for each category key
  categoryKeys.forEach(key => {
    uniqueValues[key] = new Set<string>();
  });

  // Populate sets with unique values from rows
  rows.forEach(row => {
    categoryKeys.forEach(key => {
      if (row[key] !== undefined && row[key] !== null) {
        uniqueValues[key].add(row[key]);
      }
    });
  });

  // Convert sets to sorted arrays
  const result: Record<PlayerStatsCategoryKeys, string[]> = {} as Record<PlayerStatsCategoryKeys, string[]>;
  categoryKeys.forEach(key => {
    result[key] = Array.from(uniqueValues[key]).sort();
  });

  return result;
};

/**
 * Atom to get unique values for each category key, useful for filter dropdowns.
 * This is the default export.
 */
export default atom(async (get) => {
  return uniqueCategoryValuesAtomFn(get);
});
