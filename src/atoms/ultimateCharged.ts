import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { UltimateChargedLogEvent, UltimateChargedType } from '@atoms';

export const ultimateChargedFn = async (parsedFiles: LogFileParserAtomType): Promise<UltimateChargedType> => { // Removed 'get' parameter
  return extractEventsFromFiles<UltimateChargedLogEvent>('ultimate_charged', parsedFiles);
};

export default atom(async (get): Promise<UltimateChargedType> => {
  const parsedFiles = await get(logFileParser.atom);
  return ultimateChargedFn(parsedFiles); // Removed 'get' from call
});
