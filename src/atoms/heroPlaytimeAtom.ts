import { atom } from "jotai";
import { playerEvents, roundTimes, RoundTimesType, RoundTimes, Metric, HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys, PlayerEventForPlaytime } from '@atoms';
export const heroPlaytimeAtomFn = (
  events: PlayerEventForPlaytime[],
  roundTimesData: RoundTimesType
): Metric<HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys> => {
  const actualRoundTimes: RoundTimes[] = roundTimesData;
  const playtimeMap = new Map<string, HeroPlaytime>();
  
  // Group events by player/match/round
  const eventsByPlayer = events.reduce((acc, event: PlayerEventForPlaytime) => {
    // Find which round this event belongs to based on time
    const eventTime = event.playerEventTime ?? event.matchTime;
    const round = actualRoundTimes.find((rt: RoundTimes) => 
      rt.matchId === event.matchId &&
      eventTime >= rt.roundStartTime &&
      eventTime <= rt.roundEndTime
    );
    
    if (!round) return acc; // Skip events outside known rounds
    
    const key = `${event.playerName}-${event.matchId}-${round.roundNumber}`;
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key)?.push(event);
    return acc;
  }, new Map<string, PlayerEventForPlaytime[]>());

  // Process each player's events per round
  for (const [playerKey, playerEventsList] of eventsByPlayer) {
    const [playerName, matchId, roundNumberStr] = playerKey.split('-');
    const roundNumber = parseInt(roundNumberStr);
    const round = actualRoundTimes.find((rt: RoundTimes) => 
      rt.matchId === matchId && 
      rt.roundNumber === roundNumber
    );
    
    if (!round) continue;
    
    // Sort events chronologically
    const sortedEvents = playerEventsList.sort((a, b) => (a.playerEventTime ?? a.matchTime) - (b.playerEventTime ?? b.matchTime));
    let currentHero = '';
    let lastHeroChangeTime = round.roundSetupCompleteTime;
    
    for (const event of sortedEvents) {
      const eventType = event.playerEventType || event.eventType;
      if (eventType === 'heroSpawn' || eventType === 'heroSwap') {
        if (currentHero) {
          // Add duration for previous hero
          const eventTime = event.playerEventTime ?? event.matchTime;
          const duration = eventTime - lastHeroChangeTime;
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
        lastHeroChangeTime = event.playerEventTime ?? event.matchTime;
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
};

export default atom(async (get) => {
  const events: PlayerEventForPlaytime[] = await get(playerEvents.atom);
  const roundTimesData = await get(roundTimes.atom);
  
  return heroPlaytimeAtomFn(events, roundTimesData);
});