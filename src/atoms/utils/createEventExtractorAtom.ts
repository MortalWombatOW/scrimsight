import { atom } from 'jotai';
import { logFileParserAtom } from '../logFileParserAtom';

/**
 * Helper function to extract events of a specific type
 */
function extractEventType<T>(type: string, logs: { specName: string; data: object }[]): T[] {
  const log = logs.find((log) => log.specName === type);
  if (!log) return [];
  return log.data as T[];
}

/**
 * Creates an atom that extracts events of a specific type from the parsed log files
 * @param eventType The type of event to extract (e.g., 'match_start', 'match_end')
 * @returns An atom that will extract and return an array of events of the specified type
 */
export function createEventExtractorAtom<T extends { matchId?: string }>(eventType: string) {
  return atom(async (get): Promise<T[]> => {
    const parsedFiles = await get(logFileParserAtom);
    
    return parsedFiles.flatMap((file) => 
      extractEventType<T>(eventType, file.logs).map(event => ({
        ...event,
        matchId: file.matchId
      }))
    );
  });
} 