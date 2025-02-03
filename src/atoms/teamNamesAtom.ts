import { atom } from 'jotai';
import { matchStartExtractorAtom } from './matchStartExtractorAtom';


/**
 * Atom that extracts all team names from matches
 */
export const teamNamesAtom = atom(async (get): Promise<string[]> => {
  const matchStarts = await get(matchStartExtractorAtom);
  
  // Get all team names (both team1 and team2)
  return Array.from(new Set([
    ...matchStarts.map(match => match.team1Name),
    ...matchStarts.map(match => match.team2Name)
  ]));
});
