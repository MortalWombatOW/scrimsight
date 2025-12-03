import { type ReactNode, useMemo } from "react";
import { useAtomValue } from "jotai"; // Import useAtomValue
import { useTimelineContext } from "./TimelineContext";
import { TimelineButton } from "./TimelineButton";
import {
  timelineSegmentsAtomFamily,
} from "@atoms";

export const TimelineControls = (): ReactNode => {
  const { setCurrentTimeRange, loadedData, currentTimeRange } =
    useTimelineContext();

  // Use the derived atom to get timeline segments
  const timelineSegmentsAtom = useMemo(
    () => timelineSegmentsAtomFamily({ matchId: loadedData?.matchData?.matchId || "" }),
    [loadedData?.matchData?.matchId]
  );
  const flatSegments = useAtomValue(timelineSegmentsAtom);

  if (!loadedData) {
    return <div>Loading...</div>;
  }

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
              team1Name={loadedData?.matchData?.team1Name}
              team2Name={loadedData?.matchData?.team2Name}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-6 text-xs text-base-500 gap-4">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full border border-blue-600 mr-1"></div>
          <span>{loadedData?.matchData?.team1Name ?? "Team 1"} Win</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full border border-error mr-1"></div>
          <span>{loadedData?.matchData?.team2Name ?? "Team 2"} Win</span>
        </div>
      </div>
    </div>
  );
};
