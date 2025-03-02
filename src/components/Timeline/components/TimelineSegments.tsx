import React, { useState, useRef, useEffect } from "react";
import { MapTimes } from "../../../atoms/mapTimesAtom";
import { RoundTimes } from "../../../atoms/roundTimesAtom";
import { Teamfight } from "../../../atoms/teamfightsAtom";
import { formatTime } from "../../../lib/format";

interface TimelineSegmentsProps {
  roundTimes: RoundTimes[];
  teamfights: Teamfight[];
  matchTimes: MapTimes;
  selectedSegments: TimelineSegment[];
  onSegmentSelect: (segmentIds: string[]) => void;
  onTimeRangeChange: (start: number, end: number) => void;
  currentTimeRange: { start: number; end: number };
}

export interface TimelineSegment {
  id: string;
  type: "Match" | "Round" | "Teamfight";
  startTime: number;
  endTime: number;
  metadata?: Record<string, any>;
}

/**
 * Component for displaying and navigating between different time segments (match, rounds, teamfights)
 */
export const TimelineSegments: React.FC<TimelineSegmentsProps> = ({
  roundTimes,
  teamfights,
  matchTimes,
  selectedSegments,
  onSegmentSelect,
  onTimeRangeChange,
  currentTimeRange,
}) => {
  // State for segment visibility
  const [visibleTypes, setVisibleTypes] = useState({
    Match: true,
    Round: true,
    Teamfight: true,
  });

  // State for handle dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandleSide, setDragHandleSide] = useState<
    "start" | "middle" | "end" | null
  >(null);
  const [dragStartPos, setDragStartPos] = useState(0);
  const [dragStartRange, setDragStartRange] = useState({ start: 0, end: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Convert different time segment types to a unified format
  const segments: TimelineSegment[] = [
    // Match segment
    {
      id: `match-${matchTimes.matchId}`,
      type: "Match",
      startTime: matchTimes.startTime,
      endTime: matchTimes.endTime,
      metadata: { matchId: matchTimes.matchId },
    },
    // Round segments
    ...roundTimes.map((round) => ({
      id: `round-${round.matchId}-${round.roundNumber}`,
      type: "Round" as const,
      startTime: round.roundStartTime,
      endTime: round.roundEndTime,
      metadata: {
        roundNumber: round.roundNumber,
        setupCompleteTime: round.roundSetupCompleteTime,
      },
    })),
    // Teamfight segments
    ...teamfights.map((teamfight, index) => ({
      id: `teamfight-${teamfight.matchId}-${teamfight.startTime}`,
      type: "Teamfight" as const,
      startTime: teamfight.startTime,
      endTime: teamfight.endTime,
      metadata: {
        duration: teamfight.duration,
        killCount: teamfight.killCount || 0,
        teamAKills: teamfight.teamAKills || 0,
        teamBKills: teamfight.teamBKills || 0,
        involvedPlayers: teamfight.involvedPlayers || [],
        index: index + 1, // For display purposes
      },
    })),
  ];

  // Filter visible segments
  const visibleSegments = segments.filter(
    (segment) => visibleTypes[segment.type]
  );

  // Helper function to calculate position as percentage
  const calculatePosition = (time: number) => {
    const matchDuration = matchTimes.duration;
    return (time / matchDuration) * 100;
  };

  // Helper function to calculate width as percentage
  const calculateWidth = (start: number, end: number) => {
    const matchDuration = matchTimes.duration;
    return ((end - start) / matchDuration) * 100;
  };

  // Convert percentage position back to time
  const calculateTimeFromPosition = (positionPercent: number) => {
    const matchDuration = matchTimes.duration;
    return (positionPercent / 100) * matchDuration;
  };

  // Choose segment color based on type
  const getSegmentColor = (type: string, isSelected: boolean) => {
    let intensity = 300;
    if (isSelected) intensity = 500;

    switch (type) {
      case "Match":
        return `bg-gray-${intensity}`;
      case "Round":
        return `bg-green-${intensity}`;
      case "Teamfight":
        return `bg-red-${intensity}`;
      default:
        return `bg-gray-${intensity}`;
    }
  };

  const handleSegmentClick = (segment: TimelineSegment) => {
    onSegmentSelect([segment.id]);
    onTimeRangeChange(segment.startTime, segment.endTime);
  };

  // Handle mouse down on a handle or the range selection
  const handleMouseDown = (
    e: React.MouseEvent,
    handleSide: "start" | "middle" | "end"
  ) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandleSide(handleSide);
    setDragStartPos(e.clientX);
    setDragStartRange({ ...currentTimeRange });
    if (handleSide === "middle") {
      onSegmentSelect([]);
    }
  };

  // Handle mouse move during drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const totalWidth = rect.width;
    const deltaX = e.clientX - dragStartPos;
    const deltaPercent = (deltaX / totalWidth) * 100;

    // Convert percentage change to time
    const deltaTime = calculateTimeFromPosition(deltaPercent);

    // Calculate new time range based on which handle is being dragged
    let newStart = dragStartRange.start;
    let newEnd = dragStartRange.end;

    switch (dragHandleSide) {
      case "start":
        newStart = Math.max(
          matchTimes.startTime,
          Math.min(dragStartRange.start + deltaTime, dragStartRange.end - 1)
        );
        break;
      case "end":
        newEnd = Math.min(
          matchTimes.endTime,
          Math.max(dragStartRange.end + deltaTime, dragStartRange.start + 1)
        );
        break;
      case "middle":
        // Move the entire selected range
        const rangeWidth = dragStartRange.end - dragStartRange.start;
        newStart = Math.max(
          matchTimes.startTime,
          Math.min(
            matchTimes.endTime - rangeWidth,
            dragStartRange.start + deltaTime
          )
        );
        newEnd = newStart + rangeWidth;
        break;
    }

    // Update the time range
    onTimeRangeChange(newStart, newEnd);
  };

  // Handle mouse up to end drag
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragHandleSide(null);
  };

  // Set up event listeners for mouse move and mouse up
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      // Change cursor during drag
      document.body.style.cursor =
        dragHandleSide === "middle" ? "grabbing" : "ew-resize";
    } else {
      document.body.style.cursor = "default";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isDragging, dragHandleSide, dragStartPos, dragStartRange]);

  // Toggle visibility for a segment type
  const toggleVisibility = (type: "Match" | "Round" | "Teamfight") => {
    setVisibleTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Format teamfight label with score
  const formatTeamfightLabel = (teamfight: TimelineSegment) => {
    if (teamfight.type !== "Teamfight" || !teamfight.metadata)
      return `Teamfight`;

    const { teamAKills, teamBKills, index } = teamfight.metadata;
    const hasKillData = teamAKills !== undefined && teamBKills !== undefined;

    if (!hasKillData) return `Teamfight ${index}`;

    return `Teamfight ${index} (${teamAKills}-${teamBKills})`;
  };

  // Time range display
  const timeRangeDisplay = () => {
    return (
      <div className="flex items-center justify-between text-xs text-blue-800 mb-1">
        <div className="inline-block min-w-[100px] text-left">
          {formatTime(currentTimeRange.start)}
        </div>
        <div className="flex-grow text-center">
          <span>
            <span className="inline-block min-w-[100px] text-center">
              {formatTime(currentTimeRange.end - currentTimeRange.start)}
            </span>
          </span>
        </div>
        <div className="inline-block min-w-[100px] text-right">
          {formatTime(currentTimeRange.end)}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Time Segments</h3>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 text-xs rounded ${
              visibleTypes.Match ? "bg-gray-300" : "bg-gray-100"
            }`}
            onClick={() => toggleVisibility("Match")}
          >
            Match
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${
              visibleTypes.Round ? "bg-green-300" : "bg-gray-100"
            }`}
            onClick={() => toggleVisibility("Round")}
          >
            Rounds
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${
              visibleTypes.Teamfight ? "bg-red-300" : "bg-gray-100"
            }`}
            onClick={() => toggleVisibility("Teamfight")}
          >
            Teamfights
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex mb-2 text-sm">
        <div className="mr-4 flex items-center">
          <div className="w-3 h-3 bg-gray-300 mr-1"></div>
          <span>Match</span>
        </div>
        <div className="mr-4 flex items-center">
          <div className="w-3 h-3 bg-green-300 mr-1"></div>
          <span>Rounds</span>
        </div>
        <div className="mr-4 flex items-center">
          <div className="w-3 h-3 bg-red-300 mr-1"></div>
          <span>Teamfights</span>
        </div>
      </div>

      {/* Time range display */}
      {timeRangeDisplay()}

      {/* Full match timeline with segments */}
      <div
        className="w-full h-24 relative bg-gray-100 rounded-md mb-3"
        ref={timelineRef}
      >
        {/* Current time range selection area (draggable middle) */}
        <div
          className="absolute h-24 bg-blue-400 opacity-30 top-0 cursor-grab"
          style={{
            left: `${calculatePosition(currentTimeRange.start)}%`,
            width: `${
              calculatePosition(currentTimeRange.end) -
              calculatePosition(currentTimeRange.start)
            }%`,
          }}
          onMouseDown={(e) => handleMouseDown(e, "middle")}
        ></div>
        {/* Match timeline (full width) */}
        {visibleTypes.Match && (
          <div
            className="absolute h-4 top-1 left-0 right-0 bg-gray-200 cursor-pointer"
            onClick={() => handleSegmentClick(segments[0])}
          ></div>
        )}

        {/* Segments */}
        {visibleSegments.map((segment) => {
          const isSelected = selectedSegments.some((s) => s.id === segment.id);

          // Skip rendering the match segment here since it's handled separately above
          if (segment.type === "Match" && segment === segments[0]) return null;

          return (
            <div
              key={segment.id}
              className={`absolute h-4 cursor-pointer transition-colors ${getSegmentColor(
                segment.type,
                isSelected
              )}`}
              style={{
                left: `${calculatePosition(segment.startTime)}%`,
                width: `${calculateWidth(segment.startTime, segment.endTime)}%`,
                top:
                  segment.type === "Match"
                    ? "4px"
                    : segment.type === "Round"
                    ? "24px"
                    : "44px",
              }}
              onClick={() => handleSegmentClick(segment)}
              title={`${segment.type}${
                segment.type === "Round" && segment.metadata?.roundNumber
                  ? ` ${segment.metadata.roundNumber}`
                  : ""
              } - ${formatTime(segment.startTime)} to ${formatTime(
                segment.endTime
              )}`}
            >
              {/* For teamfights with enough width, show kill count */}
              {segment.type === "Teamfight" &&
                calculateWidth(segment.startTime, segment.endTime) > 0 &&
                segment.metadata?.killCount && (
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-500 pointer-events-none">
                    {segment.metadata.killCount}
                  </div>
                )}
            </div>
          );
        })}

        {/* Current time range start handle (draggable) */}
        <div
          className="absolute h-24 -l-2 border border-blue-500 top-0 cursor-ew-resize"
          style={{
            left: `${calculatePosition(currentTimeRange.start)}%`,
            zIndex: 10,
          }}
          onMouseDown={(e) => handleMouseDown(e, "start")}
        >
          <div className="absolute top-0 left-0 h-full w-3 -translate-x-1/2 bg-transparent"></div>
          <div className="absolute top-1/2 left-0 w-4 h-8 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-md"></div>
        </div>

        {/* Current time range end handle (draggable) */}
        <div
          className="absolute h-24 border-r-2 border-blue-500 top-0 cursor-ew-resize"
          style={{
            left: `${calculatePosition(currentTimeRange.end)}%`,
            zIndex: 10,
          }}
          onMouseDown={(e) => handleMouseDown(e, "end")}
        >
          <div className="absolute top-0 left-0 h-full w-3 -translate-x-1/2 bg-transparent"></div>
          <div className="absolute top-1/2 left-0 w-4 h-8 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-md"></div>
        </div>
      </div>

      {/* Segment quick selectors */}
      <div className="flex flex-wrap gap-2">
        <button
          className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => {
            const segment = segments.find((s) => s.type === "Match");
            if (segment) handleSegmentClick(segment);
          }}
        >
          Full Match
        </button>

        {roundTimes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {roundTimes.map((round) => (
              <button
                key={`btn-round-${round.roundNumber}`}
                className="px-2 py-1 text-sm bg-green-100 rounded hover:bg-green-200"
                onClick={() => {
                  const segment = segments.find(
                    (s) =>
                      s.id === `round-${round.matchId}-${round.roundNumber}`
                  );
                  if (segment) handleSegmentClick(segment);
                }}
              >
                Round {round.roundNumber}
              </button>
            ))}
          </div>
        )}

        {teamfights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {teamfights.map((teamfight, index) => {
              const segment = segments.find(
                (s) =>
                  s.id ===
                  `teamfight-${teamfight.matchId}-${teamfight.startTime}`
              );

              return (
                <button
                  key={`btn-teamfight-${index}`}
                  className="px-2 py-1 text-sm bg-red-100 rounded hover:bg-red-200 flex items-center"
                  onClick={() => {
                    if (segment) handleSegmentClick(segment);
                  }}
                >
                  <span className="mr-1">TF {index + 1}</span>
                  {teamfight.killCount && (
                    <span className="text-xs bg-red-200 px-1 rounded-full">
                      {teamfight.killCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineSegments;
