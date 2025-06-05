import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { MatchData, PlayerInteractionEvent, KillMatrixData, matchData, playerInteractionEvents } from '@atoms';
import { transformPlayerInteractions, createKillMatrix, calculatePlayerTotals } from '@library';

export const killMatrixFn = (
  matchId: string,
  allMatchData: MatchData[],
  allPlayerInteractionEvents: PlayerInteractionEvent[]
): KillMatrixData | null => {
  
  // Main logic
  const match = allMatchData?.find((m) => m.matchId === matchId);
  const interactionsForMatch = allPlayerInteractionEvents?.filter((e) => e.matchId === matchId) ?? [];

  if (!match) {
    console.warn(`No match data found for matchId: ${matchId}`);
    return null;
  }

  const { team1Name, team2Name, team1Players, team2Players } = match;
  const allPlayers = [...team1Players, ...team2Players];

  // Handle edge case: if no interactions, return empty matrix and totals
  if (interactionsForMatch.length === 0) {
    const emptyMatrix: { [killer: string]: { [victim: string]: number } } = {};
    allPlayers.forEach((killer) => {
      emptyMatrix[killer] = {};
      allPlayers.forEach((victim) => {
        emptyMatrix[killer][victim] = 0;
      });
    });

    const emptyTotals: { [player: string]: { kills: number; deaths: number } } = {};
    allPlayers.forEach((player) => {
      emptyTotals[player] = { kills: 0, deaths: 0 };
    });

    return {
      killMatrix: emptyMatrix,
      playerTotals: emptyTotals,
      team1Players,
      team2Players,
      team1Name,
      team2Name,
      allPlayers,
    };
  }

  const processedInteractions = transformPlayerInteractions(interactionsForMatch);
  const killMatrix = createKillMatrix(processedInteractions, allPlayers);
  const playerTotals = calculatePlayerTotals(killMatrix);

  return {
    killMatrix,
    playerTotals,
    team1Players,
    team2Players,
    team1Name,
    team2Name,
    allPlayers,
  };
};

export default atomFamily((matchId: string) =>
  atom(async (get): Promise<KillMatrixData | null> => {
    const allMatchData = await get(matchData.atom);
    const allPlayerInteractionEvents = await get(playerInteractionEvents.atom);
    
    return killMatrixFn(matchId, allMatchData, allPlayerInteractionEvents);
  })
);