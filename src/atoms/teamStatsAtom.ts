import { Atom, atom } from 'jotai';
import { allPlayersForTeamAtom } from './allPlayersForTeamAtom';
import { matchDataAtom } from './matchDataAtom';
import { TeamPlayers } from './allPlayersForTeamAtom';
import { MatchData } from './matchDataAtom';

// Define the interface for team stats
export interface TeamStats {
  teamName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  mostRecentGameDate: Date | null;
  players: string[];
}

// Create the team stats atom
export const teamStatsAtom: Atom<Promise<TeamStats[]>> = atom(async (get) => {
  const allPlayers = await get(allPlayersForTeamAtom);
  const matchData = await get(matchDataAtom);

  // Process each team to gather stats
  return allPlayers.map((team: TeamPlayers) => {
    const teamMatches = matchData.filter((match: MatchData) =>
      match.team1Name === team.teamName || match.team2Name === team.teamName
    );

    const gamesPlayed = teamMatches.length;
    const wins = teamMatches.filter((match: MatchData) =>
      (match.team1Name === team.teamName && match.team1Score > match.team2Score) ||
      (match.team2Name === team.teamName && match.team2Score > match.team1Score)
    ).length;
    const losses = gamesPlayed - wins;
    const draws = teamMatches.filter((match: MatchData) =>
      match.team1Score === match.team2Score
    ).length;
    const mostRecentGameDate = teamMatches.reduce((latest: Date, match: MatchData) => {
      const matchDate = new Date(match.dateString);
      return matchDate > latest ? matchDate : latest;
    }, new Date(0));

    return {
      teamName: team.teamName,
      gamesPlayed,
      wins,
      losses,
      draws,
      mostRecentGameDate: mostRecentGameDate.getTime() === 0 ? null : mostRecentGameDate,
      players: team.players,
    };
  });
}); 
