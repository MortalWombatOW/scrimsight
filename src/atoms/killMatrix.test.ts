import { describe, it, expect } from 'vitest';
import { killMatrixFn } from '@atoms/killMatrix';
import { 
  transformPlayerInteractions, 
  createKillMatrix, 
  calculatePlayerTotals
} from '@library';
import { MatchData, PlayerInteractionEvent } from '@atoms';

describe('killMatrix pure functions', () => {
  // Sample interaction events for testing
  const sampleInteractionEvents: PlayerInteractionEvent[] = [
    {
      id: 'interaction1',
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
      playerHero: 'hero1',
      playerInteractionEventType: 'Killed player',
      otherPlayerName: 'player3',
      playerInteractionEventTime: 100,
      direction: 'outgoing'
    },
    {
      id: 'interaction2',
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
      playerHero: 'hero1',
      playerInteractionEventType: 'Killed player',
      otherPlayerName: 'player4',
      playerInteractionEventTime: 120,
      direction: 'outgoing'
    },
    {
      id: 'interaction3',
      matchId: 'match1',
      playerName: 'player2',
      playerTeam: 'team1',
      playerHero: 'hero2',
      playerInteractionEventType: 'Killed player',
      otherPlayerName: 'player3',
      playerInteractionEventTime: 140,
      direction: 'outgoing'
    },
    {
      id: 'interaction4',
      matchId: 'match1',
      playerName: 'player3',
      playerTeam: 'team2',
      playerHero: 'hero3',
      playerInteractionEventType: 'Killed player',
      otherPlayerName: 'player1',
      playerInteractionEventTime: 160,
      direction: 'outgoing'
    },
    {
      id: 'interaction5',
      matchId: 'match1',
      playerName: 'player4',
      playerTeam: 'team2',
      playerHero: 'hero4',
      playerInteractionEventType: 'Shot fired',
      otherPlayerName: 'player2',
      playerInteractionEventTime: 180,
      direction: 'outgoing'
    }
  ];

  // Sample match data
  const sampleMatchData: MatchData[] = [
    {
      matchId: 'match1',
      fileName: 'sample.log',
      fileModified: new Date().getTime(),
      dateString: '2023-01-01',
      map: 'Lijiang Tower',
      team1Name: 'team1',
      team2Name: 'team2',
      team1Players: ['player1', 'player2'],
      team2Players: ['player3', 'player4'],
      winner: 'team1', // Corrected from mapWinner
      mode: 'Control', // Added placeholder
      team1Score: 2, // Added placeholder
      team2Score: 1, // Added placeholder
      duration: 1200, // Added placeholder
      roundWinners: ['team1', 'team2', 'team1'], // Added placeholder
    }
  ];
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
    const result = killMatrixFn('match1', sampleMatchData, sampleInteractionEvents);
    
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
    const result = killMatrixFn('nonexistent', sampleMatchData, sampleInteractionEvents);
    expect(result).toBeNull();
  });
});
