import { atom } from 'jotai';
import { matchStart } from '@atoms';
import { MatchStartType } from '@atoms'; // Import MatchStartType

/**
 * Pure function that extracts unique map names from all matches
 */
export const uniqueMapNamesFn = (matchStarts: MatchStartType): string[] => {
  // Get unique map names
  const uniqueNames = Array.from(new Set(
    matchStarts.map(match => match.mapName)
  ));

  return uniqueNames;
};

/**
 * Atom that extracts unique map names from all matches
 */
export default atom(async (get): Promise<string[]> => {
  const matchStartsData = await get(matchStart.atom);
  return uniqueMapNamesFn(matchStartsData);
});
