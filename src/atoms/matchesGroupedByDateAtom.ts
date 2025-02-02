import { atom } from 'jotai';
import { matchDataAtom } from './matchDataAtom';

/**
 * Interface for matches grouped by date
 */
export interface MatchesGroupedByDate {
  dateString: string;
  matchIds: string[];
}

/**
 * Atom that groups matches by date
 */
export const matchesGroupedByDateAtom = atom(async (get): Promise<MatchesGroupedByDate[]> => {
  const matches = await get(matchDataAtom);
  
  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.dateString]) {
      acc[match.dateString] = [];
    }
    acc[match.dateString].push(match.matchId);
    return acc;
  }, {} as Record<string, string[]>);

  // Convert to array format
  return Object.entries(groupedMatches).map(([dateString, matchIds]) => ({
    dateString,
    matchIds
  }));
}); 