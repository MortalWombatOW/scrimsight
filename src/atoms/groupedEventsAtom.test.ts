import { describe, it, expect } from 'vitest';
import { groupedEventsAtomFn } from '@atoms/groupedEventsAtom';
import type { KillLogEvent, OffensiveAssistLogEvent } from '@atoms';

describe('groupedEventsAtomFn', () => {
  const mockKillEvents: KillLogEvent[] = [
    {
      matchId: 'match1',
      type: 'kill',
      matchTime: 100,
      attackerTeam: 'Team A',
      attackerName: 'Player1',
      attackerHero: 'Tracer',
      victimTeam: 'Team B',
      victimName: 'Player2',
      victimHero: 'Mercy',
      eventAbility: 'Pulse Pistols',
      eventDamage: 150,
      isCriticalHit: false,
      isEnvironmental: false
    },
    {
      matchId: 'match1',
      type: 'kill',
      matchTime: 100, // Same time as above kill
      attackerTeam: 'Team A',
      attackerName: 'Player3',
      attackerHero: 'Genji',
      victimTeam: 'Team B',
      victimName: 'Player4',
      victimHero: 'Ana',
      eventAbility: 'Dragonblade',
      eventDamage: 120,
      isCriticalHit: false,
      isEnvironmental: false
    },
    {
      matchId: 'match1',
      type: 'kill',
      matchTime: 200, // Different time
      attackerTeam: 'Team B',
      attackerName: 'Player5',
      attackerHero: 'Widowmaker',
      victimTeam: 'Team A',
      victimName: 'Player6',
      victimHero: 'Reinhardt',
      eventAbility: 'Widow\'s Kiss',
      eventDamage: 300,
      isCriticalHit: true,
      isEnvironmental: false
    },
    {
      matchId: 'match2', // Different match
      type: 'kill',
      matchTime: 100,
      attackerTeam: 'Team C',
      attackerName: 'Player7',
      attackerHero: 'Soldier: 76',
      victimTeam: 'Team D',
      victimName: 'Player8',
      victimHero: 'Pharah',
      eventAbility: 'Heavy Pulse Rifle',
      eventDamage: 170,
      isCriticalHit: true,
      isEnvironmental: false
    }
  ];

  const mockOffensiveAssistEvents: OffensiveAssistLogEvent[] = [
    {
      matchId: 'match1',
      type: 'offensiveAssist',
      matchTime: 100, // Same time as first two kills
      playerTeam: 'Team A',
      playerName: 'Player9',
      playerHero: 'Zenyatta',
      heroDuplicated: ''
    },
    {
      matchId: 'match1',
      type: 'offensiveAssist',
      matchTime: 150, // Unique time with no kills
      playerTeam: 'Team B',
      playerName: 'Player10',
      playerHero: 'Ana',
      heroDuplicated: ''
    },
    {
      matchId: 'match2',
      type: 'offensiveAssist',
      matchTime: 100, // Same match and time as match2 kill
      playerTeam: 'Team C',
      playerName: 'Player11',
      playerHero: 'Mercy',
      heroDuplicated: ''
    }
  ];

  it('should group events by matchId and matchTime', () => {
    const result = groupedEventsAtomFn(mockKillEvents, mockOffensiveAssistEvents);

    // Should have 4 groups: 
    // - match1-100 (2 kills + 1 assist)
    // - match1-200 (1 kill)
    // - match1-150 (1 assist)
    // - match2-100 (1 kill + 1 assist)
    expect(result).toHaveLength(4);

    // Find the group with multiple events
    const match1Time100 = result.find(group => 
      group.matchId === 'match1' && group.matchTime === 100
    );
    expect(match1Time100).toBeDefined();
    expect(match1Time100!.kills).toHaveLength(2);
    expect(match1Time100!.assists).toHaveLength(1);
  });

  it('should correctly group kills at the same time', () => {
    const result = groupedEventsAtomFn(mockKillEvents, mockOffensiveAssistEvents);
    
    const match1Time100 = result.find(group => 
      group.matchId === 'match1' && group.matchTime === 100
    );
    
    expect(match1Time100!.kills).toHaveLength(2);
    
    // Check both kills are present
    const tracerKill = match1Time100!.kills.find(kill => kill.attackerHero === 'Tracer');
    const genjiKill = match1Time100!.kills.find(kill => kill.attackerHero === 'Genji');
    
    expect(tracerKill).toBeDefined();
    expect(genjiKill).toBeDefined();
    expect(tracerKill!.victimHero).toBe('Mercy');
    expect(genjiKill!.victimHero).toBe('Ana');
  });

  it('should create groups with only assists when no kills at that time', () => {
    const result = groupedEventsAtomFn(mockKillEvents, mockOffensiveAssistEvents);
    
    const match1Time150 = result.find(group => 
      group.matchId === 'match1' && group.matchTime === 150
    );
    
    expect(match1Time150).toBeDefined();
    expect(match1Time150!.kills).toHaveLength(0);
    expect(match1Time150!.assists).toHaveLength(1);
    expect(match1Time150!.assists[0].playerHero).toBe('Ana');
  });

  it('should create groups with only kills when no assists at that time', () => {
    const result = groupedEventsAtomFn(mockKillEvents, mockOffensiveAssistEvents);
    
    const match1Time200 = result.find(group => 
      group.matchId === 'match1' && group.matchTime === 200
    );
    
    expect(match1Time200).toBeDefined();
    expect(match1Time200!.kills).toHaveLength(1);
    expect(match1Time200!.assists).toHaveLength(0);
    expect(match1Time200!.kills[0].attackerHero).toBe('Widowmaker');
  });

  it('should handle different matches correctly', () => {
    const result = groupedEventsAtomFn(mockKillEvents, mockOffensiveAssistEvents);
    
    const match1Groups = result.filter(group => group.matchId === 'match1');
    const match2Groups = result.filter(group => group.matchId === 'match2');
    
    expect(match1Groups).toHaveLength(3); // Times 100, 150, 200
    expect(match2Groups).toHaveLength(1); // Time 100
    
    const match2Time100 = match2Groups[0];
    expect(match2Time100.kills).toHaveLength(1);
    expect(match2Time100.assists).toHaveLength(1);
    expect(match2Time100.kills[0].attackerHero).toBe('Soldier: 76');
    expect(match2Time100.assists[0].playerHero).toBe('Mercy');
  });

  it('should handle empty kill events array', () => {
    const result = groupedEventsAtomFn([], mockOffensiveAssistEvents);
    
    // Should still create groups for assist events
    expect(result).toHaveLength(3);
    
    result.forEach(group => {
      expect(group.kills).toEqual([]);
      expect(group.assists.length).toBeGreaterThan(0);
    });
  });

  it('should handle empty offensive assist events array', () => {
    const result = groupedEventsAtomFn(mockKillEvents, []);
    
    // Should still create groups for kill events
    expect(result).toHaveLength(3); // match1: times 100,200; match2: time 100
    
    result.forEach(group => {
      expect(group.assists).toEqual([]);
      expect(group.kills.length).toBeGreaterThan(0);
    });
  });

  it('should handle both empty arrays', () => {
    const result = groupedEventsAtomFn([], []);
    expect(result).toEqual([]);
  });

  it('should preserve all event properties in grouped data', () => {
    const result = groupedEventsAtomFn(mockKillEvents, mockOffensiveAssistEvents);
    
    const match1Time100 = result.find(group => 
      group.matchId === 'match1' && group.matchTime === 100
    );
    
    // Check kill event properties are preserved
    const tracerKill = match1Time100!.kills.find(kill => kill.attackerHero === 'Tracer');
    expect(tracerKill).toEqual({
      matchId: 'match1',
      type: 'kill',
      matchTime: 100,
      attackerTeam: 'Team A',
      attackerName: 'Player1',
      attackerHero: 'Tracer',
      victimTeam: 'Team B',
      victimName: 'Player2',
      victimHero: 'Mercy',
      eventAbility: 'Pulse Pistols',
      eventDamage: 150,
      isCriticalHit: false,
      isEnvironmental: false
    });

    // Check assist event properties are preserved
    const zenyattaAssist = match1Time100!.assists[0];
    expect(zenyattaAssist).toEqual({
      matchId: 'match1',
      type: 'offensiveAssist',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player9',
      playerHero: 'Zenyatta',
      heroDuplicated: ''
    });
  });

  it('should generate unique group keys based on matchId and matchTime', () => {
    const result = groupedEventsAtomFn(mockKillEvents, mockOffensiveAssistEvents);
    
    // Create a set of group identifiers to check uniqueness
    const groupKeys = result.map(group => `${group.matchId}-${group.matchTime}`);
    const uniqueKeys = new Set(groupKeys);
    
    expect(uniqueKeys.size).toBe(groupKeys.length);
    
    // Verify specific keys exist
    expect(groupKeys).toContain('match1-100');
    expect(groupKeys).toContain('match1-150');
    expect(groupKeys).toContain('match1-200');
    expect(groupKeys).toContain('match2-100');
  });

  it('should handle multiple assists at the same time', () => {
    const multipleAssists: OffensiveAssistLogEvent[] = [
      {
        matchId: 'match1',
        type: 'offensiveAssist',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Mercy',
        heroDuplicated: ''
      },
      {
        matchId: 'match1',
        type: 'offensiveAssist',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player2',
        playerHero: 'Ana',
        heroDuplicated: ''
      },
      {
        matchId: 'match1',
        type: 'offensiveAssist',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player3',
        playerHero: 'Zenyatta',
        heroDuplicated: ''
      }
    ];

    const result = groupedEventsAtomFn([], multipleAssists);
    
    expect(result).toHaveLength(1);
    expect(result[0].assists).toHaveLength(3);
    expect(result[0].kills).toHaveLength(0);
    
    const assistHeroes = result[0].assists.map(assist => assist.playerHero);
    expect(assistHeroes).toContain('Mercy');
    expect(assistHeroes).toContain('Ana');
    expect(assistHeroes).toContain('Zenyatta');
  });

  it('should handle edge case with very large match times', () => {
    const largeTimeKill: KillLogEvent[] = [{
      matchId: 'match1',
      type: 'kill',
      matchTime: 999999999,
      attackerTeam: 'Team A',
      attackerName: 'Player1',
      attackerHero: 'Tracer',
      victimTeam: 'Team B',
      victimName: 'Player2',
      victimHero: 'Mercy',
      eventAbility: 'Pulse Pistols',
      eventDamage: 150,
      isCriticalHit: false,
      isEnvironmental: false
    }];

    const largeTimeAssist: OffensiveAssistLogEvent[] = [{
      matchId: 'match1',
      type: 'offensiveAssist',
      matchTime: 999999999,
      playerTeam: 'Team A',
      playerName: 'Player3',
      playerHero: 'Zenyatta',
      heroDuplicated: ''
    }];

    const result = groupedEventsAtomFn(largeTimeKill, largeTimeAssist);
    
    expect(result).toHaveLength(1);
    expect(result[0].matchTime).toBe(999999999);
    expect(result[0].kills).toHaveLength(1);
    expect(result[0].assists).toHaveLength(1);
  });
});