import { atom } from 'jotai';
import { RepositoryState, ProcessedMatch } from '../types';
import { readFileAsync } from '../lib/scrimtime';
import { ingestFile } from './ingestor';

// ============================================================================
// State Atoms
// ============================================================================

export const matchesRepositoryAtom = atom<RepositoryState>({});

export const isProcessingAtom = atom<boolean>(false);

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
    } catch (error) {
      console.error('Error loading files:', error);
      throw error;
    } finally {
      set(isProcessingAtom, false);
    }
  }
);
