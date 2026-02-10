import { useState, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { fetchParsertimeDataset, ParsertimeProgress } from '../data/parsertimeAdapter';
import { loadParsertimeMatchesAction } from '../data/repository';

export function useLoadParsertimeDataset() {
  const [progress, setProgress] = useState<ParsertimeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadMatches = useSetAtom(loadParsertimeMatchesAction);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgress(null);

    try {
      const matches = await fetchParsertimeDataset(setProgress);
      await loadMatches(matches);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load parsertime dataset');
    } finally {
      setIsLoading(false);
    }
  }, [loadMatches]);

  return { load, progress, error, isLoading };
}
