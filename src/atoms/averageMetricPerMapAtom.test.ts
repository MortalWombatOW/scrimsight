import { describe, it, expect } from 'vitest';
import { averageMetricPerMapAtomFn } from '@atoms/averageMetricPerMapAtom';
import type { PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys, MatchData } from '@atoms';
import { Metric } from '@library';

describe('averageMetricPerMapAtomFn', () => {
  it('should calculate average metrics per map', () => {
    const mockPlayerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
      rows: [
        {
          matchId: 'match1',
          playerName: 'Player1',
          playerTeam: 'Team A',
          playerHero: 'Tracer',
          playtime: 600,
          eliminations: 10,
          deaths: 5,
          damage: 5000,
          healing: 0,
          shotsFired: 100,
          shotsHit: 60,
          scopedShotsFired: 0,
          scopedShotsHit: 0,
          criticalHits: 20,
        }
      ],
      categoryKeys: ['playerName', 'playerTeam', 'playerHero'],
      numericalKeys: ['playtime', 'eliminations', 'deaths', 'damage', 'healing', 'shotsFired', 'shotsHit', 'scopedShotsFired', 'scopedShotsHit', 'criticalHits']
    };

    const mockAllMatches: MatchData[] = [
      {
        matchId: 'match1',
        fileName: 'test.log',
        fileModified: 123456789,
        dateString: '2023-01-01',
        map: 'Lijiang Tower',
        team1Name: 'Team A',
        team2Name: 'Team B',
        team1Players: ['Player1'],
        team2Players: ['Player2'],
        winner: 'Team A',
        mode: 'Control',
        team1Score: 2,
        team2Score: 1,
        duration: 1200,
        roundWinners: ['Team A', 'Team B', 'Team A'],
      }
    ];

    const mockUniqueMaps = ['Lijiang Tower'];

    const result = averageMetricPerMapAtomFn(mockPlayerStatsData, mockAllMatches, mockUniqueMaps);

    expect(result).toBeDefined();
    expect(result['Lijiang Tower']).toBeDefined();
    expect(result['Lijiang Tower'].weaponAccuracy).toBeCloseTo(0.6);
  });

  it('should handle empty data', () => {
    const mockPlayerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
      rows: [],
      categoryKeys: ['playerName', 'playerTeam', 'playerHero'],
      numericalKeys: ['playtime', 'eliminations', 'deaths', 'damage', 'healing', 'shotsFired', 'shotsHit', 'scopedShotsFired', 'scopedShotsHit', 'criticalHits']
    };

    const result = averageMetricPerMapAtomFn(mockPlayerStatsData, [], []);

    expect(result).toEqual({});
  });
});