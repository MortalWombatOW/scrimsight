import { atom } from 'jotai';
import { logFileParser, LogFileParserOutput, MatchFileInfo } from '@atoms';

/**
 * Interface for the match extractor atom's output
 */
export const matchExtractorAtomFn = (parsedFiles: LogFileParserOutput[]): MatchFileInfo[] => {
  return parsedFiles.map((file) => {
    const date = new Date(file.fileModified);
    return {
      matchId: file.matchId,
      name: file.fileName,
      fileModified: file.fileModified,
      dateString: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      timeString: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    };
  });
};


/**
 * Atom that extracts match information from the parsed log files
 */
export default atom(async (get): Promise<MatchFileInfo[]> => {
  const parsedFiles = await get(logFileParser.atom);
  return matchExtractorAtomFn(parsedFiles);
});
