import { UltimateChargedLogEvent, UltimateStartLogEvent, UltimateEndLogEvent, HeroSwapLogEvent, RoundEndLogEvent } from '../types/logs';
import { MatchEvents } from '../types/domain';

export interface UltCycle {
  playerId: string; // name-team-hero
  playerName: string;
  playerTeam: string;
  hero: string;
  
  chargeStartTime: number;
  chargeEndTime: number; // When it reached 100%
  
  useTime: number | null; // When it was used
  endTime: number | null; // When the ult finished (if applicable)
  
  status: 'used' | 'held' | 'swapped' | 'round-end';
  
  // Metrics
  timeToCharge: number;
  timeHeld: number; // 0 if not charged yet, or (useTime - chargeEndTime)
}

export interface PlayerUltMetrics {
  playerName: string;
  teamName: string;
  hero: string;
  
  avgTimeToCharge: number;
  avgTimeHeld: number;
  totalUltsEarned: number;
  totalUltsUsed: number;
  
  firstUltRate: number; // % of times they got ult first in their team
}

/**
 * Tracks the lifecycle of ultimates for all players in a match.
 * Matches "Charged" events to "Start" events.
 */
export function calculateUltCycles(events: MatchEvents): UltCycle[] {
  const cycles: UltCycle[] = [];
  
  // Helper to generate a unique key for a player on a specific hero
  // We need to track active cycles: Map<PlayerKey, PartialCycle>
  const activeCycles = new Map<string, Partial<UltCycle>>();
  
  const getPlayerKey = (name: string, team: string, hero: string) => `${name}-${team}-${hero}`;

  // We need to process events in chronological order.
  // The 'events' object has arrays by type. We need to merge and sort relevant events.
  
  const relevantEvents = [
    ...events.ultimateCharged.map((e: UltimateChargedLogEvent) => ({ ...e, evtType: 'charged' })),
    ...events.ultimateStart.map((e: UltimateStartLogEvent) => ({ ...e, evtType: 'start' })),
    ...events.ultimateEnd.map((e: UltimateEndLogEvent) => ({ ...e, evtType: 'end' })),
    ...events.heroSwap.map((e: HeroSwapLogEvent) => ({ ...e, evtType: 'swap' })),
    ...events.roundEnd.map((e: RoundEndLogEvent) => ({ ...e, evtType: 'round_end' })),
    // We also need to know when a player spawns to start tracking "charge time"
    // But for "Time To Charge", we can just use the previous event time or match start?
    // For simplicity, let's define "Charge Start Time" as:
    // 1. Match Start / Round Start
    // 2. Previous Ult End
    // 3. Hero Spawn / Swap
    // For now, let's focus on "Charged" -> "Used" (Hold Time) as that's the critical metric requested.
    // Time To Charge is harder without damage events to see when they started building.
    // We will approximate Charge Start Time as the time of the last ult use/swap/spawn.
  ].sort((a, b) => a.matchTime - b.matchTime);

  // Track when a player last reset their ult charge (used, swapped, or round start)
  const lastResetTimes = new Map<string, number>();

  relevantEvents.forEach(event => {
    // Handle Round End - closes all open cycles
    if (event.evtType === 'round_end') {
      activeCycles.forEach((cycle, key) => {
        if (cycle.chargeEndTime && !cycle.useTime) {
          // Held until round end
          cycles.push({
            ...cycle as UltCycle,
            status: 'round-end',
            timeHeld: event.matchTime - cycle.chargeEndTime,
            endTime: event.matchTime
          });
        }
        activeCycles.delete(key);
      });
      lastResetTimes.clear();
      return;
    }

    // For other events, we need player details.
    // RoundEnd doesn't have player details, handled above.
    const e = event as (UltimateChargedLogEvent | UltimateStartLogEvent | UltimateEndLogEvent | HeroSwapLogEvent) & { evtType: string };
    const key = getPlayerKey(e.playerName, e.playerTeam, e.playerHero);

    if (event.evtType === 'swap') {
      // If they had an ult, it's lost.
      const current = activeCycles.get(key);
      const chargeEndTime = current?.chargeEndTime;
      if (current && typeof chargeEndTime === 'number' && !current.useTime) {
        cycles.push({
          ...current as UltCycle,
          status: 'swapped',
          timeHeld: event.matchTime - chargeEndTime,
          endTime: event.matchTime
        });
      }
      activeCycles.delete(key);
      lastResetTimes.set(key, event.matchTime);
    }
    
    else if (event.evtType === 'charged') {
      // Ult is ready.
      const chargeStart = lastResetTimes.get(key) || 0; // Default to 0 if unknown (start of match)
      
      activeCycles.set(key, {
        playerId: key,
        playerName: e.playerName,
        playerTeam: e.playerTeam,
        hero: e.playerHero,
        chargeStartTime: chargeStart,
        chargeEndTime: event.matchTime,
        timeToCharge: event.matchTime - chargeStart,
        status: 'held', // Default until used
      });
    }
    
    else if (event.evtType === 'start') {
      // Ult used.
      const current = activeCycles.get(key);
      if (current) {
        // We found the cycle for this ult
        const completedCycle: UltCycle = {
          ...current as UltCycle,
          useTime: event.matchTime,
          status: 'used',
          timeHeld: event.matchTime - (current.chargeEndTime || 0),
        };
        cycles.push(completedCycle);
        
        // We keep it in activeCycles to wait for 'end' event? 
        // Actually, usually we want to start tracking the NEXT charge immediately after start?
        // In OW, charge usually resets on start (except some transformation ults).
        // Let's assume reset on start for simplicity of "Charge Start Time".
        activeCycles.delete(key); 
        lastResetTimes.set(key, event.matchTime);
      } else {
        // Used without a 'charged' event? (Can happen if log starts mid-match or bug)
        // Create a dummy cycle
        cycles.push({
          playerId: key,
          playerName: e.playerName,
          playerTeam: e.playerTeam,
          hero: e.playerHero,
          chargeStartTime: event.matchTime, // Unknown
          chargeEndTime: event.matchTime, // Instant
          useTime: event.matchTime,
          endTime: event.matchTime,
          status: 'used',
          timeToCharge: 0,
          timeHeld: 0
        });
        lastResetTimes.set(key, event.matchTime);
      }
    }
  });

  return cycles;
}

export function calculateUltMetrics(cycles: UltCycle[]): PlayerUltMetrics[] {
  const playerMap = new Map<string, PlayerUltMetrics>();

  cycles.forEach(cycle => {
    const key = `${cycle.playerName}-${cycle.playerTeam}-${cycle.hero}`;
    
    if (!playerMap.has(key)) {
      playerMap.set(key, {
        playerName: cycle.playerName,
        teamName: cycle.playerTeam,
        hero: cycle.hero,
        avgTimeToCharge: 0,
        avgTimeHeld: 0,
        totalUltsEarned: 0,
        totalUltsUsed: 0,
        firstUltRate: 0
      });
    }
    
    const stats = playerMap.get(key)!;
    
    if (cycle.status !== 'swapped' && cycle.status !== 'round-end') {
      // Only count "earned" if they actually finished charging (which they did if they have a cycle entry from 'charged')
      // Actually, our logic creates a cycle on 'charged'.
      stats.totalUltsEarned++;
      stats.avgTimeToCharge += cycle.timeToCharge;
      stats.avgTimeHeld += cycle.timeHeld;
    }
    
    if (cycle.status === 'used') {
      stats.totalUltsUsed++;
    }
  });

  // Average out
  playerMap.forEach(stats => {
    if (stats.totalUltsEarned > 0) {
      stats.avgTimeToCharge /= stats.totalUltsEarned;
      stats.avgTimeHeld /= stats.totalUltsEarned; // Average hold time for all earned ults
    }
  });

  return Array.from(playerMap.values());
}

/**
 * Returns the state of ultimates during a specific fight.
 */
export function getUltCycleForFight(
  fightStartTime: number, 
  fightEndTime: number, 
  cycles: UltCycle[]
) {
  // We want to know:
  // 1. Who HAD ult available at start of fight? (Charged before start, Used/End after start)
  // 2. Who USED ult during fight? (UseTime inside fight window)
  // 3. Who BUILT ult during fight? (ChargeTime inside fight window)
  
  const available = cycles.filter(c => 
    c.chargeEndTime <= fightStartTime && 
    (c.useTime === null || c.useTime >= fightStartTime) && // Didn't use it before fight
    (c.status !== 'swapped' || c.endTime! >= fightStartTime) // Didn't swap off before fight
  );
  
  const used = cycles.filter(c => 
    c.useTime !== null && 
    c.useTime >= fightStartTime && 
    c.useTime <= fightEndTime
  );
  
  const charged = cycles.filter(c => 
    c.chargeEndTime >= fightStartTime && 
    c.chargeEndTime <= fightEndTime
  );
  
  return { available, used, charged };
}
