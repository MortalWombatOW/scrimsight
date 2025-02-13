import { atom } from 'jotai';
import { parseFile } from '../../lib/data/uploadfile';
import { stringHash } from '../../lib/string';
import { logFileLoaderAtom } from './logFileLoaderAtom';
import { sampleDataAtom } from './sampleDataAtoms';
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
  const loadedFiles = await get(logFileLoaderAtom);
  const sampleData = get(sampleDataAtom);

  console.log('loadedFiles', loadedFiles);
  console.log('sampleData', sampleData);

  return [...loadedFiles, ...sampleData].map((file) => {
    const { logs } = parseFile(file.fileContent);
    return {
      fileName: file.fileName,
      matchId: stringHash(file.fileContent).toString(),
      logs,
      fileModified: file.fileModified,
    };
  });
}); 