import { atom } from 'jotai';
import {
  matchData,
  mapTimes,
  roundTimes,
  teamfights,
  roundEnd,
  type MatchData,
  type MapTimes,
  type RoundTimes,
  type Teamfight,
  type RoundEndLogEvent,
} from '@atoms';

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
 * Parameters for filtering timeline segments by match
 */
export interface TimelineSegmentsParams {
  matchId: string;
}

/**
 * Pure function to generate timeline segments from match data
 * This contains all the business logic previously in the useMemo hook
 */
export const generateTimelineSegments = (
  matchDataItem: MatchData | undefined,
  mapTime: MapTimes | undefined,
  roundTimesData: RoundTimes[],
  teamfightsData: Teamfight[],
  allRoundEnds: RoundEndLogEvent[]
): TimelineSegmentButtonData[] => {
  if (!mapTime || !matchDataItem) return [];

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
        team1Name: matchDataItem.team1Name,
        team2Name: matchDataItem.team2Name,
      }));

    segments.push(...roundTeamfights);

    // Filter round ends for the current match
    const matchRoundEnds = allRoundEnds.filter(re => re.matchId === matchDataItem.matchId);

    // Add round result segment
    // Find the corresponding round end event to get the winner
    const roundEndEvent = matchRoundEnds.find(
      (re: RoundEndLogEvent) =>
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
      team1Name: matchDataItem.team1Name,
      team2Name: matchDataItem.team2Name,
    });
  });

  // Add final match result segment
  segments.push({
    id: 'map-result',
    title: `${matchDataItem.winner} Wins Match`,
    type: 'map',
    startTime: mapTime.startTime,
    endTime: mapTime.endTime,
    sortTime: mapTime.endTime, // Add sortTime for map (use end time)
    winner: matchDataItem.winner,
    team1Name: matchDataItem.team1Name,
    team2Name: matchDataItem.team2Name,
  });

  // Final sort using the new sortTime property
  return segments.sort((a, b) => a.sortTime - b.sortTime);
};

/**
 * Derived atom that generates timeline segments for a specific match
 * This atom reads from matchData, mapTime, roundTimes, teamfights, and roundEnd atoms
 * and returns sorted TimelineSegmentButtonData[]
 */
export const timelineSegmentsAtomFamily = (params: TimelineSegmentsParams) =>
  atom(async (get): Promise<TimelineSegmentButtonData[]> => {
    const { matchId } = params;

    // Get all required data
    const allMatchData = await get(matchData.atom);
    const allMapTimes = await get(mapTimes.atom);
    const allRoundTimes = await get(roundTimes.atom);
    const allTeamfights = await get(teamfights.atom);
    const allRoundEnds = await get(roundEnd.atom);

    // Filter data for the specific match
    const matchDataItem = allMatchData.find((m) => m.matchId === matchId);
    const mapTime = allMapTimes.find((mt) => mt.matchId === matchId);
    const roundTimesData = allRoundTimes.filter((rt) => rt.matchId === matchId);
    const teamfightsData = allTeamfights.filter((tf) => tf.matchId === matchId);

    // Generate and return segments
    return generateTimelineSegments(
      matchDataItem,
      mapTime,
      roundTimesData,
      teamfightsData,
      allRoundEnds
    );
  });

/**
 * Default export: atom that generates timeline segments for all matches
 * This is useful if you need all segments across all matches
 */
export default atom(async (get): Promise<Record<string, TimelineSegmentButtonData[]>> => {
  const allMatchData = await get(matchData.atom);
  const allMapTimes = await get(mapTimes.atom);
  const allRoundTimes = await get(roundTimes.atom);
  const allTeamfights = await get(teamfights.atom);
  const allRoundEnds = await get(roundEnd.atom);

  const result: Record<string, TimelineSegmentButtonData[]> = {};

  allMatchData.forEach((matchDataItem) => {
    const mapTime = allMapTimes.find((mt) => mt.matchId === matchDataItem.matchId);
    const roundTimesData = allRoundTimes.filter((rt) => rt.matchId === matchDataItem.matchId);
    const teamfightsData = allTeamfights.filter((tf) => tf.matchId === matchDataItem.matchId);

    result[matchDataItem.matchId] = generateTimelineSegments(
      matchDataItem,
      mapTime,
      roundTimesData,
      teamfightsData,
      allRoundEnds
    );
  });

  return result;
});
