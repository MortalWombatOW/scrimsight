/**
 * Helper function to extract events of a specific type
 */
export function extractEventType<T>(type: string, logs: { specName: string; data: object }[]): T[] {
  const log = logs.find((log) => log.specName === type);
  if (!log) return [];
  return log.data as T[];
}

/**
 * Pure function to extract events of a specific type from parsed log files
 */
export function extractEventsFromFiles<T extends { matchId?: string}>(
  eventType: string, 
  parsedFiles: { matchId: string; logs: { specName: string; data: object }[] }[],
  columnRemapping?: Partial<Record<keyof T, keyof T>>
): T[] {
  // Extract data from all files
  const data = parsedFiles.flatMap((file) => 
    extractEventType<T>(eventType, file.logs).map(event => ({
      ...event,
      matchId: file.matchId
    }))
  );

  // Apply column remappings if provided
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
}
