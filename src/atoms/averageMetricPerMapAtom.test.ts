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
          roundNumber: '1',
          playerTeam: 'Team A',
          playerName: 'Player1',
          playerHero: 'Tracer',
          playerRole: 'damage',
          playtime: 600,
          eliminations: 10,
          finalBlows: 8,
          deaths: 5,
          allDamageDealt: 5000,
          barrierDamageDealt: 1000,
          heroDamageDealt: 4000,
          healingDealt: 0,
          healingReceived: 200,
          selfHealing: 50,
          damageTaken: 1000,
          damageBlocked: 0,
          defensiveAssists: 2,
          offensiveAssists: 5,
          ultimatesEarned: 3,
          ultimatesUsed: 3,
          multikills: 1,
          soloKills: 3,
          objectiveKills: 4,
          environmentalKills: 0,
          environmentalDeaths: 0,
          criticalHits: 20,
          shotsFired: 100,
          shotsHit: 60,
          shotsMissed: 40,
          scopedShotsFired: 0,
          scopedShotsHit: 0,
        }
      ],
      categoryKeys: ['playerName', 'playerTeam', 'playerHero'],
      numericalKeys: ['playtime', 'eliminations', 'deaths', 'allDamageDealt', 'healingDealt', 'shotsFired', 'shotsHit', 'scopedShotsFired', 'scopedShotsHit', 'criticalHits']
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
        roundWinners: ['team1', 'team2', 'team1'],
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
      numericalKeys: ['playtime', 'eliminations', 'deaths', 'allDamageDealt', 'healingDealt', 'shotsFired', 'shotsHit', 'scopedShotsFired', 'scopedShotsHit', 'criticalHits']
    };

    const result = averageMetricPerMapAtomFn(mockPlayerStatsData, [], []);

    expect(result).toEqual({});
  });
});