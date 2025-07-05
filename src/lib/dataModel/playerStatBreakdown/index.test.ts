

import { describe, it, expect, vi } from 'vitest';
import { buildPlayerStatBreakdown } from './index';
import * as ScrimsightDataModel from '../../ScrimsightDataModel';
import * as baseStatCollection from './baseStatCollection';
import * as statAggregation from './statAggregation';
import * as derivedStatComputation from './derivedStatComputation';

describe('buildPlayerStatBreakdown (integration)', () => {
  // Mock dependencies to test the orchestration logic
  vi.mock('./baseStatCollection', () => ({
    calculatePlaytime: vi.fn(() => 100),
    calculateUltsUsed: vi.fn(() => 1),
    calculateTotalAssists: vi.fn(() => 2),
    calculateRoleBasedKills: vi.fn(() => ({ tankKills: 1, damageKills: 1, supportKills: 1 })),
    calculateUltKills: vi.fn(() => 1),
    calculateTeamfightsParticipated: vi.fn(() => 5),
    calculateTeamfightsWon: vi.fn(() => 3),
    calculateTeamfightsWonWithUlt: vi.fn(() => 1),
    calculateTeamfightsWithFirstKill: vi.fn(() => 2),
    calculateTeamfightsWithFirstDeath: vi.fn(() => 1),
    calculateTeamfightsWonWithFirstKill: vi.fn(() => 1),
    calculateTeamfightsWonWithFirstDeath: vi.fn(() => 0),
    calculateDeathsWithUltAvailable: vi.fn(() => 0),
  }));

  vi.mock('./statAggregation', () => ({
    aggregateBaseStats: vi.fn((records) => {
      // Simple aggregation for testing purposes
      if (records.length === 0) return {} as ScrimsightDataModel.PlayerStatsAggregatedBase;
      return {
        playtime: records.reduce((sum, r) => sum + r.playtime, 0),
        eliminations: records.reduce((sum, r) => sum + r.eliminations, 0),
        deaths: records.reduce((sum, r) => sum + r.deaths, 0),
        ultsUsed: records.reduce((sum, r) => sum + r.ultsUsed, 0),
        ultKills: records.reduce((sum, r) => sum + r.ultKills, 0),
        teamfightsParticipated: records.reduce((sum, r) => sum + r.teamfightsParticipated, 0),
        teamfightsWon: records.reduce((sum, r) => sum + r.teamfightsWon, 0),
        teamfightsWonWithUlt: records.reduce((sum, r) => sum + r.teamfightsWonWithUlt, 0),
        teamfightsWonWithoutUlt: records.reduce((sum, r) => sum + r.teamfightsWonWithoutUlt, 0),
        teamfightsWithFirstKill: records.reduce((sum, r) => sum + r.teamfightsWithFirstKill, 0),
        teamfightsWithFirstDeath: records.reduce((sum, r) => sum + r.teamfightsWithFirstDeath, 0),
        teamfightsWonWithFirstKill: records.reduce((sum, r) => sum + r.teamfightsWonWithFirstKill, 0),
        teamfightsWonWithFirstDeath: records.reduce((sum, r) => sum + r.teamfightsWonWithFirstDeath, 0),
        deathsWithUltAvailable: records.reduce((sum, r) => sum + r.deathsWithUltAvailable, 0),
        tankKills: records.reduce((sum, r) => sum + r.tankKills, 0),
        damageKills: records.reduce((sum, r) => sum + r.damageKills, 0),
        supportKills: records.reduce((sum, r) => sum + r.supportKills, 0),
        totalAssists: records.reduce((sum, r) => sum + r.totalAssists, 0),
      } as ScrimsightDataModel.PlayerStatsAggregatedBase;
    }),
  }));

  vi.mock('./derivedStatComputation', () => ({
    computeDerivedStats: vi.fn((aggregatedBase) => ({
      ...aggregatedBase,
      eliminationsPer10Minutes: aggregatedBase.eliminations / 10,
      kdr: aggregatedBase.finalBlows / aggregatedBase.deaths,
      weaponAccuracy: 0.5,
      criticalHitRate: 0.1,
      killsPerUltimate: aggregatedBase.ultKills / aggregatedBase.ultsUsed,
      firstKillRate: aggregatedBase.teamfightsWithFirstKill / aggregatedBase.teamfightsParticipated,
      firstDeathRate: aggregatedBase.teamfightsWithFirstDeath / aggregatedBase.teamfightsParticipated,
      teamfightWinRate: aggregatedBase.teamfightsWon / aggregatedBase.teamfightsParticipated,
      teamfightWinRateWithUlt: aggregatedBase.teamfightsWonWithUlt / aggregatedBase.teamfightsParticipated,
      teamfightWinRateWithoutUlt: aggregatedBase.teamfightsWonWithoutUlt / aggregatedBase.teamfightsParticipated,
      teamfightWinRateWithFirstKill: aggregatedBase.teamfightsWonWithFirstKill / aggregatedBase.teamfightsParticipated,
      teamfightWinRateWithFirstDeath: aggregatedBase.teamfightsWonWithFirstDeath / aggregatedBase.teamfightsParticipated,
      ultimateChargeTime: 10,
      ultimateHoldTime: 5,
      ultimateUseTime: 5,
      tankFocusRate: aggregatedBase.tankKills / aggregatedBase.eliminations,
      damageFocusRate: aggregatedBase.damageKills / aggregatedBase.eliminations,
      supportFocusRate: aggregatedBase.supportKills / aggregatedBase.eliminations,
      averageLifeDuration: 100,
      totalAssistsPer10Minutes: aggregatedBase.totalAssists / 10,
      damagePerKill: aggregatedBase.allDamageDealt / aggregatedBase.eliminations,
      damageDonePerHealingReceived: aggregatedBase.allDamageDealt / aggregatedBase.healingReceived,
    })),
  }));

  const mockDataModel: ScrimsightDataModel.ScrimsightDataModel = {
    playerStat: [
      { matchId: 'm1', roundNumber: '1', playerName: 'p1', playerTeam: 't1', playerHero: 'Ana', eliminations: 10, finalBlows: 8, deaths: 2, allDamageDealt: 1000, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0, matchTime: 0, type: 'player_stat' },
      { matchId: 'm1', roundNumber: '1', playerName: 'p2', playerTeam: 't1', playerHero: 'Mercy', eliminations: 5, finalBlows: 3, deaths: 1, allDamageDealt: 500, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0, matchTime: 0, type: 'player_stat' },
    ],
    matches: [
      { match: 'm1', scrim: 's1', teams: ['t1', 't2'], map: 'King\'s Row', date: new Date(), rounds: [], duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
    ],
  } as unknown as ScrimsightDataModel.ScrimsightDataModel;

  it('should call baseStatCollection, statAggregation, and derivedStatComputation', () => {
    buildPlayerStatBreakdown(mockDataModel);

    expect(baseStatCollection.calculatePlaytime).toHaveBeenCalled();
    expect(statAggregation.aggregateBaseStats).toHaveBeenCalled();
    expect(derivedStatComputation.computeDerivedStats).toHaveBeenCalled();
  });

  it('should return a correctly structured playerStatBreakdown object', () => {
    const result = buildPlayerStatBreakdown(mockDataModel);

    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('byPlayer');
    expect(result.byPlayer).toHaveLength(2);
    expect(result).toHaveProperty('byTeam');
    expect(result.byTeam).toHaveLength(1);
    expect(result).toHaveProperty('byTeamAndPlayer');
    expect(result.byTeamAndPlayer).toHaveLength(2);
    expect(result).toHaveProperty('byPlayerAndHero');
    expect(result.byPlayerAndHero).toHaveLength(2);
    expect(result).toHaveProperty('byRole');
    expect(result.byRole).toHaveLength(2);
    expect(result).toHaveProperty('byHero');
    expect(result.byHero).toHaveLength(2);
    expect(result).toHaveProperty('byTeamAndMatch');
    expect(result.byTeamAndMatch).toHaveLength(1);
    expect(result).toHaveProperty('byTeamAndPlayerAndMatch');
    expect(result.byTeamAndPlayerAndMatch).toHaveLength(2);
    expect(result).toHaveProperty('byTeamAndPlayerAndScrim');
    expect(result.byTeamAndPlayerAndScrim).toHaveLength(2);
    expect(result).toHaveProperty('byTeamAndScrim');
    expect(result.byTeamAndScrim).toHaveLength(1);
  });

  it('should pass correct data to computeDerivedStats for total aggregation', () => {
    buildPlayerStatBreakdown(mockDataModel);

    const totalAggregatedBase = (statAggregation.aggregateBaseStats as vi.Mock).mock.results[0].value;
    expect(derivedStatComputation.computeDerivedStats).toHaveBeenCalledWith(totalAggregatedBase, mockDataModel, {});
  });

  it('should pass correct data to computeDerivedStats for byPlayer aggregation', () => {
    buildPlayerStatBreakdown(mockDataModel);

    const p1AggregatedBase = (statAggregation.aggregateBaseStats as vi.Mock).mock.results[1].value;
    expect(derivedStatComputation.computeDerivedStats).toHaveBeenCalledWith(p1AggregatedBase, mockDataModel, { playerName: 'p1' });

    const p2AggregatedBase = (statAggregation.aggregateBaseStats as vi.Mock).mock.results[2].value;
    expect(derivedStatComputation.computeDerivedStats).toHaveBeenCalledWith(p2AggregatedBase, mockDataModel, { playerName: 'p2' });
  });
});
