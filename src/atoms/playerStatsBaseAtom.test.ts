import { describe, it, expect, vi } from 'vitest';
import { playerStatsBaseAtomFn } from '@atoms/playerStatsBaseAtom';
import { playerStat, heroPlaytime } from '@atoms';

describe('playerStatsBaseAtomFn', () => {
  it('should merge player stats with playtime data', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerStat.atom) {
        return [{
          matchId: 'test-match',
          type: 'playerStat',
          matchTime: 1000,
          roundNumber: '1',
          playerTeam: 'Team A',
          playerName: 'Player1',
          playerHero: 'Tracer',
          eliminations: 10,
          finalBlows: 8,
          deaths: 3,
          allDamageDealt: 5000,
          barrierDamageDealt: 1000,
          heroDamageDealt: 4000,
          healingDealt: 0,
          healingReceived: 500,
          selfHealing: 100,
          damageTaken: 2000,
          damageBlocked: 0,
          defensiveAssists: 2,
          offensiveAssists: 5,
          ultimatesEarned: 3,
          ultimatesUsed: 2,
          multikillBest: 3,
          multikills: 2,
          soloKills: 4,
          objectiveKills: 6,
          environmentalKills: 0,
          environmentalDeaths: 1,
          criticalHits: 50,
          criticalHitAccuracy: 25.5,
          scopedAccuracy: 0,
          scopedCriticalHitAccuracy: 0,
          scopedCriticalHitKills: 0,
          shotsFired: 200,
          shotsHit: 150,
          shotsMissed: 50,
          scopedShotsFired: 0,
          scopedShotsHit: 0,
          weaponAccuracy: 75.0
        }];
      }
      if (atom === heroPlaytime.atom) {
        return {
          categoryKeys: ['playerName', 'matchId', 'roundNumber', 'hero'],
          numericalKeys: ['playtime'],
          rows: [{
            playerName: 'Player1',
            matchId: 'test-match',
            roundNumber: '1',
            hero: 'Tracer',
            playtime: 120
          }]
        };
      }
      return [];
    });
    
    const result = await playerStatsBaseAtomFn(mockGet);
    
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      matchId: 'test-match',
      playerName: 'Player1',
      playerHero: 'Tracer',
      playerRole: 'damage',
      playtime: 120,
      eliminations: 10,
      deaths: 3
    });
  });

  it('should handle missing playtime data', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerStat.atom) {
        return [{
          matchId: 'test-match',
          type: 'playerStat',
          matchTime: 1000,
          roundNumber: '1',
          playerTeam: 'Team A',
          playerName: 'Player1',
          playerHero: 'Ana',
          eliminations: 5,
          finalBlows: 3,
          deaths: 2,
          allDamageDealt: 2000,
          barrierDamageDealt: 500,
          heroDamageDealt: 1500,
          healingDealt: 8000,
          healingReceived: 300,
          selfHealing: 200,
          damageTaken: 1500,
          damageBlocked: 0,
          defensiveAssists: 8,
          offensiveAssists: 3,
          ultimatesEarned: 2,
          ultimatesUsed: 2,
          multikillBest: 1,
          multikills: 0,
          soloKills: 1,
          objectiveKills: 2,
          environmentalKills: 0,
          environmentalDeaths: 0,
          criticalHits: 20,
          criticalHitAccuracy: 60.0,
          scopedAccuracy: 70.0,
          scopedCriticalHitAccuracy: 80.0,
          scopedCriticalHitKills: 2,
          shotsFired: 100,
          shotsHit: 70,
          shotsMissed: 30,
          scopedShotsFired: 50,
          scopedShotsHit: 35,
          weaponAccuracy: 70.0
        }];
      }
      if (atom === heroPlaytime.atom) {
        return {
          categoryKeys: ['playerName', 'matchId', 'roundNumber', 'hero'],
          numericalKeys: ['playtime'],
          rows: [] // No playtime data
        };
      }
      return [];
    });
    
    const result = await playerStatsBaseAtomFn(mockGet);
    
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      matchId: 'test-match',
      playerName: 'Player1',
      playerHero: 'Ana',
      playerRole: 'support',
      playtime: 0, // Should default to 0 when no playtime data
      eliminations: 5,
      healingDealt: 8000
    });
  });

  it('should handle multiple players and rounds', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerStat.atom) {
        return [{
          matchId: 'test-match',
          type: 'playerStat',
          matchTime: 1000,
          roundNumber: '1',
          playerTeam: 'Team A',
          playerName: 'Player1',
          playerHero: 'Reinhardt',
          eliminations: 3,
          finalBlows: 2,
          deaths: 1,
          allDamageDealt: 3000,
          barrierDamageDealt: 2000,
          heroDamageDealt: 1000,
          healingDealt: 0,
          healingReceived: 2000,
          selfHealing: 500,
          damageTaken: 4000,
          damageBlocked: 15000,
          defensiveAssists: 1,
          offensiveAssists: 2,
          ultimatesEarned: 1,
          ultimatesUsed: 1,
          multikillBest: 2,
          multikills: 1,
          soloKills: 0,
          objectiveKills: 2,
          environmentalKills: 1,
          environmentalDeaths: 0,
          criticalHits: 5,
          criticalHitAccuracy: 20.0,
          scopedAccuracy: 0,
          scopedCriticalHitAccuracy: 0,
          scopedCriticalHitKills: 0,
          shotsFired: 25,
          shotsHit: 20,
          shotsMissed: 5,
          scopedShotsFired: 0,
          scopedShotsHit: 0,
          weaponAccuracy: 80.0
        }, {
          matchId: 'test-match',
          type: 'playerStat',
          matchTime: 2000,
          roundNumber: '2',
          playerTeam: 'Team A',
          playerName: 'Player1',
          playerHero: 'Reinhardt',
          eliminations: 4,
          finalBlows: 3,
          deaths: 2,
          allDamageDealt: 3500,
          barrierDamageDealt: 2200,
          heroDamageDealt: 1300,
          healingDealt: 0,
          healingReceived: 2500,
          selfHealing: 600,
          damageTaken: 4500,
          damageBlocked: 18000,
          defensiveAssists: 2,
          offensiveAssists: 3,
          ultimatesEarned: 2,
          ultimatesUsed: 1,
          multikillBest: 1,
          multikills: 0,
          soloKills: 1,
          objectiveKills: 3,
          environmentalKills: 0,
          environmentalDeaths: 1,
          criticalHits: 8,
          criticalHitAccuracy: 25.0,
          scopedAccuracy: 0,
          scopedCriticalHitAccuracy: 0,
          scopedCriticalHitKills: 0,
          shotsFired: 32,
          shotsHit: 24,
          shotsMissed: 8,
          scopedShotsFired: 0,
          scopedShotsHit: 0,
          weaponAccuracy: 75.0
        }];
      }
      if (atom === heroPlaytime.atom) {
        return {
          categoryKeys: ['playerName', 'matchId', 'roundNumber', 'hero'],
          numericalKeys: ['playtime'],
          rows: [{
            playerName: 'Player1',
            matchId: 'test-match',
            roundNumber: '1',
            hero: 'Reinhardt',
            playtime: 180
          }, {
            playerName: 'Player1',
            matchId: 'test-match',
            roundNumber: '2',
            hero: 'Reinhardt',
            playtime: 220
          }]
        };
      }
      return [];
    });
    
    const result = await playerStatsBaseAtomFn(mockGet);
    
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({
      roundNumber: '1',
      playerRole: 'tank',
      playtime: 180,
      eliminations: 3
    });
    expect(result.rows[1]).toMatchObject({
      roundNumber: '2',
      playerRole: 'tank',
      playtime: 220,
      eliminations: 4
    });
  });

  it('should include correct category and numerical keys', async () => {
    const mockGet = vi.fn();
    mockGet.mockImplementation(async (atom) => {
      if (atom === playerStat.atom) {
        return [];
      }
      if (atom === heroPlaytime.atom) {
        return {
          categoryKeys: [],
          numericalKeys: [],
          rows: []
        };
      }
      return [];
    });
    
    const result = await playerStatsBaseAtomFn(mockGet);
    
    expect(result.categoryKeys).toBeDefined();
    expect(result.numericalKeys).toBeDefined();
    expect(result.categoryKeys).toContain('playerName');
    expect(result.categoryKeys).toContain('playerHero');
    expect(result.categoryKeys).toContain('playerRole');
    expect(result.numericalKeys).toContain('playtime');
    expect(result.numericalKeys).toContain('eliminations');
  });
});