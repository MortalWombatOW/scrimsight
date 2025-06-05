import { atom } from 'jotai';
import {
  roundStart,
  roundEnd,
  setupComplete,
  RoundStartType,
  RoundEndType,
  SetupCompleteType,
  RoundTimes,
} from '@atoms';

export const roundTimesAtomFn = (
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
    
    const end = roundEnds.find(e => 
      e.matchId === start.matchId && 
      e.roundNumber === start.roundNumber
    );
    
    // Only include rounds that have all three events
    if (!setup || !end) {
      return [];
    }
    
    return [{
      matchId: start.matchId,
      roundNumber: start.roundNumber,
      roundStartTime: start.matchTime,
      roundSetupCompleteTime: setup.matchTime,
      roundEndTime: end.matchTime,
      roundDuration: end.matchTime - start.matchTime,
    }];
  }).sort((a, b) => a.matchId !== b.matchId ? a.matchId.localeCompare(b.matchId) : a.roundNumber - b.roundNumber);
};

export default atom(async (get): Promise<RoundTimes[]> => {
  const roundStartsData = await get(roundStart.atom);
  const setupCompletesData = await get(setupComplete.atom);
  const roundEndsData = await get(roundEnd.atom);

  return roundTimesAtomFn(roundStartsData, setupCompletesData, roundEndsData);
});