import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { RoundEndLogEvent, RoundEndType } from '@atoms';

export const roundEndFn = async (parsedFiles: LogFileParserAtomType): Promise<RoundEndType> => { // Removed 'get' parameter
  return extractEventsFromFiles<RoundEndLogEvent>('round_end', parsedFiles);
};

export default atom(async (get): Promise<RoundEndType> => {
  const parsedFiles = await get(logFileParser.atom);
  return roundEndFn(parsedFiles); // Removed 'get' from call
});
