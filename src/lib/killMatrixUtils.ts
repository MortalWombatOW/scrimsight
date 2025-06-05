// Local type definitions for kill matrix utilities
export interface PlayerInteractionEvent {
  id: string;
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  otherPlayerName: string;
  playerInteractionEventTime: number;
  playerInteractionEventType: string;
  direction: 'incoming' | 'outgoing';
}

export interface PlayerTotals {
  kills: number;
  deaths: number;
}

export interface PlayerInteraction {
  sourcePlayerName: string;
  sourceTeamName: string;
  targetPlayerName: string;
  value: number;
}

// Helper function to transform raw events into player interactions
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

// Helper function to create a kill matrix from player interactions
export const createKillMatrix = (
  interactions: PlayerInteraction[],
  allPlayers: string[]
): { [killer: string]: { [victim: string]: number } } => {
  const matrix: { [killer: string]: { [victim: string]: number } } = {};

  // Initialize matrix with all players
  allPlayers.forEach((killer) => {
    matrix[killer] = {};
    allPlayers.forEach((victim) => {
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

// Helper function to calculate player totals from the kill matrix
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