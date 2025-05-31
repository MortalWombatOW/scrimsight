import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { DefensiveAssistLogEvent, DefensiveAssistType } from '@atoms';

/**
 * Pure function to extract defensive assist events from parsed log files.
 * This function can be tested independently.
 */
export const defensiveAssistFn = async (parsedFiles: LogFileParserAtomType): Promise<DefensiveAssistType> => { // Removed 'get' parameter
  return extractEventsFromFiles<DefensiveAssistLogEvent>('defensive_assist', parsedFiles);
};

/**
 * Atom that extracts defensive assist events from the parsed log files.
 * This is the default export.
 */
export default atom(async (get) => {
  const parsedFiles = await get(logFileParser.atom);
  return defensiveAssistFn(parsedFiles); // Removed 'get' from call
});
