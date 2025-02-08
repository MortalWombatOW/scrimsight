import { createEventExtractorAtom } from './createEventExtractorAtom';

/**
 * Interface for setup complete events
 */
export interface SetupCompleteLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  matchTimeRemaining: number;
}

/**
 * Atom that extracts setup complete events from the parsed log files
 */
export const setupCompleteExtractorAtom = createEventExtractorAtom<SetupCompleteLogEvent>('setup_complete'); 