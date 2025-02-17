import { atom } from "jotai";
import { playerEventsAtom } from "../derived_events/playerEventsAtom";
import { roundTimesAtom } from "../roundTimesAtom";
import { MetricAtom } from "./metricUtils";

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
  const events = await get(playerEventsAtom);
  const roundTimes = await get(roundTimesAtom);
  
  const playtimeMap = new Map<string, HeroPlaytime>();
  
  // Group events by player/match/round
  const eventsByPlayer = events.reduce((acc, event) => {
    // Find which round this event belongs to based on time
    const round = roundTimes.find(rt => 
      rt.matchId === event.matchId &&
      event.playerEventTime >= rt.roundStartTime &&
      event.playerEventTime <= rt.roundEndTime
    );
    
    if (!round) return acc; // Skip events outside known rounds
    
    const key = `${event.playerName}-${event.matchId}-${round.roundNumber}`;
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key)?.push(event);
    return acc;
  }, new Map<string, typeof events>());

  // Process each player's events per round
  for (const [playerKey, playerEvents] of eventsByPlayer) {
    const [playerName, matchId, roundNumber] = playerKey.split('-');
    const round = roundTimes.find(rt => 
      rt.matchId === matchId && 
      rt.roundNumber === parseInt(roundNumber)
    );
    
    if (!round) continue;
    
    // Sort events chronologically
    const sortedEvents = playerEvents.sort((a, b) => a.playerEventTime - b.playerEventTime);
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
            roundNumber: parseInt(roundNumber),
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
        roundNumber: parseInt(roundNumber),
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