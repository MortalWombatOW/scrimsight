import { describe, it, expect } from 'vitest';
import { 
  transformPlayerInteractions, 
  createKillMatrix, 
  calculatePlayerTotals,
  generateKillMatrixData
} from './killMatrix';

// Sample interaction events for testing
const sampleInteractionEvents = [
  {
    matchId: 'match1',
    playerName: 'player1',
    playerTeam: 'team1',
    playerInteractionEventType: 'Killed player',
    otherPlayerName: 'player3',
    matchTime: 100
  },
  {
    matchId: 'match1',
    playerName: 'player1',
    playerTeam: 'team1',
    playerInteractionEventType: 'Killed player',
    otherPlayerName: 'player4',
    matchTime: 120
  },
  {
    matchId: 'match1',
    playerName: 'player2',
    playerTeam: 'team1',
    playerInteractionEventType: 'Killed player',
    otherPlayerName: 'player3',
    matchTime: 140
  },
  {
    matchId: 'match1',
    playerName: 'player3',
    playerTeam: 'team2',
    playerInteractionEventType: 'Killed player',
    otherPlayerName: 'player1',
    matchTime: 160
  },
  {
    matchId: 'match1',
    playerName: 'player4',
    playerTeam: 'team2',
    playerInteractionEventType: 'Shot fired',
    otherPlayerName: 'player2',
    matchTime: 180
  }
];

// Sample match data
const sampleMatchData = [
  {
    matchId: 'match1',
    team1Name: 'team1',
    team2Name: 'team2',
    team1Players: ['player1', 'player2'],
    team2Players: ['player3', 'player4']
  }
];

describe('killMatrix pure functions', () => {
  it('transforms player interactions correctly', () => {
    const interactions = transformPlayerInteractions(sampleInteractionEvents);
    
    expect(interactions).toHaveLength(4); // There are 4 kill events in the sample data
    
    // Check first interaction
    expect(interactions[0]).toEqual({
      sourcePlayerName: 'player1',
      sourceTeamName: 'team1',
      targetPlayerName: 'player3',
      value: 1
    });
  });

  it('creates kill matrix from interactions', () => {
    const players = ['player1', 'player2', 'player3', 'player4'];
    const interactions = transformPlayerInteractions(sampleInteractionEvents);
    const matrix = createKillMatrix(interactions, players);
    
    expect(matrix.player1.player3).toBe(1);
    expect(matrix.player1.player4).toBe(1);
    expect(matrix.player2.player3).toBe(1);
    expect(matrix.player3.player1).toBe(1);
    expect(matrix.player4.player2).toBe(0); // Not a kill event
  });

  it('calculates player totals correctly', () => {
    const players = ['player1', 'player2', 'player3', 'player4'];
    const interactions = transformPlayerInteractions(sampleInteractionEvents);
    const matrix = createKillMatrix(interactions, players);
    const totals = calculatePlayerTotals(matrix);
    
    expect(totals.player1.kills).toBe(2);
    expect(totals.player1.deaths).toBe(1);
    expect(totals.player2.kills).toBe(1);
    expect(totals.player2.deaths).toBe(0);
    expect(totals.player3.kills).toBe(1);
    expect(totals.player3.deaths).toBe(2);
    expect(totals.player4.kills).toBe(0);
    expect(totals.player4.deaths).toBe(1);
  });

  it('generates complete kill matrix data', () => {
    const result = generateKillMatrixData('match1', sampleMatchData, sampleInteractionEvents);
    
    expect(result).not.toBeNull();
    if (result) {
      expect(result.team1Name).toBe('team1');
      expect(result.team2Name).toBe('team2');
      expect(result.team1Players).toEqual(['player1', 'player2']);
      expect(result.team2Players).toEqual(['player3', 'player4']);
      expect(result.allPlayers).toEqual(['player1', 'player2', 'player3', 'player4']);
      
      // Check kill matrix results
      expect(result.killMatrix.player1.player3).toBe(1);
      expect(result.playerTotals.player1.kills).toBe(2);
    }
  });

  it('handles missing match data gracefully', () => {
    const result = generateKillMatrixData('nonexistent', sampleMatchData, sampleInteractionEvents);
    expect(result).toBeNull();
  });
});