import { atom } from 'jotai';
import { heroSpawnExtractorAtom, type HeroSpawnLogEvent } from './event_extractors/heroSpawnExtractorAtom';
import { heroSwapExtractorAtom, type HeroSwapLogEvent } from './event_extractors/heroSwapExtractorAtom';
import { mapTimesAtom } from './mapTimesAtom';

type HeroEvent = HeroSpawnLogEvent | HeroSwapLogEvent;

export interface TeamComposition {
  teamName: string;
  heroes: string[];
  timePlayed: number;
}

export const teamCompositionsAtom = atom(async (get) => {
  const [heroSpawns, heroSwaps, mapTimes] = await Promise.all([
    get(heroSpawnExtractorAtom),
    get(heroSwapExtractorAtom),
    get(mapTimesAtom),
  ]);

  const allEvents = [...heroSpawns, ...heroSwaps].sort((a, b) => a.matchTime - b.matchTime);
  const compositions: TeamComposition[] = [];

  // Group events by match and team
  const eventsByMatchAndTeam = new Map<string, Map<string, HeroEvent[]>>();
  for (const event of allEvents) {
    const matchMap = eventsByMatchAndTeam.get(event.matchId) || new Map();
    const teamEvents = matchMap.get(event.playerTeam) || [];
    teamEvents.push(event);
    matchMap.set(event.playerTeam, teamEvents);
    eventsByMatchAndTeam.set(event.matchId, matchMap);
  }

  // Process each match and team combination
  for (const [matchId, teamMap] of eventsByMatchAndTeam) {
    const matchTime = mapTimes.find(mt => mt.matchId === matchId);
    if (!matchTime) continue;

    for (const [teamName, events] of teamMap) {
      const playerHeroes = new Map<string, string>();
      let currentComposition: string[] = [];
      let compositionStart = matchTime.startTime;
      const compositionMap = new Map<string, TeamComposition>();

      // Sort events chronologically
      const sortedEvents = events.sort((a, b) => a.matchTime - b.matchTime);

      for (const event of sortedEvents) {
        // Update player's current hero
        playerHeroes.set(event.playerName, event.playerHero);
        
        // Get sorted hero list for current composition
        const newComposition = Array.from(playerHeroes.values()).sort();
        const compositionKey = newComposition.join(',');

        // Skip if composition hasn't changed
        if (compositionKey === currentComposition.join(',')) continue;

        // Calculate duration for previous composition
        if (currentComposition.length > 0) {
          if (currentComposition.length === 5) {
            const duration = event.matchTime - compositionStart;
            const existing = compositionMap.get(currentComposition.join(','));
            if (existing) {
              existing.timePlayed += duration;
            } else {
              compositionMap.set(currentComposition.join(','), {
                teamName,
                heroes: [...currentComposition],
                timePlayed: duration,
              });
            }
          }
        }

        // Update tracking variables
        currentComposition = newComposition;
        compositionStart = event.matchTime;
      }

      // Add final composition duration
      if (currentComposition.length > 0) {
        if (currentComposition.length === 5) {
          const duration = matchTime.endTime - compositionStart;
          const existing = compositionMap.get(currentComposition.join(','));
          if (existing) {
            existing.timePlayed += duration;
          } else {
            compositionMap.set(currentComposition.join(','), {
              teamName,
              heroes: [...currentComposition],
              timePlayed: duration,
            });
          }
        }
      }

      compositions.push(...Array.from(compositionMap.values()));
    }
  }

  return compositions;
}); 