import { atom } from 'jotai';
import { parseFile, stringHash } from '@library';
import { logFileLoader, sampleData } from '@atoms';
/**
 * Interface for the log file parser atom's output
 */
export interface LogFileParserOutput {
  fileName: string;
  matchId: string;
  logs: {
    specName: string;
    data: object;
  }[];
  fileModified: number;
}

/**
 * Atom that parses the loaded log files into structured data
 */
export const logFileParserAtom = atom(async (get): Promise<LogFileParserOutput[]> => {
  const loadedFiles = await get(logFileLoader.atom);
  const sampleDataFiles = get(sampleData.atom);

  console.log('loadedFiles', loadedFiles);
  console.log('sampleData', sampleData);

  return [...loadedFiles, ...sampleDataFiles].map((file) => {
    const { logs } = parseFile(file.fileContent);
    return {
      fileName: file.fileName,
      matchId: stringHash(file.fileContent).toString(),
      logs,
      fileModified: file.fileModified,
    };
  });
});
