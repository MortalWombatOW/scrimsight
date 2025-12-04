import { Scrim, MatchMetadata, ProcessedMatch } from '../types';

export function detectScrims(matches: ProcessedMatch[]): Scrim[] {
  const allMatchData = matches.map((m) => m.metadata);

  const groupedMatches: Record<string, MatchMetadata[]> = {};

  for (const match of allMatchData) {
    const key = `${match.dateString}-${match.team1Name}-${match.team2Name}`;
    if (!groupedMatches[key]) {
      groupedMatches[key] = [];
    }
    groupedMatches[key].push(match);
  }

  const scrims: Scrim[] = [];

  for (const key in groupedMatches) {
    const matchGroup = groupedMatches[key];
    const team1Wins = matchGroup.filter((match) => match.team1Score > match.team2Score).length;
    const team2Wins = matchGroup.filter((match) => match.team2Score > match.team1Score).length;
    const draws = matchGroup.filter((match) => match.team1Score === match.team2Score).length;
    const duration = matchGroup.reduce((acc, match) => acc + match.duration, 0);

    const scrim: Scrim = {
      dateString: matchGroup[0].dateString,
      team1Name: matchGroup[0].team1Name,
      team2Name: matchGroup[0].team2Name,
      team1Players: matchGroup[0].team1Players,
      team2Players: matchGroup[0].team2Players,
      team1Wins,
      team2Wins,
      draws,
      duration,
      matchIds: matchGroup.map((match) => match.matchId),
    };
    scrims.push(scrim);
  }

  return scrims;
}
