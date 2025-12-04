import { describe, it, expect, beforeAll } from 'vitest';
import { detectScrims } from './scrims';
import { ingestFile } from '../data/ingestor';
import sampleFile1 from '../lib/sampledata/Log-2023-08-28-17-05-38.txt?raw';
import sampleFile2 from '../lib/sampledata/Log-2023-08-28-17-29-57.txt?raw';
import sampleFile3 from '../lib/sampledata/Log-2023-08-28-17-52-17.txt?raw';

describe('Scrim Grouping Logic', () => {
  let match1: Awaited<ReturnType<typeof ingestFile>>;
  let match2: Awaited<ReturnType<typeof ingestFile>>;
  let match3: Awaited<ReturnType<typeof ingestFile>>;

  beforeAll(async () => {
    match1 = await ingestFile({
      fileContent: sampleFile1,
      fileName: 'match1.txt',
      fileModified: new Date('2023-08-28T17:05:38').getTime(),
    });

    match2 = await ingestFile({
      fileContent: sampleFile2,
      fileName: 'match2.txt',
      fileModified: new Date('2023-08-28T17:29:57').getTime(),
    });

    match3 = await ingestFile({
      fileContent: sampleFile3,
      fileName: 'match3.txt',
      fileModified: new Date('2023-08-28T17:52:17').getTime(),
    });
  });

  it('should group matches on the same date with same teams into one scrim', () => {
    // These matches are from the same day and likely same teams (based on sample data filenames)
    // We need to ensure the team names match in the sample data for them to group.
    // Assuming sample data has consistent team names.
    
    // Force team names to be identical for testing grouping logic if sample data differs
    match1.metadata.team1Name = 'Team A';
    match1.metadata.team2Name = 'Team B';
    match1.metadata.dateString = '2023-08-28';

    match2.metadata.team1Name = 'Team A';
    match2.metadata.team2Name = 'Team B';
    match2.metadata.dateString = '2023-08-28';

    const scrims = detectScrims([match1, match2]);

    expect(scrims).toHaveLength(1);
    expect(scrims[0].matchIds).toHaveLength(2);
    expect(scrims[0].team1Name).toBe('Team A');
    expect(scrims[0].team2Name).toBe('Team B');
  });

  it('should separate matches on different dates', () => {
    const matchDiffDate = { ...match1, metadata: { ...match1.metadata, dateString: '2023-08-29', matchId: 'diff-date' } };
    
    const scrims = detectScrims([match1, matchDiffDate]);

    expect(scrims).toHaveLength(2);
  });

  it('should separate matches with different teams on same date', () => {
    const matchDiffTeams = { ...match1, metadata: { ...match1.metadata, team1Name: 'Team C', matchId: 'diff-teams' } };

    const scrims = detectScrims([match1, matchDiffTeams]);

    expect(scrims).toHaveLength(2);
  });

  it('should handle partial team overlap (should NOT group)', () => {
    // If team1 is same but team2 is different
    const matchPartialOverlap = { ...match1, metadata: { ...match1.metadata, team2Name: 'Team C', matchId: 'partial-overlap' } };

    const scrims = detectScrims([match1, matchPartialOverlap]);

    expect(scrims).toHaveLength(2);
  });

  it('should correctly aggregate scrim stats', () => {
    // Setup matches with known scores
    const m1 = { ...match1, metadata: { ...match1.metadata, team1Score: 2, team2Score: 1, duration: 100 } };
    const m2 = { ...match2, metadata: { ...match2.metadata, team1Score: 0, team2Score: 3, duration: 150 } };

    // m1: Team A wins (2 > 1)
    // m2: Team B wins (3 > 0)
    
    const scrims = detectScrims([m1, m2]);
    const scrim = scrims[0];

    expect(scrim.team1Wins).toBe(1);
    expect(scrim.team2Wins).toBe(1);
    expect(scrim.duration).toBe(250);
  });

  it('should group multiple matches correctly', () => {
    // Make match3 part of the same scrim as match1 and match2
    match3.metadata.team1Name = 'Team A';
    match3.metadata.team2Name = 'Team B';
    match3.metadata.dateString = '2023-08-28';

    const scrims = detectScrims([match1, match2, match3]);

    expect(scrims).toHaveLength(1);
    expect(scrims[0].matchIds).toHaveLength(3);
  });

  it('should handle single-match scrims', () => {
    const scrims = detectScrims([match1]);
    expect(scrims).toHaveLength(1);
    expect(scrims[0].matchIds).toHaveLength(1);
  });
});
