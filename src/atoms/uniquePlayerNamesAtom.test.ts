import { describe, it, expect } from 'vitest';
import { uniquePlayerNamesAtomFn } from '@atoms/uniquePlayerNamesAtom';
import type { PlayerStatType } from '@atoms';

describe('uniquePlayerNamesAtomFn', () => {
  it('should extract unique player names from player stats', () => {
    const mockPlayerStats: PlayerStatType = [
      {
        matchId: 'match1',
        type: 'player_stat',
        matchTime: 150,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Tracer',
        statName: 'eliminations',
        statValue: 25,
      },
      {
        matchId: 'match1',
        type: 'player_stat',
        matchTime: 150,
        playerTeam: 'Team A',
        playerName: 'Player2',
        playerHero: 'Ana',
        statName: 'healing',
        statValue: 5000,
      },
      {
        matchId: 'match2',
        type: 'player_stat',
        matchTime: 200,
        playerTeam: 'Team B',
        playerName: 'Player1',
        playerHero: 'Genji',
        statName: 'eliminations',
        statValue: 30,
      }
    ];

    const result = uniquePlayerNamesAtomFn(mockPlayerStats);

    expect(result).toEqual(['Player1', 'Player2']);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no player stats provided', () => {
    const result = uniquePlayerNamesAtomFn([]);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle single player stat', () => {
    const mockPlayerStats: PlayerStatType = [
      {
        matchId: 'match1',
        type: 'player_stat',
        matchTime: 150,
        playerTeam: 'Team A',
        playerName: 'SoloPlayer',
        playerHero: 'Mercy',
        statName: 'healing',
        statValue: 3000,
      }
    ];

    const result = uniquePlayerNamesAtomFn(mockPlayerStats);

    expect(result).toEqual(['SoloPlayer']);
    expect(result).toHaveLength(1);
  });

  it('should handle multiple stats from same player', () => {
    const mockPlayerStats: PlayerStatType = [
      {
        matchId: 'match1',
        type: 'player_stat',
        matchTime: 150,
        playerTeam: 'Team A',
        playerName: 'ConsistentPlayer',
        playerHero: 'Soldier: 76',
        statName: 'eliminations',
        statValue: 20,
      },
      {
        matchId: 'match1',
        type: 'player_stat',
        matchTime: 150,
        playerTeam: 'Team A',
        playerName: 'ConsistentPlayer',
        playerHero: 'Soldier: 76',
        statName: 'damage',
        statValue: 8000,
      }
    ];

    const result = uniquePlayerNamesAtomFn(mockPlayerStats);

    expect(result).toEqual(['ConsistentPlayer']);
    expect(result).toHaveLength(1);
  });
});