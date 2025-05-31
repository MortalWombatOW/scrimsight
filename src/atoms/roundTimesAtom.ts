import { atom } from 'jotai';
import roundStartAtom from '@atoms/roundStart'; // Renamed for clarity
import roundEndAtom from '@atoms/roundEnd';     // Renamed for clarity
import setupCompleteAtom from '@atoms/setupComplete'; // Renamed for clarity
import { RoundStartType, RoundEndType, SetupCompleteType } from '@atoms'; // Import types

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
 * Pure function that combines round start, setup complete, and round end events to calculate round times
 */
export const roundTimesFn = (
  roundStarts: RoundStartType,
  setupCompletes: SetupCompleteType,
  roundEnds: RoundEndType
): RoundTimes[] => {
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
      roundDuration: end.matchTime - setup.matchTime,
    }];
  }).sort((a, b) => a.matchId !== b.matchId ? a.matchId.localeCompare(b.matchId) : a.roundNumber - b.roundNumber);
};

/**
 * Atom that combines round start, setup complete, and round end events to calculate round times
 */
export default atom(async (get): Promise<RoundTimes[]> => {
  const roundStartsData = await get(roundStartAtom);
  const setupCompletesData = await get(setupCompleteAtom);
  const roundEndsData = await get(roundEndAtom);

  return roundTimesFn(roundStartsData, setupCompletesData, roundEndsData);
});
