import { type ReactNode } from "react";
import { useTimelineContext } from "@components/Timeline/TimelineContext"; // Import context hook

// Moved and updated TimeSegment type
export type TimeSegment = {
  matchId: string;
  title: string;
  subtitle: string;
  type: "map" | "round" | "teamfight";
  startTime: number;
  endTime: number;
  winner?: string | null;
  childrenSegments?: TimeSegment[]; // Added for nesting
};


// Define props for the main component
interface TimeSegmentDisplayProps {
  segment: TimeSegment;
  onSelect: (start: number, end: number) => void;
  // isSelected: boolean; // Removed isSelected prop
  team1Name?: string | null;
  team2Name?: string | null;
}

// Main TimeSegmentDisplay component
export const TimeSegmentDisplay = ({
  segment,
  onSelect,
  // isSelected, // Removed isSelected prop
  team1Name,
  team2Name,
}: TimeSegmentDisplayProps): ReactNode => {
  const { currentTimeRange } = useTimelineContext(); // Get context

  // Calculate isSelected locally
  const isSelected =
    segment.startTime === currentTimeRange.start &&
    segment.endTime === currentTimeRange.end;

  // Determine border color based on winner and selection state
  let borderColorClass = "border border-gray-700"; // Default grey
  if (segment.winner) {
    if (segment.winner === team1Name) {
      borderColorClass = "border border-success hover:border-success/80";
    } else if (segment.winner === team2Name) {
      borderColorClass = "border border-error hover:border-error/80";
    }
  }
  // Apply winning team color to map and round segments as well
  if ((segment.type === 'map' || segment.type === 'round') && segment.winner) {
    if (segment.winner === team1Name) {
      borderColorClass = "border border-success hover:border-success/80";
    } else if (segment.winner === team2Name) {
      borderColorClass = "border border-error hover:border-error/80";
    }
  }

  if (isSelected) {
    borderColorClass = "border-2 border-primary";
    console.log("Selected segment:", segment);
  }

  return (
    <div
      key={`${segment.startTime}-${segment.endTime}`}
      className={`p-2 rounded-md shadow-sm cursor-pointer ${borderColorClass} text-base-content ${segment.type === "teamfight" ? "w-fit-content" : "w-full"} flex flex-col gap-1 bg-base-200/50`} 
      onClick={(e) => {e.stopPropagation(); onSelect(segment.startTime, segment.endTime)}}
    >
      <div className={segment.type === "teamfight" ? "flex flex-col gap-1" : "flex flex-row gap-9"}>
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
      </div>

      {/* Render Children Segments */}
      {segment.childrenSegments && segment.childrenSegments.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pl-2 ">
          {segment.childrenSegments.map((childSegment) => (
            <TimeSegmentDisplay
              key={`${childSegment.startTime}-${childSegment.endTime}-child`}
              segment={childSegment}
              onSelect={onSelect}
              team1Name={team1Name}
              team2Name={team2Name}
            />
          ))}
        </div>
      )}
    </div>
  );
};
