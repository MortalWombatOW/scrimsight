import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType, Ability1UsedLogEvent, Ability1UsedType } from '@atoms';
import { extractEventsFromFiles } from '@library';

export const ability1UsedFn = async (parsedFiles: LogFileParserAtomType): Promise<Ability1UsedType> => {
  return extractEventsFromFiles<Ability1UsedLogEvent>('ability_1_used', parsedFiles);
};

export default atom(async (get) => {
  const parsedFiles = await get(logFileParser.atom);
  return ability1UsedFn(parsedFiles);
});
