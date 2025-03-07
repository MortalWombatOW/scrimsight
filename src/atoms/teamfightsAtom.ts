import { atom } from 'jotai';
import { PlayerInteractionEvent, playerInteractionEventsAtom} from './derived_events';
import { ultimateEventsAtom } from './derived_events/ultimateEventsAtom';
import { matchDataAtom } from './matchDataAtom';
const TEAMFIGHT_BUFFER_TIME = 10; // seconds
const TEAMFIGHT_PADDING = 2; // seconds to add before/after deaths to better capture full teamfight

// A teamfight is a period of time where a teams are engaged in a fight.
// The teamfights in a match are seperated by periods of at least TEAMFIGHT_BUFFER_TIME seconds of kill-less time.
export interface Teamfight {
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
  team1Kills: number;
  team2Kills: number;
  // names of players
  team1PlayersWithUltimatesChargedAtStart: string[];
  team2PlayersWithUltimatesChargedAtStart: string[];
  team1PlayersWithUltimatesUsed: string[];
  team2PlayersWithUltimatesUsed: string[];
}

export const teamfightsAtom = atom(async (get) => {
  const playerInteractionEvents = await get(playerInteractionEventsAtom);
  

  // use this to compute which players had an ultimate at the teamfight start or used it during the teamfight
  const ultimateEvents = await get(ultimateEventsAtom);

  // can get the team names from matchData.team1Name and matchData.team2Name
  const matchDatas = await get(matchDataAtom);
  
  // Extract death events as markers for teamfights
  const killEvents = playerInteractionEvents.filter(event => 
    event.playerInteractionEventType === 'Killed player'
  );

  // Group death events by matchId
  const killEventsByMatch: Record<string, PlayerInteractionEvent[]> = killEvents.reduce((acc, event) => {
    const { matchId } = event;
    if (!acc[matchId]) {
      acc[matchId] = [];
    }
    acc[matchId].push(event);
    return acc;
  }, {} as Record<string, PlayerInteractionEvent[]>);
  
  const teamfightsPass1: Pick<Teamfight, 'matchId' | 'startTime' | 'endTime' | 'duration' | 'team1Kills' | 'team2Kills'>[] = [];
  
  // First pass: process kills to identify teamfights
  Object.entries(killEventsByMatch).forEach(([matchId, killEvents]) => {
    // Sort deaths chronologically
    killEvents.sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);
    
    const matchData = matchDatas.find(matchData => matchData.matchId === matchId);
    if (!matchData) {
      console.error(`No match data found for matchId: ${matchId}`);
      return;
    }
    
    // Find teamfight periods
    let teamfightStartTime: number | null = null;
    let teamfightKills: typeof killEvents = [];
    
    for (let i = 0; i < killEvents.length; i++) {
      const currentKill = killEvents[i];
      const currentTime = currentKill.playerInteractionEventTime;
      
      // If this is the first death or there was a long gap before this death,
      // start a new teamfight
      if (teamfightStartTime === null || 
          (i > 0 && currentTime - killEvents[i-1].playerInteractionEventTime > TEAMFIGHT_BUFFER_TIME)) {
        
        // If we had an ongoing teamfight, end it before the gap
        if (teamfightStartTime !== null && i > 0) {
          const endTime = killEvents[i-1].playerInteractionEventTime + TEAMFIGHT_PADDING;
          const startTime = Math.max(0, teamfightStartTime - TEAMFIGHT_PADDING);
          
          let team1Kills = 0;
          let team2Kills = 0;
          
          teamfightKills.forEach(kill => {
            if (kill.playerTeam === matchData.team1Name) {
              team1Kills++;
            } else {
              team2Kills++;
            }
          });
          
      
          
          teamfightsPass1.push({
            matchId,
            startTime: startTime,
            endTime,
            duration: endTime - startTime,
            team1Kills,
            team2Kills,
          });
        }
        
        // Start a new teamfight
        teamfightStartTime = currentTime;
        teamfightKills = [currentKill];
      } else {
        // Continue the current teamfight
        teamfightKills.push(currentKill);
      }
      
      // If this is the last death, end the current teamfight
      if (i === killEvents.length - 1 && teamfightStartTime !== null) {
        const startTime = Math.max(0, teamfightStartTime - TEAMFIGHT_PADDING);
        const endTime = currentTime + TEAMFIGHT_PADDING;
        
        // Count kills by team
        let team1Kills = 0;
        let team2Kills = 0;
        
        teamfightKills.forEach(kill => {
          if (kill.playerTeam === matchData.team1Name) {
            team1Kills++;
          } else {
            team2Kills++;
          }
        });
        
        teamfightsPass1.push({
          matchId,
          startTime,
          endTime,
          duration: endTime - startTime,
          team1Kills,
          team2Kills,
        });
      }
    }
  });

  const teamfights = teamfightsPass1.flatMap(t => {
    const matchData = matchDatas.find(matchData => matchData.matchId === t.matchId);
    if (!matchData) {
      console.error(`No match data found for matchId: ${t.matchId}`);
      return [];
    }
    const team1PlayersWithUltimatesChargedAtStart = ultimateEvents.filter(ultimateEvent => 
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team1Name &&
      ultimateEvent.ultimateChargedTime <= t.startTime &&
      ultimateEvent.ultimateStartTime >= t.endTime
    ).map(event => event.playerName);
    
    const team2PlayersWithUltimatesChargedAtStart = ultimateEvents.filter(ultimateEvent => 
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team2Name &&
      ultimateEvent.ultimateChargedTime <= t.startTime &&
      ultimateEvent.ultimateStartTime >= t.endTime
    ).map(event => event.playerName);

    const team1PlayersWithUltimatesUsed = ultimateEvents.filter(ultimateEvent => 
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team1Name &&
      ultimateEvent.ultimateStartTime >= t.startTime &&
      ultimateEvent.ultimateStartTime <= t.endTime
    ).map(event => event.playerName);
    
    const team2PlayersWithUltimatesUsed = ultimateEvents.filter(ultimateEvent => 
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team2Name &&
      ultimateEvent.ultimateStartTime >= t.startTime &&
      ultimateEvent.ultimateStartTime <= t.endTime
    ).map(event => event.playerName);

    return [{
      ...t,
      team1PlayersWithUltimatesChargedAtStart,
      team2PlayersWithUltimatesChargedAtStart,
      team1PlayersWithUltimatesUsed,
      team2PlayersWithUltimatesUsed,
    }];
  });
  
  return teamfights;
});
