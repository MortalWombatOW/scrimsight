import { Getter } from 'jotai';
import {
  kill, // ScrimsightAtom wrapper for kill events
  offensiveAssist, // Type for offensive assist events
  // GroupedKillOffensiveAssistEvent will be defined in and imported from @atoms/index.ts
  type GroupedKillOffensiveAssistEvent,
} from '@atoms';

// Default export the core atom logic (async getter function)
export default async (get: Getter): Promise<GroupedKillOffensiveAssistEvent[]> => {
  const killEvents = await get(kill.atom);
  const offensiveAssistEvents = await get(offensiveAssist.atom);

  const groupsByKey = new Map<string, GroupedKillOffensiveAssistEvent>();

  // Inlined helper function logic:
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

  for (const killEvent of killEvents) { // Renamed 'kill' to 'killEvent' to avoid conflict with imported atom
    const group = getOrCreateGroup(killEvent.matchId, killEvent.matchTime);
    group.kills.push(killEvent);
  }

  for (const assist of offensiveAssistEvents) {
    const group = getOrCreateGroup(assist.matchId, assist.matchTime);
    group.assists.push(assist);
  }

  return Array.from(groupsByKey.values());
};
