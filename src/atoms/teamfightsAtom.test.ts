import { describe, it, expect, vi } from 'vitest';
import { teamfightsAtomFn } from '@atoms/teamfightsAtom';
import { playerInteractionEvents, ultimateEvents, matchData } from '@atoms';

describe('teamfightsAtomFn', () => {
  it('should return empty array for no kill events', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async () => []);
    
    const result = await teamfightsAtomFn(mockGet);
    expect(result).toEqual([]);
  });

  it('should detect teamfights from kill events', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerInteractionEvents.atom) {
        return [{
          id: 'kill-1',
          matchId: 'test-match',
          playerName: 'Tracer1',
          playerTeam: 'Team A',
          playerHero: 'Tracer',
          otherPlayerName: 'Ana1',
          playerInteractionEventTime: 100,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }, {
          id: 'kill-2',
          matchId: 'test-match',
          playerName: 'Soldier1',
          playerTeam: 'Team A',
          playerHero: 'Soldier: 76',
          otherPlayerName: 'Genji1',
          playerInteractionEventTime: 102,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }];
      }
      if (atom === ultimateEvents.atom) {
        return [];
      }
      if (atom === matchData.atom) {
        return [{
          matchId: 'test-match',
          team1Name: 'Team A',
          team2Name: 'Team B',
          team1Players: ['Tracer1', 'Soldier1'],
          team2Players: ['Ana1', 'Genji1']
        }];
      }
      return [];
    });
    
    const result = await teamfightsAtomFn(mockGet);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      matchId: 'test-match',
      team1Name: 'Team A',
      team2Name: 'Team B',
      team1Kills: 2,
      team2Kills: 0,
      winner: 'Team A'
    });
  });

  it('should separate teamfights by buffer time', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerInteractionEvents.atom) {
        return [{
          id: 'kill-1',
          matchId: 'test-match',
          playerName: 'Tracer1',
          playerTeam: 'Team A',
          playerHero: 'Tracer',
          otherPlayerName: 'Ana1',
          playerInteractionEventTime: 100,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }, {
          id: 'kill-2',
          matchId: 'test-match',
          playerName: 'Genji1',
          playerTeam: 'Team B',
          playerHero: 'Genji',
          otherPlayerName: 'Soldier1',
          playerInteractionEventTime: 120, // 20 seconds later - should be separate teamfight
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }];
      }
      if (atom === ultimateEvents.atom) {
        return [];
      }
      if (atom === matchData.atom) {
        return [{
          matchId: 'test-match',
          team1Name: 'Team A',
          team2Name: 'Team B',
          team1Players: ['Tracer1', 'Soldier1'],
          team2Players: ['Ana1', 'Genji1']
        }];
      }
      return [];
    });
    
    const result = await teamfightsAtomFn(mockGet);
    expect(result).toHaveLength(2); // Should create two separate teamfights
    expect(result[0].team1Kills).toBe(1);
    expect(result[1].team2Kills).toBe(1);
  });

  it('should include ultimate information in teamfights', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerInteractionEvents.atom) {
        return [{
          id: 'kill-1',
          matchId: 'test-match',
          playerName: 'Tracer1',
          playerTeam: 'Team A',
          playerHero: 'Tracer',
          otherPlayerName: 'Ana1',
          playerInteractionEventTime: 100,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }];
      }
      if (atom === ultimateEvents.atom) {
        return [{
          matchId: 'test-match',
          playerName: 'Tracer1',
          playerTeam: 'Team A',
          ultimateChargedTime: 50,
          ultimateStartTime: 99, // Started during the teamfight (98-102)
          ultimateEndTime: 105
        }];
      }
      if (atom === matchData.atom) {
        return [{
          matchId: 'test-match',
          team1Name: 'Team A',
          team2Name: 'Team B',
          team1Players: ['Tracer1'],
          team2Players: ['Ana1']
        }];
      }
      return [];
    });
    
    const result = await teamfightsAtomFn(mockGet);
    expect(result).toHaveLength(1);
    // Ultimate was used during the teamfight, not charged at start
    expect(result[0].team1PlayersWithUltimatesUsed).toContain('Tracer1');
    expect(result[0].team1PlayersWithUltimatesChargedAtStart).toEqual([]);
  });

  it('should determine teamfight winner correctly', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerInteractionEvents.atom) {
        return [{
          id: 'kill-1',
          matchId: 'test-match',
          playerName: 'Genji1',
          playerTeam: 'Team B',
          playerHero: 'Genji',
          otherPlayerName: 'Tracer1',
          playerInteractionEventTime: 100,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }, {
          id: 'kill-2',
          matchId: 'test-match',
          playerName: 'Genji1',
          playerTeam: 'Team B',
          playerHero: 'Genji',
          otherPlayerName: 'Soldier1',
          playerInteractionEventTime: 102,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }];
      }
      if (atom === ultimateEvents.atom) {
        return [];
      }
      if (atom === matchData.atom) {
        return [{
          matchId: 'test-match',
          team1Name: 'Team A',
          team2Name: 'Team B',
          team1Players: ['Tracer1', 'Soldier1'],
          team2Players: ['Genji1']
        }];
      }
      return [];
    });
    
    const result = await teamfightsAtomFn(mockGet);
    expect(result).toHaveLength(1);
    expect(result[0].team1Kills).toBe(0);
    expect(result[0].team2Kills).toBe(2);
    expect(result[0].winner).toBe('Team B');
  });

  it('should handle draw scenarios', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerInteractionEvents.atom) {
        return [{
          id: 'kill-1',
          matchId: 'test-match',
          playerName: 'Tracer1',
          playerTeam: 'Team A',
          playerHero: 'Tracer',
          otherPlayerName: 'Ana1',
          playerInteractionEventTime: 100,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }, {
          id: 'kill-2',
          matchId: 'test-match',
          playerName: 'Genji1',
          playerTeam: 'Team B',
          playerHero: 'Genji',
          otherPlayerName: 'Soldier1',
          playerInteractionEventTime: 102,
          playerInteractionEventType: 'Killed player',
          direction: 'outgoing'
        }];
      }
      if (atom === ultimateEvents.atom) {
        return [];
      }
      if (atom === matchData.atom) {
        return [{
          matchId: 'test-match',
          team1Name: 'Team A',
          team2Name: 'Team B',
          team1Players: ['Tracer1', 'Soldier1'],
          team2Players: ['Ana1', 'Genji1']
        }];
      }
      return [];
    });
    
    const result = await teamfightsAtomFn(mockGet);
    expect(result).toHaveLength(1);
    expect(result[0].team1Kills).toBe(1);
    expect(result[0].team2Kills).toBe(1);
    expect(result[0].winner).toBe(null);
  });
});