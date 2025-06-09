import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { MercyRezLogEvent, MercyRezType } from '@atoms';

export const mercyRezFn = async (parsedFiles: LogFileParserAtomType): Promise<MercyRezType> => { // Removed 'get' parameter
  return extractEventsFromFiles<MercyRezLogEvent>('mercy_rez', parsedFiles, {
    eventAbility: 'revivedHero',
    revivedHero: 'revivedName',
    revivedName: 'revivedTeam',
  });
};

export default atom(async (get): Promise<MercyRezType> => {
  const parsedFiles = await get(logFileParser.atom);
  return mercyRezFn(parsedFiles); // Removed 'get' from call
});
