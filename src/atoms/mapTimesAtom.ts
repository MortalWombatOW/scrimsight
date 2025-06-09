import { atom } from 'jotai';
import {
  matchStart,
  matchEnd,
  roundTimes,
  MatchStartType,
  MatchEndType,
  RoundTimes,
  MapTimes,
} from '@atoms';

/**
 * Interface for map times data
 */
export const mapTimesAtomFn = (
  matchStarts: MatchStartType,
  matchEnds: MatchEndType,
  roundTimesData: RoundTimes[] // Changed parameter name and type
): MapTimes[] => {
  if (!matchStarts || !matchEnds || !roundTimesData) return [];

  return matchStarts.map((start) => {
    const end = matchEnds.find((e) => e.matchId === start.matchId);
    if (!end) return null;

    return {
      matchId: start.matchId,
      startTime: start.matchTime,
      endTime: end.matchTime,
      duration: end.matchTime - start.matchTime,
    };
  }).filter((time): time is MapTimes => time !== null);
};


/**
 * Atom that combines match start, end, and round events to calculate map times
 */
export default atom(async (get): Promise<MapTimes[]> => {
  const matchStartsData = await get(matchStart.atom);
  const matchEndsData = await get(matchEnd.atom);
  const roundTimesData = await get(roundTimes.atom); // Use the imported atom

  return mapTimesAtomFn(matchStartsData, matchEndsData, roundTimesData);
});
