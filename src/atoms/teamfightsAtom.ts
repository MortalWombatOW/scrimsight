import { atom, Getter } from 'jotai'; // Added Getter
import { playerInteractionEvents, PlayerInteractionEvent, Teamfight, TeamfightPass1 } from '@atoms';
import { ultimateEvents } from '@atoms';
import { matchData } from '@atoms';
export const teamfightsAtomFn = async (get: Getter): Promise<Teamfight[]> => {
  const TEAMFIGHT_BUFFER_TIME = 10; // seconds
  const TEAMFIGHT_PADDING = 2; // seconds to add before/after deaths to better capture full teamfight
  
  const allPlayerInteractionEvents = await get(playerInteractionEvents.atom);
  

  // use this to compute which players had an ultimate at the teamfight start or used it during the teamfight
  const allUltimateEvents = await get(ultimateEvents.atom);

  // can get the team names from matchData.team1Name and matchData.team2Name
  const matchDatas = await get(matchData.atom);
  
  // Extract death events as markers for teamfights
  const killEvents = allPlayerInteractionEvents.filter(event => 
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
   
  const teamfightsPass1: TeamfightPass1[] = [];
   
  // First pass: process kills to identify teamfights
  Object.entries(killEventsByMatch).forEach(([matchId, killEvents]) => {
    // Sort deaths chronologically
    killEvents.sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);
    
    const matchData = matchDatas.find(matchData => matchData.matchId === matchId);
    if (!matchData) {
      console.error(`No match data found for matchId: ${matchId}`);
      return;
    }
    const { team1Name, team2Name } = matchData; // Get team names here
    
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
            if (kill.playerTeam === team1Name) { // Use extracted team name
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
            team1Name, // Add team name
            team2Name, // Add team name
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
          if (kill.playerTeam === team1Name) { // Use extracted team name
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
          team1Name, // Add team name
          team2Name, // Add team name
        });
      }
    }
  });

  // Second pass: Add ultimate usage, determine winner, and find first kill/death
  const teamfights = teamfightsPass1.flatMap(t => {
    // Find corresponding matchData again
    const matchData = matchDatas.find(matchData => matchData.matchId === t.matchId);
    if (!matchData) {
      // This check might be redundant if the first pass guarantees matchData exists, but safe to keep
      console.error(`No match data found for matchId: ${t.matchId} in second pass`);
      return [];
    }
    const { team1Name, team2Name, team1Players, team2Players } = matchData; // Destructure for easier access

    // Combine players with their team names for easier lookup
    const allPlayersWithTeams = [
      ...team1Players.map((p: string) => ({ playerName: p, teamName: team1Name })),
      ...team2Players.map((p: string) => ({ playerName: p, teamName: team2Name })),
    ];

    // Calculate winner using actual team names
    let winner: string | null; // Changed type
    if (t.team1Kills > t.team2Kills) {
      winner = t.team1Name; // Assign team name
    } else if (t.team2Kills > t.team1Kills) {
      winner = t.team2Name; // Assign team name
    } else {
      winner = null; // Assign null for draw
    }

    // Generate fightId
    const fightId = `${t.matchId}-${t.startTime.toFixed(3)}`; // Use fixed decimal places for consistency

    // --- Find First Kill/Death ---
    let firstKillPlayer: string | undefined;
    let firstKillTeam: string | undefined;
    let firstKillTime: number | undefined;
    let firstDeathPlayer: string | undefined;
    let firstDeathTeam: string | undefined;
    let firstDeathTime: number | undefined;

    const fightKillEvents = killEvents
      .filter(kill => kill.matchId === t.matchId && kill.playerInteractionEventTime >= t.startTime && kill.playerInteractionEventTime <= t.endTime)
      .sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);

    if (fightKillEvents.length > 0) {
      const firstKillEvent = fightKillEvents[0];
      firstKillPlayer = firstKillEvent.playerName;
      firstKillTeam = firstKillEvent.playerTeam;
      firstKillTime = firstKillEvent.playerInteractionEventTime;
      firstDeathPlayer = firstKillEvent.otherPlayerName; // Use otherPlayerName for the victim
      firstDeathTime = firstKillEvent.playerInteractionEventTime; // Time is the same

      // Find the victim's team using the combined list
      const victimPlayerData = allPlayersWithTeams.find((p: { playerName: string; teamName: string }) => p.playerName === firstDeathPlayer);
      firstDeathTeam = victimPlayerData?.teamName; // Could be undefined if player not found (shouldn't happen ideally)
    }
    // --- End First Kill/Death ---


    // Filter ultimate events (using matchData for team names as before)
    const team1PlayersWithUltimatesChargedAtStart = allUltimateEvents.filter(ultimateEvent =>
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team1Name && // Use matchData here for consistency
      ultimateEvent.ultimateChargedTime <= t.startTime &&
      ultimateEvent.ultimateStartTime >= t.endTime // Check if ult started AFTER fight ended
    ).map(event => event.playerName);
    
    const team2PlayersWithUltimatesChargedAtStart = allUltimateEvents.filter(ultimateEvent => 
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team2Name && // Use matchData here for consistency
      ultimateEvent.ultimateChargedTime <= t.startTime &&
      ultimateEvent.ultimateStartTime >= t.endTime // Check if ult started AFTER fight ended
    ).map(event => event.playerName);

    const team1PlayersWithUltimatesUsed = allUltimateEvents.filter(ultimateEvent => 
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team1Name && // Use matchData here for consistency
      ultimateEvent.ultimateStartTime >= t.startTime &&
      ultimateEvent.ultimateStartTime <= t.endTime
    ).map(event => event.playerName);
    
    const team2PlayersWithUltimatesUsed = allUltimateEvents.filter(ultimateEvent => 
      ultimateEvent.matchId === t.matchId &&
      ultimateEvent.playerTeam === matchData.team2Name && // Use matchData here for consistency
      ultimateEvent.ultimateStartTime >= t.startTime &&
      ultimateEvent.ultimateStartTime <= t.endTime
    ).map(event => event.playerName);

    // Construct the final Teamfight object
    return [{
      ...t, // Includes matchId, startTime, endTime, duration, team1Kills, team2Kills, team1Name, team2Name
      fightId, // Add fightId
      winner, // Add winner
      team1PlayersWithUltimatesChargedAtStart,
      team2PlayersWithUltimatesChargedAtStart,
      team1PlayersWithUltimatesUsed,
      team2PlayersWithUltimatesUsed,
      // Add first kill/death info
      firstKillPlayer,
      firstKillTeam,
      firstKillTime,
      firstDeathPlayer,
      firstDeathTeam,
      firstDeathTime,
    }];
  });
  
  return teamfights;
}; // seconds

// A teamfight is a period of time where a teams are engaged in a fight.
// The teamfights in a match are seperated by periods of at least TEAMFIGHT_BUFFER_TIME seconds of kill-less time.

export default atom(async (get) => {
  return teamfightsAtomFn(get);
});
