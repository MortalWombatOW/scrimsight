import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { HeroSpawnLogEvent, HeroSpawnType } from '@atoms';

export const heroSpawnFn = async (parsedFiles: LogFileParserAtomType): Promise<HeroSpawnType> => { // Removed 'get' parameter
  return extractEventsFromFiles<HeroSpawnLogEvent>('hero_spawn', parsedFiles);
};

export default atom(async (get): Promise<HeroSpawnType> => {
  const parsedFiles = await get(logFileParser.atom);
  return heroSpawnFn(parsedFiles); // Removed 'get' from call
});
