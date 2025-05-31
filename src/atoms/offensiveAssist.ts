import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { OffensiveAssistLogEvent, OffensiveAssistType } from '@atoms';

export const offensiveAssistFn = async (parsedFiles: LogFileParserAtomType): Promise<OffensiveAssistType> => { // Removed 'get' parameter
  return extractEventsFromFiles<OffensiveAssistLogEvent>('offensive_assist', parsedFiles);
};

export default atom(async (get): Promise<OffensiveAssistType> => {
  const parsedFiles = await get(logFileParser.atom);
  return offensiveAssistFn(parsedFiles); // Removed 'get' from call
});
