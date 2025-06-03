import { Getter } from 'jotai';
import {
  logFileParser, // This is the ScrimsightAtom wrapper from index.ts
  type LogFileParserAtomType,
  type Ability1UsedLogEvent, // This type will be moved to and imported from @atoms/index.ts
  type Ability1UsedType      // This type will be moved to and imported from @atoms/index.ts
} from '@atoms';
import { extractEventsFromFiles } from '@library';

// Default export the core atom logic (async getter function)
// The helper function 'ability1UsedFn' will be inlined.
export default async (get: Getter): Promise<Ability1UsedType> => {
  const parsedFiles: LogFileParserAtomType = await get(logFileParser.atom);

  // Inlined logic from ability1UsedFn:
  return extractEventsFromFiles<Ability1UsedLogEvent>('ability_1_used', parsedFiles);
};
