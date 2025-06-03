import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { KillLogEvent, KillType } from '@atoms';

export const killFn = async (parsedFiles: LogFileParserAtomType): Promise<KillType> => { // Removed 'get' parameter
  return extractEventsFromFiles<KillLogEvent>('kill', parsedFiles);
};

export default atom(async (get): Promise<KillType> => {
  const parsedFiles = await get(logFileParser.atom);
  return killFn(parsedFiles); // Removed 'get' from call
});
