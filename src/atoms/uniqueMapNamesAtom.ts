import { atom } from 'jotai';
import { matchStartExtractorAtom } from './event_extractors/matchStartExtractorAtom';

/**
 * Interface for unique map names
 */
export interface UniqueMapName {
  mapName: string;
}

/**
 * Atom that extracts unique map names from all matches
 */
export const uniqueMapNamesAtom = atom(async (get): Promise<UniqueMapName[]> => {
  const matchStarts = await get(matchStartExtractorAtom);
  
  // Get unique map names
  const uniqueNames = Array.from(new Set(
    matchStarts.map(match => match.mapName)
  ));

  return uniqueNames.map(name => ({ mapName: name }));
}); 