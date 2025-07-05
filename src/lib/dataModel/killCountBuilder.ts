
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import * as R from "remeda";

export const buildKillCounts = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.ScrimsightDataModel['killCounts'] => {
  // Helper function to get round number for a kill event
  const getRoundNumber = (matchId: string, eventTime: number): ScrimsightDataModel.RoundNumber => {
    const roundStarts = R.pipe(
      dataModel.roundStart,
      R.filter(r => r.matchId === matchId),
      R.sortBy(r => r.matchTime)
    );
    
    const activeRound = R.findLast(roundStarts, r => r.matchTime <= eventTime);
    return (activeRound?.roundNumber || 1) as ScrimsightDataModel.RoundNumber;
  };

  // Build kill counts by match
  const killCountsByMatch = R.pipe(
    dataModel.kill,
    R.groupBy(kill => `${kill.matchId}|${kill.attackerName}|${kill.victimName}`),
    R.entries(),
    R.map(([key, killEvents]) => {
      const [matchId, attackerName, victimName] = key.split('|');
      return {
        matchId,
        player: attackerName,
        victim: victimName,
        killCount: killEvents.length
      };
    })
  );

  // Build kill counts by match and round
  const killCountsByMatchAndRound = R.pipe(
    dataModel.kill,
    R.map(kill => ({
      ...kill,
      roundNumber: getRoundNumber(kill.matchId, kill.matchTime)
    })),
    R.groupBy(kill => `${kill.matchId}|${kill.roundNumber}|${kill.attackerName}|${kill.victimName}`),
    R.entries(),
    R.map(([key, killEvents]) => {
      const [matchId, roundNumber, attackerName, victimName] = key.split('|');
      return {
        matchId,
        roundNumber: parseInt(roundNumber) as ScrimsightDataModel.RoundNumber,
        player: attackerName,
        victim: victimName,
        killCount: killEvents.length
      };
    })
  );

  return {
    byMatch: killCountsByMatch,
    byMatchAndRound: killCountsByMatchAndRound
  };
};