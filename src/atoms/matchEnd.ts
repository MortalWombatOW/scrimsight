import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { MatchEndLogEvent, MatchEndType } from '@atoms';

export const matchEndFn = async (parsedFiles: LogFileParserAtomType): Promise<MatchEndType> => { // Removed 'get' parameter
  return extractEventsFromFiles<MatchEndLogEvent>('match_end', parsedFiles);
};

export default atom(async (get): Promise<MatchEndType> => {
  const parsedFiles = await get(logFileParser.atom);
  return matchEndFn(parsedFiles); // Removed 'get' from call
});
