import { describe, it, expect } from 'vitest';
import { ingestFile } from './ingestor';
import sampleFile1 from '../lib/sampledata/Log-2023-08-28-17-05-38.txt?raw';

const SAMPLE_LOG_CONTENT = sampleFile1;

describe('ingestFile', () => {
  it('should parse and process a valid log file into a ProcessedMatch', async () => {
    const result = await ingestFile({
      fileContent: SAMPLE_LOG_CONTENT,
      fileName: 'test-match.txt',
      fileModified: Date.now(),
    });

    // Verify the structure
    expect(result).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.events).toBeDefined();
    expect(result.playerStats).toBeDefined();
    expect(result.roundTimes).toBeDefined();
    expect(result.mapTimes).toBeDefined();
    expect(result.teamfights).toBeDefined();
    expect(result.ultimateEvents).toBeDefined();
    expect(result.playerStatusTimeline).toBeDefined();
  });

  it('should extract correct metadata', async () => {
    const result = await ingestFile({
      fileContent: SAMPLE_LOG_CONTENT,
      fileName: 'test-match.txt',
      fileModified: 1234567890,
    });

    // Verify metadata fields exist and have correct types
    expect(result.metadata.map).toBeDefined();
    expect(typeof result.metadata.map).toBe('string');
    expect(result.metadata.mode).toBeDefined();
    expect(typeof result.metadata.mode).toBe('string');
    expect(result.metadata.team1Name).toBeDefined();
    expect(typeof result.metadata.team1Name).toBe('string');
    expect(result.metadata.team2Name).toBeDefined();
    expect(typeof result.metadata.team2Name).toBe('string');
    expect(typeof result.metadata.team1Score).toBe('number');
    expect(typeof result.metadata.team2Score).toBe('number');
    expect(result.metadata.matchId).toBeDefined();
    expect(result.metadata.duration).toBeGreaterThan(0);
    
    // Check for realistic data
    expect(result.metadata.team1Players.length).toBeGreaterThan(0);
    expect(result.metadata.team2Players.length).toBeGreaterThan(0);
  });

  it('should throw error for malformed files', async () => {
    // Test with garbage content
    await expect(ingestFile({
      fileContent: 'GARBAGE_DATA_NOT_A_LOG_FILE',
      fileName: 'garbage.txt',
      fileModified: Date.now(),
    })).rejects.toThrow();
  });

  it('should handle empty files', async () => {
    const result = await ingestFile({
      fileContent: '',
      fileName: 'empty.txt',
      fileModified: Date.now(),
    });

    expect(result).toBeDefined();
    expect(result.events.matchStart).toHaveLength(0);
  });

  it('should group events by type correctly', async () => {
    const result = await ingestFile({
      fileContent: SAMPLE_LOG_CONTENT,
      fileName: 'test-match.txt',
      fileModified: Date.now(),
    });

    expect(result.events.heroSpawn).toBeDefined();
    expect(result.events.heroSpawn.length).toBeGreaterThan(0);
    expect(result.events.kills).toBeDefined();
    expect(result.events.kills.length).toBeGreaterThan(0);
  });

  it('should calculate player stats with valid values', async () => {
    const result = await ingestFile({
      fileContent: SAMPLE_LOG_CONTENT,
      fileName: 'test-match.txt',
      fileModified: Date.now(),
    });

    expect(result.playerStats.rows).toBeDefined();
    expect(result.playerStats.rows.length).toBeGreaterThan(0);

    const firstPlayer = result.playerStats.rows[0];
    expect(firstPlayer.playerName).toBeDefined();
    expect(typeof firstPlayer.eliminations).toBe('number');
    expect(typeof firstPlayer.deaths).toBe('number');
    expect(firstPlayer.playerHero).toBeDefined();
    expect(firstPlayer.playerRole).toBeDefined();
    expect(typeof firstPlayer.playtime).toBe('number');
  });

  it('should calculate round times and map times', async () => {
    const result = await ingestFile({
      fileContent: SAMPLE_LOG_CONTENT,
      fileName: 'test-match.txt',
      fileModified: Date.now(),
    });

    expect(result.roundTimes).toBeDefined();
    expect(result.roundTimes.length).toBeGreaterThan(0);

    const firstRound = result.roundTimes[0];
    expect(firstRound.roundNumber).toBeGreaterThanOrEqual(1);
    expect(typeof firstRound.roundStartTime).toBe('number');
    expect(typeof firstRound.roundEndTime).toBe('number');
    expect(firstRound.roundEndTime).toBeGreaterThan(firstRound.roundStartTime);

    expect(result.mapTimes).toBeDefined();
    expect(result.mapTimes.startTime).toBeDefined();
    expect(result.mapTimes.endTime).toBeDefined();
  });
});
