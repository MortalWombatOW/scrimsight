import { describe, it, expect } from 'vitest';
import { playerInteractionEventsAtomFn } from '@atoms/playerInteractionEventsAtom';

describe('playerInteractionEventsAtomFn', () => {
  it('should handle empty input arrays', () => {
    const result = playerInteractionEventsAtomFn([], [], [], [], [], []);
    expect(result).toEqual([]);
  });

  it('should create bidirectional events for mercy rez', () => {
    const result = playerInteractionEventsAtomFn([{
      matchId: 'test-match',
      type: 'mercyRez',
      matchTime: 150,
      mercyTeam: 'Team A',
      mercyName: 'Mercy1',
      revivedTeam: 'Team A',
      revivedName: 'Soldier1',
      revivedHero: 'Soldier: 76',
      eventAbility: 'Resurrect'
    }], [], [], [], [], []);
    
    expect(result).toHaveLength(2);
    expect(result[0].playerInteractionEventType).toBe('Resurrected');
    expect(result[1].playerInteractionEventType).toBe('Resurrect');
  });

  it('should create bidirectional events for kills', () => {
    const result = playerInteractionEventsAtomFn([], [], [], [{
      matchId: 'test-match',
      type: 'kill',
      matchTime: 300,
      attackerTeam: 'Team B',
      attackerName: 'Tracer1',
      attackerHero: 'Tracer',
      victimTeam: 'Team A',
      victimName: 'Ana1',
      victimHero: 'Ana',
      eventAbility: 'Pulse Pistols',
      eventDamage: 120,
      isCriticalHit: false,
      isEnvironmental: false
    }], [], []);
    
    expect(result).toHaveLength(2);
    expect(result[0].playerInteractionEventType).toBe('Killed player');
    expect(result[1].playerInteractionEventType).toBe('Killed by player');
  });

  it('should sort events chronologically', () => {
    const result = playerInteractionEventsAtomFn([{
      matchId: 'test-match',
      type: 'mercyRez',
      matchTime: 500,
      mercyTeam: 'Team A',
      mercyName: 'Mercy1',
      revivedTeam: 'Team A',
      revivedName: 'Soldier1',
      revivedHero: 'Soldier: 76',
      eventAbility: 'Resurrect'
    }], [], [], [{
      matchId: 'test-match',
      type: 'kill',
      matchTime: 100,
      attackerTeam: 'Team B',
      attackerName: 'Tracer1',
      attackerHero: 'Tracer',
      victimTeam: 'Team A',
      victimName: 'Ana1',
      victimHero: 'Ana',
      eventAbility: 'Pulse Pistols',
      eventDamage: 120,
      isCriticalHit: false,
      isEnvironmental: false
    }], [], []);
    
    expect(result.map(e => e.playerInteractionEventTime)).toEqual([100, 100, 500, 500]);
  });

  it('should combine multiple event types', () => {
    const result = playerInteractionEventsAtomFn([{
      matchId: 'test-match',
      type: 'mercyRez',
      matchTime: 150,
      mercyTeam: 'Team A',
      mercyName: 'Mercy1',
      revivedTeam: 'Team A',
      revivedName: 'Soldier1',
      revivedHero: 'Soldier: 76',
      eventAbility: 'Resurrect'
    }], [], [{
      matchId: 'test-match',
      type: 'dvaRemech',
      matchTime: 250,
      playerTeam: 'Team A',
      playerName: 'Dva1',
      playerHero: 'D.Va',
      ultimateId: 1
    }], [], [], []);
    
    expect(result).toHaveLength(3); // 2 mercy + 1 remech
    expect(result.map(e => e.playerInteractionEventType)).toContain('Resurrected');
    expect(result.map(e => e.playerInteractionEventType)).toContain('Resurrect');
    expect(result.map(e => e.playerInteractionEventType)).toContain('Remech');
  });
});