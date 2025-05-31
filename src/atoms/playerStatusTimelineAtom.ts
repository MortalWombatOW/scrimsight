import { atom } from 'jotai';
import matchDataAtom from '@atoms/matchDataAtom'; // Corrected import for atom
import { LogFileParserAtomType, logFileParser } from '@atoms';

// Define a basic LogEvent type based on expected properties
interface LogEvent {
  timestamp: number;
  event_type: string;
  player_name?: string;
  player_team?: string;
  // Add other potential properties if needed, or use 'any'/'unknown' if structure varies widely
  [key: string]: unknown; // Changed any to unknown
}

export interface PlayerStatusEntry {
  timestamp: number;
  team1Players: Set<string>;
  team2Players: Set<string>;
}

export type PlayerStatusTimeline = PlayerStatusEntry[];

// Atom to track the active players on each team over time for each match
export const playerStatusTimelineAtom = atom(async (get): Promise<Map<string, PlayerStatusTimeline>> => {
  const parsedFiles: LogFileParserAtomType = await get(logFileParser.atom); // Use imported logFileParser
  const allMatchData = await get(matchDataAtom);
  const statusTimelines = new Map<string, PlayerStatusTimeline>();

  // Create a map for quick lookup of matchData by matchId
  const matchDataMap = new Map(allMatchData.map(md => [md.matchId, md]));

  for (const parsedFile of parsedFiles) {
    const { matchId, logs } = parsedFile;
    const matchData = matchDataMap.get(matchId);

    if (!matchData) {
      console.warn(`No matchData found for matchId ${matchId} when building player status timeline.`);
      continue; // Skip if no corresponding matchData
    }

    const { team1Name, team2Name, team1Players: initialTeam1, team2Players: initialTeam2 } = matchData;
    const timeline: PlayerStatusTimeline = [];
    // Each log.data is an object[], flatMap them and cast individual items to LogEvent
    const matchLogs: LogEvent[] = logs.flatMap(log => log.data as LogEvent[]); 

    // Initialize sets with starting players
    let currentTeam1Players = new Set(initialTeam1);
    let currentTeam2Players = new Set(initialTeam2);

    // Add initial state at time 0
    timeline.push({
      timestamp: 0,
      team1Players: new Set(currentTeam1Players),
      team2Players: new Set(currentTeam2Players),
    });

    // Sort logs by time just in case they aren't already
    matchLogs.sort((a: LogEvent, b: LogEvent) => a.timestamp - b.timestamp);

    for (const event of matchLogs) {
      let stateChanged = false;
      const playerName = event.player_name; // Assuming player_name exists on relevant events
      const playerTeam = event.player_team; // Assuming player_team exists

      // Handle player join/leave events (adjust event types based on actual log spec)
      if (event.event_type === 'PlayerJoinedMatch' && playerName) {
        if (playerTeam === team1Name) {
          if (!currentTeam1Players.has(playerName)) {
            currentTeam1Players.add(playerName);
            stateChanged = true;
          }
        } else if (playerTeam === team2Name) {
          if (!currentTeam2Players.has(playerName)) {
            currentTeam2Players.add(playerName);
            stateChanged = true;
          }
        }
      } else if (event.event_type === 'PlayerLeftMatch' && playerName) {
        if (currentTeam1Players.has(playerName)) {
          currentTeam1Players.delete(playerName);
          stateChanged = true;
        } else if (currentTeam2Players.has(playerName)) {
          currentTeam2Players.delete(playerName);
          stateChanged = true;
        }
      }
      // Potentially handle team swaps if logs provide that info

      // If the player sets changed, record the new state
      if (stateChanged) {
        timeline.push({
          timestamp: event.timestamp,
          team1Players: new Set(currentTeam1Players),
          team2Players: new Set(currentTeam2Players),
        });
      }
    }
    statusTimelines.set(matchId, timeline);
  }

  return statusTimelines;
});
