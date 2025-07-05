
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import * as R from "remeda";

export const buildMatchRelationships = (dataModel: ScrimsightDataModel.ScrimsightDataModel, parsedFiles: {matchId: string, fileModified: number}[]): ScrimsightDataModel.MatchRelationships[] => {
  const scrimByMatchId = R.pipe(
    dataModel.scrims,
    R.flatMap(scrim => R.map(scrim.matches, matchId => ({ matchId, scrim }))),
    R.indexBy(item => item.matchId)
  );

  return R.pipe(
    dataModel.matchStart,
    R.map(matchStart => {
      const parsedFile = parsedFiles.find(f => f.matchId === matchStart.matchId);
      const scrimInfo = scrimByMatchId[matchStart.matchId];
      
      const rounds = R.pipe(
        [...dataModel.roundStart, ...dataModel.roundEnd],
        R.filter(event => event.matchId === matchStart.matchId),
        R.map(event => event.roundNumber as ScrimsightDataModel.RoundNumber),
        R.unique(),
        R.sortBy(x => x)
      );

      // Calculate match duration by summing individual round durations (excluding time between rounds)
      const roundStarts = R.pipe(
        dataModel.roundStart,
        R.filter(event => event.matchId === matchStart.matchId),
        R.sortBy(event => event.matchTime),
        R.indexBy(event => event.roundNumber)
      );
      
      const roundEnds = R.pipe(
        dataModel.roundEnd,
        R.filter(event => event.matchId === matchStart.matchId),
        R.sortBy(event => event.matchTime),
        R.indexBy(event => event.roundNumber)
      );

      const duration = R.pipe(
        rounds,
        R.map(roundNumber => {
          const roundStart = roundStarts[roundNumber];
          const roundEnd = roundEnds[roundNumber];
          return (roundStart && roundEnd) ? roundEnd.matchTime - roundStart.matchTime : 0;
        }),
        R.sum()
      );

      // Get final scores from match end event or last round end event
      const matchEnd = dataModel.matchEnd.find(event => event.matchId === matchStart.matchId);
      const lastRoundEnd = R.pipe(
        dataModel.roundEnd,
        R.filter(event => event.matchId === matchStart.matchId),
        R.sortBy(event => event.matchTime),
        R.last()
      );

      const team1Score = matchEnd?.team1Score ?? lastRoundEnd?.team1Score ?? 0;
      const team2Score = matchEnd?.team2Score ?? lastRoundEnd?.team2Score ?? 0;

      // Determine winning team
      const winningTeam = team1Score > team2Score 
        ? matchStart.team1Name 
        : team2Score > team1Score 
          ? matchStart.team2Name 
          : matchStart.team1Name; // Default to team1 in case of tie

      return {
        match: matchStart.matchId,
        scrim: scrimInfo?.scrim.scrim || `unknown-scrim-${matchStart.matchId}`,
        teams: [matchStart.team1Name, matchStart.team2Name] as [ScrimsightDataModel.TeamName, ScrimsightDataModel.TeamName],
        map: matchStart.mapName,
        date: new Date(parsedFile?.fileModified || 0),
        rounds,
        duration,
        team1Score,
        team2Score,
        winningTeam,
        gameMode: matchStart.mapType
      };
    })
  );
};