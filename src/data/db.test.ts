import { describe, it, expect, beforeEach } from 'vitest';
import { db, putMatches, getAllMatches, clearMatches } from './db';
import { serializeMatch, deserializeMatch } from './serialization';
import { ProcessedMatch, PlayerStatusEntry } from '../types';

function createTestMatch(id: string): ProcessedMatch {
  const entry: PlayerStatusEntry = {
    timestamp: 100,
    team1Players: new Set(['Alice']),
    team2Players: new Set(['Bob']),
  };

  return {
    metadata: {
      matchId: id,
      fileName: 'test.txt',
      fileModified: 1234567890,
      dateString: '2023-08-28',
      timeString: '17:05:38',
      map: "King's Row",
      mode: 'Control',
      team1Name: 'Team Alpha',
      team2Name: 'Team Beta',
      team1Score: 2,
      team2Score: 1,
      team1Players: ['Alice'],
      team2Players: ['Bob'],
      duration: 600,
      roundWinners: ['team1'],
      winner: 'Team Alpha',
    },
    events: {
      ability1Used: [],
      ability2Used: [],
      damage: [],
      defensiveAssist: [],
      dvaDemech: [],
      dvaRemech: [],
      healing: [],
      heroSpawn: [],
      heroSwap: [],
      kills: [],
      matchEnd: [],
      matchStart: [],
      mercyRez: [],
      offensiveAssist: [],
      playerStat: [],
      roundEnd: [],
      roundStart: [],
      setupComplete: [],
      ultimateCharged: [],
      ultimateEnd: [],
      ultimateStart: [],
    },
    teamfights: [],
    playerStats: { categoryKeys: [], numericalKeys: [], rows: [] },
    roundTimes: [],
    mapTimes: { matchId: id, startTime: 0, endTime: 600, duration: 600 },
    playerStatusTimeline: new Map([['round1', [entry]]]),
    ultimateEvents: [],
    ultCycles: [],
  } as ProcessedMatch;
}

describe('Database (db.ts)', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it('should return empty array from empty database', async () => {
    const matches = await getAllMatches();
    expect(matches).toEqual([]);
  });

  it('should store and retrieve a single match', async () => {
    const match = createTestMatch('match-1');
    const stored = serializeMatch(match);

    await putMatches([stored]);

    const results = await getAllMatches();
    expect(results).toHaveLength(1);
    expect(results[0].metadata.matchId).toBe('match-1');
  });

  it('should bulkPut multiple matches', async () => {
    const stored1 = serializeMatch(createTestMatch('match-1'));
    const stored2 = serializeMatch(createTestMatch('match-2'));

    await putMatches([stored1, stored2]);

    const results = await getAllMatches();
    expect(results).toHaveLength(2);
    const ids = results.map((r) => r.metadata.matchId).sort();
    expect(ids).toEqual(['match-1', 'match-2']);
  });

  it('should upsert (overwrite) match with same ID', async () => {
    const match = createTestMatch('match-1');
    match.metadata.team1Score = 1;
    await putMatches([serializeMatch(match)]);

    // Update the score and re-put
    match.metadata.team1Score = 3;
    await putMatches([serializeMatch(match)]);

    const results = await getAllMatches();
    expect(results).toHaveLength(1);
    expect(results[0].metadata.team1Score).toBe(3);
  });

  it('should clear all matches', async () => {
    await putMatches([
      serializeMatch(createTestMatch('match-1')),
      serializeMatch(createTestMatch('match-2')),
    ]);

    await clearMatches();

    const results = await getAllMatches();
    expect(results).toEqual([]);
  });

  it('should round-trip ProcessedMatch through full pipeline', async () => {
    const original = createTestMatch('match-rt');
    const stored = serializeMatch(original);

    await putMatches([stored]);

    const results = await getAllMatches();
    const restored = deserializeMatch(results[0]);

    expect(restored.metadata).toEqual(original.metadata);
    expect(restored.playerStatusTimeline).toBeInstanceOf(Map);
    expect(restored.playerStatusTimeline.size).toBe(1);

    const entries = restored.playerStatusTimeline.get('round1')!;
    expect(entries[0].team1Players).toBeInstanceOf(Set);
    expect(entries[0].team1Players.has('Alice')).toBe(true);
  });
});
