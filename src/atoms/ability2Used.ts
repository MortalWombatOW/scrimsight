import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { Ability2UsedLogEvent, Ability2UsedType } from '@atoms';


export const ability2UsedFn = async (parsedFiles: LogFileParserAtomType): Promise<Ability2UsedType> => {
  return extractEventsFromFiles<Ability2UsedLogEvent>('ability_2_used', parsedFiles);
};


export default atom(async (get) => {
  const parsedFiles = await get(logFileParser.atom);
  return ability2UsedFn(parsedFiles); // Removed 'get' from call
});
