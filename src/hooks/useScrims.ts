import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useMemo } from 'react';
import { matchesRepositoryAtom } from '../data/repository';
import { Scrim } from '../types';
import { detectScrims } from '../domain/scrims';

export function useScrims(): Scrim[] {
  const scrimsAtom = useMemo(
    () =>
      selectAtom(matchesRepositoryAtom, (repository) => {
        const allMatches = Object.values(repository);
        return detectScrims(allMatches);
      }),
    []
  );

  return useAtomValue(scrimsAtom);
}

export function useScrim(scrimId: string): Scrim | undefined {
  const scrimAtom = useMemo(
    () =>
      selectAtom(matchesRepositoryAtom, (repository) => {
        const allMatches = Object.values(repository);
        const scrims = detectScrims(allMatches);
        return scrims.find(
          (scrim) =>
            `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}` === scrimId
        );
      }),
    [scrimId]
  );

  return useAtomValue(scrimAtom);
}
