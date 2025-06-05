import { describe, it, expect } from 'vitest';
import { playerEventsAtomFn } from '@atoms/playerEventsAtom';
import type { 
  DefensiveAssistType, 
  OffensiveAssistType, 
  HeroSpawnType, 
  HeroSwapType, 
  Ability1UsedType, 
  Ability2UsedType 
} from '@atoms';

describe('playerEventsAtomFn', () => {
  const mockDefensiveAssists: DefensiveAssistType = [
    {
      matchId: 'match1',
      type: 'defensiveAssist',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      heroDuplicated: ''
    }
  ];

  const mockOffensiveAssists: OffensiveAssistType = [
    {
      matchId: 'match1',
      type: 'offensiveAssist',
      matchTime: 150,
      playerTeam: 'Team A',
      playerName: 'Player2',
      playerHero: 'Zenyatta',
      heroDuplicated: ''
    }
  ];

  const mockHeroSpawns: HeroSpawnType = [
    {
      matchId: 'match1',
      type: 'heroSpawn',
      matchTime: 50,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      previousHero: '',
      heroTimePlayed: 0
    }
  ];

  const mockHeroSwaps: HeroSwapType = [
    {
      matchId: 'match1',
      type: 'heroSwap',
      matchTime: 200,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Mercy',
      previousHero: 'Ana',
      heroTimePlayed: 150
    }
  ];

  const mockAbility1Used: Ability1UsedType = [
    {
      matchId: 'match1',
      type: 'ability1Used',
      matchTime: 75,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      heroDuplicated: ''
    }
  ];

  const mockAbility2Used: Ability2UsedType = [
    {
      matchId: 'match1',
      type: 'ability2Used',
      matchTime: 125,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      heroDuplicated: ''
    }
  ];

  it('should combine all event types into a unified list', () => {
    const result = playerEventsAtomFn(
      mockDefensiveAssists,
      mockOffensiveAssists,
      mockHeroSpawns,
      mockHeroSwaps,
      mockAbility1Used,
      mockAbility2Used
    );

    expect(result).toHaveLength(6);
    
    // Check that all event types are present
    const eventTypes = result.map(event => event.eventType);
    expect(eventTypes).toContain('defensiveAssist');
    expect(eventTypes).toContain('offensiveAssist');
    expect(eventTypes).toContain('heroSpawn');
    expect(eventTypes).toContain('heroSwap');
    expect(eventTypes).toContain('ability1Used');
    expect(eventTypes).toContain('ability2Used');
  });

  it('should sort events by match time', () => {
    const result = playerEventsAtomFn(
      mockDefensiveAssists,
      mockOffensiveAssists,
      mockHeroSpawns,
      mockHeroSwaps,
      mockAbility1Used,
      mockAbility2Used
    );

    // Events should be sorted by matchTime: 50, 75, 100, 125, 150, 200
    expect(result[0].matchTime).toBe(50);
    expect(result[0].eventType).toBe('heroSpawn');
    
    expect(result[1].matchTime).toBe(75);
    expect(result[1].eventType).toBe('ability1Used');
    
    expect(result[2].matchTime).toBe(100);
    expect(result[2].eventType).toBe('defensiveAssist');
    
    expect(result[3].matchTime).toBe(125);
    expect(result[3].eventType).toBe('ability2Used');
    
    expect(result[4].matchTime).toBe(150);
    expect(result[4].eventType).toBe('offensiveAssist');
    
    expect(result[5].matchTime).toBe(200);
    expect(result[5].eventType).toBe('heroSwap');
  });

  it('should handle empty event arrays', () => {
    const result = playerEventsAtomFn([], [], [], [], [], []);
    expect(result).toEqual([]);
  });

  it('should handle mixed empty and populated arrays', () => {
    const result = playerEventsAtomFn(
      mockDefensiveAssists,
      [],
      mockHeroSpawns,
      [],
      [],
      mockAbility2Used
    );

    expect(result).toHaveLength(3);
    expect(result.map(e => e.eventType)).toEqual(['heroSpawn', 'defensiveAssist', 'ability2Used']);
  });

  it('should preserve all original event properties', () => {
    const result = playerEventsAtomFn(
      mockDefensiveAssists,
      [],
      [],
      [],
      [],
      []
    );

    const defensiveAssistEvent = result[0];
    expect(defensiveAssistEvent.matchId).toBe('match1');
    expect(defensiveAssistEvent.playerName).toBe('Player1');
    expect(defensiveAssistEvent.playerTeam).toBe('Team A');
    expect(defensiveAssistEvent.playerHero).toBe('Ana');
    expect(defensiveAssistEvent.matchTime).toBe(100);
    expect(defensiveAssistEvent.eventType).toBe('defensiveAssist');
  });

  it('should handle multiple events of the same type', () => {
    const multipleDefensiveAssists: DefensiveAssistType = [
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerTeam: 'Team A',
        playerHero: 'Ana',
        matchTime: 100,
      },
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerTeam: 'Team A',
        playerHero: 'Ana',
        matchTime: 300,
      }
    ];

    const result = playerEventsAtomFn(
      multipleDefensiveAssists,
      [],
      [],
      [],
      [],
      []
    );

    expect(result).toHaveLength(2);
    expect(result[0].matchTime).toBe(100);
    expect(result[1].matchTime).toBe(300);
    expect(result.every(e => e.eventType === 'defensiveAssist')).toBe(true);
  });

  it('should handle events with same timestamp correctly', () => {
    const sameTimeEvents: DefensiveAssistType = [
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerTeam: 'Team A',
        playerHero: 'Ana',
        matchTime: 100,
      }
    ];

    const sameTimeSpawns: HeroSpawnType = [
      {
        matchId: 'match1',
        playerName: 'Player2',
        playerTeam: 'Team B',
        playerHero: 'Mercy',
        matchTime: 100,
      }
    ];

    const result = playerEventsAtomFn(
      sameTimeEvents,
      [],
      sameTimeSpawns,
      [],
      [],
      []
    );

    expect(result).toHaveLength(2);
    expect(result[0].matchTime).toBe(100);
    expect(result[1].matchTime).toBe(100);
  });
});