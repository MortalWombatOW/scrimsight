import { atom } from 'jotai';
import { roundStartExtractorAtom } from './roundStartExtractorAtom';
import { roundEndExtractorAtom } from './roundEndExtractorAtom';
import { setupCompleteExtractorAtom } from './setupCompleteExtractorAtom';

/**
 * Interface for round times data
 */
export interface RoundTimes {
  matchId: string;
  roundNumber: number;
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
  roundDuration: number;
}

/**
 * Atom that combines round start, setup complete, and round end events to calculate round times
 */
export const roundTimesAtom = atom(async (get): Promise<RoundTimes[]> => {
  const roundStarts = await get(roundStartExtractorAtom);
  const setupCompletes = await get(setupCompleteExtractorAtom);
  const roundEnds = await get(roundEndExtractorAtom);

  return roundStarts.flatMap(start => {
    // Find matching setup complete and end events
    const setup = setupCompletes.find(s => 
      s.matchId === start.matchId && 
      s.roundNumber === start.roundNumber
    );

    if (!setup) return [];

    const end = roundEnds.find(e => 
      e.matchId === start.matchId && 
      e.roundNumber === start.roundNumber
    );

    if (!end) return [];

    return [{
      matchId: start.matchId,
      roundNumber: start.roundNumber,
      roundStartTime: start.matchTime,
      roundSetupCompleteTime: setup.matchTime,
      roundEndTime: end.matchTime,
      roundDuration: end.matchTime - setup.matchTime
    }];
  });
}); 