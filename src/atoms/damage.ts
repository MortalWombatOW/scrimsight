import { Getter } from 'jotai';
import {
  logFileParser, // This is the ScrimsightAtom wrapper from index.ts
  type LogFileParserAtomType,
  type DamageLogEvent, // This type will be moved to and imported from @atoms/index.ts
  type DamageType      // This type will be moved to and imported from @atoms/index.ts
} from '@atoms';
import { extractEventsFromFiles } from '@library';

// Default export the core atom logic (async getter function)
// The helper function 'damageFn' will be inlined.
export default async (get: Getter): Promise<DamageType> => {
  const parsedFiles: LogFileParserAtomType = await get(logFileParser.atom);

  // Inlined logic from damageFn:
  return extractEventsFromFiles<DamageLogEvent>('damage', parsedFiles);
};
