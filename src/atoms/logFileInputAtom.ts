import { atom } from 'jotai';
import { type LogFileInputType } from '@atoms';

// Default export the core writable atom logic directly.
// This pattern previously had a TS2353 error, but that might be resolved now.
// This structure avoids the root-level 'const' that caused linting issues.
export default atom<LogFileInputType, [File[]], void>(
  { files: [] }, // Initial value
  (_get, set, newFiles: File[]) => {
    set({ files: newFiles });
  }
);
