import { atom } from 'jotai';
import { logFileParser, LogFileParserAtomType } from '@atoms';
import { extractEventsFromFiles } from '@library/eventExtractionUtils';
import { HeroSwapLogEvent, HeroSwapType } from '@atoms';

export const heroSwapFn = async (parsedFiles: LogFileParserAtomType): Promise<HeroSwapType> => { // Removed 'get' parameter
  return extractEventsFromFiles<HeroSwapLogEvent>('hero_swap', parsedFiles);
};

export default atom(async (get): Promise<HeroSwapType> => {
  const parsedFiles = await get(logFileParser.atom);
  return heroSwapFn(parsedFiles); // Removed 'get' from call
});
