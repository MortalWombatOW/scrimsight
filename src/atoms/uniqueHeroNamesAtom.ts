import { atom } from 'jotai';
import { 
  playerStatsBase, 
  PlayerStatsBase, 
  PlayerStatsCategoryKeys, 
  PlayerStatsBaseNumericalKeys 
} from '@atoms'; // Import the registered atom and types
import { Metric } from '@library';

/**
 * Pure function to get unique hero names.
 * This function can be tested independently.
 */
export const uniqueHeroNamesAtomFn = async (
  playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>
): Promise<string[]> => {
  const heroSet = new Set<string>();
  playerStatsData.rows.forEach(row => {
    if (row.playerHero) {
      heroSet.add(row.playerHero);
    }
  });
  return Array.from(heroSet).sort();
};

/**
 * Atom to get unique hero names.
 * This is the default export.
 */
export default atom(async (get): Promise<string[]> => {
  const playerStatsData = await get(playerStatsBase.atom); // Use the registered atom
  return uniqueHeroNamesAtomFn(playerStatsData);
});
