import { Getter } from 'jotai';
import {
  matchStart,
  matchEnd,
  roundTimes,
  type MatchStartType, // Type for match start events (actually MatchStartLogEvent[])
  type MatchEndType,   // Type for match end events (actually MatchEndLogEvent[])
  type RoundTimes,     // Type for round times data (element type if roundTimes.atom is RoundTimes[])
  // but based on index.ts, roundTimes.atom is Promise<RoundTimes[]> where RoundTimes is an array itself.
  // So await get(roundTimes.atom) is RoundTimes[] (which is RoundTimesType)
  type MapTimes,       // This type will be moved to and imported from @atoms/index.ts
} from '@atoms';

// Default export the core atom logic (async getter function)
// The helper function 'mapTimesFn' will be inlined.
export default async (get: Getter): Promise<MapTimes[]> => {
  const matchStartsData: MatchStartType = await get(matchStart.atom); // Corrected: MatchStartType is MatchStartLogEvent[]
  const matchEndsData: MatchEndType = await get(matchEnd.atom);       // Corrected: MatchEndType is MatchEndLogEvent[]
  const roundTimesData: RoundTimes[] = await get(roundTimes.atom); // This is RoundTimesType from index.ts (RoundTimes[])

  // Inlined logic from mapTimesFn:
  if (!matchStartsData || !matchEndsData || !roundTimesData) return [];

  return matchStartsData.map((start) => {
    const end = matchEndsData.find((e) => e.matchId === start.matchId);
    if (!end) return null;

    return {
      matchId: start.matchId,
      startTime: start.matchTime,
      endTime: end.matchTime,
      duration: end.matchTime - start.matchTime,
    };
  }).filter((time): time is MapTimes => time !== null);
};
