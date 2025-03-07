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
export function createEventExtractorAtom<T extends { matchId?: string}>(eventType: string, columnRemapping?: Partial<Record<keyof T, keyof T> >) {
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
        const newKey = columnRemapping[key as keyof T] ? columnRemapping[key as keyof T] as keyof T : null;
        if (newKey) {
          newEvent[newKey] = event[key as keyof T];
        } else {
          console.error("columnRemapping", columnRemapping);
          console.error("key", key);
          console.error("event", event);
        }
      });
      return newEvent;
    });
  });
} 