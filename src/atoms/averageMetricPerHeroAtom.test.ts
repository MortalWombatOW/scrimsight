import { describe, it, expect } from 'vitest';
import { averageMetricPerHeroAtomFn } from '@atoms/averageMetricPerHeroAtom';
import type { PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys } from '@atoms';
import type { Metric } from '@library';

describe('averageMetricPerHeroAtomFn', () => {
  const mockPlayerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
    categoryKeys: ['playerName', 'playerHero'],
    numericalKeys: ['playtime', 'eliminations', 'finalBlows', 'deaths'],
    rows: [
      {
        matchId: 'match1',
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        roundNumber: '1',
        playerRole: 'support',
        playtime: 300,
        eliminations: 10,
        finalBlows: 8,
        deaths: 2,
        allDamageDealt: 0,
        barrierDamageDealt: 0,
        heroDamageDealt: 0,
        healingDealt: 1000,
        healingReceived: 200,
        selfHealing: 100,
        damageTaken: 500,
        damageBlocked: 0,
        defensiveAssists: 5,
        offensiveAssists: 3,
        ultimatesEarned: 2,
        ultimatesUsed: 2,
        multikills: 0,
        soloKills: 1,
        objectiveKills: 2,
        environmentalKills: 0,
        environmentalDeaths: 0,
        criticalHits: 0,
        shotsFired: 0,
        shotsHit: 0,
        shotsMissed: 0,
        scopedShotsFired: 0,
        scopedShotsHit: 0,
      } as PlayerStatsBase,
      {
        matchId: 'match1',
        playerTeam: 'Team B',
        playerName: 'Player2', 
        playerHero: 'Ana',
        roundNumber: '1',
        playerRole: 'support',
        playtime: 400,
        eliminations: 15,
        finalBlows: 12,
        deaths: 3,
        allDamageDealt: 0,
        barrierDamageDealt: 0,
        heroDamageDealt: 0,
        healingDealt: 1200,
        healingReceived: 250,
        selfHealing: 120,
        damageTaken: 600,
        damageBlocked: 0,
        defensiveAssists: 6,
        offensiveAssists: 4,
        ultimatesEarned: 3,
        ultimatesUsed: 3,
        multikills: 0,
        soloKills: 2,
        objectiveKills: 3,
        environmentalKills: 0,
        environmentalDeaths: 0,
        criticalHits: 0,
        shotsFired: 0,
        shotsHit: 0,
        shotsMissed: 0,
        scopedShotsFired: 0,
        scopedShotsHit: 0,
      } as PlayerStatsBase,
      {
        matchId: 'match2',
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Genji',
        roundNumber: '1',
        playerRole: 'damage',
        playtime: 500,
        eliminations: 20,
        finalBlows: 18,
        deaths: 1,
        allDamageDealt: 2000,
        barrierDamageDealt: 500,
        heroDamageDealt: 1500,
        healingDealt: 0,
        healingReceived: 300,
        selfHealing: 50,
        damageTaken: 200,
        damageBlocked: 0,
        defensiveAssists: 1,
        offensiveAssists: 8,
        ultimatesEarned: 3,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 5,
        objectiveKills: 8,
        environmentalKills: 1,
        environmentalDeaths: 0,
        criticalHits: 20,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 0,
        scopedShotsHit: 0,
      } as PlayerStatsBase
    ]
  };

  const uniqueHeroes = ['Ana', 'Genji'];

  it('should calculate average metrics per hero correctly', () => {
    const result = averageMetricPerHeroAtomFn(mockPlayerStatsData, uniqueHeroes);
    
    // Should return an object with hero names as keys and their average stats
    expect(result).toHaveProperty('Ana');
    expect(result).toHaveProperty('Genji');
    expect(typeof result.Ana).toBe('object');
    expect(typeof result.Genji).toBe('object');
  });

  it('should handle empty player stats array', () => {
    const emptyData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
      categoryKeys: ['playerName', 'playerHero'],
      numericalKeys: ['playtime', 'eliminations', 'finalBlows', 'deaths'],
      rows: []
    };
    const result = averageMetricPerHeroAtomFn(emptyData, uniqueHeroes);
    expect(result).toHaveProperty('Ana');
    expect(result).toHaveProperty('Genji');
  });

  it('should handle empty unique heroes array', () => {
    const result = averageMetricPerHeroAtomFn(mockPlayerStatsData, []);
    expect(typeof result).toBe('object');
  });

});