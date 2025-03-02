import React from "react";
import type { TimelineData, TimelineEvent } from "../../hooks";
import { formatTime } from "../../../../lib";
import { getHeroImage } from "../../../../lib/hero";

interface TimelineDetailsProps {
  selectedEvents: string[];
  data: TimelineData;
}

/**
 * TimelineDetails component for displaying information about selected events
 */
export const TimelineDetails: React.FC<TimelineDetailsProps> = ({
  selectedEvents,
  data,
}) => {
  // No events selected, show empty state
  if (selectedEvents.length === 0) {
    return null;
  }

  // Find the selected events in the data
  const events = selectedEvents
    .map((id) => {
      return data.events.find((event) => event.id === id);
    })
    .filter((event): event is TimelineEvent => event !== undefined);

  // Get related events for the selected events
  const getRelatedEvents = (event: TimelineEvent): TimelineEvent[] => {
    if (!event.relatedEvents) return [];

    return event.relatedEvents
      .map((id) => data.events.find((e) => e.id === id))
      .filter((e): e is TimelineEvent => e !== undefined);
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium text-gray-800">
        {events.length === 1
          ? "Event Details"
          : `${events.length} Events Selected`}
      </h3>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="p-2 border border-gray-300 rounded">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {/* Event type and time */}
              <div className="col-span-2 flex justify-between border-b border-gray-200 pb-1 mb-1">
                <span className="font-semibold text-gray-700">
                  {event.type}
                </span>
                <span className="text-gray-500">{formatTime(event.time)}</span>
              </div>

              {/* Player info */}
              {event.playerName && (
                <>
                  <div className="text-gray-600">Player:</div>
                  <div>{event.playerName}</div>
                </>
              )}

              {/* Team info */}
              {event.playerTeam && (
                <>
                  <div className="text-gray-600">Team:</div>
                  <div>{event.playerTeam}</div>
                </>
              )}

              {/* Hero info */}
              {event.playerHero && (
                <>
                  <div className="text-gray-600">Hero:</div>
                  <div className="flex items-center">
                    <img
                      src={getHeroImage(event.playerHero)}
                      alt={event.playerHero}
                      className="w-6 h-6 mr-1 rounded-full"
                    />
                    {event.playerHero}
                  </div>
                </>
              )}

              {/* Related player info */}
              {event.relatedPlayerName && (
                <>
                  <div className="text-gray-600">Related Player:</div>
                  <div>{event.relatedPlayerName}</div>
                </>
              )}

              {/* Related hero info */}
              {event.relatedPlayerHero && (
                <>
                  <div className="text-gray-600">Related Hero:</div>
                  <div className="flex items-center">
                    <img
                      src={getHeroImage(event.relatedPlayerHero)}
                      alt={event.relatedPlayerHero}
                      className="w-6 h-6 mr-1 rounded-full"
                    />
                    {event.relatedPlayerHero}
                  </div>
                </>
              )}

              {/* Additional metadata */}
              {event.metadata &&
                Object.entries(event.metadata).map(([key, value]) => {
                  // Skip raw data for cleanliness
                  if (key === "raw") return null;

                  return (
                    <React.Fragment key={key}>
                      <div className="text-gray-600">{key}:</div>
                      <div>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value}
                      </div>
                    </React.Fragment>
                  );
                })}
            </div>

            {/* Related events section */}
            {event.relatedEvents && event.relatedEvents.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  Related Events:
                </div>
                <div className="space-y-1">
                  {getRelatedEvents(event).map((relatedEvent) => (
                    <div
                      key={relatedEvent.id}
                      className="text-sm bg-gray-50 p-1 rounded"
                    >
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          {relatedEvent.type} -{relatedEvent.playerName}
                          {relatedEvent.playerHero && (
                            <img
                              src={getHeroImage(relatedEvent.playerHero)}
                              alt={relatedEvent.playerHero}
                              className="w-4 h-4 mx-1 rounded-full"
                            />
                          )}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTime(relatedEvent.time)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
