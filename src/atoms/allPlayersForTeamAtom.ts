import { atom } from 'jotai';
import { matchDataAtom } from './matchDataAtom';

export interface TeamPlayers {
  teamName: string;
  players: string[];
}

export const allPlayersForTeamAtom = atom(async (get): Promise<TeamPlayers[]> => {
  const matchData = await get(matchDataAtom);
  const teamPlayersMap: Record<string, Set<string>> = {};

  matchData.forEach(match => {
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