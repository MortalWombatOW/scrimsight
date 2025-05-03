import { atom } from 'jotai';
import { rawLogContentAtom } from './rawAtoms';
import { processRawLogsToBronze } from '../layers/bronzeLogic';

/**
 * Atom that parses and validates raw log files into Bronze layer structured data
 */
export const bronzeParsedEventsAtom = atom(async (get) => {
  const rawLogContent = await get(rawLogContentAtom);
  
  // Process raw logs to Bronze layer data with Zod validation
  const bronzeData = await processRawLogsToBronze(rawLogContent);
  
  return bronzeData;
});