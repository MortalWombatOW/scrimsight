import type { ReactNode } from "react";
import { useTimelineContext } from "@components/Timeline/TimelineContext";
import { getHeroImage } from "@lib";

// Event type display text mapping (Simplified for kill feed)
const getEventDisplayText = (eventType: string): string => {
  // const eventMap: Record<string, string> = { // Removed unused map
  //   // Player events
  //   death: "Died",
  //   respawn: "Respawned",
  //   swap: "Swapped Hero",
  //   // position: "Changed Position", // Position changes likely too noisy for kill feed
  //
  //   // Ultimate events - handled separately
  //   // Interactions (elimination, assist) handled separately
  // };

  // Simple check for known non-interaction/non-ultimate types
  const lowerEventType = eventType.toLowerCase();
  if (lowerEventType.includes("death")) return "Died";
  if (lowerEventType.includes("respawn")) return "Respawned";
  if (lowerEventType.includes("swap")) return "Swapped Hero";

  // Default or unmapped type (should ideally not happen often in kill feed context)
  return eventType;
};

// --- Icons ---

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3" // Thicker stroke for visibility
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-1 inline-block"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10" // Slightly smaller
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-1 inline-block"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

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
    className="mr-1 inline-block" // Use inline-block
  >
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const PlayerHeroDisplay = ({
  name,
  hero,
  isTeam1,
}: {
  name: string;
  hero: string;
  isTeam1: boolean;
}) => {
  // Added null check for hero
  const heroImage = getHeroImage(hero);
  return (
    <span className="inline-flex items-center">
      <span
        className={`font-medium text-xs ${
          isTeam1 ? "text-blue-400" : "text-red-400"
        }`}
      >
        {name}
      </span>
      {heroImage && ( // Conditionally render image
        <img
          src={heroImage}
          alt={hero}
          className="w-4 h-4 ml-1 inline-block" // Use inline-block
        />
      )}
    </span>
  );
};

// Define props interface for TimelineItem
interface TimelineItemProps {
  playerName: string;
  playerHero: string;
  eventType: string;
  isTeam1: boolean;
  isSelected: boolean;
  targetName?: string; // Optional
  targetHero?: string; // Optional
  // We don't need otherPlayerHero in the props anymore as we're handling it differently
  onClick: () => void;
  onMouseLeave: () => void;
}

const TimelineItem = ({
  playerName,
  playerHero,
  eventType,
  isTeam1,
  isSelected,
  targetName,
  targetHero,
  // otherPlayerHero removed as it's not needed
  onClick,
  onMouseLeave,
}: TimelineItemProps): ReactNode => {
  // Use the interface
  const lowerEventType = eventType.toLowerCase();
  const isElimination =
    lowerEventType.includes("elimination") || lowerEventType.includes("killed");
  const isAssist = lowerEventType.includes("assist");
  const isUltimate = lowerEventType.includes("ultimate");
  const isDeath =
    lowerEventType.includes("death") || lowerEventType.includes("died");
  const isSwap = lowerEventType.includes("swap");
  const isDamage = lowerEventType.includes("damage");
  const isHealing = lowerEventType.includes("heal");
  const isResurrect = lowerEventType.includes("resurrect");
  const isDemech = lowerEventType.includes("demech");
  const isRemech = lowerEventType.includes("remech");

  // Determine target player's team (assuming targetName exists for elim/assist)
  // For damage/healing events between teammates, this needs to be adjusted
  // For now, we'll assume targets are on the opposite team for eliminations
  // and on the same team for healing
  let targetIsTeam1 = !isTeam1; // Default: target is on the opposite team

  // For healing events, targets are typically on the same team
  if (isHealing || isResurrect) {
    targetIsTeam1 = isTeam1;
  }

  const renderContent = () => {
    if (isElimination && targetName && targetHero) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <ArrowRightIcon />
          <PlayerHeroDisplay
            name={targetName}
            hero={targetHero}
            isTeam1={targetIsTeam1}
          />
        </>
      );
    }
    if (isAssist && targetName) {
      // Victim hero might not be available for assists, handle gracefully
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <PlusIcon />
          <span
            className={`font-medium text-xs ${
              targetIsTeam1 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {targetName}
          </span>
          {targetHero &&
          getHeroImage(targetHero) && ( // Check if image exists
            <img
              src={getHeroImage(targetHero)}
              alt={targetHero}
              className="w-4 h-4 ml-1 inline-block"
            />
          )}
        </>
      );
    }
    if (isUltimate) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <ZapIcon />
          <span className="text-xs ml-1">Ultimate ({playerHero})</span>
        </>
      );
    }
    if (isDeath || isSwap) {
      const displayText = getEventDisplayText(eventType);
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <span className="text-xs ml-1">{displayText}</span>
        </>
      );
    }

    // Handle damage events
    if (isDamage && targetName) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <span className="text-xs ml-1">→ Damage →</span>
          <span
            className={`font-medium text-xs ${
              targetIsTeam1 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {targetName}
          </span>
        </>
      );
    }

    // Handle healing events
    if (isHealing && targetName) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <span className="text-xs ml-1">→ Healing →</span>
          <span
            className={`font-medium text-xs ${
              !targetIsTeam1 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {targetName}
          </span>
        </>
      );
    }

    // Handle resurrect events
    if (isResurrect && targetName) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <span className="text-xs ml-1">→ Resurrected →</span>
          <span
            className={`font-medium text-xs ${
              !targetIsTeam1 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {targetName}
          </span>
        </>
      );
    }

    // Handle demech events
    if (isDemech && targetName) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <span className="text-xs ml-1">was demeched</span>
        </>
      );
    }

    // Handle remech events
    if (isRemech) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <span className="text-xs ml-1">called mech</span>
        </>
      );
    }

    // Fallback for other event types
    if (targetName) {
      return (
        <>
          <PlayerHeroDisplay
            name={playerName}
            hero={playerHero}
            isTeam1={isTeam1}
          />
          <span className="text-xs ml-1">{eventType}</span>
          <span
            className={`font-medium text-xs ml-1 ${
              targetIsTeam1 ? "text-blue-400" : "text-red-400"
            }`}
          >
            {targetName}
          </span>
        </>
      );
    }

    // For any other event with no target
    return (
      <>
        <PlayerHeroDisplay
          name={playerName}
          hero={playerHero}
          isTeam1={isTeam1}
        />
        <span className="text-xs ml-1">{eventType}</span>
      </>
    );
  };

  const content = renderContent();
  if (!content) return null; // Don't render the div if no content

  return (
    <div
      className={`
        py-1 px-2 text-center text-xs border-b border-gray-800 last:border-0
        ${
    isSelected ? "bg-base-300" : "bg-base-100"
    } // Adjusted background colors
        hover:bg-base-300 transition-all duration-150
      `}
      onMouseEnter={onClick}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </div>
  );
};

export const TimelineEvents = (): ReactNode => {
  const {
    loadedData,
    selectedEventId,
    setSelectedEventId,
  } = useTimelineContext();

  if (!loadedData) {
    // Added return statement for the loading indicator JSX
    return (
      <div className="flex justify-center items-center h-[400px]">
        {" "}
        {/* Ensure loading takes height */}
        <div className="loading loading-dots"></div>
      </div>
    );
  }

  const { matchData, events }: { matchData: any; events: any[] } = loadedData;

  return (
    // Removed outer card padding, applying directly to children if needed
    <div className="bg-base-100 shadow-md rounded-lg overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto bg-base-100">
        {events.map((event, index) => {
          if (
            event.type === "playerInteractionEvent" &&
            event.playerInteractionEvent
          ) {
            const { playerInteractionEvent: p } = event; // Alias for brevity
            const isTeam1 = p.playerTeam === matchData.team1Name;
            // *** Need targetHero for eliminations! Assuming it exists on the event ***
            // *** If not, this needs adjustment based on available data ***
            // For interaction events, we need to handle the target hero
            // Since otherPlayerHero is not in the interface, we'll use a workaround
            // by checking if the event is a kill event and setting the target hero accordingly
            let targetHero = "Unknown";

            // For kill events, the target hero should be available from the event
            if (p.playerInteractionEventType.toLowerCase().includes("killed")) {
              // Try to find the hero from the events array for the target player
              const targetEvent = events.find(
                (e) =>
                  e.playerName === p.otherPlayerName &&
                  e.type === "playerEvent" &&
                  e.playerEvent?.playerEventType.toLowerCase().includes("death")
              );

              if (targetEvent) {
                targetHero = targetEvent.playerHero;
              }
            } else {
              // For other interaction events, use the player's hero as fallback
              targetHero = p.playerHero;
            }

            return (
              <TimelineItem
                key={`interaction-${p.id || index}`} // Use ID if available
                // time={p.playerInteractionEventTime} // Time removed
                playerName={p.playerName}
                playerHero={p.playerHero}
                eventType={p.playerInteractionEventType}
                isTeam1={isTeam1}
                isSelected={selectedEventId === p.id}
                targetName={p.otherPlayerName}
                targetHero={targetHero} // Pass target hero
                // otherPlayerHero removed as it's not needed
                onClick={() => setSelectedEventId(p.id)}
                onMouseLeave={() => setSelectedEventId(null)}
              />
            );
          }
          // Player Event (Death, Swap)
          else if (event.type === "playerEvent" && event.playerEvent) {
            const { playerEvent: p } = event;
            const isTeam1 = p.playerTeam === matchData.team1Name;

            return (
              <TimelineItem
                key={`player-${p.id || index}`}
                // time={p.playerEventTime} // Time removed
                playerName={p.playerName}
                playerHero={p.playerHero}
                eventType={p.playerEventType}
                isTeam1={isTeam1}
                isSelected={selectedEventId === p.id}
                // No targetName/targetHero for these events
                onClick={() => setSelectedEventId(p.id)}
                onMouseLeave={() => setSelectedEventId(null)}
              />
            );
          }
          // Ultimate Event
          else if (event.type === "ultimateEvent" && event.ultimateEvent) {
            const { ultimateEvent: p } = event;
            const isTeam1 = p.playerTeam === matchData.team1Name;

            return (
              <TimelineItem
                key={`ultimate-${p.id || index}`}
                // time={p.ultimateStartTime} // Time removed
                playerName={p.playerName}
                playerHero={p.playerHero}
                eventType="ultimate" // Standardized type
                isTeam1={isTeam1}
                isSelected={selectedEventId === p.id}
                // No targetName/targetHero needed here
                onClick={() => setSelectedEventId(p.id)}
                onMouseLeave={() => setSelectedEventId(null)}
              />
            );
          }
          return null; // Should not happen with pre-filtering
        })}
        {events.length === 0 && (
          <div className="text-center py-4 text-base-500 text-xs px-2">
            No relevant events found for kill feed.
          </div>
        )}
      </div>
    </div>
  );
};
