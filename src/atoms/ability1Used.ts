import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { Ability1UsedLogEvent, Ability1UsedType } from '@atoms';

export const ability1UsedFn = async (parsedFiles: LogFileParserAtomType): Promise<Ability1UsedType> => {
  return extractEventsFromFiles<Ability1UsedLogEvent>('ability_1_used', parsedFiles);
};

export default atom(async (get) => {
  const parsedFiles = await get(logFileParser.atom);
  return ability1UsedFn(parsedFiles); // Removed 'get' from call
});
