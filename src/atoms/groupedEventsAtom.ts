
import { atom } from 'jotai';
import {
  KillLogEvent,
  OffensiveAssistLogEvent,
  kill,
  offensiveAssist,
} from '@atoms'; // Types and registered atoms from @atoms

/**
 * An interface to represent grouped kill and offensive assist events.
 */
export interface GroupedKillOffensiveAssistEvent {
  matchId: string;
  matchTime: number;
  kills: KillLogEvent[];
  assists: OffensiveAssistLogEvent[];
}

/**
 * Atom that groups kill events and offensive assists by matchId and matchTime.
 * If multiple kills or assists occur in the same moment, all are grouped together.
 */
export const groupedKillOffensiveAssistExtractorAtom = atom(async (get) => {
  const killEvents = await get(kill.atom);
  const offensiveAssistEvents = await get(offensiveAssist.atom);

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
});
