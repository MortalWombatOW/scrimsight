import React, { useMemo } from "react";
import { useAtomValue } from "jotai";
import { mapTimesAtom } from "../../atoms/mapTimesAtom";
import { playerEventsAtom } from "../../atoms/derived_events/playerEventsAtom";
import { playerInteractionEventsAtom } from "../../atoms/derived_events/playerInteractionEventsAtom";
import {
  useTimelineData,
  useTimelineFilters,
  useTimelineSelection,
} from "./hooks";
import {
  TimelineRenderer,
  TimelineControls,
  TimelineDetails,
} from "./components";

/**
 * Timeline component for visualizing match flow
 * This component acts as the container for the entire timeline visualization,
 * integrating THREE.js rendering with React UI controls
 */
export const Timeline: React.FC<{ matchId: string }> = ({ matchId }) => {
  // Load data from atoms
  const allMapTimes = useAtomValue(mapTimesAtom);
  const allPlayerEvents = useAtomValue(playerEventsAtom);
  const allPlayerInteractions = useAtomValue(playerInteractionEventsAtom);

  // Use useMemo to filter the data only when dependencies change
  const mapTimes = useMemo(
    () => allMapTimes.find((map) => map.matchId === matchId),
    [allMapTimes, matchId]
  );

  const playerEvents = useMemo(
    () =>
      allPlayerEvents.filter((playerEvent) => playerEvent.matchId === matchId),
    [allPlayerEvents, matchId]
  );

  const playerInteractions = useMemo(
    () =>
      allPlayerInteractions.filter(
        (playerInteraction) => playerInteraction.matchId === matchId
      ),
    [allPlayerInteractions, matchId]
  );

  // Use the filters hook to manage filter state
  const { filters, handleTimeRangeChange } = useTimelineFilters({ mapTimes });

  // Loading state if data isn't available yet
  if (!mapTimes || !playerEvents || !playerInteractions) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading timeline data...
      </div>
    );
  }

  // Process data for visualization using custom hook
  const { timelineData, timeRange } = useTimelineData(
    mapTimes,
    playerEvents,
    playerInteractions,
    filters
  );

  // Use the selection hook to manage selection state
  const { selectedEvents, handleEventSelect } = useTimelineSelection({
    data: timelineData,
  });

  return (
    <div className="flex flex-col w-full">
      {/* Main visualization container */}
      <div className="flex-grow relative h-[300px]">
        <TimelineRenderer
          data={timelineData}
          onEventSelect={handleEventSelect}
          selectedEvents={selectedEvents}
          timeRangeFilter={filters.timeRange}
        />
      </div>

      {/* Time range control */}
      <TimelineControls
        timeRange={timeRange}
        currentTimeRange={filters.timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />

      {/* Details panel for selected events */}
      {selectedEvents.length > 0 && (
        <TimelineDetails selectedEvents={selectedEvents} data={timelineData} />
      )}
    </div>
  );
};

export default Timeline;
