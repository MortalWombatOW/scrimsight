import { MatchEvents, RoundTimes, MapTimes, PlayerStatusTimeline, PlayerStatusEntry } from '../types';

export function calculateRoundTimes(events: MatchEvents): RoundTimes[] {
  const roundStarts = events.roundStart;
  const setupCompletes = events.setupComplete;
  const roundEnds = events.roundEnd;

  return roundStarts
    .flatMap((start) => {
      const setup = setupCompletes.find(
        (s) => s.matchId === start.matchId && s.roundNumber === start.roundNumber
      );

      const end = roundEnds.find(
        (e) => e.matchId === start.matchId && e.roundNumber === start.roundNumber
      );

      if (!setup || !end) {
        return [];
      }

      return [
        {
          matchId: start.matchId,
          roundNumber: start.roundNumber,
          roundStartTime: start.matchTime,
          roundSetupCompleteTime: setup.matchTime,
          roundEndTime: end.matchTime,
          roundDuration: end.matchTime - start.matchTime,
        },
      ];
    })
    .sort((a, b) =>
      a.matchId !== b.matchId ? a.matchId.localeCompare(b.matchId) : a.roundNumber - b.roundNumber
    );
}

export function calculateMapTimes(events: MatchEvents, roundTimes: RoundTimes[]): MapTimes {
  const matchStarts = events.matchStart;
  const matchEnds = events.matchEnd;

  if (!matchStarts || !matchEnds || !roundTimes) {
    return {
      matchId: '',
      startTime: 0,
      endTime: 0,
      duration: 0,
    };
  }

  const start = matchStarts[0];
  const end = matchEnds[0];

  if (!start || !end) {
    return {
      matchId: '',
      startTime: 0,
      endTime: 0,
      duration: 0,
    };
  }

  return {
    matchId: start.matchId,
    startTime: start.matchTime,
    endTime: end.matchTime,
    duration: end.matchTime - start.matchTime,
  };
}

export function calculatePlayerStatusTimeline(
  events: MatchEvents,
  matchId: string
): Map<string, PlayerStatusTimeline> {
  const playerStatusTimeline = new Map<string, PlayerStatusTimeline>();

  const heroSpawns = events.heroSpawn.filter((e) => e.matchId === matchId);
  const kills = events.kills.filter((e) => e.matchId === matchId);

  const timelineEntries: PlayerStatusEntry[] = [];

  const currentTeam1Players = new Set<string>();
  const currentTeam2Players = new Set<string>();

  const allEvents = [
    ...heroSpawns.map((e) => ({ type: 'spawn' as const, event: e, time: e.matchTime })),
    ...kills.map((e) => ({ type: 'kill' as const, event: e, time: e.matchTime })),
  ].sort((a, b) => a.time - b.time);

  for (const item of allEvents) {
    if (item.type === 'spawn') {
      const spawn = item.event;
      if (spawn.playerTeam === events.matchStart[0]?.team1Name) {
        currentTeam1Players.add(spawn.playerName);
      } else {
        currentTeam2Players.add(spawn.playerName);
      }
    } else if (item.type === 'kill') {
      const kill = item.event;
      if (kill.victimTeam === events.matchStart[0]?.team1Name) {
        currentTeam1Players.delete(kill.victimName);
      } else {
        currentTeam2Players.delete(kill.victimName);
      }
    }

    timelineEntries.push({
      timestamp: item.time,
      team1Players: new Set(currentTeam1Players),
      team2Players: new Set(currentTeam2Players),
    });
  }

  playerStatusTimeline.set(matchId, timelineEntries);

  return playerStatusTimeline;
}

/**
 * Interface for timeline segment button data
 * This represents a selectable segment in the timeline (teamfight, round, or map)
 */
export interface TimelineSegmentButtonData {
  id: string; // Unique ID for React key
  type: 'teamfight' | 'round' | 'map';
  title: string; // Text to display on the button
  startTime: number; // Used for selection range
  endTime: number; // Used for selection range
  sortTime: number; // Used for chronological sorting
  winner?: string | null; // Team name or null/undefined
  team1Name?: string;
  team2Name?: string;
  roundNumber?: number; // Optional, for round segments
}

/**
 * Pure function to generate timeline segments from match data
 */
export function generateTimelineSegments(
  matchMetadata: import('../types').MatchMetadata,
  mapTime: MapTimes,
  roundTimesData: RoundTimes[],
  teamfightsData: import('../types').Teamfight[],
  allRoundEnds: import('../types').RoundEndLogEvent[]
): TimelineSegmentButtonData[] {
  if (!mapTime || !matchMetadata) return [];

  const segments: TimelineSegmentButtonData[] = [];
  let fightCounter = 1; // Simple counter for fight IDs/labels

  roundTimesData.forEach((roundTime) => {
    const roundMatchId = roundTime.matchId || mapTime.matchId;
    if (!roundMatchId) return;

    // Add teamfights for this round
    const roundTeamfights = teamfightsData
      .filter(
        (tf) =>
          tf.matchId === roundMatchId &&
          tf.startTime >= roundTime.roundStartTime &&
          tf.endTime <= roundTime.roundEndTime
      )
      .sort((a, b) => a.startTime - b.startTime) // Ensure fights are chronological
      .map((tf): TimelineSegmentButtonData => ({
        id: `tf-${fightCounter++}`, // Generate unique ID
        title: `${tf.winner} Fight Win (${Math.round(tf.startTime)}s - ${Math.round(tf.endTime)}s)`,
        type: 'teamfight',
        startTime: tf.startTime,
        endTime: tf.endTime,
        sortTime: tf.startTime, // Add sortTime for teamfights
        winner: tf.winner,
        team1Name: matchMetadata.team1Name,
        team2Name: matchMetadata.team2Name,
      }));

    segments.push(...roundTeamfights);

    // Filter round ends for the current match
    const matchRoundEnds = allRoundEnds.filter(re => re.matchId === matchMetadata.matchId);

    // Add round result segment
    // Find the corresponding round end event to get the winner
    const roundEndEvent = matchRoundEnds.find(
      (re) =>
        re.matchId === roundMatchId && re.roundNumber === roundTime.roundNumber
    );
    const roundWinner = roundEndEvent?.capturingTeam; // Use capturingTeam from the event

    segments.push({
      id: `round-${roundTime.roundNumber}`,
      title: roundWinner
        ? `${roundWinner} Wins Round ${roundTime.roundNumber}`
        : `Round ${roundTime.roundNumber} End`,
      type: 'round',
      startTime: roundTime.roundStartTime, // Use round times for selection
      endTime: roundTime.roundEndTime,
      sortTime: roundTime.roundEndTime, // Add sortTime for rounds (use end time)
      winner: roundWinner,
      roundNumber: roundTime.roundNumber,
      team1Name: matchMetadata.team1Name,
      team2Name: matchMetadata.team2Name,
    });
  });

  // Add final match result segment
  segments.push({
    id: 'map-result',
    title: `${matchMetadata.winner} Wins Match`,
    type: 'map',
    startTime: mapTime.startTime,
    endTime: mapTime.endTime,
    sortTime: mapTime.endTime, // Add sortTime for map (use end time)
    winner: matchMetadata.winner,
    team1Name: matchMetadata.team1Name,
    team2Name: matchMetadata.team2Name,
  });

  // Final sort using the new sortTime property
  return segments.sort((a, b) => a.sortTime - b.sortTime);
}
