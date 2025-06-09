
import { atom } from 'jotai';
import {
  KillLogEvent,
  OffensiveAssistLogEvent,
  GroupedKillOffensiveAssistEvent,
  kill,
  offensiveAssist,
} from '@atoms';

/**
 * Pure function that groups kill events and offensive assists by matchId and matchTime.
 */
export const groupedEventsAtomFn = (
  killEvents: KillLogEvent[],
  offensiveAssistEvents: OffensiveAssistLogEvent[]
): GroupedKillOffensiveAssistEvent[] => {
  // Use a map to collect events under a single key (matchId & matchTime).
  const groupsByKey = new Map<string, GroupedKillOffensiveAssistEvent>();

  // Helper function to ensure the group object is created before usage.
  const getOrCreateGroup = (matchId: string, matchTime: number) => {
    const key = `${matchId}-${matchTime}`;
    if (!groupsByKey.has(key)) {
      groupsByKey.set(key, {
        matchId,
        matchTime,
        kills: [],
        assists: [],
      });
    }
    return groupsByKey.get(key)!;
  };

  // Group all kills first.
  for (const kill of killEvents) {
    const group = getOrCreateGroup(kill.matchId, kill.matchTime);
    group.kills.push(kill);
  }

  // Group all offensive assists.
  for (const assist of offensiveAssistEvents) {
    const group = getOrCreateGroup(assist.matchId, assist.matchTime);
    group.assists.push(assist);
  }

  // Convert the Map's values to an array for easy consumption.
  return Array.from(groupsByKey.values());
};

/**
 * Atom that groups kill events and offensive assists by matchId and matchTime.
 */
export default atom(async (get): Promise<GroupedKillOffensiveAssistEvent[]> => {
  const killEvents = await get(kill.atom);
  const offensiveAssistEvents = await get(offensiveAssist.atom);
  
  return groupedEventsAtomFn(killEvents, offensiveAssistEvents);
});
