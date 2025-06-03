import { type PlayerInteractionEvent, type MatchData } from '@atoms';

// Types previously defined here (PlayerTotals, PlayerInteraction, KillMatrixData)
// are now expected to be defined in or re-exported by src/atoms/index.ts.
// Local versions can be used if generateKillMatrixData's signature doesn't expose them,
// but KillMatrixData (the return type) IS exposed.
// For now, assume these types will be available from @atoms for the function signature.
import { type KillMatrixData, type PlayerTotals } from '@atoms'; // PlayerInteraction is internal to KillMatrixData

// Helper function
export const generateKillMatrixData = (
  matchId: string,
  allMatchData: MatchData[],
  allPlayerInteractionEvents: PlayerInteractionEvent[]
): KillMatrixData | null => {
  const match = allMatchData?.find((m) => m.matchId === matchId);
  const interactionsForMatch = allPlayerInteractionEvents?.filter((e) => e.matchId === matchId) ?? [];

  if (!match) {
    console.warn(`No match data found for matchId: ${matchId}`);
    return null;
  }

  const { team1Name, team2Name, team1Players, team2Players } = match;
  const allPlayers = [...team1Players, ...team2Players];

  if (allPlayers.length === 0 || interactionsForMatch.length === 0) {
    const emptyMatrix = Object.fromEntries(allPlayers.map(killer => 
      [killer, Object.fromEntries(allPlayers.map(victim => [victim, 0]))]
    ));
    const emptyTotals = Object.fromEntries(allPlayers.map(player => 
      [player, { kills: 0, deaths: 0 }]
    ));
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
};;

// Helper function
function createKillMatrix (
  interactions: { sourcePlayerName: string; targetPlayerName: string; value: number }[], // Simplified local PlayerInteraction
  players: string[]
): { [killer: string]: { [victim: string]: number } } {
  const matrix: { [killer: string]: { [victim: string]: number } } = {};

  players.forEach((killer) => {
    matrix[killer] = {};
    players.forEach((victim) => {
      matrix[killer][victim] = 0;
    });
  });

  interactions.forEach((interaction) => {
    if (matrix[interaction.sourcePlayerName] && matrix[interaction.sourcePlayerName][interaction.targetPlayerName] !== undefined) {
      matrix[interaction.sourcePlayerName][interaction.targetPlayerName] = interaction.value;
    } else {
      console.warn(`Player ${interaction.sourcePlayerName} or ${interaction.targetPlayerName} not found in initial player list for matrix creation.`);
    }
  });

  return matrix;
};

// Helper function
function transformPlayerInteractions (
  data: PlayerInteractionEvent[]
): { sourcePlayerName: string; sourceTeamName: string; targetPlayerName: string; value: number }[] { // Simplified local PlayerInteraction
  const interactions: {
    [key: string]: { sourcePlayerName: string; sourceTeamName: string; targetPlayerName: string; value: number };
  } = {};

  const kills = data.filter(
    (row) => row.playerInteractionEventType === "Killed player"
  );

  kills.forEach((row) => {
    const sourcePlayer = row.playerName;
    const targetPlayer = row.otherPlayerName;
    const interactionKey = `${sourcePlayer}-${targetPlayer}`;

    if (sourcePlayer === targetPlayer) {
      return;
    }

    if (!interactions[interactionKey]) {
      interactions[interactionKey] = {
        sourcePlayerName: sourcePlayer,
        sourceTeamName: row.playerTeam,
        targetPlayerName: targetPlayer,
        value: 0,
      };
    }
    interactions[interactionKey].value += 1;
  });

  return Object.values(interactions);
};

function calculatePlayerTotals (killMatrix: {
  [killer: string]: { [victim: string]: number };
}): { [player: string]: PlayerTotals } { // PlayerTotals here needs to be from @atoms
  const totals: { [player: string]: PlayerTotals } = {};
  const players = Object.keys(killMatrix);

  players.forEach((player) => {
    totals[player] = {
      kills: Object.values(killMatrix[player]).reduce(
        (sum, kills) => sum + kills,
        0
      ),
      deaths: players.reduce(
        (sum, killer) => sum + (killMatrix[killer]?.[player] ?? 0),
        0
      ),
    };
  });

  return totals;
}
