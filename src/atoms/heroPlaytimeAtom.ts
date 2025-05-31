import { atom } from "jotai";
import { playerEventsAtom, PlayerEvent } from "@atoms/playerEventsAtom"; // Corrected import for atom and type to named
import roundTimesAtom, { RoundTimes } from "@atoms/roundTimesAtom"; // Corrected import for atom and type
import { MetricAtom } from "@library/metricUtils";

export interface HeroPlaytime {
  playerName: string;
  matchId: string;
  roundNumber: number;
  hero: string;
  playtime: number;
}

export type HeroPlaytimeCategoryKeys = "playerName" | "matchId" | "roundNumber" | "hero";
export type HeroPlaytimeNumericalKeys = "playtime";

export const heroPlaytimeAtom: MetricAtom<HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys> = atom(async (get) => {
  const events: PlayerEvent[] = await get(playerEventsAtom);
  const roundTimesData = await get(roundTimesAtom); // Renamed to avoid conflict with RoundTimes type if it's an array
  const actualRoundTimes: RoundTimes[] = roundTimesData; // Assuming roundTimesData is RoundTimes[]
  
  const playtimeMap = new Map<string, HeroPlaytime>();
  
  // Group events by player/match/round
  const eventsByPlayer = events.reduce((acc, event: PlayerEvent) => {
    // Find which round this event belongs to based on time
    const round = actualRoundTimes.find((rt: RoundTimes) => 
      rt.matchId === event.matchId &&
      event.playerEventTime >= rt.roundStartTime &&
      event.playerEventTime <= rt.roundEndTime
    );
    
    if (!round) return acc; // Skip events outside known rounds
    
    const key = `${event.playerName}-${event.matchId}-${round.roundNumber}`;
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key)?.push(event);
    return acc;
  }, new Map<string, PlayerEvent[]>()); // Explicitly type the accumulator

  // Process each player's events per round
  for (const [playerKey, playerEventsList] of eventsByPlayer) { // Renamed playerEvents to playerEventsList
    const [playerName, matchId, roundNumberStr] = playerKey.split('-'); // Renamed roundNumber to roundNumberStr
    const roundNumber = parseInt(roundNumberStr);
    const round = actualRoundTimes.find((rt: RoundTimes) => 
      rt.matchId === matchId && 
      rt.roundNumber === roundNumber
    );
    
    if (!round) continue;
    
    // Sort events chronologically
    const sortedEvents = playerEventsList.sort((a: PlayerEvent, b: PlayerEvent) => a.playerEventTime - b.playerEventTime);
    let currentHero = '';
    let lastHeroChangeTime = round.roundSetupCompleteTime;
    
    for (const event of sortedEvents) {
      if (event.playerEventType === 'heroSpawn' || event.playerEventType === 'heroSwap') {
        if (currentHero) {
          // Add duration for previous hero
          const duration = event.playerEventTime - lastHeroChangeTime;
          const playtimeKey = `${playerName}-${matchId}-${roundNumber}-${currentHero}`;
          
          playtimeMap.set(playtimeKey, {
            playerName,
            matchId,
            roundNumber: roundNumber,
            hero: currentHero,
            playtime: (playtimeMap.get(playtimeKey)?.playtime || 0) + duration
          });
        }
        
        currentHero = event.playerHero;
        lastHeroChangeTime = event.playerEventTime;
      }
    }
    
    // Add remaining time after last event
    if (currentHero) {
      const duration = round.roundEndTime - lastHeroChangeTime;
      const playtimeKey = `${playerName}-${matchId}-${roundNumber}-${currentHero}`;
      
      playtimeMap.set(playtimeKey, {
        playerName,
        matchId,
        roundNumber: roundNumber,
        hero: currentHero,
        playtime: (playtimeMap.get(playtimeKey)?.playtime || 0) + duration
      });
    }
  }

  return {
    categoryKeys: ['playerName', 'matchId', 'roundNumber', 'hero'] as HeroPlaytimeCategoryKeys[],
    numericalKeys: ['playtime'] as HeroPlaytimeNumericalKeys[],
    rows: Array.from(playtimeMap.values())
  };
});
