
import { describe, it, expect } from 'vitest';
import { computeDerivedStats } from './derivedStatComputation';
import * as ScrimsightDataModel from '../../ScrimsightDataModel';

describe('computeDerivedStats', () => {
  const mockAggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
    playtime: 600, // 10 minutes
    eliminations: 10,
    finalBlows: 8,
    deaths: 2,
    allDamageDealt: 5000,
    barrierDamageDealt: 1000,
    heroDamageDealt: 4000,
    healingDealt: 2000,
    healingReceived: 1000,
    selfHealing: 500,
    damageTaken: 1500,
    damageBlocked: 500,
    defensiveAssists: 3,
    offensiveAssists: 5,
    ultimatesEarned: 4,
    ultimatesUsed: 3,
    multikills: 2,
    soloKills: 1,
    objectiveKills: 2,
    environmentalKills: 0,
    environmentalDeaths: 0,
    criticalHits: 20,
    shotsFired: 100,
    shotsHit: 50,
    shotsMissed: 50,
    scopedShotsFired: 20,
    scopedShotsHit: 10,
    ultsUsed: 3,
    ultKills: 6,
    teamfightsParticipated: 10,
    teamfightsWithFirstKill: 4,
    teamfightsWithFirstDeath: 2,
    teamfightsWon: 7,
    teamfightsWonWithUlt: 3,
    teamfightsWonWithoutUlt: 4,
    teamfightsWonWithFirstKill: 3,
    teamfightsWonWithFirstDeath: 1,
    deathsWithUltAvailable: 1,
    tankKills: 3,
    damageKills: 5,
    supportKills: 2,
    totalAssists: 8,
  };

  const mockDataModel: ScrimsightDataModel.ScrimsightDataModel = {
    ultimateCharged: [
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 100, ultimateId: 1, type: 'ultimate_charged' },
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 300, ultimateId: 2, type: 'ultimate_charged' },
    ],
    ultimateStart: [
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 150, ultimateId: 1, type: 'ultimate_start' },
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 350, ultimateId: 2, type: 'ultimate_start' },
    ],
    ultimateEnd: [
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 200, ultimateId: 1, type: 'ultimate_end' },
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 400, ultimateId: 2, type: 'ultimate_end' },
    ],
    playerLives: [
      { matchId: 'm1', roundIndex: 1, player: 'p1', hero: 'Ana', startTime: 0, endTime: 600, duration: 600, causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
    ],
  } as unknown as ScrimsightDataModel.ScrimsightDataModel;

  it('should calculate per-10-minute stats correctly', () => {
    const stats = computeDerivedStats(mockAggregatedBase, mockDataModel, {});
    expect(stats.eliminationsPer10Minutes).toBe(10);
    expect(stats.deathsPer10Minutes).toBe(2);
    expect(stats.allDamageDealtPer10Minutes).toBe(5000);
  });

  it('should calculate accuracy stats correctly', () => {
    const stats = computeDerivedStats(mockAggregatedBase, mockDataModel, {});
    expect(stats.weaponAccuracy).toBe(50);
    expect(stats.scopedWeaponAccuracy).toBe(50);
    expect(stats.criticalHitRate).toBe(40);
  });

  it('should calculate derived ratios correctly', () => {
    const stats = computeDerivedStats(mockAggregatedBase, mockDataModel, {});
    expect(stats.killsPerUltimate).toBe(2); // 6 ultKills / 3 ultsUsed
    expect(stats.firstKillRate).toBe(0.4); // 4 / 10
    expect(stats.firstDeathRate).toBe(0.2); // 2 / 10
    expect(stats.teamfightWinRate).toBe(0.7); // 7 / 10
    expect(stats.teamfightWinRateWithUlt).toBe(0.3); // 3 / 10
    expect(stats.teamfightWinRateWithoutUlt).toBe(0.4); // 4 / 10
    expect(stats.teamfightWinRateWithFirstKill).toBe(0.3); // 3 / 10
    expect(stats.teamfightWinRateWithFirstDeath).toBe(0.1); // 1 / 10
    expect(stats.tankFocusRate).toBe(0.3); // 3 / 10
    expect(stats.damageFocusRate).toBe(0.5); // 5 / 10
    expect(stats.supportFocusRate).toBe(0.2); // 2 / 10
    expect(stats.totalAssistsPer10Minutes).toBe(8);
    expect(stats.damagePerKill).toBe(500); // 5000 / 10
    expect(stats.damageDonePerHealingReceived).toBe(5); // 5000 / 1000
    expect(stats.kdr).toBe(4); // 8 / 2
  });

  it('should calculate ultimate timing stats correctly', () => {
    const stats = computeDerivedStats(mockAggregatedBase, mockDataModel, { matchId: 'm1', playerName: 'p1', playerHero: 'Ana' });
    expect(stats.ultimateChargeTime).toBe(200); // (300-100) / 1
    expect(stats.ultimateHoldTime).toBe(50); // (150-100) / 1
    expect(stats.ultimateUseTime).toBe(50); // (200-150) / 1
  });

  it('should calculate average life duration correctly', () => {
    const stats = computeDerivedStats(mockAggregatedBase, mockDataModel, { matchId: 'm1', playerName: 'p1', playerHero: 'Ana' });
    expect(stats.averageLifeDuration).toBe(600); // 600 / 1
  });

  it('should handle zero playtime for per-10-minute stats', () => {
    const baseWithZeroPlaytime = { ...mockAggregatedBase, playtime: 0 };
    const stats = computeDerivedStats(baseWithZeroPlaytime, mockDataModel, {});
    expect(stats.eliminationsPer10Minutes).toBe(0);
    expect(stats.deathsPer10Minutes).toBe(0);
  });

  it('should handle zero shots fired for accuracy stats', () => {
    const baseWithZeroShots = { ...mockAggregatedBase, shotsFired: 0, scopedShotsFired: 0, shotsHit: 0, criticalHits: 0 };
    const stats = computeDerivedStats(baseWithZeroShots, mockDataModel, {});
    expect(stats.weaponAccuracy).toBe(0);
    expect(stats.scopedWeaponAccuracy).toBe(0);
    expect(stats.criticalHitRate).toBe(0);
  });

  it('should handle zero denominators for ratios', () => {
    const baseWithZeroDenominators = { ...mockAggregatedBase, ultsUsed: 0, teamfightsParticipated: 0, eliminations: 0, deaths: 0, healingReceived: 0 };
    const stats = computeDerivedStats(baseWithZeroDenominators, mockDataModel, {});
    expect(stats.killsPerUltimate).toBe(0);
    expect(stats.firstKillRate).toBe(0);
    expect(stats.teamfightWinRate).toBe(0);
    expect(stats.tankFocusRate).toBe(0);
    expect(stats.damagePerKill).toBe(0);
    expect(stats.damageDonePerHealingReceived).toBe(0);
    expect(stats.kdr).toBe(mockAggregatedBase.finalBlows); // finalBlows / 0 = finalBlows
  });
});
