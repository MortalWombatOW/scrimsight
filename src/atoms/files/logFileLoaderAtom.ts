import { atom } from 'jotai';
import { readFileAsync } from '../../lib/data/uploadfile';
import { logFileInputAtom } from './logFileInputAtom';

/**
 * Interface for the log file loader atom's output
 */
export interface LogFileLoaderOutput {
  fileName: string;
  fileModified: number;
  fileContent: string;
}

/**
 * Atom that loads the contents of the uploaded log files
 */
export const logFileLoaderAtom = atom(async (get): Promise<LogFileLoaderOutput[]> => {
  const { files } = get(logFileInputAtom);
  
  // Read all files concurrently
  const fileContents = await Promise.all(
    files.map(async (file) => {
      const content = await readFileAsync(file);
      return {
        fileName: file.name,
        fileModified: file.lastModified,
        fileContent: content,
      };
    })
  );

  return fileContents;
}); 