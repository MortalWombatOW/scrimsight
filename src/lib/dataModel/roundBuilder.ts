
import * as ScrimsightDataModel from "../ScrimsightDataModel";

export const buildRounds = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.Round[] => {
  const rounds: ScrimsightDataModel.Round[] = [];

  // Process each match to extract round information
  dataModel.matches.forEach(match => {
    match.rounds.forEach(roundNumber => {
      // Find round start and end events for this match and round
      const roundStart = dataModel.roundStart.find(event => 
        event.matchId === match.match && event.roundNumber === roundNumber
      );
      const roundEnd = dataModel.roundEnd.find(event => 
        event.matchId === match.match && event.roundNumber === roundNumber
      );

      if (roundStart && roundEnd) {
        // Determine winning team for this round
        const winningTeam = roundEnd.team1Score > roundEnd.team2Score 
          ? match.teams[0] 
          : roundEnd.team2Score > roundEnd.team1Score 
            ? match.teams[1] 
            : match.teams[0]; // Default to team1 in case of tie

        rounds.push({
          matchId: match.match,
          roundIndex: roundNumber,
          startTime: roundStart.matchTime,
          endTime: roundEnd.matchTime,
          duration: roundEnd.matchTime - roundStart.matchTime,
          team1Score: roundEnd.team1Score,
          team2Score: roundEnd.team2Score,
          winningTeam
        });
      }
    });
  });

  return rounds.sort((a, b) => {
    if (a.matchId !== b.matchId) {
      return a.matchId.localeCompare(b.matchId);
    }
    return a.roundIndex - b.roundIndex;
  });
};