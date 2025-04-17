import { atom } from 'jotai';
import { logFileParserAtom } from '../files/logFileParserAtom';
import { extractEventsFromFiles } from './extractEventHelpers';

/**
 * Creates an atom that extracts events of a specific type from the parsed log files
 * @param eventType The type of event to extract (e.g., 'match_start', 'match_end')
 * @returns An atom that will extract and return an array of events of the specified type
 */
export function createEventExtractorAtom<T extends { matchId?: string}>(
  eventType: string, 
  columnRemapping?: Partial<Record<keyof T, keyof T>>
) {
  return atom(async (get): Promise<T[]> => {
    // Get parsed files from the logFileParserAtom
    const parsedFiles = await get(logFileParserAtom);
    
    // Use the pure logic function to extract events
    return extractEventsFromFiles<T>(eventType, parsedFiles, columnRemapping);
  });
}