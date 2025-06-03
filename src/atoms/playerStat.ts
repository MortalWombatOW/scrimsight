import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library';
import { PlayerStatLogEvent, PlayerStatType } from '@atoms';

export const playerStatFn = async (parsedFiles: LogFileParserAtomType): Promise<PlayerStatType> => { // Removed 'get' parameter
  return extractEventsFromFiles<PlayerStatLogEvent>('player_stat', parsedFiles);
};

export default atom(async (get): Promise<PlayerStatType> => {
  const parsedFiles = await get(logFileParser.atom);
  return playerStatFn(parsedFiles); // Removed 'get' from call
});
