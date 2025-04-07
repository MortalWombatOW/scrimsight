import { type ReactNode, useMemo } from "react";
import { useTimelineContext } from "./TimelineContext";
import { TimeSegmentDisplay, TimeSegment } from "./TimeSegmentDisplay"; // Import new component and type

export const TimelineControls = (): ReactNode => {

  const { setCurrentTimeRange, loadedData, } =
    useTimelineContext();

  if (!loadedData) {
    return <div>Loading...</div>;
  }

  const { mapTime, roundTimes, teamfights, matchData } = loadedData;

  // Prepare nested data structure
  const mapSegmentData = useMemo<TimeSegment | null>(() => {
    if (!mapTime) return null;

    const roundSegments: TimeSegment[] = roundTimes
      .map((roundTime): TimeSegment | null => { // Explicitly type the map return
        const roundMatchId = roundTime.matchId || mapTime.matchId;
        if (!roundMatchId) return null; // Should not happen if mapTime exists

        if (!matchData) return null; // Should not happen if roundMatchId exists  
        const roundWinner = matchData.roundWinners[roundTime.roundNumber - 1] === 'team1' ? matchData.team1Name : matchData.team2Name;

        const teamfightSegments: TimeSegment[] = teamfights
          .filter(
            (tf) =>
              tf.matchId === roundMatchId &&
              tf.startTime >= roundTime.roundStartTime &&
              tf.endTime <= roundTime.roundEndTime
          )
          .map((tf) => ({
            matchId: tf.matchId,
            title: `${tf.winner} Win`,
            subtitle: "Teamfight",
            type: "teamfight",
            startTime: tf.startTime,
            endTime: tf.endTime,
            winner: tf.winner,
          }));

        return {
          matchId: roundMatchId,
          // Use round winner for the title, fallback to generic title if no winner
          title: roundWinner ? `${roundWinner} Win` : `Round ${roundTime.roundNumber}`,
          subtitle: `Round ${roundTime.roundNumber}`,
          type: "round",
          startTime: roundTime.roundStartTime,
          endTime: roundTime.roundEndTime,
          winner: roundWinner,
          childrenSegments: teamfightSegments,
        };
      })
      .filter((segment): segment is TimeSegment => segment !== null); // Filter out nulls - this predicate is correct

    return {
      matchId: mapTime.matchId,
      title: `${matchData?.winner} Win`,
      subtitle: "Match",
      type: "map",
      startTime: mapTime.startTime,
      endTime: mapTime.endTime,
      winner: matchData?.winner, // Assuming matchData provides overall winner
      childrenSegments: roundSegments,
    };
  }, [mapTime, roundTimes, teamfights, matchData]);

  const handleSelect = (start: number, end: number) => {
    setCurrentTimeRange({ start, end });
  };


  return (
    <div className="flex flex-col gap-2 ml-4 mt-3">
      <div className="text-lg text-base-500 font-semibold mb-2">
        Select segment to view
      </div>

      {/* Render the single top-level map segment */}
      {mapSegmentData && (
        <div className="flex flex-col gap-2"> {/* Container for the map segment */}
          <TimeSegmentDisplay
            segment={mapSegmentData}
            onSelect={handleSelect}
            // isSelected prop removed as the component now handles its own state
            team1Name={matchData?.team1Name}
            team2Name={matchData?.team2Name}
          />
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center mt-6 text-xs text-base-500 gap-4">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full border border-success mr-1"></div>
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
