import { atom } from 'jotai';
import { playerStatExtractorAtom } from './event_extractors/playerStatExtractorAtom';

/**
 * Interface for unique player names
 */
export interface UniquePlayerName {
  playerName: string;
}

/**
 * Atom that extracts unique player names from all matches
 */
export const uniquePlayerNamesAtom = atom(async (get): Promise<UniquePlayerName[]> => {
  const playerStats = await get(playerStatExtractorAtom);
  
  // Get unique player names
  const uniqueNames = Array.from(new Set(
    playerStats.map(stat => stat.playerName)
  ));

  return uniqueNames.map(name => ({ playerName: name }));
}); 