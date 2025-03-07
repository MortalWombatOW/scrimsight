import { useTimelineContext } from "./TimelineContext";
import { getHeroImage } from "../../lib";

// Helper function to format time (MM:SS)
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// Event type display text mapping
const getEventDisplayText = (eventType: string): string => {
  const eventMap: Record<string, string> = {
    // Player interaction events
    elimination: "Eliminated",
    assist: "Assisted",
    damage: "Damaged",
    healing: "Healed",

    // Player events
    death: "Died",
    respawn: "Respawned",
    swap: "Swapped Hero",
    position: "Changed Position",

    // Ultimate events - handled separately
  };

  // Try to find a match in the map
  for (const [key, value] of Object.entries(eventMap)) {
    if (eventType.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return the original if no match found
  return eventType;
};

const TimelineItem: React.FC<{
  time: number;
  playerName: string;
  playerHero: string;
  eventType: string;
  isTeam1: boolean;
  isSelected: boolean;
  targetName?: string;
  hero?: string;
  teamName?: string;
  onClick: () => void;
  onMouseLeave: () => void;
}> = ({
  time,
  playerName,
  playerHero,
  eventType,
  isTeam1,
  isSelected,
  targetName,
  hero,
  teamName,
  onClick,
  onMouseLeave,
}) => {
  const displayText = getEventDisplayText(eventType);
  const isUltimate = eventType.toLowerCase().includes("ultimate");

  // Zap icon for ultimate indicator
  const ZapIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-1"
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );

  const EventIcon = () => {
    return (
      <img
        src={getHeroImage(playerHero)}
        alt={playerHero}
        className="w-4 h-4"
      />
    );
  };

  return (
    <div
      className={`
        py-1.5 border-b border-base-200 last:border-0
        ${isSelected ? "bg-base-200" : ""}
        hover:bg-base-200 transition-all duration-200
      `}
      onMouseEnter={onClick}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center justify-between">
        {/* Left side (Team 1) content */}
        <div className={`w-[45%] ${isTeam1 ? "block" : "invisible"} text-left`}>
          {isTeam1 && (
            <>
              <div className="flex items-center">
                <span className="font-medium text-xs">{playerName}</span>
                <span className="text-xs text-gray-500 ml-1">
                  {formatTime(time)}
                </span>
              </div>
              {isUltimate ? (
                <div className="mt-0.5 flex items-center">
                  <EventIcon />
                  <span className="badge badge-xs badge-outline ml-1">
                    Ultimate ({hero})
                  </span>
                </div>
              ) : (
                <div className="flex items-center mt-0.5">
                  <span className="text-xs badge badge-xs ml-1">
                    {displayText}
                  </span>
                  {targetName && (
                    <span className="text-xs ml-1">{targetName}</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Middle time marker (only for important events) */}
        {isUltimate && (
          <div className="text-center flex-shrink-0">
            <div className="text-xs text-gray-500">{formatTime(time)}</div>
            <div className="border border-base-300 rounded-full text-xs px-2 py-0.5 mt-0.5 flex items-center">
              <ZapIcon />
              <span>
                Ultimate ({hero})
                <span className="text-xs text-gray-500 ml-1">{teamName}</span>
              </span>
            </div>
          </div>
        )}

        {/* Right side (Team 2) content */}
        <div
          className={`w-[45%] ${!isTeam1 ? "block" : "invisible"} text-right`}
        >
          {!isTeam1 && (
            <>
              <div className="flex items-center justify-end">
                <span className="text-xs text-gray-500 mr-1">
                  {formatTime(time)}
                </span>
                <EventIcon />
                <span className="font-medium text-xs">{playerName}</span>
              </div>
              {isUltimate ? (
                <div className="mt-0.5 flex justify-end items-center">
                  <span className="badge badge-xs badge-outline mr-1">
                    Ultimate ({hero})
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-end mt-0.5">
                  <span className="text-xs badge badge-xs mr-1">
                    {displayText}
                  </span>
                  {targetName && (
                    <span className="text-xs mr-1">{targetName}</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const TimelineEvents: React.FC = () => {
  const {
    loadedData,
    selectedEventId,
    setSelectedEventId,
  } = useTimelineContext();

  if (!loadedData) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="loading loading-dots"></div>
      </div>
    );
  }

  const { matchData, events } = loadedData;

  return (
    <div className="card bg-base-100 shadow-md p-2">
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-semibold">{matchData.team1Name}</div>
          <div className="text-sm font-semibold">{matchData.team2Name}</div>
        </div>
        <div className="w-full h-0.5 bg-base-200 rounded-full"></div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {events.map((event, index) => {
          if (
            event.type === "playerInteractionEvent" &&
            event.playerInteractionEvent
          ) {
            const { playerInteractionEvent } = event;
            const isTeam1 =
              playerInteractionEvent.playerTeam === matchData.team1Name;

            return (
              <TimelineItem
                key={`interaction-${index}`}
                time={playerInteractionEvent.playerInteractionEventTime}
                playerName={playerInteractionEvent.playerName}
                playerHero={playerInteractionEvent.playerHero}
                eventType={playerInteractionEvent.playerInteractionEventType}
                isTeam1={isTeam1}
                isSelected={selectedEventId === playerInteractionEvent.id}
                targetName={playerInteractionEvent.otherPlayerName}
                teamName={playerInteractionEvent.playerTeam}
                onClick={() => setSelectedEventId(playerInteractionEvent.id)}
                onMouseLeave={() => setSelectedEventId(null)}
              />
            );
          } else if (event.type === "playerEvent" && event.playerEvent) {
            const { playerEvent } = event;
            const isTeam1 = playerEvent.playerTeam === matchData.team1Name;

            return (
              <TimelineItem
                key={`player-${index}`}
                time={playerEvent.playerEventTime}
                playerName={playerEvent.playerName}
                playerHero={playerEvent.playerHero}
                eventType={playerEvent.playerEventType}
                isTeam1={isTeam1}
                isSelected={selectedEventId === playerEvent.id}
                teamName={playerEvent.playerTeam}
                onClick={() => setSelectedEventId(playerEvent.id)}
                onMouseLeave={() => setSelectedEventId(null)}
              />
            );
          } else if (event.type === "ultimateEvent" && event.ultimateEvent) {
            const { ultimateEvent } = event;
            const isTeam1 = ultimateEvent.playerTeam === matchData.team1Name;

            return (
              <TimelineItem
                key={`ultimate-${index}`}
                time={ultimateEvent.ultimateStartTime}
                playerName={ultimateEvent.playerName}
                playerHero={ultimateEvent.playerHero}
                eventType="ultimate"
                isTeam1={isTeam1}
                isSelected={selectedEventId === ultimateEvent.id}
                hero={ultimateEvent.playerHero}
                teamName={ultimateEvent.playerTeam}
                onClick={() => setSelectedEventId(ultimateEvent.id)}
                onMouseLeave={() => setSelectedEventId(null)}
              />
            );
          }
          return null;
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-xs">
          No events found for this match
        </div>
      )}
    </div>
  );
};
