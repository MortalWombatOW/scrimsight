import {
  Teamfight,
  TeamfightEvent,
  MatchEvents,
  MatchMetadata,
} from '../types/domain';
import { KillLogEvent } from '../types/logs';
import { UltCycle, calculateUltCycles, getUltCycleForFight } from './economy';

const TEAMFIGHT_SUSTAIN_TIME = 12; // seconds

interface FightEvent {
  time: number;
  type: 'kill' | 'ult_start' | 'rez';
  data: TeamfightEvent;
}

export function calculateTeamfights(
  events: MatchEvents,
  metadata: MatchMetadata
): Teamfight[] {
  const { matchId, team1Name, team2Name } = metadata;
  
  // 1. Flatten relevant events into a time-sorted list
  const fightEvents: FightEvent[] = [];
  
  events.kills.forEach(e => fightEvents.push({ time: e.matchTime, type: 'kill', data: e }));
  events.ultimateStart.forEach(e => fightEvents.push({ time: e.matchTime, type: 'ult_start', data: e }));
  events.mercyRez.forEach(e => fightEvents.push({ time: e.matchTime, type: 'rez', data: e }));
  
  fightEvents.sort((a, b) => a.time - b.time);
  
  // 2. Cluster events into fights
  const fights: Teamfight[] = [];
  const ultCycles = calculateUltCycles(events);
  
  let currentFightEvents: FightEvent[] = [];
  let fightStartTime: number | null = null;
  let lastEventTime: number | null = null;
  
  for (let i = 0; i < fightEvents.length; i++) {
    const event = fightEvents[i];
    
    // Start a new fight if none active
    if (fightStartTime === null) {
      // Only start on kill or ult (not rez, though rez usually implies a death happened)
      if (event.type === 'kill' || event.type === 'ult_start') {
        fightStartTime = event.time;
        lastEventTime = event.time;
        currentFightEvents.push(event);
      }
      continue;
    }
    
    // Check if we should sustain the current fight
    if (event.time - lastEventTime! <= TEAMFIGHT_SUSTAIN_TIME) {
      currentFightEvents.push(event);
      lastEventTime = event.time;
    } else {
      // Fight ended. Close it.
      // The fight ends at the last event time + some buffer? 
      // Or just the last event time?
      // The prompt says "Close the fight if no significant events occur for 12 seconds."
      // So the fight effectively ended at lastEventTime.
      // But we might want to include the "quiet period" or just the active period.
      // Usually "fight duration" is active time.
      
      fights.push(createTeamfight(
        matchId,
        team1Name,
        team2Name,
        fightStartTime,
        lastEventTime!,
        currentFightEvents,
        ultCycles
      ));
      
      // Reset
      fightStartTime = null;
      lastEventTime = null;
      currentFightEvents = [];
      
      // Re-process this event as it might start a new fight
      i--; 
    }
  }
  
  // Close final fight if exists
  if (fightStartTime !== null && currentFightEvents.length > 0) {
    fights.push(createTeamfight(
      matchId,
      team1Name,
      team2Name,
      fightStartTime,
      lastEventTime!,
      currentFightEvents,
      ultCycles
    ));
  }
  
  return fights;
}

function createTeamfight(
  matchId: string,
  team1Name: string,
  team2Name: string,
  startTime: number,
  endTime: number,
  events: FightEvent[],
  ultCycles: UltCycle[]
): Teamfight {
  const duration = endTime - startTime;
  
  // Extract kill events — safe to narrow since we filter by type
  const kills = events.filter(e => e.type === 'kill').map(e => e.data as KillLogEvent);
  
  // Determine Winner
  let team1Kills = 0;
  let team2Kills = 0;
  kills.forEach(k => {
    if (k.victimTeam === team2Name) team1Kills++;
    if (k.victimTeam === team1Name) team2Kills++;
  });
  
  let winner: string | null = null;
  if (team1Kills > team2Kills) winner = team1Name;
  else if (team2Kills > team1Kills) winner = team2Name;
  
  // First Pick
  let firstPick = null;
  if (kills.length > 0) {
    const firstKill = kills[0]; // Already sorted by time
    firstPick = {
      player: firstKill.attackerName,
      team: firstKill.attackerTeam,
      hero: firstKill.attackerHero,
      victim: firstKill.victimName,
      time: firstKill.matchTime
    };
  }
  
  // Economy
  const { used } = getUltCycleForFight(startTime, endTime, ultCycles);
  const team1UltsUsed = used.filter(u => u.playerTeam === team1Name).map(u => u.hero);
  const team2UltsUsed = used.filter(u => u.playerTeam === team2Name).map(u => u.hero);
  
  // Classification
  const totalUlts = team1UltsUsed.length + team2UltsUsed.length;
  let type: Teamfight['type'] = 'dry';
  if (totalUlts === 0) type = 'dry';
  else if (totalUlts >= 4) type = 'all-in';
  else type = 'ult-invested';
  
  // Stagger check: Very short fight with few kills?
  // Or isolated pick?
  if (duration < 5 && kills.length <= 1 && totalUlts === 0) {
    type = 'stagger';
  }

  return {
    fightId: `${matchId}-${startTime.toFixed(3)}`,
    matchId,
    startTime,
    endTime,
    duration,
    team1Name,
    team2Name,
    team1Kills,
    team2Kills,
    type,
    winner,
    firstPick,
    team1UltsUsed,
    team2UltsUsed,
    events: events.map(e => e.data)
  };
}
