import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { SetupCompleteLogEvent, SetupCompleteType } from '@atoms';

export const setupCompleteFn = async (parsedFiles: LogFileParserAtomType): Promise<SetupCompleteType> => { // Removed 'get' parameter
  return extractEventsFromFiles<SetupCompleteLogEvent>('setup_complete', parsedFiles);
};

export default atom(async (get): Promise<SetupCompleteType> => {
  const parsedFiles = await get(logFileParser.atom);
  return setupCompleteFn(parsedFiles); // Removed 'get' from call
});
