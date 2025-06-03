import { Getter } from 'jotai';
import {
  logFileParser, // This is the ScrimsightAtom wrapper from index.ts
  type LogFileParserAtomType,
  type Ability2UsedLogEvent, // This type will be moved to and imported from @atoms/index.ts
  type Ability2UsedType      // This type will be moved to and imported from @atoms/index.ts
} from '@atoms';
import { extractEventsFromFiles } from '@library';

// Default export the core atom logic (async getter function)
// The helper function 'ability2UsedFn' will be inlined.
export default async (get: Getter): Promise<Ability2UsedType> => {
  const parsedFiles: LogFileParserAtomType = await get(logFileParser.atom);

  // Inlined logic from ability2UsedFn:
  return extractEventsFromFiles<Ability2UsedLogEvent>('ability_2_used', parsedFiles);
};
