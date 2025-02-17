import { atom } from 'jotai';
import { MatchData, matchDataAtom } from './matchDataAtom';

export interface Scrim {
  dateString: string;
  team1Name: string;
  team2Name: string;
  team1Wins: number;
  team2Wins: number;
  draws: number;
  matchIds: string[];
  duration: number;
}

export const scrimAtom = atom<Promise<Scrim[]>>(async (get) => {
  // group matches by date and teams
  const matchData = await get(matchDataAtom);
  const groupedMatches: Record<string, MatchData[]> = {};
  for (const match of matchData) {
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
      team1Wins,
      team2Wins,
      draws,
      duration,
      matchIds: matches.map((match) => match.matchId),
    };
    scrims.push(scrim);
  }
  return scrims;
});
