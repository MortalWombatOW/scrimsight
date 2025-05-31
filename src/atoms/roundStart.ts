import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { RoundStartLogEvent, RoundStartType } from '@atoms';

export const roundStartFn = async (parsedFiles: LogFileParserAtomType): Promise<RoundStartType> => { // Removed 'get' parameter
  return extractEventsFromFiles<RoundStartLogEvent>('round_start', parsedFiles);
};

export default atom(async (get): Promise<RoundStartType> => {
  const parsedFiles = await get(logFileParser.atom);
  return roundStartFn(parsedFiles); // Removed 'get' from call
});
