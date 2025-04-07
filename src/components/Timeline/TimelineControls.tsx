import { type ReactNode, useMemo } from "react"; // Added useMemo
import { useAtomValue } from "jotai";
import { useTimelineContext } from "./TimelineContext";
import { formatTime } from "../../lib";
import {
  segmentStatsAtomFamily,
  SegmentParams,
} from "../../atoms/derived_state/segmentStatsAtomFamily"; // Added
import { FaSkull, FaBolt } from "react-icons/fa"; // Added

type TimeSegment = {
  matchId: string; // Added matchId
  title: string;
  subtitle: string;
  type: "map" | "round" | "teamfight";
  startTime: number;
  endTime: number;
  winner?: string | null;
};

// Helper component to render stats to avoid calling hook conditionally
const SegmentStatsDisplay = ({ segment }: { segment: TimeSegment }) => {
  // Memoize the params object to prevent unnecessary atom recalculations
  const segmentParams = useMemo<SegmentParams>(() => ({
    matchId: segment.matchId,
    startTime: segment.startTime,
    endTime: segment.endTime,
    type: segment.type,
  }), [segment.matchId, segment.startTime, segment.endTime, segment.type]);

  // Get stats for the segment
  const stats = useAtomValue(segmentStatsAtomFamily(segmentParams));

  if (!stats) {
    // Render placeholders or nothing while loading/if error
    return <div className="text-xs mt-1 opacity-50">Loading stats...</div>;
  }

  return (
    <div className="flex flex-col text-xs mt-1 gap-0.5">
       {/* Winning team */}
       {segment.winner && (
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 opacity-80">Winner:</span>
          <span className="font-bold">{segment.winner}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 opacity-80">
          <FaSkull /> Kills:
        </span>
        <span>
          {stats.team1Kills} / {stats.team2Kills}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 opacity-80">
          <FaBolt /> Ults:
        </span>
        <span>
          {stats.team1UltsUsed} / {stats.team2UltsUsed}
        </span>
      </div>
       
    </div>
  );
};

export const TimelineControls = (): ReactNode => {
  const {
    currentTimeRange,
    setCurrentTimeRange,
    loadedData,
  } = useTimelineContext();

  const startTime = currentTimeRange.start;
  const endTime = currentTimeRange.end;

  if (!loadedData) {
    return <div>Loading...</div>;
  }

  const { mapTime, roundTimes, teamfights } = loadedData;

  const renderTimeSegment = (segment: TimeSegment) => {
    const duration = segment.endTime - segment.startTime;
    const isSelected =
      segment.startTime === startTime && segment.endTime === endTime;

    let borderColorClass = "border border-gray-700"; // Default grey
    if (segment.type === "teamfight" && segment.winner) {
      if (segment.winner === loadedData?.matchData?.team1Name) {
        borderColorClass = "border border-success hover:border-success/80"; // Use full success color, adjust hover
      } else if (segment.winner === loadedData?.matchData?.team2Name) {
        borderColorClass = "border border-error hover:border-error/80"; // Use full error color, adjust hover
      }
    }
    if (isSelected) {
      borderColorClass = "border border-primary"; // Highlight selected
    }

    return (
      <div
        key={`${segment.startTime}-${segment.endTime}`}
        className={`p-2 rounded-md shadow-sm cursor-pointer ${borderColorClass} text-base-content w-48 flex flex-col gap-1`} // Fixed width, flex col
        onClick={() =>
          setCurrentTimeRange({
            start: segment.startTime,
            end: segment.endTime,
          })
        }
      >
        {/* Title */}
        <div
          className={`text-sm truncate ${
            segment.type === "map" || segment.type === "round"
              ? "font-bold"
              : "font-normal"
          }`}
          title={segment.title}
        >
          {segment.title}
        </div>

        {/* Times */}
        <div className="text-xs opacity-80">
          {formatTime(segment.startTime)} - {formatTime(segment.endTime)} (
          {formatTime(duration)}
          )
        </div>

       
       

        {/* Stats Display */}
        <SegmentStatsDisplay segment={segment} />

      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 ml-4 mt-3">
      <div className="text-lg text-base-500 font-semibold mb-2">
        {" "}
        {/* Added mb-2 */}
        Select segment to view
      </div>
      {/* Replace table with flex container */}
      <div className="flex flex-wrap gap-2">
        {/* Render Full Map segment */}
        {mapTime &&
          renderTimeSegment({
            // Check if mapTime exists
            matchId: mapTime.matchId, // Pass matchId
            title: "Full Map",
            subtitle: "",
            type: "map",
            startTime: mapTime.startTime,
            endTime: mapTime.endTime,
          })}
        {roundTimes.flatMap((roundTime) => {
          // Ensure roundTime has matchId (might need adjustment based on roundTimesAtom structure)
          const roundMatchId = roundTime.matchId || mapTime?.matchId;
          if (!roundMatchId) return []; // Skip if no matchId

          const teamfightsInRound = teamfights.filter(
            (teamfight) =>
              teamfight.matchId === roundMatchId && // Ensure teamfight belongs to the same match
              teamfight.startTime >= roundTime.roundStartTime &&
              teamfight.endTime <= roundTime.roundEndTime
          );

          return [
            renderTimeSegment({
              matchId: roundMatchId, // Pass matchId
              title: `Round ${roundTime.roundNumber}`,
              subtitle: "",
              type: "round",
              startTime: roundTime.roundStartTime,
              endTime: roundTime.roundEndTime,
            }),
            ...teamfightsInRound.map((teamfight) =>
              renderTimeSegment({
                matchId: teamfight.matchId, // Pass matchId
                title: `Teamfight`,
                subtitle: "",
                type: "teamfight",
                startTime: teamfight.startTime,
                endTime: teamfight.endTime,
                winner: teamfight.winner,
              })
            ),
          ];
        })}
      </div>
      {/* Legend */}
      <div className="flex justify-center mt-6 text-xs text-base-500 gap-4">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full border border-success mr-1"></div>
          <span>{loadedData?.matchData?.team1Name} Win</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full border border-error mr-1"></div>
          <span>{loadedData?.matchData?.team2Name} Win</span>
        </div>
      </div>
    </div>
  );
};
