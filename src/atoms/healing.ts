import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { HealingLogEvent, HealingType } from '@atoms';

export const healingFn = async (parsedFiles: LogFileParserAtomType): Promise<HealingType> => { // Removed 'get' parameter
  return extractEventsFromFiles<HealingLogEvent>('healing', parsedFiles);
};

export default atom(async (get): Promise<HealingType> => {
  const parsedFiles = await get(logFileParser.atom);
  return healingFn(parsedFiles); // Removed 'get' from call
});
