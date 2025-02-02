import { createEventExtractorAtom } from './utils/createEventExtractorAtom';

/**
 * Interface for round start events
 */
export interface RoundStartLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
}

/**
 * Atom that extracts round start events from the parsed log files
 */
export const roundStartExtractorAtom = createEventExtractorAtom<RoundStartLogEvent>('round_start'); 