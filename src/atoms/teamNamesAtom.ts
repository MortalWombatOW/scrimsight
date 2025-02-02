import { atom } from 'jotai';
import { matchStartExtractorAtom } from './matchStartExtractorAtom';

/**
 * Interface for team names
 */
export interface TeamName {
  teamName: string;
}

/**
 * Atom that extracts all team names from matches
 */
export const teamNamesAtom = atom(async (get): Promise<TeamName[]> => {
  const matchStarts = await get(matchStartExtractorAtom);
  
  // Get all team names (both team1 and team2)
  return [
    ...matchStarts.map(match => ({ teamName: match.team1Name })),
    ...matchStarts.map(match => ({ teamName: match.team2Name }))
  ];
});

/**
 * Atom that extracts unique team names from matches
 */
export const uniqueTeamNamesAtom = atom(async (get): Promise<TeamName[]> => {
  const teamNames = await get(teamNamesAtom);
  
  // Get unique team names
  const uniqueNames = Array.from(new Set(
    teamNames.map(team => team.teamName)
  ));

  return uniqueNames.map(name => ({ teamName: name }));
}); 