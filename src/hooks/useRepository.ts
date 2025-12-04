import { useAtomValue, useSetAtom } from 'jotai';
import { matchesRepositoryAtom, isProcessingAtom, loadFilesAction } from '../data/repository';
import { ProcessedMatch } from '../types';

export function useMatches(): ProcessedMatch[] {
  const repository = useAtomValue(matchesRepositoryAtom);
  return Object.values(repository);
}

export function useIsProcessing(): boolean {
  return useAtomValue(isProcessingAtom);
}

export function useLoadFiles() {
  return useSetAtom(loadFilesAction);
}
