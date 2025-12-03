import { renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { describe, it, expect } from 'vitest';
import { ingestFile } from '../data/ingestor';
import { matchesRepositoryAtom } from '../data/repository';
import { useStats } from '../hooks/useStats';
import { useScrims } from '../hooks/useScrims';
import sampleFile1 from '../lib/sampledata/Log-2023-08-28-17-05-38.txt?raw';
import sampleFile2 from '../lib/sampledata/Log-2023-08-28-17-29-57.txt?raw';

// Helper to hydrate atoms
const HydrateAtoms = ({ initialValues, children }: { initialValues: any; children: React.ReactNode }) => {
  useHydrateAtoms(initialValues);
  return children;
};

describe('Integration Workflows', () => {
  it('Workflow 1: File upload -> Process -> Stats available', async () => {
    // 1. Process file (simulating upload)
    const processedMatch = await ingestFile({
      fileContent: sampleFile1,
      fileName: 'match1.txt',
      fileModified: Date.now(),
    });

    // 2. Setup store with processed match
    const TestProvider = ({ children }: { children: React.ReactNode }) => (
      <Provider>
        <HydrateAtoms initialValues={[[matchesRepositoryAtom, { [processedMatch.metadata.matchId]: processedMatch }]]}>
          {children}
        </HydrateAtoms>
      </Provider>
    );

    // 3. Verify stats hook returns data
    const { result } = renderHook(() => useStats(), {
      wrapper: TestProvider,
    });

    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current[0].matchId).toBe(processedMatch.metadata.matchId);
  });

  it('Workflow 2: Upload multiple matches -> Group into scrim', async () => {
    // 1. Process two matches
    const match1 = await ingestFile({
      fileContent: sampleFile1,
      fileName: 'match1.txt',
      fileModified: new Date('2023-08-28T17:05:38').getTime(),
    });

    // We need to ensure match2 groups with match1. 
    // The sample files might be from the same scrim.
    // Let's force metadata to match just in case, although sample files usually work.
    const match2 = await ingestFile({
      fileContent: sampleFile2,
      fileName: 'match2.txt',
      fileModified: new Date('2023-08-28T17:29:57').getTime(),
    });

    // Force same teams/date for grouping test reliability
    match1.metadata.team1Name = 'Team A';
    match1.metadata.team2Name = 'Team B';
    match1.metadata.dateString = '2023-08-28';
    
    match2.metadata.team1Name = 'Team A';
    match2.metadata.team2Name = 'Team B';
    match2.metadata.dateString = '2023-08-28';

    const repository = {
      [match1.metadata.matchId]: match1,
      [match2.metadata.matchId]: match2,
    };

    // 2. Setup store
    const TestProvider = ({ children }: { children: React.ReactNode }) => (
      <Provider>
        <HydrateAtoms initialValues={[[matchesRepositoryAtom, repository]]}>
          {children}
        </HydrateAtoms>
      </Provider>
    );

    // 3. Verify scrims hook groups them
    const { result } = renderHook(() => useScrims(), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].matchIds).toHaveLength(2);
    expect(result.current[0].team1Name).toBe('Team A');
  });
});
