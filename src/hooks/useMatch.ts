import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useMemo } from 'react';
import { matchesRepositoryAtom } from '../data/repository';
import { ProcessedMatch, MatchEvents } from '../types';

export function useMatch(matchId: string): ProcessedMatch | undefined {
  const matchAtom = useMemo(
    () => selectAtom(matchesRepositoryAtom, (repository) => repository[matchId]),
    [matchId]
  );

  return useAtomValue(matchAtom);
}

export function useMatchEvents(matchId: string): MatchEvents | undefined {
  const matchAtom = useMemo(
    () => selectAtom(matchesRepositoryAtom, (repository) => repository[matchId]?.events),
    [matchId]
  );

  return useAtomValue(matchAtom);
}
