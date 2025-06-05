import { describe, it, expect } from 'vitest';
import { ultimateEventsAtomFn } from '@atoms/ultimateEventsAtom';
import type { UltimateChargedType, UltimateStartType, UltimateEndType } from '@atoms';

describe('ultimateEventsAtomFn', () => {
  const mockChargedEvents: UltimateChargedType = [
    {
      matchId: 'match1',
      type: 'ultimate_charged',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    },
    {
      matchId: 'match1',
      type: 'ultimate_charged',
      matchTime: 200,
      playerTeam: 'Team B',
      playerName: 'Player2',
      playerHero: 'Ana',
      ultimateId: 2,
      heroDuplicated: ''
    },
    {
      matchId: 'match1',
      type: 'ultimate_charged',
      matchTime: 300,
      playerTeam: 'Team A',
      playerName: 'Player3',
      playerHero: 'Reinhardt',
      ultimateId: 3,
      heroDuplicated: ''
    }
  ];

  const mockStartEvents: UltimateStartType = [
    {
      matchId: 'match1',
      type: 'ultimate_start',
      matchTime: 120,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    },
    {
      matchId: 'match1',
      type: 'ultimate_start',
      matchTime: 220,
      playerTeam: 'Team B',
      playerName: 'Player2',
      playerHero: 'Ana',
      ultimateId: 2,
      heroDuplicated: ''
    }
    // Note: No start for Player3's ultimate to test incomplete sequences
  ];

  const mockEndEvents: UltimateEndType = [
    {
      matchId: 'match1',
      type: 'ultimate_end',
      matchTime: 130,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    },
    {
      matchId: 'match1',
      type: 'ultimate_end',
      matchTime: 225,
      playerTeam: 'Team B',
      playerName: 'Player2',
      playerHero: 'Ana',
      ultimateId: 2,
      heroDuplicated: ''
    }
    // Note: No end for Player3's ultimate to test incomplete sequences
  ];

  it('should create complete ultimate events for charged-start-end sequences', () => {
    const result = ultimateEventsAtomFn(mockChargedEvents, mockStartEvents, mockEndEvents);

    expect(result).toHaveLength(2);

    // Check first ultimate event (Genji)
    const genjiUlt = result.find(event => event.playerName === 'Player1');
    expect(genjiUlt).toEqual({
      id: 'match1-100-Player1-Genji-ultimateCharged',
      matchId: 'match1',
      playerName: 'Player1',
      playerTeam: 'Team A',
      playerHero: 'Genji',
      ultimateId: '1',
      ultimateChargedTime: 100,
      ultimateStartTime: 120,
      ultimateEndTime: 130,
      ultimateHoldTime: 20
    });

    // Check second ultimate event (Ana)
    const anaUlt = result.find(event => event.playerName === 'Player2');
    expect(anaUlt).toEqual({
      id: 'match1-200-Player2-Ana-ultimateCharged',
      matchId: 'match1',
      playerName: 'Player2',
      playerTeam: 'Team B',
      playerHero: 'Ana',
      ultimateId: '2',
      ultimateChargedTime: 200,
      ultimateStartTime: 220,
      ultimateEndTime: 225,
      ultimateHoldTime: 20
    });
  });

  it('should filter out charged events without matching start events', () => {
    // Test with only charged events, no start/end
    const result = ultimateEventsAtomFn(mockChargedEvents, [], []);
    expect(result).toEqual([]);
  });

  it('should filter out charged events without matching end events', () => {
    // Test with charged and start, but no end events
    const result = ultimateEventsAtomFn(mockChargedEvents, mockStartEvents, []);
    expect(result).toEqual([]);
  });

  it('should handle empty input arrays', () => {
    const result = ultimateEventsAtomFn([], [], []);
    expect(result).toEqual([]);
  });

  it('should calculate ultimateHoldTime correctly', () => {
    const chargedAt50: UltimateChargedType = [{
      matchId: 'match1',
      type: 'ultimate_charged',
      matchTime: 50,
      playerTeam: 'Team A',
      playerName: 'TestPlayer',
      playerHero: 'Tracer',
      ultimateId: 10,
      heroDuplicated: ''
    }];

    const startAt100: UltimateStartType = [{
      matchId: 'match1',
      type: 'ultimate_start',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'TestPlayer',
      playerHero: 'Tracer',
      ultimateId: 10,
      heroDuplicated: ''
    }];

    const endAt105: UltimateEndType = [{
      matchId: 'match1',
      type: 'ultimate_end',
      matchTime: 105,
      playerTeam: 'Team A',
      playerName: 'TestPlayer',
      playerHero: 'Tracer',
      ultimateId: 10,
      heroDuplicated: ''
    }];

    const result = ultimateEventsAtomFn(chargedAt50, startAt100, endAt105);
    
    expect(result).toHaveLength(1);
    expect(result[0].ultimateHoldTime).toBe(50); // 100 - 50 = 50
    expect(result[0].ultimateChargedTime).toBe(50);
    expect(result[0].ultimateStartTime).toBe(100);
    expect(result[0].ultimateEndTime).toBe(105);
  });

  it('should match events by all required criteria', () => {
    const chargedDifferentMatch: UltimateChargedType = [{
      matchId: 'differentMatch',
      type: 'ultimate_charged',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    }];

    // Start event with same player but different match
    const startDifferentMatch: UltimateStartType = [{
      matchId: 'match1', // Different match ID
      type: 'ultimate_start',
      matchTime: 120,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    }];

    const result = ultimateEventsAtomFn(chargedDifferentMatch, startDifferentMatch, mockEndEvents);
    
    // Should not match because matchId is different
    expect(result).toEqual([]);
  });

  it('should require start event matchTime to be >= charged event matchTime', () => {
    const chargedAt200: UltimateChargedType = [{
      matchId: 'match1',
      type: 'ultimate_charged',
      matchTime: 200,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    }];

    const startAt100: UltimateStartType = [{
      matchId: 'match1',
      type: 'ultimate_start',
      matchTime: 100, // Earlier than charged time
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    }];

    const result = ultimateEventsAtomFn(chargedAt200, startAt100, mockEndEvents);
    
    // Should not match because start is before charged
    expect(result).toEqual([]);
  });

  it('should require end event matchTime to be >= start event matchTime', () => {
    const chargedAt100: UltimateChargedType = [{
      matchId: 'match1',
      type: 'ultimate_charged',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    }];

    const startAt150: UltimateStartType = [{
      matchId: 'match1',
      type: 'ultimate_start',
      matchTime: 150,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    }];

    const endAt120: UltimateEndType = [{
      matchId: 'match1',
      type: 'ultimate_end',
      matchTime: 120, // Earlier than start time
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      ultimateId: 1,
      heroDuplicated: ''
    }];

    const result = ultimateEventsAtomFn(chargedAt100, startAt150, endAt120);
    
    // Should not match because end is before start
    expect(result).toEqual([]);
  });

  it('should handle multiple ultimates for the same player', () => {
    const multipleChargedEvents: UltimateChargedType = [
      {
        matchId: 'match1',
        type: 'ultimate_charged',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Genji',
        ultimateId: 1,
        heroDuplicated: ''
      },
      {
        matchId: 'match1',
        type: 'ultimate_charged',
        matchTime: 300,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Genji',
        ultimateId: 2,
        heroDuplicated: ''
      }
    ];

    const multipleStartEvents: UltimateStartType = [
      {
        matchId: 'match1',
        type: 'ultimate_start',
        matchTime: 120,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Genji',
        ultimateId: 1,
        heroDuplicated: ''
      },
      {
        matchId: 'match1',
        type: 'ultimate_start',
        matchTime: 320,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Genji',
        ultimateId: 2,
        heroDuplicated: ''
      }
    ];

    const multipleEndEvents: UltimateEndType = [
      {
        matchId: 'match1',
        type: 'ultimate_end',
        matchTime: 130,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Genji',
        ultimateId: 1,
        heroDuplicated: ''
      },
      {
        matchId: 'match1',
        type: 'ultimate_end',
        matchTime: 330,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Genji',
        ultimateId: 2,
        heroDuplicated: ''
      }
    ];

    const result = ultimateEventsAtomFn(multipleChargedEvents, multipleStartEvents, multipleEndEvents);
    
    expect(result).toHaveLength(2);
    
    const firstUlt = result.find(e => e.ultimateId === '1');
    const secondUlt = result.find(e => e.ultimateId === '2');
    
    expect(firstUlt?.ultimateHoldTime).toBe(20); // 120 - 100
    expect(secondUlt?.ultimateHoldTime).toBe(20); // 320 - 300
  });

  it('should generate unique IDs for each ultimate event', () => {
    const result = ultimateEventsAtomFn(mockChargedEvents, mockStartEvents, mockEndEvents);
    
    expect(result).toHaveLength(2);
    
    const ids = result.map(event => event.id);
    const uniqueIds = new Set(ids);
    
    // All IDs should be unique
    expect(uniqueIds.size).toBe(ids.length);
    
    // Check ID format
    expect(result[0].id).toBe('match1-100-Player1-Genji-ultimateCharged');
    expect(result[1].id).toBe('match1-200-Player2-Ana-ultimateCharged');
  });

  it('should convert ultimateId to string in the output', () => {
    const result = ultimateEventsAtomFn(mockChargedEvents, mockStartEvents, mockEndEvents);
    
    result.forEach(event => {
      expect(typeof event.ultimateId).toBe('string');
    });
    
    expect(result[0].ultimateId).toBe('1');
    expect(result[1].ultimateId).toBe('2');
  });
});