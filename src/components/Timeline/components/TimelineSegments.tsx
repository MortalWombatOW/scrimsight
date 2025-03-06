import React, { useState, useRef, useEffect } from "react";
import { mapTimesAtom } from "../../../atoms/mapTimesAtom";
import { RoundTimes, roundTimesAtom } from "../../../atoms/roundTimesAtom";
import { Teamfight, teamfightsAtom } from "../../../atoms/teamfightsAtom";
import { formatTime } from "../../../lib/format";
import { useAtomValue } from "jotai";

interface TimelineSegmentsProps {
  matchId: string;
  selectedSegmentId: string | null;
  setSelectedSegmentId: (segmentId: string | null) => void;
  currentTimeRange: { start: number; end: number };
  setCurrentTimeRange: (timeRange: { start: number; end: number }) => void;
}

const getSegmentIdForRound = (round: RoundTimes) => {
  return `round-${round.matchId}-${round.roundNumber}`;
};

const getSegmentIdForTeamfight = (teamfight: Teamfight) => {
  return `teamfight-${teamfight.matchId}-${teamfight.startTime}`;
};

/**
 * Component for displaying and navigating between different time segments (match, rounds, teamfights)
 */
export const TimelineSegments: React.FC<TimelineSegmentsProps> = ({
  matchId,
  selectedSegmentId,
  setSelectedSegmentId,
  currentTimeRange,
  setCurrentTimeRange,
}) => {
  const matchTimes = useAtomValue(mapTimesAtom).find(
    (map) => map.matchId === matchId
  ) || {
    matchId: "",
    startTime: 0,
    endTime: 100,
    duration: 100,
  };
  const roundTimes = useAtomValue(roundTimesAtom).filter(
    (round) => round.matchId === matchId
  );
  const teamfights = useAtomValue(teamfightsAtom).filter(
    (teamfight) => teamfight.matchId === matchId
  );

  // State for handle dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandleSide, setDragHandleSide] = useState<
    "start" | "middle" | "end" | null
  >(null);
  const [dragStartPos, setDragStartPos] = useState(0);
  const [dragStartRange, setDragStartRange] = useState({ start: 0, end: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Helper function to calculate position as percentage
  const calculatePosition = (time: number) => {
    return (time / matchTimes.duration) * 100;
  };

  // Helper function to calculate width as percentage
  const calculateWidth = (start: number, end: number) => {
    return ((end - start) / matchTimes.duration) * 100;
  };

  // Convert percentage position back to time
  const calculateTimeFromPosition = (positionPercent: number) => {
    return (positionPercent / 100) * matchTimes.duration;
  };

  // Choose segment color based on type
  const getSegmentColor = (type: string, isSelected: boolean) => {
    let intensity = 0;

    if (type === "Match") intensity = 300;
    if (type === "Round") intensity = 400;
    if (type === "Teamfight") intensity = 900;

    if (isSelected) intensity += 100;

    switch (type) {
      case "Match":
        return `bg-gray-${intensity}`;
      case "Round":
        return `bg-gray-${intensity}`;
      case "Teamfight":
        return `bg-gray-${intensity}`;
      default:
        return `bg-gray-${intensity}`;
    }
  };

  const handleSegmentClick = (
    segmentId: string,
    startTime: number,
    endTime: number
  ) => {
    setSelectedSegmentId(segmentId);
    setCurrentTimeRange({ start: startTime, end: endTime });
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
      setSelectedSegmentId(null);
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
    setCurrentTimeRange({ start: newStart, end: newEnd });
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

  return (
    <div className="mb-4">
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

      {/* Full match timeline with segments */}
      <div
        className="w-full h-15 relative bg-gray-100 rounded-md mb-3"
        ref={timelineRef}
      >
        {/* Current time range selection area (draggable middle) */}
        <div
          className="absolute h-15 bg-blue-400 opacity-30 top-0 cursor-grab"
          style={{
            left: `${calculatePosition(currentTimeRange.start)}%`,
            width: `${
              calculatePosition(currentTimeRange.end) -
              calculatePosition(currentTimeRange.start)
            }%`,
          }}
          onMouseDown={(e) => handleMouseDown(e, "middle")}
        ></div>

        {/* Rounds */}
        {roundTimes.map((round) => {
          const isSelected = selectedSegmentId === getSegmentIdForRound(round);
          return (
            <div
              key={getSegmentIdForRound(round)}
              className={`absolute h-4 cursor-pointer transition-colors ${getSegmentColor(
                "Round",
                isSelected
              )}`}
              style={{
                left: `${calculatePosition(round.roundSetupCompleteTime)}%`,
                width: `${calculateWidth(
                  round.roundSetupCompleteTime,
                  round.roundEndTime
                )}%`,
                top: "4px",
              }}
              onClick={() =>
                handleSegmentClick(
                  getSegmentIdForRound(round),
                  round.roundSetupCompleteTime,
                  round.roundEndTime
                )
              }
            >
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs pointer-events-none">
                {`Round ${round.roundNumber}`}
              </div>
            </div>
          );
        })}

        {/* Teamfights */}
        {teamfights.map((teamfight, index) => {
          return (
            <div
              key={getSegmentIdForTeamfight(teamfight)}
              className={`absolute h-4 cursor-pointer transition-colors bg-gray-400`}
              style={{
                left: `${calculatePosition(teamfight.startTime)}%`,
                width: `${calculateWidth(
                  teamfight.startTime,
                  teamfight.endTime
                )}%`,
                top: "24px",
              }}
              onClick={() =>
                handleSegmentClick(
                  getSegmentIdForTeamfight(teamfight),
                  teamfight.startTime,
                  teamfight.endTime
                )
              }
            >
              <div className="absolute -bottom-4 left-0 w-full h-full flex items-center justify-center text-xs pointer-events-none">
                {`${index + 1}`}
              </div>
            </div>
          );
        })}

        {/* Current time range start handle (draggable) */}
        <div
          className="absolute h-15 -l-2 border border-blue-500 top-0 cursor-ew-resize"
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
          className="absolute h-15 border-r-2 border-blue-500 top-0 cursor-ew-resize"
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
    </div>
  );
};

export default TimelineSegments;
