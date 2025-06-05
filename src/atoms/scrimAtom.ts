import { atom } from 'jotai';
import { MatchData, matchData, Scrim } from '@atoms';

export const scrimAtomFn = (allMatchData: MatchData[]): Scrim[] => {
  // group matches by date and teams
  const groupedMatches: Record<string, MatchData[]> = {};
  for (const match of allMatchData) {
    const key = `${match.dateString}-${match.team1Name}-${match.team2Name}`;
    if (!groupedMatches[key]) {
      groupedMatches[key] = [];
    }
    groupedMatches[key].push(match);
  }

  const scrims: Scrim[] = [];
  for (const key in groupedMatches) {
    const matches = groupedMatches[key];
    const team1Wins = matches.filter((match) => match.team1Score > match.team2Score).length;
    const team2Wins = matches.filter((match) => match.team2Score > match.team1Score).length;
    const draws = matches.filter((match) => match.team1Score === match.team2Score).length;
    const duration = matches.reduce((acc, match) => acc + match.duration, 0);
    const scrim = {
      dateString: matches[0].dateString,
      team1Name: matches[0].team1Name,
      team2Name: matches[0].team2Name,
      team1Players: matches[0].team1Players,
      team2Players: matches[0].team2Players,
      team1Wins,
      team2Wins,
      draws,
      duration,
      matchIds: matches.map((match) => match.matchId),
    };
    scrims.push(scrim);
  }
  return scrims;
};

export default atom<Promise<Scrim[]>>(async (get) => {
  const allMatchData = await get(matchData.atom);
  return scrimAtomFn(allMatchData);
});
