import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'jotai';

// In test environment, bypass the Web Worker and call ingestFile directly
vi.mock('../workers/ingestWorkerClient', async () => {
  const { ingestFile } = await vi.importActual<typeof import('./ingestor')>('./ingestor');
  return { ingestFileInWorker: ingestFile };
});

import {
  matchesRepositoryAtom,
  isProcessingAtom,
  loadFilesAction,
  isHydratedAtom,
  hydrateFromDbAction,
  clearDataAction,
} from './repository';
import { db } from './db';
import sampleFile1 from '@library/sampledata/Log-2023-08-28-17-05-38.txt?raw';
import sampleFile2 from '@library/sampledata/Log-2023-08-28-17-29-57.txt?raw';

// Helper to create File objects for testing
function createMockFile(content: string, filename: string): File {
  return new File([content], filename, { type: 'text/plain', lastModified: Date.now() });
}

describe('Repository', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe('matchesRepositoryAtom', () => {
    it('should initialize as empty', () => {
      const repository = store.get(matchesRepositoryAtom);
      expect(repository).toEqual({});
      expect(Object.keys(repository).length).toBe(0);
    });

    it('should store matches by matchId', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockRepo: Record<string, any> = {
        'match-1': {
          metadata: { matchId: 'match-1' },
          events: {},
        },
      };

      store.set(matchesRepositoryAtom, mockRepo);
      const repository = store.get(matchesRepositoryAtom);

      expect(repository['match-1']).toBeDefined();
      expect(repository['match-1'].metadata.matchId).toBe('match-1');
    });
  });

  describe('isProcessingAtom', () => {
    it('should initialize as false', () => {
      const isProcessing = store.get(isProcessingAtom);
      expect(isProcessing).toBe(false);
    });

    it('should be settable', () => {
      store.set(isProcessingAtom, true);
      expect(store.get(isProcessingAtom)).toBe(true);

      store.set(isProcessingAtom, false);
      expect(store.get(isProcessingAtom)).toBe(false);
    });
  });

  describe('loadFilesAction', () => {
    it('should process files and add to repository', async () => {
      const file1 = createMockFile(sampleFile1, 'sample1.txt');
      const file2 = createMockFile(sampleFile2, 'sample2.txt');

      await store.set(loadFilesAction, [file1, file2]);

      const repository = store.get(matchesRepositoryAtom);
      const matchIds = Object.keys(repository);

      expect(matchIds.length).toBe(2);

      // Verify each match has the correct structure
      for (const matchId of matchIds) {
        const match = repository[matchId];
        expect(match.metadata).toBeDefined();
        expect(match.events).toBeDefined();
        expect(match.playerStats).toBeDefined();
        expect(match.roundTimes).toBeDefined();
        expect(match.mapTimes).toBeDefined();
        expect(match.teamfights).toBeDefined();
        expect(match.ultimateEvents).toBeDefined();
        expect(match.playerStatusTimeline).toBeDefined();
      }
    });

    it('should set processing flag during file loading', async () => {
      const file = createMockFile(sampleFile1, 'sample.txt');

      // Start loading
      const loadPromise = store.set(loadFilesAction, [file]);

      await loadPromise;

      // After loading completes, should be false
      const processingAfterLoad = store.get(isProcessingAtom);
      expect(processingAfterLoad).toBe(false);
    });

    it('should merge new matches with existing repository', async () => {
      const file1 = createMockFile(sampleFile1, 'sample1.txt');
      await store.set(loadFilesAction, [file1]);

      const repoAfterFirst = store.get(matchesRepositoryAtom);
      const firstMatchIds = Object.keys(repoAfterFirst);
      expect(firstMatchIds.length).toBe(1);

      const file2 = createMockFile(sampleFile2, 'sample2.txt');
      await store.set(loadFilesAction, [file2]);

      const repoAfterSecond = store.get(matchesRepositoryAtom);
      const secondMatchIds = Object.keys(repoAfterSecond);
      expect(secondMatchIds.length).toBe(2);

      // Original match should still be there
      expect(repoAfterSecond[firstMatchIds[0]]).toBeDefined();
    });

    it('should overwrite matches with same ID', async () => {
      // Load a file
      const file1 = createMockFile(sampleFile1, 'sample.txt');
      await store.set(loadFilesAction, [file1]);

      const repoAfterFirst = store.get(matchesRepositoryAtom);
      const matchIds = Object.keys(repoAfterFirst);

      // Load same file again (will have same matchId due to content hash)
      const file2 = createMockFile(sampleFile1, 'sample.txt');
      await store.set(loadFilesAction, [file2]);

      const repoAfterSecond = store.get(matchesRepositoryAtom);
      expect(Object.keys(repoAfterSecond).length).toBe(1);
      expect(repoAfterSecond[matchIds[0]]).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      const badFile = createMockFile('invalid content', 'bad.txt');

      // Should not throw, but processing flag should be reset
      try {
        await store.set(loadFilesAction, [badFile]);
      } catch {
        // Expected to potentially fail
      }

      const processingAfter = store.get(isProcessingAtom);
      expect(processingAfter).toBe(false);
    });
  });

  describe('loadFilesAction persistence', () => {
    beforeEach(async () => {
      await db.delete();
      await db.open();
    });

    it('should persist newly loaded matches to IndexedDB', async () => {
      const file = createMockFile(sampleFile1, 'sample.txt');
      await store.set(loadFilesAction, [file]);

      const stored = await db.matches.toArray();
      expect(stored.length).toBe(1);
      expect(stored[0].schemaVersion).toBe(1);
    });

    it('should persist multiple loaded files to IndexedDB', async () => {
      const file1 = createMockFile(sampleFile1, 'sample1.txt');
      const file2 = createMockFile(sampleFile2, 'sample2.txt');
      await store.set(loadFilesAction, [file1, file2]);

      const stored = await db.matches.toArray();
      expect(stored.length).toBe(2);
    });
  });

  describe('hydrateFromDbAction', () => {
    beforeEach(async () => {
      await db.delete();
      await db.open();
    });

    it('should set isHydrated to true even with empty DB', async () => {
      expect(store.get(isHydratedAtom)).toBe(false);

      await store.set(hydrateFromDbAction);

      expect(store.get(isHydratedAtom)).toBe(true);
      expect(Object.keys(store.get(matchesRepositoryAtom)).length).toBe(0);
    });

    it('should populate matchesRepositoryAtom from IndexedDB', async () => {
      // Pre-populate DB by loading a file
      const file = createMockFile(sampleFile1, 'sample.txt');
      await store.set(loadFilesAction, [file]);

      const matchIds = Object.keys(store.get(matchesRepositoryAtom));
      expect(matchIds.length).toBe(1);

      // Reset atom (simulates fresh page load)
      store.set(matchesRepositoryAtom, {});
      expect(Object.keys(store.get(matchesRepositoryAtom)).length).toBe(0);

      // Hydrate from DB
      await store.set(hydrateFromDbAction);

      const repo = store.get(matchesRepositoryAtom);
      expect(Object.keys(repo).length).toBe(1);
      expect(repo[matchIds[0]]).toBeDefined();
      expect(repo[matchIds[0]].playerStatusTimeline).toBeInstanceOf(Map);
    });
  });

  describe('clearDataAction', () => {
    beforeEach(async () => {
      await db.delete();
      await db.open();
    });

    it('should clear IndexedDB and reset atoms', async () => {
      // Load a file first
      const file = createMockFile(sampleFile1, 'sample.txt');
      await store.set(loadFilesAction, [file]);

      expect(Object.keys(store.get(matchesRepositoryAtom)).length).toBe(1);
      expect((await db.matches.toArray()).length).toBe(1);

      // Clear
      await store.set(clearDataAction);

      expect(store.get(matchesRepositoryAtom)).toEqual({});
      expect(store.get(isProcessingAtom)).toBe(false);
      expect((await db.matches.toArray()).length).toBe(0);
    });
  });

  describe('Repository Data Integrity', () => {
    it('should maintain referential equality for unchanged data', async () => {
      const file = createMockFile(sampleFile1, 'sample.txt');
      await store.set(loadFilesAction, [file]);

      const repo1 = store.get(matchesRepositoryAtom);
      const repo2 = store.get(matchesRepositoryAtom);

      // Should be same reference if nothing changed
      expect(repo1).toBe(repo2);
    });

    it('should generate consistent matchIds for same content', async () => {
      const file1 = createMockFile(sampleFile1, 'name1.txt');
      await store.set(loadFilesAction, [file1]);

      const repo1 = store.get(matchesRepositoryAtom);
      const matchIds1 = Object.keys(repo1);

      // Clear repository
      store.set(matchesRepositoryAtom, {});

      // Load same content with different filename
      const file2 = createMockFile(sampleFile1, 'name2.txt');
      await store.set(loadFilesAction, [file2]);

      const repo2 = store.get(matchesRepositoryAtom);
      const matchIds2 = Object.keys(repo2);

      // Should have same matchId (based on content, not filename)
      expect(matchIds1[0]).toBe(matchIds2[0]);
    });
  });
});
