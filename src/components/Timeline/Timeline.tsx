import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAtomValue } from "jotai";
import { mapTimesAtom } from "../../atoms/mapTimesAtom";
import { playerEventsAtom } from "../../atoms/derived_events/playerEventsAtom";
import { playerInteractionEventsAtom } from "../../atoms/derived_events/playerInteractionEventsAtom";
import { useTimelineData } from "./hooks/useTimelineData";
import { TimelineRenderer } from "./TimelineRenderer";
import { TimelineControls } from "./TimelineControls";
import { TimelineDetails } from "./TimelineDetails";

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

  // State for selected events and filter options
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [timeRangeStart, setTimeRangeStart] = useState(0);
  const [timeRangeEnd, setTimeRangeEnd] = useState(0);

  // Initialize timeRange properly using useEffect to avoid render loop
  useEffect(() => {
    if (mapTimes) {
      setTimeRangeStart(0);
      setTimeRangeEnd(mapTimes.duration || 0);
    }
  }, [mapTimes]);

  // Loading state if data isn't available yet
  if (!mapTimes || !playerEvents || !playerInteractions) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading timeline data...
      </div>
    );
  }

  const timeRangeFilter = useMemo(
    () => ({ start: timeRangeStart, end: timeRangeEnd }),
    [timeRangeStart, timeRangeEnd]
  );

  const filters = useMemo(
    () => ({
      players: [],
      teams: [],
      eventTypes: [],
      timeRange: timeRangeFilter,
    }),
    [timeRangeFilter]
  );

  // Process data for visualization using custom hook
  const {
    timelineData,
    players,
    teams,
    eventTypes,
    timeRange,
  } = useTimelineData(mapTimes, playerEvents, playerInteractions, filters);

  // Handle event selection from the visualization
  const handleEventSelect = useCallback(
    (eventIds: string[]) => {
      // only add if set of selectedEvents is different from eventIds
      if (
        selectedEvents.length !== eventIds.length ||
        !selectedEvents.every((event) => eventIds.includes(event))
      ) {
        setSelectedEvents(eventIds);
      }
    },
    [selectedEvents]
  );

  // Handle time range changes from controls
  const handleTimeRangeChange = (start: number, end: number) => {
    if (start !== timeRangeStart) {
      setTimeRangeStart(start);
    }
    if (end !== timeRangeEnd) {
      setTimeRangeEnd(end);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Main visualization container */}
      <div className="flex-grow relative h-[300px]">
        <TimelineRenderer
          data={timelineData}
          onEventSelect={handleEventSelect}
          selectedEvents={selectedEvents}
          timeRangeFilter={timeRangeFilter}
        />
      </div>

      {/* Time range control */}
      <TimelineControls
        timeRange={timeRange}
        currentTimeRange={timeRangeFilter}
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
