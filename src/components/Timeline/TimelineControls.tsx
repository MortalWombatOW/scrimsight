import { type ReactNode, useMemo } from "react";
import { useAtomValue } from "jotai"; // Import useAtomValue
import { useTimelineContext } from "~/components/Timeline/TimelineContext";
import { TimelineButton, type TimelineSegmentButtonData } from "~/components/Timeline/TimelineButton"; // Import new component and type
import {
  roundEndExtractorAtom,
  type RoundEndLogEvent, // Corrected type name
} from "~/atoms/event_extractors/roundEndExtractorAtom"; // Import atom and type

export const TimelineControls = (): ReactNode => {
  const { setCurrentTimeRange, loadedData, currentTimeRange } =
    useTimelineContext();

  if (!loadedData) {
    return <div>Loading...</div>;
  }

  const { mapTime, roundTimes, teamfights, matchData } = loadedData;
  const allRoundEnds = useAtomValue(roundEndExtractorAtom); // Get all round end events

  // Prepare flattened and sorted data structure for buttons
  const flatSegments = useMemo<TimelineSegmentButtonData[]>(() => {
    if (!mapTime || !matchData) return [];

    const segments: TimelineSegmentButtonData[] = [];
    let fightCounter = 1; // Simple counter for fight IDs/labels

    roundTimes.forEach((roundTime) => {
      const roundMatchId = roundTime.matchId || mapTime.matchId;
      if (!roundMatchId) return;

      // Add teamfights for this round
      const roundTeamfights = teamfights
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
          type: "teamfight",
          startTime: tf.startTime,
          endTime: tf.endTime,
          sortTime: tf.startTime, // Add sortTime for teamfights
          winner: tf.winner,
          team1Name: matchData.team1Name,
          team2Name: matchData.team2Name,
        }));

      segments.push(...roundTeamfights);

      // Filter round ends for the current match
      const matchRoundEnds = allRoundEnds.filter(re => re.matchId === matchData.matchId);

      // Add round result segment
      // Find the corresponding round end event to get the winner
      const roundEndEvent = matchRoundEnds.find(
        (re: RoundEndLogEvent) => // Corrected type annotation here
          re.matchId === roundMatchId && re.roundNumber === roundTime.roundNumber
      );
      const roundWinner = roundEndEvent?.capturingTeam; // Use capturingTeam from the event

      segments.push({
        id: `round-${roundTime.roundNumber}`,
        title: roundWinner
          ? `${roundWinner} Wins Round ${roundTime.roundNumber}`
          : `Round ${roundTime.roundNumber} End`,
        type: "round",
        startTime: roundTime.roundStartTime, // Use round times for selection
        endTime: roundTime.roundEndTime,
        sortTime: roundTime.roundEndTime, // Add sortTime for rounds (use end time)
        winner: roundWinner,
        roundNumber: roundTime.roundNumber,
        team1Name: matchData.team1Name,
        team2Name: matchData.team2Name,
      });
    });

    // Add final match result segment
    segments.push({
      id: "map-result",
      title: `${matchData.winner} Wins Match`,
      type: "map",
      startTime: mapTime.startTime,
      endTime: mapTime.endTime,
      sortTime: mapTime.endTime, // Add sortTime for map (use end time)
      winner: matchData.winner,
      team1Name: matchData.team1Name,
      team2Name: matchData.team2Name,
    });

    // Final sort using the new sortTime property
    return segments.sort((a, b) => a.sortTime - b.sortTime);

  }, [mapTime, roundTimes, teamfights, matchData, allRoundEnds]); // Add allRoundEnds to dependency array

  const handleSelect = (start: number, end: number) => {
    setCurrentTimeRange({ start, end });
  };

  return (
    <div className="flex flex-col gap-2 ml-4 mt-3">
      <div className="text-lg text-base-500 font-semibold mb-2">
        Select segment to view
      </div>

      {/* Render the flat list of buttons */}
      <div className="flex flex-wrap gap-2">
        {flatSegments.map((segment) => {
          const isSelected =
            currentTimeRange?.start === segment.startTime &&
            currentTimeRange?.end === segment.endTime;

          return (
            <TimelineButton
              key={segment.id}
              segment={segment}
              isSelected={isSelected}
              onClick={handleSelect}
              team1Name={matchData?.team1Name}
              team2Name={matchData?.team2Name}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-6 text-xs text-base-500 gap-4">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full border border-blue-600 mr-1"></div>
          <span>{matchData?.team1Name ?? "Team 1"} Win</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full border border-error mr-1"></div>
          <span>{matchData?.team2Name ?? "Team 2"} Win</span>
        </div>
      </div>
    </div>
  );
};
