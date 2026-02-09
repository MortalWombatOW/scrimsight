import { atom } from 'jotai';
import { RepositoryState, ProcessedMatch } from '../types';
import { readFileAsync } from '../lib/scrimtime';
import { ingestFile } from './ingestor';
import { serializeMatch, deserializeMatch } from './serialization';
import { putMatches, getAllMatches, clearMatches } from './db';

// ============================================================================
// State Atoms
// ============================================================================

export const matchesRepositoryAtom = atom<RepositoryState>({});

export const isProcessingAtom = atom<boolean>(false);

export const isHydratedAtom = atom<boolean>(false);

// ============================================================================
// Action: Load Files
// ============================================================================

export const loadFilesAction = atom(
  null,
  async (get, set, files: File[]) => {
    set(isProcessingAtom, true);

    try {
      const processedMatches: ProcessedMatch[] = [];

      for (const file of files) {
        try {
          const fileContent = await readFileAsync(file);

          const processedMatch = await ingestFile({
            fileContent,
            fileName: file.name,
            fileModified: file.lastModified,
          });

          processedMatches.push(processedMatch);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
        }
      }

      const currentRepository = get(matchesRepositoryAtom);
      const newRepository: RepositoryState = { ...currentRepository };

      for (const match of processedMatches) {
        newRepository[match.metadata.matchId] = match;
      }

      set(matchesRepositoryAtom, newRepository);

      // Persist to IndexedDB (best-effort, non-fatal on error)
      try {
        const storedMatches = processedMatches.map(serializeMatch);
        await putMatches(storedMatches);
      } catch (error) {
        console.error('Failed to persist matches to IndexedDB:', error);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      throw error;
    } finally {
      set(isProcessingAtom, false);
    }
  }
);

// ============================================================================
// Action: Hydrate from IndexedDB
// ============================================================================

export const hydrateFromDbAction = atom(
  null,
  async (_get, set) => {
    try {
      const storedMatches = await getAllMatches();
      const repository: RepositoryState = {};

      for (const stored of storedMatches) {
        const match = deserializeMatch(stored);
        repository[match.metadata.matchId] = match;
      }

      set(matchesRepositoryAtom, repository);
    } catch (error) {
      console.error('Failed to hydrate from IndexedDB:', error);
    } finally {
      set(isHydratedAtom, true);
    }
  }
);

// ============================================================================
// Action: Clear All Data
// ============================================================================

export const clearDataAction = atom(
  null,
  async (_get, set) => {
    await clearMatches();
    set(matchesRepositoryAtom, {});
    set(isProcessingAtom, false);
  }
);
