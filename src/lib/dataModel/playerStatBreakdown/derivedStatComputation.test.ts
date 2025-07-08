import { describe, it, expect } from 'vitest';
import * as ScrimsightDataModel from "../../ScrimsightDataModel";
import { computeDerivedStats } from "./derivedStatComputation";

describe('derivedStatComputation', () => {
  describe('killsPerUltimate', () => {
    it('should calculate kills per ultimate correctly using ultsUsed derived measure', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        // Base stats
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        // Derived measures
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 2,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.killsPerUltimate).toBe(2); // 6 ultKills / 3 ultsUsed
    });

    it('should return 0 when no ultimates are used', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 0,
        ultKills: 0,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 2,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.killsPerUltimate).toBe(0);
    });
  });

  describe('teamfight win rates', () => {
    it('should calculate all teamfight win rates correctly using aggregated measures', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 10,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 6,
        teamfightsWonWithUlt: 2,
        teamfightsWonWithoutUlt: 4,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 2,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.teamfightWinRate).toBe(0.6); // 6/10
      expect(result.teamfightWinRateWithUlt).toBe(0.2); // 2/10
      expect(result.teamfightWinRateWithoutUlt).toBe(0.4); // 4/10
      expect(result.teamfightWinRateWithFirstKill).toBe(0.3); // 3/10
      expect(result.teamfightWinRateWithFirstDeath).toBe(0.1); // 1/10
    });

    it('should return 0 for all teamfight win rates when no teamfights participated', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 0,
        teamfightsWithFirstKill: 0,
        teamfightsWithFirstDeath: 0,
        teamfightsWon: 0,
        teamfightsWonWithUlt: 0,
        teamfightsWonWithoutUlt: 0,
        teamfightsWonWithFirstKill: 0,
        teamfightsWonWithFirstDeath: 0,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 2,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.teamfightWinRate).toBe(0);
      expect(result.teamfightWinRateWithUlt).toBe(0);
      expect(result.teamfightWinRateWithoutUlt).toBe(0);
      expect(result.teamfightWinRateWithFirstKill).toBe(0);
      expect(result.teamfightWinRateWithFirstDeath).toBe(0);
    });
  });

  describe('first kill and death rates', () => {
    it('should calculate first kill and death rates correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 3,
        teamfightsWithFirstDeath: 4,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 2,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.firstKillRate).toBe(0.25); // 3/12
      expect(result.firstDeathRate).toBeCloseTo(0.3333333333333333); // 4/12
    });

    it('should return 0 for first kill and death rates when no teamfights participated', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 0,
        teamfightsWithFirstKill: 0,
        teamfightsWithFirstDeath: 0,
        teamfightsWon: 0,
        teamfightsWonWithUlt: 0,
        teamfightsWonWithoutUlt: 0,
        teamfightsWonWithFirstKill: 0,
        teamfightsWonWithFirstDeath: 0,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 2,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.firstKillRate).toBe(0);
      expect(result.firstDeathRate).toBe(0);
    });
  });

  describe('role focus rates', () => {
    it('should calculate role focus rates correctly using aggregated measures', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.tankFocusRate).toBe(0.2); // 2/10
      expect(result.damageFocusRate).toBe(0.4); // 4/10
      expect(result.supportFocusRate).toBe(0.4); // 4/10
    });

    it('should return 0 for all role focus rates when no eliminations', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 0,
        finalBlows: 0,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 0,
        damageKills: 0,
        supportKills: 0,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.tankFocusRate).toBe(0);
      expect(result.damageFocusRate).toBe(0);
      expect(result.supportFocusRate).toBe(0);
    });
  });

  describe('accuracy calculations', () => {
    it('should calculate weapon accuracy correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.weaponAccuracy).toBe(60); // (60/100) * 100
      expect(result.scopedWeaponAccuracy).toBe(75); // (15/20) * 100
      expect(result.criticalHitRate).toBeCloseTo(41.666666666666664, 10); // (25/60) * 100
    });

    it('should return 0 for weapon accuracy when no shots fired', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 0,
        shotsHit: 0,
        shotsMissed: 0,
        scopedShotsFired: 0,
        scopedShotsHit: 0,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.weaponAccuracy).toBe(0);
      expect(result.scopedWeaponAccuracy).toBe(0);
      expect(result.criticalHitRate).toBe(0);
    });
  });

  describe('per-10-minute calculations', () => {
    it('should calculate per-10-minute stats correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600, // 10 minutes
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.eliminationsPer10Minutes).toBe(10); // 10 eliminations / 10 minutes * 10
      expect(result.finalBlowsPer10Minutes).toBe(8); // 8 finalBlows / 10 minutes * 10
      expect(result.deathsPer10Minutes).toBe(3); // 3 deaths / 10 minutes * 10
      expect(result.allDamageDealtPer10Minutes).toBe(5000); // 5000 damage / 10 minutes * 10
      expect(result.totalAssistsPer10Minutes).toBe(12); // 12 assists / 10 minutes * 10
    });

    it('should return 0 for per-10-minute stats when no playtime', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 0,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.eliminationsPer10Minutes).toBe(0);
      expect(result.finalBlowsPer10Minutes).toBe(0);
      expect(result.deathsPer10Minutes).toBe(0);
      expect(result.allDamageDealtPer10Minutes).toBe(0);
      expect(result.totalAssistsPer10Minutes).toBe(0);
    });
  });

  describe('kdr calculation', () => {
    it('should calculate KDR correctly when deaths > 0', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 4,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.kdr).toBe(2); // 8 finalBlows / 4 deaths
    });

    it('should return finalBlows when no deaths', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 0,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.kdr).toBe(8); // finalBlows when deaths = 0
    });
  });

  describe('damage and healing ratios', () => {
    it('should calculate damage per kill correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.damagePerKill).toBe(500); // 5000 allDamageDealt / 10 eliminations
      expect(result.damageDonePerHealingReceived).toBeCloseTo(3.3333333333333335); // 5000 / 1500
    });

    it('should return 0 for damage per kill when no eliminations', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 0,
        finalBlows: 0,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.damagePerKill).toBe(0);
    });

    it('should return 0 for damage per healing received when no healing received', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 0,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.damageDonePerHealingReceived).toBe(0);
    });
  });

  describe('ultimate timing metrics', () => {
    it('should calculate ultimate charge time correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {
        ultimateCharged: [
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 30, ultimateId: 1 },
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 90, ultimateId: 2 },
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 150, ultimateId: 3 },
        ],
        heroSpawn: [
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 0 },
        ],
        ultimateEnd: [
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 60, ultimateId: 1 },
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 120, ultimateId: 2 },
        ],
        kill: [
          { matchId: 'match1', victimName: 'testPlayer', victimHero: 'Tracer', matchTime: 80 },
        ],
        ultimateStart: [],
        playerLives: [],
      } as ScrimsightDataModel.ScrimsightDataModel;

      const grouping = { 
        playerName: 'testPlayer',
        playerHero: 'Tracer' as ScrimsightDataModel.Hero,
        matchId: 'match1'
      };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      // Let me calculate the expected value from the test data:
      // Charged at 30: 30 - 0 = 30 (from spawn)
      // Charged at 90: 90 - 80 = 10 (from death at 80, which is more recent than ultimateEnd at 60)
      // Charged at 150: 150 - 120 = 30 (from ultimateEnd at 120)
      // Average: (30 + 10 + 30) / 3 = 23.33
      expect(result.ultimateChargeTime).toBeCloseTo(23.333333333333332);
    });

    it('should calculate ultimate hold time correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {
        ultimateCharged: [
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 30, ultimateId: 1 },
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 90, ultimateId: 2 },
        ],
        ultimateStart: [
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 50, ultimateId: 1 },
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 100, ultimateId: 2 },
        ],
        heroSpawn: [],
        ultimateEnd: [],
        kill: [],
        playerLives: [],
      } as ScrimsightDataModel.ScrimsightDataModel;

      const grouping = { 
        playerName: 'testPlayer',
        playerHero: 'Tracer' as ScrimsightDataModel.Hero,
        matchId: 'match1'
      };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.ultimateHoldTime).toBe(15); // Average of 20, 10 seconds
    });

    it('should calculate ultimate use time correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {
        ultimateStart: [
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 50, ultimateId: 1 },
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 100, ultimateId: 2 },
        ],
        ultimateEnd: [
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 55, ultimateId: 1 },
          { matchId: 'match1', playerName: 'testPlayer', playerHero: 'Tracer', matchTime: 108, ultimateId: 2 },
        ],
        ultimateCharged: [],
        heroSpawn: [],
        kill: [],
        playerLives: [],
      } as ScrimsightDataModel.ScrimsightDataModel;

      const grouping = { 
        playerName: 'testPlayer',
        playerHero: 'Tracer' as ScrimsightDataModel.Hero,
        matchId: 'match1'
      };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.ultimateUseTime).toBe(6.5); // Average of 5, 8 seconds
    });

    it('should calculate average life duration correctly', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {
        playerLives: [
          { matchId: 'match1', player: 'testPlayer', duration: 45 },
          { matchId: 'match1', player: 'testPlayer', duration: 30 },
          { matchId: 'match1', player: 'testPlayer', duration: 60 },
        ],
        ultimateCharged: [],
        ultimateStart: [],
        ultimateEnd: [],
        heroSpawn: [],
        kill: [],
      } as ScrimsightDataModel.ScrimsightDataModel;

      const grouping = { 
        playerName: 'testPlayer',
        matchId: 'match1'
      };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.averageLifeDuration).toBe(45); // Average of 45, 30, 60 seconds
    });

    it('should return 0 for ultimate metrics when no data available', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {
        ultimateCharged: [],
        ultimateStart: [],
        ultimateEnd: [],
        heroSpawn: [],
        kill: [],
        playerLives: [],
      } as ScrimsightDataModel.ScrimsightDataModel;

      const grouping = { 
        playerName: 'testPlayer',
        playerHero: 'Tracer' as ScrimsightDataModel.Hero,
        matchId: 'match1'
      };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      expect(result.ultimateChargeTime).toBe(0);
      expect(result.ultimateHoldTime).toBe(0);
      expect(result.ultimateUseTime).toBe(0);
      expect(result.averageLifeDuration).toBe(0);
    });
  });

  describe('integration tests', () => {
    it('should return all base stats plus calculated derived ratios', () => {
      const aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase = {
        playtime: 600,
        eliminations: 10,
        finalBlows: 8,
        deaths: 3,
        allDamageDealt: 5000,
        barrierDamageDealt: 1000,
        heroDamageDealt: 4000,
        healingDealt: 2000,
        healingReceived: 1500,
        selfHealing: 500,
        damageTaken: 3000,
        damageBlocked: 1200,
        defensiveAssists: 5,
        offensiveAssists: 7,
        ultimatesEarned: 4,
        ultimatesUsed: 3,
        multikills: 2,
        soloKills: 1,
        objectiveKills: 4,
        environmentalKills: 0,
        environmentalDeaths: 1,
        criticalHits: 25,
        shotsFired: 100,
        shotsHit: 60,
        shotsMissed: 40,
        scopedShotsFired: 20,
        scopedShotsHit: 15,
        
        ultsUsed: 3,
        ultKills: 6,
        teamfightsParticipated: 12,
        teamfightsWithFirstKill: 4,
        teamfightsWithFirstDeath: 2,
        teamfightsWon: 8,
        teamfightsWonWithUlt: 3,
        teamfightsWonWithoutUlt: 5,
        teamfightsWonWithFirstKill: 3,
        teamfightsWonWithFirstDeath: 1,
        deathsWithUltAvailable: 1,
        tankKills: 2,
        damageKills: 4,
        supportKills: 4,
        totalAssists: 12,
      };

      const mockDataModel = {} as ScrimsightDataModel.ScrimsightDataModel;
      const grouping = { playerName: 'testPlayer' };

      const result = computeDerivedStats(aggregatedBase, mockDataModel, grouping);

      // Should include all base stats
      expect(result.playtime).toBe(600);
      expect(result.eliminations).toBe(10);
      expect(result.finalBlows).toBe(8);
      expect(result.deaths).toBe(3);
      expect(result.allDamageDealt).toBe(5000);
      expect(result.teamfightsParticipated).toBe(12);
      expect(result.teamfightsWon).toBe(8);
      expect(result.ultsUsed).toBe(3);
      expect(result.ultKills).toBe(6);

      // Should include calculated derived ratios
      expect(result.eliminationsPer10Minutes).toBe(10);
      expect(result.finalBlowsPer10Minutes).toBe(8);
      expect(result.deathsPer10Minutes).toBe(3);
      expect(result.teamfightWinRate).toBeCloseTo(0.6666666666666666);
      expect(result.firstKillRate).toBeCloseTo(0.3333333333333333);
      expect(result.firstDeathRate).toBeCloseTo(0.16666666666666666);
      expect(result.killsPerUltimate).toBe(2);
      expect(result.weaponAccuracy).toBe(60);
      expect(result.tankFocusRate).toBe(0.2);
      expect(result.damageFocusRate).toBe(0.4);
      expect(result.supportFocusRate).toBe(0.4);
      expect(result.kdr).toBeCloseTo(2.6666666666666665);
      expect(result.damagePerKill).toBe(500);
      expect(result.damageDonePerHealingReceived).toBeCloseTo(3.3333333333333335);
    });
  });
});