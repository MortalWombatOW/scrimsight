import { atom } from 'jotai';
import { parseFile, stringHash } from '@library';
import { logFileLoader, sampleData, LogFileLoaderType, LogFileParserOutput } from '@atoms';

export const logFileParserAtomFn = (
  loadedFiles: LogFileLoaderType,
  sampleDataFiles: LogFileLoaderType
): LogFileParserOutput[] => {
  return [...loadedFiles, ...sampleDataFiles].map((file) => {
    const { logs } = parseFile(file.fileContent);
    return {
      fileName: file.fileName,
      matchId: stringHash(file.fileContent).toString(),
      logs,
      fileModified: file.fileModified,
    };
  });
};

/**
 * Atom that parses the loaded log files into structured data
 */
export default atom(async (get): Promise<LogFileParserOutput[]> => {
  const loadedFiles = await get(logFileLoader.atom);
  const sampleDataFiles = await get(sampleData.atom);

  return logFileParserAtomFn(loadedFiles, sampleDataFiles);
});
