import { atom } from 'jotai';
import { matchData, type MatchData } from '@atoms';
import type { TeamPlayersType } from '@atoms'; // Import as type-only

export default atom(async (get): Promise<TeamPlayersType[]> => {
  const matchDataValue = await get(matchData.atom); // Use registered atom
  const teamPlayersMap: Record<string, Set<string>> = {};

  matchDataValue.forEach((match: MatchData) => { // Add type for match
    if (!teamPlayersMap[match.team1Name]) {
      teamPlayersMap[match.team1Name] = new Set();
    }
    if (!teamPlayersMap[match.team2Name]) {
      teamPlayersMap[match.team2Name] = new Set();
    }
    match.team1Players.forEach(player => teamPlayersMap[match.team1Name].add(player));
    match.team2Players.forEach(player => teamPlayersMap[match.team2Name].add(player));
  });

  return Object.entries(teamPlayersMap).map(([teamName, playersSet]) => ({
    teamName,
    players: Array.from(playersSet),
  }));
});
