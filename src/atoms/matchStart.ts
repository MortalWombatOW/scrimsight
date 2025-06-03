import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { MatchStartLogEvent, MatchStartType } from '@atoms';

export const matchStartFn = async (parsedFiles: LogFileParserAtomType): Promise<MatchStartType> => { // Removed 'get' parameter
  return extractEventsFromFiles<MatchStartLogEvent>('match_start', parsedFiles);
};

export default atom(async (get): Promise<MatchStartType> => {
  const parsedFiles = await get(logFileParser.atom);
  return matchStartFn(parsedFiles); // Removed 'get' from call
});
