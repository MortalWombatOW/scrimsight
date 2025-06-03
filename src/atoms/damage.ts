import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { DamageLogEvent, DamageType } from '@atoms';

/**
 * Pure function to extract damage events from parsed log files.
 * This function can be tested independently.
 */
export const damageFn = async (parsedFiles: LogFileParserAtomType): Promise<DamageType> => { // Removed 'get' parameter
  return extractEventsFromFiles<DamageLogEvent>('damage', parsedFiles);
};

/**
 * Atom that extracts damage events from the parsed log files.
 * This is the default export.
 */
export default atom(async (get) => {
  const parsedFiles = await get(logFileParser.atom);
  return damageFn(parsedFiles); // Removed 'get' from call
});
