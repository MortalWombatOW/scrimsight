import { useMemo } from 'react';
import { useMatches } from './useRepository';
import { computeCompositionAnalysis, CompositionAnalysis } from '../domain/composition';

export interface CompositionAnalysisResult extends CompositionAnalysis {
  hasData: boolean;
}

const EMPTY_RESULT: CompositionAnalysisResult = {
  heroPickRates: [],
  archetypeStats: [],
  totalCompsAnalyzed: 0,
  mostPlayedArchetype: 'Mixed',
  highestWRArchetype: 'Mixed',
  hasData: false,
};

export function useCompositionAnalysis(): CompositionAnalysisResult {
  const matches = useMatches();

  return useMemo(() => {
    if (matches.length === 0) return EMPTY_RESULT;
    const analysis = computeCompositionAnalysis(matches);
    return { ...analysis, hasData: true };
  }, [matches]);
}
