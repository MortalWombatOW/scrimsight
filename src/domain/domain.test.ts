import { describe, it, expect } from 'vitest';
import { calculatePlayerStats } from './stats';
import { calculateTeamfights } from './teamfights';
import { detectScrims } from './scrims';
import { calculateRoundTimes, calculateMapTimes } from './timeline';
import { calculateUltimateEvents } from './ultimateEvents';
import { ingestFile } from '../data/ingestor';
import sampleFile1 from '@library/sampledata/Log-2023-08-28-17-05-38.txt?raw';
import sampleFile2 from '@library/sampledata/Log-2023-08-28-17-29-57.txt?raw';

describe('Domain Functions', () => {
  let processedMatch1: Awaited<ReturnType<typeof ingestFile>>;
  let processedMatch2: Awaited<ReturnType<typeof ingestFile>>;

  // Setup: ingest sample files
  beforeAll(async () => {
    processedMatch1 = await ingestFile({
      fileContent: sampleFile1,
      fileName: 'sample1.txt',
      fileModified: Date.now(),
    });

    processedMatch2 = await ingestFile({
      fileContent: sampleFile2,
      fileName: 'sample2.txt',
      fileModified: Date.now(),
    });
  });

  describe('calculatePlayerStats', () => {
    it('should calculate stats with playtime for all players', () => {
      const stats = calculatePlayerStats(
        processedMatch1.events,
        processedMatch1.roundTimes
      );

      expect(stats.rows).toBeDefined();
      expect(stats.rows.length).toBeGreaterThan(0);

      // Verify all stats have playtime
      for (const stat of stats.rows) {
        expect(typeof stat.playtime).toBe('number');
        expect(stat.playtime).toBeGreaterThanOrEqual(0);
        expect(stat.playerRole).toBeDefined();
      }
    });

    it('should include required category and numerical keys', () => {
      const stats = calculatePlayerStats(
        processedMatch1.events,
        processedMatch1.roundTimes
      );

      expect(stats.categoryKeys).toBeDefined();
      expect(stats.categoryKeys).toContain('matchId');
      expect(stats.categoryKeys).toContain('playerName');
      expect(stats.categoryKeys).toContain('playerHero');

      expect(stats.numericalKeys).toBeDefined();
      expect(stats.numericalKeys).toContain('eliminations');
      expect(stats.numericalKeys).toContain('deaths');
    });
  });

  describe('calculateTeamfights', () => {
    it('should detect teamfights from kill events', () => {
      const teamfights = calculateTeamfights(
        processedMatch1.events,
        processedMatch1.metadata
      );

      expect(teamfights).toBeDefined();
      expect(Array.isArray(teamfights)).toBe(true);

      if (teamfights.length > 0) {
        const tf = teamfights[0];
        expect(tf.startTime).toBeDefined();
        expect(tf.endTime).toBeDefined();
        expect(tf.endTime).toBeGreaterThanOrEqual(tf.startTime);
        expect(typeof tf.team1Kills).toBe('number');
        expect(typeof tf.team2Kills).toBe('number');
      }
    });

    it('should identify teamfight winners', () => {
      const teamfights = calculateTeamfights(
        processedMatch1.events,
        processedMatch1.metadata
      );

      const teamfightsWithWinners = teamfights.filter(tf => tf.winner !== null);
      for (const tf of teamfightsWithWinners) {
        expect(tf.winner).toBeDefined();
        expect([
          processedMatch1.metadata.team1Name,
          processedMatch1.metadata.team2Name,
        ]).toContain(tf.winner);
      }
    });
  });

  describe('detectScrims', () => {
    it('should group matches into scrims', () => {
      const scrims = detectScrims([processedMatch1, processedMatch2]);

      expect(scrims).toBeDefined();
      expect(Array.isArray(scrims)).toBe(true);
      expect(scrims.length).toBeGreaterThan(0);

      const scrim = scrims[0];
      expect(scrim.dateString).toBeDefined();
      expect(scrim.team1Name).toBeDefined();
      expect(scrim.team2Name).toBeDefined();
      expect(Array.isArray(scrim.matchIds)).toBe(true);
      expect(scrim.matchIds.length).toBeGreaterThan(0);
      expect(typeof scrim.duration).toBe('number');
      expect(typeof scrim.team1Wins).toBe('number');
      expect(typeof scrim.team2Wins).toBe('number');
      expect(typeof scrim.draws).toBe('number');
    });

    it('should calculate scrim statistics correctly', () => {
      const scrims = detectScrims([processedMatch1, processedMatch2]);

      for (const scrim of scrims) {
        const totalMaps = scrim.team1Wins + scrim.team2Wins + scrim.draws;
        expect(scrim.matchIds.length).toBeGreaterThanOrEqual(totalMaps);
      }
    });
  });

  describe('calculateRoundTimes', () => {
    it('should calculate round times from events', () => {
      const roundTimes = calculateRoundTimes(processedMatch1.events);

      expect(roundTimes).toBeDefined();
      expect(Array.isArray(roundTimes)).toBe(true);
      expect(roundTimes.length).toBeGreaterThan(0);

      const round = roundTimes[0];
      expect(round.roundNumber).toBeGreaterThanOrEqual(1);
      expect(typeof round.roundStartTime).toBe('number');
      expect(typeof round.roundEndTime).toBe('number');
      expect(round.roundEndTime).toBeGreaterThan(round.roundStartTime);
    });

    it('should have sequential round numbers', () => {
      const roundTimes = calculateRoundTimes(processedMatch1.events);

      for (let i = 0; i < roundTimes.length; i++) {
        expect(roundTimes[i].roundNumber).toBe(i + 1);
      }
    });
  });

  describe('calculateMapTimes', () => {
    it('should calculate map start and end times', () => {
      const roundTimes = calculateRoundTimes(processedMatch1.events);
      const mapTimes = calculateMapTimes(processedMatch1.events, roundTimes);

      expect(mapTimes).toBeDefined();
      expect(typeof mapTimes.startTime).toBe('number');
      expect(typeof mapTimes.endTime).toBe('number');
      expect(mapTimes.endTime).toBeGreaterThan(mapTimes.startTime);
    });
  });

  describe('calculateUltimateEvents', () => {
    it('should track ultimate usage', () => {
      const ultimateEvents = calculateUltimateEvents(processedMatch1.events);

      expect(ultimateEvents).toBeDefined();
      expect(Array.isArray(ultimateEvents)).toBe(true);

      if (ultimateEvents.length > 0) {
        const ult = ultimateEvents[0];
        expect(ult.id).toBeDefined();
        expect(ult.matchId).toBeDefined();
        expect(ult.playerName).toBeDefined();
        expect(typeof ult.ultimateChargedTime).toBe('number');
      }
    });

    it('should calculate ultimate hold time when used', () => {
      const ultimateEvents = calculateUltimateEvents(processedMatch1.events);

      const usedUltimates = ultimateEvents.filter(
        ult => ult.ultimateStartTime !== null
      );

      for (const ult of usedUltimates) {
        expect(ult.ultimateStartTime).toBeDefined();
        if (ult.ultimateStartTime !== null) {
          expect(ult.ultimateStartTime).toBeGreaterThanOrEqual(
            ult.ultimateChargedTime
          );
          expect(typeof ult.ultimateHoldTime).toBe('number');
          expect(ult.ultimateHoldTime).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('Integration: Full Pipeline', () => {
    it('should produce consistent data through the full pipeline', () => {
      // Verify that all domain functions work together
      expect(processedMatch1.metadata).toBeDefined();
      expect(processedMatch1.events).toBeDefined();
      expect(processedMatch1.playerStats.rows.length).toBeGreaterThan(0);
      expect(processedMatch1.roundTimes.length).toBeGreaterThan(0);
      expect(processedMatch1.mapTimes).toBeDefined();
      expect(processedMatch1.teamfights).toBeDefined();
      expect(processedMatch1.ultimateEvents).toBeDefined();

      // Verify relationships
      const allPlayersInStats = new Set(
        processedMatch1.playerStats.rows.map(s => s.playerName)
      );
      const allPlayersInMetadata = [
        ...processedMatch1.metadata.team1Players,
        ...processedMatch1.metadata.team2Players,
      ];

      // All players in metadata should appear in stats
      for (const player of allPlayersInMetadata) {
        expect(allPlayersInStats.has(player)).toBe(true);
      }
    });
  });
});
