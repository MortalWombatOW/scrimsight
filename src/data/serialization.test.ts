import { describe, it, expect } from 'vitest';
import { serializeMatch, deserializeMatch } from './serialization';
import { ProcessedMatch, PlayerStatusEntry } from '../types';

// Minimal fixture that exercises the Map/Set paths
function createTestMatch(overrides?: Partial<ProcessedMatch>): ProcessedMatch {
  const entry1: PlayerStatusEntry = {
    timestamp: 100,
    team1Players: new Set(['Alice', 'Bob']),
    team2Players: new Set(['Charlie']),
  };

  const entry2: PlayerStatusEntry = {
    timestamp: 200,
    team1Players: new Set(['Alice']),
    team2Players: new Set(['Charlie', 'Dave']),
  };

  return {
    metadata: {
      matchId: 'test-match-1',
      fileName: 'test.txt',
      fileModified: 1234567890,
      dateString: '2023-08-28',
      timeString: '17:05:38',
      map: 'King\'s Row',
      mode: 'Control',
      team1Name: 'Team Alpha',
      team2Name: 'Team Beta',
      team1Score: 2,
      team2Score: 1,
      team1Players: ['Alice', 'Bob'],
      team2Players: ['Charlie', 'Dave'],
      duration: 600,
      roundWinners: ['team1', 'team2', 'team1'],
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
    mapTimes: { matchId: 'test-match-1', startTime: 0, endTime: 600, duration: 600 },
    playerStatusTimeline: new Map([
      ['round1', [entry1, entry2]],
    ]),
    ultimateEvents: [],
    ...overrides,
  } as ProcessedMatch;
}

describe('Serialization', () => {
  describe('serializeMatch', () => {
    it('should convert Map to Record for playerStatusTimeline', () => {
      const match = createTestMatch();
      const stored = serializeMatch(match);

      expect(stored.playerStatusTimeline).not.toBeInstanceOf(Map);
      expect(typeof stored.playerStatusTimeline).toBe('object');
      expect(stored.playerStatusTimeline['round1']).toBeDefined();
      expect(stored.playerStatusTimeline['round1']).toHaveLength(2);
    });

    it('should convert Set to Array for team players in status entries', () => {
      const match = createTestMatch();
      const stored = serializeMatch(match);

      const entry = stored.playerStatusTimeline['round1'][0];
      expect(Array.isArray(entry.team1Players)).toBe(true);
      expect(Array.isArray(entry.team2Players)).toBe(true);
      expect(entry.team1Players).toContain('Alice');
      expect(entry.team1Players).toContain('Bob');
      expect(entry.team2Players).toContain('Charlie');
    });

    it('should add schemaVersion', () => {
      const match = createTestMatch();
      const stored = serializeMatch(match);

      expect(stored.schemaVersion).toBe(1);
    });

    it('should preserve all other fields unchanged', () => {
      const match = createTestMatch();
      const stored = serializeMatch(match);

      expect(stored.metadata).toEqual(match.metadata);
      expect(stored.events).toEqual(match.events);
      expect(stored.teamfights).toEqual(match.teamfights);
      expect(stored.roundTimes).toEqual(match.roundTimes);
      expect(stored.mapTimes).toEqual(match.mapTimes);
      expect(stored.ultimateEvents).toEqual(match.ultimateEvents);
    });
  });

  describe('deserializeMatch', () => {
    it('should convert Record back to Map for playerStatusTimeline', () => {
      const match = createTestMatch();
      const stored = serializeMatch(match);
      const restored = deserializeMatch(stored);

      expect(restored.playerStatusTimeline).toBeInstanceOf(Map);
      expect(restored.playerStatusTimeline.size).toBe(1);
      expect(restored.playerStatusTimeline.has('round1')).toBe(true);
    });

    it('should convert Arrays back to Sets for team players', () => {
      const match = createTestMatch();
      const stored = serializeMatch(match);
      const restored = deserializeMatch(stored);

      const entries = restored.playerStatusTimeline.get('round1')!;
      expect(entries[0].team1Players).toBeInstanceOf(Set);
      expect(entries[0].team2Players).toBeInstanceOf(Set);
      expect(entries[0].team1Players.has('Alice')).toBe(true);
      expect(entries[0].team1Players.has('Bob')).toBe(true);
      expect(entries[0].team2Players.has('Charlie')).toBe(true);
    });

    it('should strip schemaVersion from result', () => {
      const match = createTestMatch();
      const stored = serializeMatch(match);
      const restored = deserializeMatch(stored);

      expect((restored as any).schemaVersion).toBeUndefined();
    });
  });

  describe('round-trip', () => {
    it('should produce equal match after serialize → deserialize', () => {
      const match = createTestMatch();
      const restored = deserializeMatch(serializeMatch(match));

      // Check metadata and simple fields
      expect(restored.metadata).toEqual(match.metadata);
      expect(restored.events).toEqual(match.events);
      expect(restored.teamfights).toEqual(match.teamfights);
      expect(restored.roundTimes).toEqual(match.roundTimes);
      expect(restored.mapTimes).toEqual(match.mapTimes);
      expect(restored.ultimateEvents).toEqual(match.ultimateEvents);

      // Check Map contents
      expect(restored.playerStatusTimeline.size).toBe(match.playerStatusTimeline.size);
      for (const [key, entries] of match.playerStatusTimeline) {
        const restoredEntries = restored.playerStatusTimeline.get(key)!;
        expect(restoredEntries).toHaveLength(entries.length);
        for (let i = 0; i < entries.length; i++) {
          expect(restoredEntries[i].timestamp).toBe(entries[i].timestamp);
          expect(restoredEntries[i].team1Players).toEqual(entries[i].team1Players);
          expect(restoredEntries[i].team2Players).toEqual(entries[i].team2Players);
        }
      }
    });

    it('should handle empty Map', () => {
      const match = createTestMatch({ playerStatusTimeline: new Map() });
      const restored = deserializeMatch(serializeMatch(match));

      expect(restored.playerStatusTimeline).toBeInstanceOf(Map);
      expect(restored.playerStatusTimeline.size).toBe(0);
    });

    it('should handle entries with empty Sets', () => {
      const entry: PlayerStatusEntry = {
        timestamp: 0,
        team1Players: new Set(),
        team2Players: new Set(),
      };
      const match = createTestMatch({
        playerStatusTimeline: new Map([['empty', [entry]]]),
      });
      const restored = deserializeMatch(serializeMatch(match));

      const entries = restored.playerStatusTimeline.get('empty')!;
      expect(entries[0].team1Players).toBeInstanceOf(Set);
      expect(entries[0].team1Players.size).toBe(0);
      expect(entries[0].team2Players).toBeInstanceOf(Set);
      expect(entries[0].team2Players.size).toBe(0);
    });

    it('should handle multiple timeline keys', () => {
      const entry1: PlayerStatusEntry = {
        timestamp: 100,
        team1Players: new Set(['A']),
        team2Players: new Set(['B']),
      };
      const entry2: PlayerStatusEntry = {
        timestamp: 200,
        team1Players: new Set(['C']),
        team2Players: new Set(['D']),
      };
      const match = createTestMatch({
        playerStatusTimeline: new Map([
          ['round1', [entry1]],
          ['round2', [entry2]],
        ]),
      });
      const restored = deserializeMatch(serializeMatch(match));

      expect(restored.playerStatusTimeline.size).toBe(2);
      expect(restored.playerStatusTimeline.get('round1')![0].team1Players.has('A')).toBe(true);
      expect(restored.playerStatusTimeline.get('round2')![0].team1Players.has('C')).toBe(true);
    });
  });
});
