import { atom } from 'jotai';
import { logFileParserAtom } from './logFileParserAtom';

/**
 * Interface for the match extractor atom's output
 */
export interface MatchFileInfo {
  matchId: string;
  name: string;
  fileModified: number;
  dateString: string;
  timeString: string;
}

/**
 * Atom that extracts match information from the parsed log files
 */
export const matchExtractorAtom = atom(async (get): Promise<MatchFileInfo[]> => {
  const parsedFiles = await get(logFileParserAtom);
  
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
}); 