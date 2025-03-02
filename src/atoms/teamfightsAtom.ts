import { atom } from 'jotai';
import { playerInteractionEventsAtom} from './derived_events';

const TEAMFIGHT_BUFFER_TIME = 5; // seconds
const TEAMFIGHT_PADDING = 2; // seconds to add before/after deaths to better capture full teamfight

// A teamfight is a period of time where a teams are engaged in a fight.
// The teamfights in a match are seperated by periods of at least TEAMFIGHT_BUFFER_TIME seconds of kill-less time.
export interface Teamfight {
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
  killCount?: number;
  teamAKills?: number;
  teamBKills?: number;
  involvedPlayers?: string[];
}

export const teamfightsAtom = atom(async (get) => {
  const playerInteractionEvents = await get(playerInteractionEventsAtom);
  
  // Extract death events as markers for teamfights
  const deathEvents = playerInteractionEvents.filter(event => 
    event.playerInteractionEventType === 'Died'
  );

  // Group death events by matchId
  const deathsByMatch: Record<string, Array<{
    time: number, 
    playerName: string, 
    playerTeam: string,
    killerName?: string,
    killerTeam?: string
  }>> = {};
  
  deathEvents.forEach(event => {
    const { 
      matchId, 
      playerInteractionEventTime,
      playerName,
      playerTeam,
      otherPlayerName
    } = event;
    
    if (!deathsByMatch[matchId]) {
      deathsByMatch[matchId] = [];
    }
    
    // For the killer's team, use the opposite of the player who died
    // In Overwatch, kills are always between opposing teams
    const killerTeam = playerTeam === 'Blue' ? 'Red' : 'Blue';
    
    deathsByMatch[matchId].push({
      time: playerInteractionEventTime,
      playerName, // The player who died
      playerTeam, // The team of the player who died
      killerName: otherPlayerName, // The player who got the kill
      killerTeam // The team of the player who got the kill
    });
  });
  
  const teamfights: Teamfight[] = [];
  
  // Process each match
  Object.entries(deathsByMatch).forEach(([matchId, deaths]) => {
    // Sort deaths chronologically
    deaths.sort((a, b) => a.time - b.time);
    const deathTimes = deaths.map(d => d.time);
    
    // Find teamfight periods
    let teamfightStartTime: number | null = null;
    let teamfightDeaths: typeof deaths = [];
    
    for (let i = 0; i < deaths.length; i++) {
      const currentDeath = deaths[i];
      const currentTime = currentDeath.time;
      
      // If this is the first death or there was a long gap before this death,
      // start a new teamfight
      if (teamfightStartTime === null || 
          (i > 0 && currentTime - deaths[i-1].time > TEAMFIGHT_BUFFER_TIME)) {
        
        // If we had an ongoing teamfight, end it before the gap
        if (teamfightStartTime !== null && i > 0) {
          const endTime = deaths[i-1].time + TEAMFIGHT_PADDING;
          const startTime = Math.max(0, teamfightStartTime - TEAMFIGHT_PADDING);
          
          // Count kills by team
          const teamCounts: Record<string, number> = {};
          const involvedPlayers = new Set<string>();
          
          teamfightDeaths.forEach(death => {
            // Track all players involved
            involvedPlayers.add(death.playerName);
            if (death.killerName) {
              involvedPlayers.add(death.killerName);
            }
            
            // Count kills by team
            if (death.killerTeam) {
              teamCounts[death.killerTeam] = (teamCounts[death.killerTeam] || 0) + 1;
            }
          });
          
          // Get the two teams with most kills (normally just 2 teams)
          const teams = Object.keys(teamCounts).sort((a, b) => 
            teamCounts[b] - teamCounts[a]
          );
          
          teamfights.push({
            matchId,
            startTime: startTime,
            endTime,
            duration: endTime - startTime,
            killCount: teamfightDeaths.length,
            teamAKills: teams[0] ? teamCounts[teams[0]] : 0,
            teamBKills: teams[1] ? teamCounts[teams[1]] : 0,
            involvedPlayers: Array.from(involvedPlayers)
          });
        }
        
        // Start a new teamfight
        teamfightStartTime = currentTime;
        teamfightDeaths = [currentDeath];
      } else {
        // Continue the current teamfight
        teamfightDeaths.push(currentDeath);
      }
      
      // If this is the last death, end the current teamfight
      if (i === deaths.length - 1 && teamfightStartTime !== null) {
        const startTime = Math.max(0, teamfightStartTime - TEAMFIGHT_PADDING);
        const endTime = currentTime + TEAMFIGHT_PADDING;
        
        // Count kills by team
        const teamCounts: Record<string, number> = {};
        const involvedPlayers = new Set<string>();
        
        teamfightDeaths.forEach(death => {
          // Track all players involved
          involvedPlayers.add(death.playerName);
          if (death.killerName) {
            involvedPlayers.add(death.killerName);
          }
          
          // Count kills by team
          if (death.killerTeam) {
            teamCounts[death.killerTeam] = (teamCounts[death.killerTeam] || 0) + 1;
          }
        });
        
        // Get the two teams with most kills (normally just 2 teams)
        const teams = Object.keys(teamCounts).sort((a, b) => 
          teamCounts[b] - teamCounts[a]
        );
        
        teamfights.push({
          matchId,
          startTime,
          endTime,
          duration: endTime - startTime,
          killCount: teamfightDeaths.length,
          teamAKills: teams[0] ? teamCounts[teams[0]] : 0,
          teamBKills: teams[1] ? teamCounts[teams[1]] : 0,
          involvedPlayers: Array.from(involvedPlayers)
        });
      }
    }
  });
  
  // Merge teamfights that are very close together
  const mergedTeamfights: Teamfight[] = [];
  const MERGE_THRESHOLD = TEAMFIGHT_BUFFER_TIME * 1.5; // If teamfights are this close, merge them
  
  // Sort all teamfights by match and start time
  const sortedTeamfights = teamfights.sort((a, b) => {
    if (a.matchId !== b.matchId) {
      return a.matchId.localeCompare(b.matchId);
    }
    return a.startTime - b.startTime;
  });
  
  let currentTeamfight: Teamfight | null = null;
  
  sortedTeamfights.forEach(teamfight => {
    if (!currentTeamfight || 
        teamfight.matchId !== currentTeamfight.matchId || 
        teamfight.startTime - currentTeamfight.endTime > MERGE_THRESHOLD) {
      // This is a new teamfight or one from a different match
      if (currentTeamfight) {
        mergedTeamfights.push(currentTeamfight);
      }
      currentTeamfight = {...teamfight};
    } else {
      // Merge with the current teamfight
      currentTeamfight.endTime = teamfight.endTime;
      currentTeamfight.duration = currentTeamfight.endTime - currentTeamfight.startTime;
      currentTeamfight.killCount = (currentTeamfight.killCount || 0) + (teamfight.killCount || 0);
      currentTeamfight.teamAKills = (currentTeamfight.teamAKills || 0) + (teamfight.teamAKills || 0);
      currentTeamfight.teamBKills = (currentTeamfight.teamBKills || 0) + (teamfight.teamBKills || 0);
      
      // Merge involved players
      if (currentTeamfight.involvedPlayers && teamfight.involvedPlayers) {
        const allPlayers = new Set([
          ...currentTeamfight.involvedPlayers, 
          ...teamfight.involvedPlayers
        ]);
        currentTeamfight.involvedPlayers = Array.from(allPlayers);
      }
    }
  });
  
  // Don't forget to add the last teamfight
  if (currentTeamfight) {
    mergedTeamfights.push(currentTeamfight);
  }
  
  return mergedTeamfights;
});
