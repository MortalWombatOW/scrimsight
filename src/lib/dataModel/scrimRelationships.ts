
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import * as R from "remeda";

export const groupMatchesIntoScrims = (dataModel: ScrimsightDataModel.ScrimsightDataModel, parsedFiles: {matchId: string, fileModified: number, team1Name: string, team2Name: string}[]): ScrimsightDataModel.ScrimRelationships[] => {
  const matchesWithDate = R.pipe(
    dataModel.matchStart,
    R.map(matchStart => {
      const parsedFile = parsedFiles.find(f => f.matchId === matchStart.matchId);
      const date = new Date(parsedFile!.fileModified);
      const dateString = date.toISOString().split('T')[0];
      return {
        matchId: matchStart.matchId,
        dateString,
        team1Name: matchStart.team1Name,
        team2Name: matchStart.team2Name,
        fileModified: parsedFile!.fileModified
      };
    }),
    R.sortBy(match => match.fileModified)
  );

  const scrimGroups = R.pipe(
    matchesWithDate,
    R.groupBy(match => `${match.dateString}-${match.team1Name}-${match.team2Name}`),
    R.mapValues(matches => R.map(matches, m => m.matchId))
  );

  return R.pipe(
    scrimGroups,
    R.entries(),
    R.map(([scrimId, matchIds]) => {
      const firstMatch = matchesWithDate.find(m => m.matchId === matchIds[0])!;
      
      // Calculate team1MatchesWon and team2MatchesWon by counting wins per team
      let team1MatchesWon = 0;
      let team2MatchesWon = 0;
      
      matchIds.forEach(matchId => {
        // Get final scores from match end event or last round end event
        const matchEnd = dataModel.matchEnd.find(event => event.matchId === matchId);
        const lastRoundEnd = R.pipe(
          dataModel.roundEnd,
          R.filter(event => event.matchId === matchId),
          R.sortBy(event => event.matchTime),
          R.last()
        );

        const team1Score = matchEnd?.team1Score ?? lastRoundEnd?.team1Score ?? 0;
        const team2Score = matchEnd?.team2Score ?? lastRoundEnd?.team2Score ?? 0;

        // Determine winning team and increment count
        if (team1Score > team2Score) {
          team1MatchesWon++;
        } else if (team2Score > team1Score) {
          team2MatchesWon++;
        } else {
          // In case of tie, award to team1 (consistent with match winner logic)
          team1MatchesWon++;
        }
      });
      
      return {
        scrim: scrimId,
        teams: [firstMatch.team1Name, firstMatch.team2Name] as [ScrimsightDataModel.TeamName, ScrimsightDataModel.TeamName],
        matches: matchIds,
        date: new Date(firstMatch.dateString),
        team1MatchesWon,
        team2MatchesWon
      };
    })
  );
};