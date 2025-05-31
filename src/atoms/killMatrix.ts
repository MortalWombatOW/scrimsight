import { PlayerInteractionEvent, MatchData } from "@atoms";

interface PlayerInteraction {
  sourcePlayerName: string;
  sourceTeamName: string;
  targetPlayerName: string;
  value: number;
}

interface PlayerTotals {
  kills: number;
  deaths: number;
}

export interface KillMatrixData {
  killMatrix: { [killer: string]: { [victim: string]: number } };
  playerTotals: { [player: string]: PlayerTotals };
  team1Players: string[];
  team2Players: string[];
  team1Name: string;
  team2Name: string;
  allPlayers: string[];
}

// Pure function to transform raw events into player interactions
export const transformPlayerInteractions = (
  data: PlayerInteractionEvent[]
): PlayerInteraction[] => {
  const interactions: {
    [key: string]: PlayerInteraction;
  } = {};

  const kills = data.filter(
    (row) => row.playerInteractionEventType === "Killed player"
  );

  kills.forEach((row) => {
    const sourcePlayer = row.playerName;
    const targetPlayer = row.otherPlayerName;
    const interactionKey = `${sourcePlayer}-${targetPlayer}`;

    // Ignore self-kills if necessary
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

// Pure function to create kill matrix from interactions
export const createKillMatrix = (
  interactions: PlayerInteraction[],
  players: string[]
): { [killer: string]: { [victim: string]: number } } => {
  const matrix: { [killer: string]: { [victim: string]: number } } = {};

  // Initialize matrix with zeros
  players.forEach((killer) => {
    matrix[killer] = {};
    players.forEach((victim) => {
      matrix[killer][victim] = 0;
    });
  });

  // Fill in kill counts
  interactions.forEach((interaction) => {
    // Ensure players exist in the matrix before assigning
    if (matrix[interaction.sourcePlayerName] && matrix[interaction.sourcePlayerName][interaction.targetPlayerName] !== undefined) {
      matrix[interaction.sourcePlayerName][interaction.targetPlayerName] = interaction.value;
    } else {
      // Handle cases where a player might not be in the initial player list (e.g., mid-match joiners if data allows)
      console.warn(`Player ${interaction.sourcePlayerName} or ${interaction.targetPlayerName} not found in initial player list for matrix creation.`);
    }
  });

  return matrix;
};

// Pure function to calculate player totals from the kill matrix
export const calculatePlayerTotals = (killMatrix: {
  [killer: string]: { [victim: string]: number };
}): { [player: string]: PlayerTotals } => {
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
};

// Main logic function that combines all the steps
export const generateKillMatrixData = (
  matchId: string,
  allMatchData: MatchData[],
  allPlayerInteractionEvents: PlayerInteractionEvent[]
): KillMatrixData | null => {
  // Find the match data
  const match = allMatchData?.find((m) => m.matchId === matchId);
  const interactionsForMatch = allPlayerInteractionEvents?.filter((e) => e.matchId === matchId) ?? [];

  if (!match) {
    console.warn(`No match data found for matchId: ${matchId}`);
    return null;
  }

  const { team1Name, team2Name, team1Players, team2Players } = match;
  const allPlayers = [...team1Players, ...team2Players];

  if (allPlayers.length === 0 || interactionsForMatch.length === 0) {
    // Return a default state if there are no players or interactions
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
};
