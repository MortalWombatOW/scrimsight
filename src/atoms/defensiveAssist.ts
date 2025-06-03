import { Getter } from 'jotai';
import {
  logFileParser, // This is the ScrimsightAtom wrapper from index.ts
  type LogFileParserAtomType,
  type DefensiveAssistLogEvent, // This type will be moved to and imported from @atoms/index.ts
  type DefensiveAssistType      // This type will be moved to and imported from @atoms/index.ts
} from '@atoms';
import { extractEventsFromFiles } from '@library';

// Default export the core atom logic (async getter function)
// The helper function 'defensiveAssistFn' will be inlined.
export default async (get: Getter): Promise<DefensiveAssistType> => {
  const parsedFiles: LogFileParserAtomType = await get(logFileParser.atom);

  // Inlined logic from defensiveAssistFn:
  return extractEventsFromFiles<DefensiveAssistLogEvent>('defensive_assist', parsedFiles);
};
