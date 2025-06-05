import { describe, it, expect } from 'vitest';
import { averageMetricPerHeroAtomFn } from '@atoms/averageMetricPerHeroAtom';
import type { PlayerStatExpandedType } from '@atoms';

describe('averageMetricPerHeroAtomFn', () => {
  const mockPlayerStats: PlayerStatExpandedType = [
    {
      matchId: 'match1',
      playerName: 'Player1',
      playerHero: 'Ana',
      statName: 'eliminations',
      statValue: 10,
      heroTimePlayed: 300,
    },
    {
      matchId: 'match1', 
      playerName: 'Player2',
      playerHero: 'Ana',
      statName: 'eliminations',
      statValue: 15,
      heroTimePlayed: 400,
    },
    {
      matchId: 'match2',
      playerName: 'Player1',
      playerHero: 'Genji',
      statName: 'eliminations',
      statValue: 20,
      heroTimePlayed: 500,
    }
  ];

  it('should calculate average metrics per hero correctly', () => {
    const result = averageMetricPerHeroAtomFn(mockPlayerStats, 'eliminations');

    expect(result).toEqual([
      { hero: 'Ana', averageValue: 12.5 },
      { hero: 'Genji', averageValue: 20 }
    ]);
  });

  it('should handle empty player stats array', () => {
    const result = averageMetricPerHeroAtomFn([], 'eliminations');
    expect(result).toEqual([]);
  });

  it('should handle stat name that does not exist', () => {
    const result = averageMetricPerHeroAtomFn(mockPlayerStats, 'nonexistent');
    expect(result).toEqual([]);
  });

  it('should handle single hero with one stat', () => {
    const singleStat: PlayerStatExpandedType = [
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerHero: 'Mercy',
        statName: 'healing',
        statValue: 5000,
        heroTimePlayed: 600,
      }
    ];

    const result = averageMetricPerHeroAtomFn(singleStat, 'healing');
    expect(result).toEqual([{ hero: 'Mercy', averageValue: 5000 }]);
  });
});