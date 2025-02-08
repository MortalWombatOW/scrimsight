/**
 * Interface for the log file input atom's output
 */
export interface LogFileInput {
  files: File[];
}

import { atom } from 'jotai';

/**
 * Atom that stores the uploaded log files
 */
export const logFileInputAtom = atom<LogFileInput>({
  files: [],
});

/**
 * Atom that provides a setter function to update the log files
 */
export const logFileInputMutationAtom = atom(
  (get) => get(logFileInputAtom),
  (_, set, files: File[]) => {
    set(logFileInputAtom, { files });
  }
); 