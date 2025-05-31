import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { UltimateEndLogEvent, UltimateEndType } from '@atoms';

export const ultimateEndFn = async (parsedFiles: LogFileParserAtomType): Promise<UltimateEndType> => { // Removed 'get' parameter
  return extractEventsFromFiles<UltimateEndLogEvent>('ultimate_end', parsedFiles);
};

export default atom(async (get): Promise<UltimateEndType> => {
  const parsedFiles = await get(logFileParser.atom);
  return ultimateEndFn(parsedFiles); // Removed 'get' from call
});
