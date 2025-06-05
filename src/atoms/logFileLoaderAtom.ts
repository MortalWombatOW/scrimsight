import { atom } from 'jotai';
import { readFileAsync } from '@library';
import { logFileInput, LogFileLoaderType, LogFileInputType } from '@atoms';

/**
 * Implementation function for loading log file contents.
 * This function can be tested independently.
 */
export const logFileLoaderAtomFn = async (
  logFileInput: LogFileInputType 
): Promise<LogFileLoaderType> => {
  const { files } = logFileInput;

  if (!files || files.length === 0) {
    return [];
  }

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
};

export default atom(async (get): Promise<LogFileLoaderType> => {
  const logFileInputData = get(logFileInput.atom);
  return logFileLoaderAtomFn(logFileInputData);
});
