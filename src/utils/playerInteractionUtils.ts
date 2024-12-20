import { PlayerInteractionEvent } from '../components/MapTimeline/types/timeline.types';

export interface PlayerInteraction {
  sourcePlayerName: string;
  sourceTeamName: string;
  targetPlayerName: string;
  value: number;
}

export interface PlayerTotals {
  kills: number;
  deaths: number;
}

export const transformPlayerInteractions = (data: PlayerInteractionEvent[]): PlayerInteraction[] => {
  const interactions: {
    [key: string]: PlayerInteraction;
  } = {};

  const kills = data.filter((row) => row.playerInteractionEventType === 'Killed player');

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

export const createKillMatrix = (
  interactions: PlayerInteraction[], 
  players: string[]
): { [killer: string]: { [victim: string]: number } } => {
  const matrix: { [killer: string]: { [victim: string]: number } } = {};
  
  // Initialize matrix with zeros
  players.forEach(killer => {
    matrix[killer] = {};
    players.forEach(victim => {
      matrix[killer][victim] = 0;
    });
  });

  // Fill in kill counts
  interactions.forEach(interaction => {
    matrix[interaction.sourcePlayerName][interaction.targetPlayerName] = interaction.value;
  });

  return matrix;
};

export const calculatePlayerTotals = (
  killMatrix: { [killer: string]: { [victim: string]: number } }
): { [player: string]: PlayerTotals } => {
  const totals: { [player: string]: PlayerTotals } = {};
  
  Object.keys(killMatrix).forEach(player => {
    totals[player] = {
      kills: Object.values(killMatrix[player]).reduce((sum, kills) => sum + kills, 0),
      deaths: Object.keys(killMatrix).reduce((sum, killer) => sum + killMatrix[killer][player], 0)
    };
  });

  return totals;
}; 