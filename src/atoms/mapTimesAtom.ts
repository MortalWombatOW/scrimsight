import { atom } from 'jotai';
import matchStart from '@atoms/matchStart';
import matchEnd from '@atoms/matchEnd';
import roundTimesAtom, { RoundTimes } from '@atoms/roundTimesAtom'; // Changed import name and added RoundTimes
import { MatchStartType, MatchEndType } from '@atoms'; // Import specific types

/**
 * Interface for map times data
 */
export interface MapTimes {
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
}

/**
 * Pure function that combines match start, end, and round events to calculate map times
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
 * Atom that combines match start, end, and round events to calculate map times
 */
export default atom(async (get): Promise<MapTimes[]> => {
  const matchStartsData = await get(matchStart);
  const matchEndsData = await get(matchEnd);
  const roundTimesData = await get(roundTimesAtom); // Use the imported atom

  return mapTimesFn(matchStartsData, matchEndsData, roundTimesData);
});
