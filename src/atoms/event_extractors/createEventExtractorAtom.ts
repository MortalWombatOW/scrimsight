import { atom } from 'jotai';
import { logFileParserAtom } from '../files/logFileParserAtom';

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
export function createEventExtractorAtom<T extends { matchId?: string}>(eventType: string, columnRemapping?: Record<keyof Partial<T>, keyof Partial<T>>) {
  return atom(async (get): Promise<T[]> => {
    const parsedFiles = await get(logFileParserAtom);
    
    const data = parsedFiles.flatMap((file) => 
      extractEventType<T>(eventType, file.logs).map(event => ({
        ...event,
        matchId: file.matchId
      }))
    );

    if (!columnRemapping) {
      return data;
    }

    return data.map(event => {
      const newEvent = { ...event };
      Object.keys(columnRemapping).forEach((key) => {
        newEvent[columnRemapping[key as keyof T]] = event[key as keyof T];
      });
      console.log("previous event", event);
      console.log("new event", newEvent);
      return newEvent;
    });
  });
} 