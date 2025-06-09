import { atom } from 'jotai';
import { matchStart, MatchStartType } from '@atoms';

export const teamNamesAtomFn = (matchStarts: MatchStartType): string[] => {
  // Get all team names (both team1 and team2)
  return Array.from(new Set([
    ...matchStarts.map(match => match.team1Name),
    ...matchStarts.map(match => match.team2Name)
  ]));
};

export default atom(async (get): Promise<string[]> => {
  const matchStarts = await get(matchStart.atom);
  return teamNamesAtomFn(matchStarts);
});
