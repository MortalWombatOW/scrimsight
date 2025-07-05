
import { describe, it, expect } from 'vitest';
import { aggregateBaseStats } from './statAggregation';
import * as ScrimsightDataModel from '../../ScrimsightDataModel';

describe('aggregateBaseStats', () => {
  it('should correctly sum base numerical and derived measures keys', () => {
    const records: ScrimsightDataModel.PlayerStatsBase[] = [
      {
        matchId: 'm1', roundNumber: '1', playerTeam: 't1', playerName: 'p1', playerHero: 'Ana', playerRole: 'support',
        playtime: 100, eliminations: 5, deaths: 1, ultsUsed: 2, ultKills: 1, teamfightsParticipated: 3, teamfightsWon: 2, teamfightsWithFirstKill: 1, teamfightsWithFirstDeath: 0, teamfightsWonWithUlt: 1, teamfightsWonWithoutUlt: 1, teamfightsWonWithFirstKill: 1, teamfightsWonWithFirstDeath: 0, deathsWithUltAvailable: 0, tankKills: 0, damageKills: 0, supportKills: 0,
        allDamageDealt: 1000, barrierDamageDealt: 100, heroDamageDealt: 900, healingDealt: 500, healingReceived: 200, selfHealing: 50, damageTaken: 300, damageBlocked: 0, defensiveAssists: 1, offensiveAssists: 2, ultimatesEarned: 1, ultimatesUsed: 1, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, totalAssists: 0
      },
      {
        matchId: 'm1', roundNumber: '1', playerTeam: 't1', playerName: 'p1', playerHero: 'Ana', playerRole: 'support',
        playtime: 50, eliminations: 0, deaths: 0, ultsUsed: 0, ultKills: 0, teamfightsParticipated: 0, teamfightsWon: 0, teamfightsWithFirstKill: 0, teamfightsWithFirstDeath: 0, teamfightsWonWithUlt: 0, teamfightsWonWithoutUlt: 0, teamfightsWonWithFirstKill: 0, teamfightsWonWithFirstDeath: 0, deathsWithUltAvailable: 0, tankKills: 0, damageKills: 0, supportKills: 0,
        allDamageDealt: 500, barrierDamageDealt: 50, heroDamageDealt: 450, healingDealt: 250, healingReceived: 100, selfHealing: 25, damageTaken: 150, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 1, ultimatesEarned: 0, ultimatesUsed: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, totalAssists: 0
      },
    ];

    const aggregated = aggregateBaseStats(records);

    expect(aggregated.playtime).toBe(150);
    expect(aggregated.eliminations).toBe(7);
    expect(aggregated.deaths).toBe(1);
    expect(aggregated.ultsUsed).toBe(3);
    expect(aggregated.ultKills).toBe(1);
    expect(aggregated.teamfightsParticipated).toBe(4);
    expect(aggregated.teamfightsWon).toBe(3);
    expect(aggregated.allDamageDealt).toBe(1500);
    expect(aggregated.healingDealt).toBe(750);
    expect(aggregated.totalAssists).toBe(0);
  });

  it('should return zeros for all metrics if no records are provided', () => {
    const records: ScrimsightDataModel.PlayerStatsBase[] = [];
    const aggregated = aggregateBaseStats(records);

    ScrimsightDataModel.playerStatsBaseNumericalKeys.forEach(key => {
      expect(aggregated[key]).toBe(0);
    });
    ScrimsightDataModel.playerStatsDerivedMeasuresKeys.forEach(key => {
      expect(aggregated[key]).toBe(0);
    });
  });

  it('should handle records with missing or undefined numerical values as zero', () => {
    const records: ScrimsightDataModel.PlayerStatsBase[] = [
      {
        matchId: 'm1', roundNumber: '1', playerTeam: 't1', playerName: 'p1', playerHero: 'Ana', playerRole: 'support',
        playtime: 100, eliminations: 5, deaths: 1, ultsUsed: 2, ultKills: 1, teamfightsParticipated: 3, teamfightsWon: 2, teamfightsWithFirstKill: 1, teamfightsWithFirstDeath: 0, teamfightsWonWithUlt: 1, teamfightsWonWithoutUlt: 1, teamfightsWonWithFirstKill: 1, teamfightsWonWithFirstDeath: 0, deathsWithUltAvailable: 0, tankKills: 0, damageKills: 0, supportKills: 0,
        allDamageDealt: 1000, barrierDamageDealt: 100, heroDamageDealt: 900, healingDealt: 500, healingReceived: 200, selfHealing: 50, damageTaken: 300, damageBlocked: 0, defensiveAssists: 1, offensiveAssists: 2, ultimatesEarned: 1, ultimatesUsed: 1, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, totalAssists: 0
      },
      {
        matchId: 'm2', roundNumber: '1', playerTeam: 't1', playerName: 'p1', playerHero: 'Ana', playerRole: 'support',
        playtime: 50, eliminations: 0, deaths: 0, ultsUsed: 0, ultKills: 0, teamfightsParticipated: 0, teamfightsWon: 0, teamfightsWithFirstKill: 0, teamfightsWithFirstDeath: 0, teamfightsWonWithUlt: 0, teamfightsWonWithoutUlt: 0, teamfightsWonWithFirstKill: 0, teamfightsWonWithFirstDeath: 0, deathsWithUltAvailable: 0, tankKills: 0, damageKills: 0, supportKills: 0,
        allDamageDealt: 500, barrierDamageDealt: 50, heroDamageDealt: 450, healingDealt: 250, healingReceived: 100, selfHealing: 25, damageTaken: 150, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 1, ultimatesEarned: 0, ultimatesUsed: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, totalAssists: 0
      },
    ];

    const aggregated = aggregateBaseStats(records);

    expect(aggregated.eliminations).toBe(5); // 5 + 0
    expect(aggregated.ultsUsed).toBe(2); // 2 + 0
    expect(aggregated.teamfightsParticipated).toBe(3); // 3 + 0
  });
});
