import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for round end events
 */
export interface RoundEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
  controlTeam1Progress: number;
  controlTeam2Progress: number;
  matchTimeRemaining: number;
}

/**
 * Atom that extracts round end events from the parsed log files
 */
export const roundEndExtractorAtom = createEventExtractorAtom<RoundEndLogEvent>('round_end'); 