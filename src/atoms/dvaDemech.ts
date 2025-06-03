import { Getter } from 'jotai';
import {
  logFileParser, // This is the ScrimsightAtom wrapper from index.ts
  type LogFileParserAtomType,
  type DvaDemechLogEvent, // This type will be moved to and imported from @atoms/index.ts
  type DvaDemechType      // This type will be moved to and imported from @atoms/index.ts
} from '@atoms';
import { extractEventsFromFiles } from '@library';

// Default export the core atom logic (async getter function)
// The helper function 'dvaDemechFn' will be inlined.
export default async (get: Getter): Promise<DvaDemechType> => {
  const parsedFiles: LogFileParserAtomType = await get(logFileParser.atom);

  // Inlined logic from dvaDemechFn:
  return extractEventsFromFiles<DvaDemechLogEvent>('dva_demech', parsedFiles);
};
