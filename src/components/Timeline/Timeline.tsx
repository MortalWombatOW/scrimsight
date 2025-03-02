import React, { useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { mapTimesAtom } from "../../atoms/mapTimesAtom";
import { playerEventsAtom } from "../../atoms/derived_events/playerEventsAtom";
import { playerInteractionEventsAtom } from "../../atoms/derived_events/playerInteractionEventsAtom";
import { roundTimesAtom } from "../../atoms/roundTimesAtom";
import { teamfightsAtom } from "../../atoms/teamfightsAtom";
import {
  useTimelineData,
  useTimelineFilters,
  useTimelineSelection,
  TimelineSegment,
  TimelineEvent,
} from "./hooks";
import {
  TimelineRenderer,
  TimelineDetails,
  TimelineSegments,
} from "./components";
import { formatTime } from "../../lib/format";

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
  const allRoundTimes = useAtomValue(roundTimesAtom);
  const allTeamfights = useAtomValue(teamfightsAtom);

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

  // Filter round times and teamfights for this match
  const roundTimes = useMemo(
    () => allRoundTimes.filter((round) => round.matchId === matchId),
    [allRoundTimes, matchId]
  );

  const teamfights = useMemo(
    () => allTeamfights.filter((teamfight) => teamfight.matchId === matchId),
    [allTeamfights, matchId]
  );

  // State for event display pagination and filtering in segment details
  const [eventsPerPage, setEventsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null
  );

  // Use the filters hook to manage filter state
  const { filters, handleTimeRangeChange, resetFilters } = useTimelineFilters({
    mapTimes,
  });

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
    filters,
    roundTimes,
    teamfights
  );

  // Use the selection hook to manage selection state
  const {
    selectedEvents,
    selectedSegments,
    handleEventSelect,
    handleSegmentSelect,
  } = useTimelineSelection({
    data: timelineData,
  });

  // Get events for the selected segment
  const getSegmentEvents = (segment: TimelineSegment): TimelineEvent[] => {
    // For teamfights, we already have events in metadata
    if (segment.type === "Teamfight" && segment.metadata?.events) {
      return segment.metadata.events;
    }

    // For other segments, filter events based on time range
    return timelineData.events.filter(
      (event) =>
        event.time >= segment.startTime && event.time <= segment.endTime
    );
  };

  // Group events by type for better organization
  const groupEventsByType = (events: TimelineEvent[]) => {
    const groups: Record<string, TimelineEvent[]> = {};

    events.forEach((event) => {
      if (!groups[event.type]) {
        groups[event.type] = [];
      }
      groups[event.type].push(event);
    });

    // Sort events within each group by time
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.time - b.time);
    });

    return groups;
  };

  // Calculate pagination data
  const getPaginationData = (events: TimelineEvent[]) => {
    const totalPages = Math.ceil(events.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = events.slice(startIndex, endIndex);

    return {
      totalPages,
      currentEvents,
      startIndex,
      endIndex: Math.min(endIndex, events.length),
      totalEvents: events.length,
    };
  };

  // Render a segment details panel with events
  const renderSegmentDetails = () => {
    if (selectedSegments.length === 0) return null;

    const segment = selectedSegments[0]; // For now, just show details for the first selected segment
    const allSegmentEvents = getSegmentEvents(segment);
    const eventsByType = groupEventsByType(allSegmentEvents);
    const eventTypes = Object.keys(eventsByType).sort();

    // Filter events by type if a type is selected
    const filteredEvents = selectedEventType
      ? eventsByType[selectedEventType] || []
      : allSegmentEvents;

    // Reset to first page when changing event type
    if (currentPage > 1 && filteredEvents.length <= eventsPerPage) {
      setCurrentPage(1);
    }

    // Pagination for the filtered events
    const {
      totalPages,
      currentEvents,
      startIndex,
      endIndex,
      totalEvents,
    } = getPaginationData(filteredEvents);

    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
    };

    const handleEventTypeSelect = (type: string | null) => {
      setSelectedEventType(type);
      setCurrentPage(1); // Reset to first page on type change
    };

    // Get teamfight-specific information
    const renderTeamfightHeader = () => {
      if (segment.type !== "Teamfight" || !segment.metadata) return null;

      const {
        killCount,
        teamAKills,
        teamBKills,
        involvedPlayers,
      } = segment.metadata;

      if (!killCount && !teamAKills && !teamBKills) return null;

      return (
        <div className="px-3 py-2 bg-red-50 border-b flex flex-wrap justify-between">
          <div className="mr-4">
            <span className="text-sm font-medium">Kills: </span>
            <span className="text-sm">{killCount || 0}</span>
          </div>

          {(teamAKills !== undefined || teamBKills !== undefined) && (
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-sm">{teamAKills || 0}</span>
              </div>
              <span className="text-sm mx-1">vs</span>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span className="text-sm">{teamBKills || 0}</span>
              </div>
            </div>
          )}

          {involvedPlayers && involvedPlayers.length > 0 && (
            <div className="w-full mt-1 text-xs text-gray-500">
              Players: {involvedPlayers.slice(0, 8).join(", ")}
              {involvedPlayers.length > 8 &&
                ` +${involvedPlayers.length - 8} more`}
            </div>
          )}
        </div>
      );
    };

    // Get round-specific information
    const renderRoundHeader = () => {
      if (segment.type !== "Round" || !segment.metadata) return null;

      const { roundNumber, setupCompleteTime } = segment.metadata;

      if (!roundNumber) return null;

      const setupDuration = setupCompleteTime
        ? setupCompleteTime - segment.startTime
        : 0;
      const playDuration =
        segment.endTime - (setupCompleteTime || segment.startTime);

      return (
        <div className="px-3 py-2 bg-green-50 border-b flex flex-wrap justify-between">
          <div className="mr-4">
            <span className="text-sm font-medium">Round: </span>
            <span className="text-sm">{roundNumber}</span>
          </div>

          {setupCompleteTime && (
            <div className="flex items-center space-x-3">
              <div>
                <span className="text-xs text-gray-500">Setup: </span>
                <span className="text-sm">{formatTime(setupDuration)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Play: </span>
                <span className="text-sm">{formatTime(playDuration)}</span>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="mt-4 p-0 border rounded bg-gray-50 overflow-hidden">
        {/* Header with segment info */}
        <div className="bg-gray-100 p-3 border-b">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-semibold">
              {segment.type} Details
              {segment.type === "Round" && segment.metadata?.roundNumber && (
                <span className="ml-2">
                  Round {segment.metadata.roundNumber}
                </span>
              )}
              {segment.type === "Teamfight" && segment.metadata?.index && (
                <span className="ml-2">#{segment.metadata.index}</span>
              )}
            </h3>
            <span className="text-sm text-gray-600">
              {formatTime(segment.endTime - segment.startTime)} duration
            </span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>
              {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
            </span>
            <span>{allSegmentEvents.length} events</span>
          </div>
        </div>

        {/* Segment-specific details */}
        {segment.type === "Teamfight" && renderTeamfightHeader()}
        {segment.type === "Round" && renderRoundHeader()}

        {/* Tabs for different event types */}
        <div className="p-3 border-b bg-white overflow-x-auto">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedEventType === null
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleEventTypeSelect(null)}
            >
              All ({allSegmentEvents.length})
            </button>
            {eventTypes.map((type) => (
              <button
                key={type}
                className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap ${
                  selectedEventType === type
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleEventTypeSelect(type)}
              >
                {type} ({eventsByType[type].length})
              </button>
            ))}
          </div>
        </div>

        {/* Event list */}
        {totalEvents > 0 ? (
          <div className="p-0">
            <ul className="divide-y divide-gray-100">
              {currentEvents.map((event) => (
                <li
                  key={event.id}
                  className="p-3 hover:bg-gray-100 flex justify-between transition-colors cursor-pointer"
                  onClick={() => handleEventSelect([event.id])}
                >
                  <div>
                    <div className="font-medium">{event.type}</div>
                    <div className="text-sm text-gray-600">
                      {event.playerName && (
                        <span className="mr-1">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-1 ${
                              event.playerTeam?.toLowerCase() === "blue"
                                ? "bg-blue-500"
                                : event.playerTeam?.toLowerCase() === "red"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          ></span>
                          {event.playerName}
                          {event.relatedPlayerName && (
                            <span>
                              {" "}
                              →
                              <span
                                className={`inline-block w-2 h-2 rounded-full mx-1 ${
                                  event.relatedPlayerTeam?.toLowerCase() ===
                                  "blue"
                                    ? "bg-blue-500"
                                    : event.relatedPlayerTeam?.toLowerCase() ===
                                      "red"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                                }`}
                              ></span>
                              {event.relatedPlayerName}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTime(event.time)}
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="px-3 py-2 bg-gray-50 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600 flex items-center">
                  <span className="mr-3">
                    Showing {startIndex + 1}-{endIndex} of {totalEvents}
                  </span>
                  <select
                    className="px-2 py-1 text-xs border rounded bg-white"
                    value={eventsPerPage}
                    onChange={(e) => {
                      setEventsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No events found in this time segment.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* Main visualization container */}
      <div className="flex-grow relative h-[600px]">
        <TimelineRenderer
          data={timelineData}
          onEventSelect={handleEventSelect}
          selectedEvents={selectedEvents}
          timeRangeFilter={filters.timeRange}
        />
      </div>

      {/* Time segments navigation panel with integrated controls */}
      <TimelineSegments
        roundTimes={roundTimes}
        teamfights={teamfights}
        matchTimes={mapTimes}
        selectedSegments={selectedSegments}
        onSegmentSelect={handleSegmentSelect}
        onTimeRangeChange={handleTimeRangeChange}
        currentTimeRange={filters.timeRange}
      />

      {/* Details panel for selected events */}
      {selectedEvents.length > 0 && (
        <TimelineDetails selectedEvents={selectedEvents} data={timelineData} />
      )}

      {/* Enhanced details panel for selected segments */}
      {selectedSegments.length > 0 && renderSegmentDetails()}
    </div>
  );
};

export default Timeline;
