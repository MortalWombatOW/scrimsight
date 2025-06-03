import { Getter } from 'jotai'; // atom will be used in index.ts
import { readFileAsync } from '@library';
import {
  logFileInput, // This is the ScrimsightAtom wrapper from index.ts
  type LogFileLoaderType,
} from '@atoms';

// This is the core logic function for the atom.
// It's an async function that takes Jotai's `get` and returns the atom's value.
const logFileLoaderLogic = async (get: Getter): Promise<LogFileLoaderType> => {
  const logFileInputData = get(logFileInput.atom); // logFileInput is imported from @atoms

  // Inlined logic from loadLogFiles helper function:
  const { files } = logFileInputData;

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

export default logFileLoaderLogic;
