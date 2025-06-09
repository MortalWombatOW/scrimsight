import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { DvaDemechLogEvent, DvaDemechType } from '@atoms';

export const dvaDemechFn = async (parsedFiles: LogFileParserAtomType): Promise<DvaDemechType> => { // Removed 'get' parameter
  return extractEventsFromFiles<DvaDemechLogEvent>('dva_demech', parsedFiles);
};

export default atom(async (get): Promise<DvaDemechType> => {
  const parsedFiles = await get(logFileParser.atom);
  return dvaDemechFn(parsedFiles); // Removed 'get' from call
});
