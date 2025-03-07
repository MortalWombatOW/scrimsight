import { useMemo } from "react";
import { useTimelineContext } from "./TimelineContext";
import { formatTime, getHeroImage } from "../../lib";

export const TimelineDisplay: React.FC = () => {
  const {
    currentTimeRange,
    loadedData,
    selectedEventId,
    setSelectedEventId,
  } = useTimelineContext();

  if (!loadedData) {
    return <div>Loading...</div>;
  }

  const { events } = loadedData;

  const xScale = useMemo(() => {
    return (time: number) => {
      return (
        ((time - currentTimeRange.start) /
          (currentTimeRange.end - currentTimeRange.start)) *
        100
      );
    };
  }, [currentTimeRange]);

  // Generate tick marks at regular intervals
  const tickMarks = useMemo(() => {
    const numberOfTicks = 10;
    const tickArray = [];

    for (let i = 0; i <= numberOfTicks; i++) {
      const position = i * (100 / numberOfTicks);
      const time =
        currentTimeRange.start +
        (i / numberOfTicks) * (currentTimeRange.end - currentTimeRange.start);

      const formattedTime = formatTime(time);

      tickArray.push({
        position,
        label: formattedTime,
        time,
      });
    }

    return tickArray;
  }, [currentTimeRange]);

  // Filter events that are within the current time range
  const visibleEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.time >= currentTimeRange.start &&
        event.time <= currentTimeRange.end
    );
  }, [events, currentTimeRange]);

  // Group events by time (considering a small threshold to group events that are close)
  const groupedEvents = useMemo(() => {
    const groups: {
      time: number;
      position: number;
      events: typeof events;
    }[] = [];
    const threshold = 0.5; // 0.5 seconds threshold to group events

    visibleEvents.forEach((event) => {
      // Find an existing group that's close enough in time
      const existingGroup = groups.find(
        (group) => Math.abs(group.time - event.time) <= threshold
      );

      if (existingGroup) {
        existingGroup.events.push(event);
      } else {
        // Create a new group
        groups.push({
          time: event.time,
          position: xScale(event.time),
          events: [event],
        });
      }
    });

    // Sort groups by time
    return groups.sort((a, b) => a.time - b.time);
  }, [visibleEvents, xScale]);

  return (
    <div className="mt-6 mb-24">
      {/* Container for the entire timeline */}
      <div className="relative w-full">
        {/* Top time labels */}
        <div className="relative w-full h-5 mb-1">
          {tickMarks.map((tick, index) => (
            <div
              key={`label-${index}`}
              className="absolute text-xs text-gray-500 w-20"
              style={{
                left: `${tick.position - 0}%`,
                transform:
                  index === 0
                    ? "translateX(10%)"
                    : index === tickMarks.length - 1
                    ? "translateX(-6z0%)"
                    : "translateX(-50%)",
              }}
            >
              {tick.label}
            </div>
          ))}
        </div>

        {/* Timeline bar with tick marks */}
        <div className="relative w-full h-8">
          {/* The main timeline bar */}
          <div className="absolute top-4 h-1 bg-gray-300 w-full rounded-full"></div>

          {/* Tick marks */}
          {tickMarks.map((tick, index) => (
            <div
              key={`tick-${index}`}
              className="absolute top-0 flex flex-col items-center"
              style={{
                left: `${tick.position}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="h-8 w-px bg-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Events display */}
        <div className="relative">
          {/* Event groups */}
          {groupedEvents.map((group, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              className="absolute"
              style={{
                left: `${group.position}%`,
                transform: "translateX(-50%)",
                top: "-20px",
              }}
            >
              {/* Vertical marker line */}
              <div className="w-px h-3 bg-gray-400 mx-auto"></div>

              {/* Group of events */}
              <div
                className={`mt-1 pt-1 flex items-center justify-center ${
                  group.events.length > 1 ? "flex-wrap" : ""
                }`}
              >
                {group.events.map((event) => (
                  <div
                    key={event.id}
                    className={`transition-all duration-200 mx-1 flex flex-col items-center ${
                      selectedEventId === event.id ? "scale-110 z-10" : ""
                    }`}
                    style={{
                      width: group.events.length > 1 ? "30px" : "auto",
                      marginBottom: group.events.length > 1 ? "8px" : "0",
                    }}
                    onMouseEnter={() => setSelectedEventId(event.id)}
                    onMouseLeave={() => setSelectedEventId(null)}
                  >
                    {/* Event content with hero image and name */}
                    <div
                      className={`p-1 rounded transition-all ${
                        selectedEventId === event.id
                          ? "bg-gray-200 shadow-sm"
                          : ""
                      }`}
                    >
                      <img
                        src={getHeroImage(event.playerHero)}
                        alt={event.playerHero}
                        className="w-8 h-8 mx-auto rounded-full border border-gray-300"
                      />
                      <div
                        className="text-xs text-gray-600 mt-1 text-center font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ maxWidth: "60px" }}
                      >
                        {event.playerName}
                      </div>
                      <div
                        className="text-xs text-gray-600 mt-1 text-center font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ maxWidth: "60px" }}
                      >
                        {event.type === "playerEvent" &&
                          event.playerEvent?.playerEventType}
                        {event.type === "playerInteractionEvent" &&
                          event.playerInteractionEvent
                            ?.playerInteractionEventType}
                        {event.type === "ultimateEvent" &&
                          event.ultimateEvent?.ultimateId}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
