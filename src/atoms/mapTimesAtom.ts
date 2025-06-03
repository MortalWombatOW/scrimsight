import { atom } from 'jotai';
import { matchStart } from '@atoms';
import { matchEnd } from '@atoms';
import { roundTimes } from '@atoms';
import { MatchStartType, MatchEndType, RoundTimes } from '@atoms'; // Import specific types

/**
 * Interface for map times data
 */
export const mapTimesFn = (
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
 * Pure function that combines match start, end, and round events to calculate map times
 */
export interface MapTimes {
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
}

/**
 * Atom that combines match start, end, and round events to calculate map times
 */
export default atom(async (get): Promise<MapTimes[]> => {
  const matchStartsData = await get(matchStart.atom);
  const matchEndsData = await get(matchEnd.atom);
  const roundTimesData = await get(roundTimes.atom); // Use the imported atom

  return mapTimesFn(matchStartsData, matchEndsData, roundTimesData);
});
