import { atom } from 'jotai';
import { teamPlayers, matchData, TeamPlayersType, MatchData, TeamStats } from '@atoms';

export const teamStatsAtomFn = (
  allPlayers: TeamPlayersType[],
  allMatchData: MatchData[]
): TeamStats[] => {
  // Process each team to gather stats
  return allPlayers.map((team) => {
    const teamMatches = allMatchData.filter((match) =>
      match.team1Name === team.teamName || match.team2Name === team.teamName
    );

    const gamesPlayed = teamMatches.length;
    const wins = teamMatches.filter((match) =>
      (match.team1Name === team.teamName && match.team1Score > match.team2Score) ||
      (match.team2Name === team.teamName && match.team2Score > match.team1Score)
    ).length;
    const losses = teamMatches.filter((match) =>
      (match.team1Name === team.teamName && match.team1Score < match.team2Score) ||
      (match.team2Name === team.teamName && match.team2Score < match.team1Score)
    ).length;
    const draws = teamMatches.filter((match) =>
      match.team1Score === match.team2Score
    ).length;
    const mostRecentGameDate = teamMatches.reduce((latest: Date, match) => {
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
};

export default atom(async (get) => {
  const allPlayers = await get(teamPlayers.atom);
  const allMatchData = await get(matchData.atom);
  
  return teamStatsAtomFn(allPlayers, allMatchData);
}); 
