import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { UltimateStartLogEvent, UltimateStartType } from '@atoms';

export const ultimateStartFn = async (parsedFiles: LogFileParserAtomType): Promise<UltimateStartType> => { // Removed 'get' parameter
  return extractEventsFromFiles<UltimateStartLogEvent>('ultimate_start', parsedFiles);
};

export default atom(async (get): Promise<UltimateStartType> => {
  const parsedFiles = await get(logFileParser.atom);
  return ultimateStartFn(parsedFiles); // Removed 'get' from call
});
