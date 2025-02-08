import { Atom, atom } from 'jotai';
import { matchStartExtractorAtom } from './event_extractors/matchStartExtractorAtom';
import { matchEndExtractorAtom } from './event_extractors/matchEndExtractorAtom';
import { roundTimesAtom } from './roundTimesAtom';

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
 * Atom that combines match start, end, and round events to calculate map times
 */
export const mapTimesAtom: Atom<Promise<MapTimes[]>> = atom(async (get) => {
  const matchStarts = await get(matchStartExtractorAtom);
  const matchEnds = await get(matchEndExtractorAtom);
  const roundTimes = await get(roundTimesAtom);

  if (!matchStarts || !matchEnds || !roundTimes) return [];

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
}); 