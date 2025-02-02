import { atom } from 'jotai';
import { matchStartExtractorAtom } from './matchStartExtractorAtom';

/**
 * Interface for unique game modes
 */
export interface UniqueGameMode {
  mapType: string;
}

/**
 * Atom that extracts unique game modes from all matches
 */
export const uniqueGameModesAtom = atom(async (get): Promise<UniqueGameMode[]> => {
  const matchStarts = await get(matchStartExtractorAtom);
  
  // Get unique map types (game modes)
  const uniqueModes = Array.from(new Set(
    matchStarts.map(match => match.mapType)
  ));

  return uniqueModes.map(mode => ({ mapType: mode }));
}); 