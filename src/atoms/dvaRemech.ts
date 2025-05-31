import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { DvaRemechLogEvent, DvaRemechType } from '@atoms';

export const dvaRemechFn = async (parsedFiles: LogFileParserAtomType): Promise<DvaRemechType> => { // Removed 'get' parameter
  return extractEventsFromFiles<DvaRemechLogEvent>('dva_remech', parsedFiles);
};

export default atom(async (get): Promise<DvaRemechType> => {
  const parsedFiles = await get(logFileParser.atom);
  return dvaRemechFn(parsedFiles); // Removed 'get' from call
});
