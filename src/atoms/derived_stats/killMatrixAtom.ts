import { atom } from "jotai"; // Removed PrimitiveAtom
import { atomFamily } from "jotai/utils";
import {
  matchDataAtom,
  type MatchData, // Ensure this type represents the resolved data
  type PlayerInteractionEvent, // Ensure this type represents the resolved data
  playerInteractionEventsAtom,
} from "~/atoms";

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

interface KillMatrixData {
  killMatrix: { [killer: string]: { [victim: string]: number } };
  playerTotals: { [player: string]: PlayerTotals };
  team1Players: string[];
  team2Players: string[];
  team1Name: string;
  team2Name: string;
  allPlayers: string[];
}

// --- Logic moved from KillsTable.tsx ---

const transformPlayerInteractions = (
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

    // Ignore self-kills if necessary, though the original didn't explicitly filter team kills
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

const createKillMatrix = (
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
        // Or log a warning. For now, we'll assume players list is complete.
        console.warn(`Player ${interaction.sourcePlayerName} or ${interaction.targetPlayerName} not found in initial player list for matrix creation.`);
    }
  });

  return matrix;
};

const calculatePlayerTotals = (killMatrix: {
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
        (sum, killer) => sum + (killMatrix[killer]?.[player] ?? 0), // Added check for safety
        0
      ),
    };
  });

  return totals;
};

// --- Derived Atom Definition ---

export const killMatrixAtomFamily = atomFamily((matchId: string) =>
  // Make the derived atom async since its dependencies are async
  atom(async (get): Promise<KillMatrixData | null> => {
    // Await the resolution of the async base atoms
    const allMatchData = await get(matchDataAtom);
    const allPlayerInteractionEvents = await get(playerInteractionEventsAtom);

    // Add explicit types for callback parameters (good practice)
    const match = allMatchData?.find((m: MatchData) => m.matchId === matchId);
    const interactionsForMatch =
      allPlayerInteractionEvents?.filter((e: PlayerInteractionEvent) => e.matchId === matchId) ?? [];

    if (!match) {
      console.warn(`No match data found for matchId: ${matchId}`);
      return null; // Return null if match data isn't found
    }

    const { team1Name, team2Name, team1Players, team2Players } = match;
    const allPlayers = [...team1Players, ...team2Players];

    if (allPlayers.length === 0 || interactionsForMatch.length === 0) {
        // Return a default state if there are no players or interactions
        const emptyMatrix = Object.fromEntries(allPlayers.map(killer => [killer, Object.fromEntries(allPlayers.map(victim => [victim, 0]))]));
        const emptyTotals = Object.fromEntries(allPlayers.map(player => [player, { kills: 0, deaths: 0 }]));
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
  })
);
// Removed custom atomFamily helper, using the one from jotai/utils now.
