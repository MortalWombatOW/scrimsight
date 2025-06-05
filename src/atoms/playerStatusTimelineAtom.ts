import { atom } from 'jotai';
import {
  matchData,
  logFileParser,
  LogFileParserAtomType,
  LogEvent,
  PlayerStatusTimeline,
} from '@atoms';

export const playerStatusTimelineAtomFn = async (
  parsedFiles: LogFileParserAtomType,
  allMatchData: any[]
): Promise<Map<string, PlayerStatusTimeline>> => {
  const statusTimelines = new Map<string, PlayerStatusTimeline>();

  // Create a map for quick lookup of matchData by matchId
  const matchDataMap = new Map(allMatchData.map(md => [md.matchId, md]));

  for (const file of parsedFiles) {
    const matchInfo = matchDataMap.get(file.matchId);
    if (!matchInfo) continue; // Skip if no match data

    const timeline: PlayerStatusTimeline = [];
    const team1Players = new Set<string>();
    const team2Players = new Set<string>();

    // Process each log spec in the file
    for (const logSpec of file.logs) {
      const events = logSpec.data as LogEvent[];

      for (const event of events) {
        // Handle player spawn events to track active players
        if (event.event_type === 'player_spawn' && event.player_name && event.player_team) {
          if (event.player_team === matchInfo.team1Name) {
            team1Players.add(event.player_name);
          } else if (event.player_team === matchInfo.team2Name) {
            team2Players.add(event.player_name);
          }

          // Add entry to timeline
          timeline.push({
            timestamp: event.timestamp,
            team1Players: new Set(team1Players),
            team2Players: new Set(team2Players),
          });
        }

        // Handle player death events to remove from active
        if (event.event_type === 'player_death' && event.player_name && event.player_team) {
          if (event.player_team === matchInfo.team1Name) {
            team1Players.delete(event.player_name);
          } else if (event.player_team === matchInfo.team2Name) {
            team2Players.delete(event.player_name);
          }

          // Add entry to timeline
          timeline.push({
            timestamp: event.timestamp,
            team1Players: new Set(team1Players),
            team2Players: new Set(team2Players),
          });
        }
      }
    }

    // Sort timeline by timestamp
    timeline.sort((a, b) => a.timestamp - b.timestamp);
    statusTimelines.set(file.matchId, timeline);
  }

  return statusTimelines;
};

export default atom(async (get): Promise<Map<string, PlayerStatusTimeline>> => {
  const parsedFiles: LogFileParserAtomType = await get(logFileParser.atom);
  const allMatchData = await get(matchData.atom);
  
  return playerStatusTimelineAtomFn(parsedFiles, allMatchData);
});