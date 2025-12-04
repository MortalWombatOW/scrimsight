import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { formatDuration, getRoleFromHero } from "@library";
import { useMatch } from "../../hooks/useMatch";
import {
  MapTimes,
  MatchMetadata,
  RoundTimes,
  Teamfight,
  UltimateEvent,
} from "../../data/types";

interface PlayerEventWithType {
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  matchTime: number;
  eventType: string;
}

interface PlayerInteractionEvent {
  id: string;
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  otherPlayerName: string;
  playerInteractionEventTime: number;
  playerInteractionEventType: string;
  direction: 'incoming' | 'outgoing';
}

interface TimeRange {
  start: number;
  end: number;
}

export interface TimelineEvent {
  id: string;
  type: "playerEvent" | "playerInteractionEvent" | "ultimateEvent";
  time: number;
  playerName: string;
  teamName: string;
  playerHero: string;
  playerRole: string;
  isTeam1: boolean;
  playerEvent?: PlayerEventWithType;
  playerInteractionEvent?: PlayerInteractionEvent;
  ultimateEvent?: UltimateEvent;
}

// A grouped structure that collects events by approximate time + team
interface GroupedTimelineEvents {
  time: number;
  teamName: string;
  isTeam1: boolean;
  events: TimelineEvent[];
}

interface TimelineContextType {
  matchId: string;
  timeRangeLabel: string;
  currentTimeRange: TimeRange;
  setCurrentTimeRange: (timeRange: TimeRange) => void;
  selectedEventId: string | null;
  setSelectedEventId: (eventId: string | null) => void;
  loadedData?: {
    matchData: MatchMetadata;
    mapTime: MapTimes;
    roundTimes: RoundTimes[];
    teamfights: Teamfight[];
    events: TimelineEvent[];
    groupedEvents: GroupedTimelineEvents[];
    roundEndEvents: import("../../data/types").RoundEndLogEvent[];
  };
}

const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

interface TimelineProviderProps {
  children: ReactNode;
  matchId: string;
}

export const TimelineProvider = ({
  children,
  matchId,
}: TimelineProviderProps): ReactNode => {
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>({
    start: 0,
    end: 100,
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const match = useMatch(matchId);

  const currentMatchData = match?.metadata;
  const currentMapTime = match?.mapTimes;
  const currentRoundTimes = match?.roundTimes || [];
  const currentTeamfights = match?.teamfights || [];
  const currentRoundEndEvents = match?.events.roundEnd || [];

  // Calculate player lives from hero spawn and kill events (for future use)
  // Commented out as it's not currently used but may be needed for timeline features
  // const playerLives = useMemo(() => { ... }, [match, matchId, currentMapTime]);

  // Convert events to PlayerEventWithType format
  const allPlayerEvents = useMemo(() => {
    if (!match) return [];
    const events: PlayerEventWithType[] = [];

    for (const spawn of match.events.heroSpawn) {
      events.push({
        matchId: spawn.matchId,
        playerName: spawn.playerName,
        playerTeam: spawn.playerTeam,
        playerHero: spawn.playerHero,
        matchTime: spawn.matchTime,
        eventType: 'heroSpawn',
      });
    }

    for (const swap of match.events.heroSwap) {
      events.push({
        matchId: swap.matchId,
        playerName: swap.playerName,
        playerTeam: swap.playerTeam,
        playerHero: swap.playerHero,
        matchTime: swap.matchTime,
        eventType: 'heroSwap',
      });
    }

    for (const assist of match.events.defensiveAssist) {
      events.push({
        matchId: assist.matchId,
        playerName: assist.playerName,
        playerTeam: assist.playerTeam,
        playerHero: assist.playerHero,
        matchTime: assist.matchTime,
        eventType: 'defensiveAssist',
      });
    }

    for (const assist of match.events.offensiveAssist) {
      events.push({
        matchId: assist.matchId,
        playerName: assist.playerName,
        playerTeam: assist.playerTeam,
        playerHero: assist.playerHero,
        matchTime: assist.matchTime,
        eventType: 'offensiveAssist',
      });
    }

    return events.sort((a, b) => a.matchTime - b.matchTime);
  }, [match]);

  const currentPlayerEvents = useMemo(
    () =>
      allPlayerEvents.filter(
        (pe) =>
          pe.matchTime >= currentTimeRange.start &&
          pe.matchTime <= currentTimeRange.end
      ),
    [allPlayerEvents, currentTimeRange]
  );

  // Convert kills to PlayerInteractionEvent format
  const allPlayerInteractionEvents = useMemo(() => {
    if (!match) return [];
    const events: PlayerInteractionEvent[] = [];

    for (const kill of match.events.kills) {
      events.push({
        id: `${kill.matchId}-${kill.matchTime}-${kill.attackerName}-kill`,
        matchId: kill.matchId,
        playerName: kill.attackerName,
        playerTeam: kill.attackerTeam,
        playerHero: kill.attackerHero,
        otherPlayerName: kill.victimName,
        playerInteractionEventTime: kill.matchTime,
        playerInteractionEventType: 'Killed player',
        direction: 'outgoing',
      });
    }

    return events.sort((a, b) => a.playerInteractionEventTime - b.playerInteractionEventTime);
  }, [match]);

  const currentPlayerInteractionEvents = useMemo(
    () =>
      allPlayerInteractionEvents.filter(
        (pie) =>
          pie.playerInteractionEventTime >= currentTimeRange.start &&
          pie.playerInteractionEventTime <= currentTimeRange.end &&
          pie.direction === "outgoing"
      ),
    [allPlayerInteractionEvents, currentTimeRange]
  );

  const allUltimateEvents = match?.ultimateEvents || [];
  const currentUltimateEvents = useMemo(
    () =>
      allUltimateEvents.filter(
        (ue) =>
          ue.ultimateStartTime >= currentTimeRange.start &&
          ue.ultimateStartTime <= currentTimeRange.end
      ),
    [allUltimateEvents, matchId, currentTimeRange]
  );

  // A nicely formatted label for the current time range
  const timeRangeLabel = useMemo(() => {
    const start = currentMapTime?.startTime;
    const end = currentMapTime?.endTime;
    if (currentTimeRange.start === start && currentTimeRange.end === end) {
      return "Entire Match";
    }
    const maybeRound = currentRoundTimes.find(
      (r) =>
        r.roundStartTime === currentTimeRange.start &&
        r.roundEndTime === currentTimeRange.end
    );
    if (maybeRound) {
      return `Round ${maybeRound.roundNumber}`;
    }
    const maybeTeamfight = currentTeamfights.find(
      (tf) =>
        tf.startTime === currentTimeRange.start &&
        tf.endTime === currentTimeRange.end
    );
    if (maybeTeamfight) {
      return `Teamfight ${maybeTeamfight.startTime} - ${maybeTeamfight.endTime}  (${maybeTeamfight.team1Kills} - ${maybeTeamfight.team2Kills})`;
    }
    return `${formatDuration(currentTimeRange.end - currentTimeRange.start)}`;
  }, [currentMapTime, currentTimeRange, currentRoundTimes, currentTeamfights]);

  // Combine all relevant events into a single array
  const events: TimelineEvent[] = useMemo(() => {
    if (!currentMatchData) {
      return [];
    }
    return [
      ...currentPlayerInteractionEvents.map((pie) => ({
        id: pie.id,
        type: "playerInteractionEvent" as const,
        time: pie.playerInteractionEventTime,
        playerInteractionEvent: pie,
        playerName: pie.playerName,
        teamName: pie.playerTeam,
        playerHero: pie.playerHero,
        playerRole: getRoleFromHero(pie.playerHero),
        isTeam1: pie.playerTeam === currentMatchData.team1Name,
      })),
      ...currentPlayerEvents.map((pe) => ({
        id: `${pe.matchId}-${pe.matchTime}-${pe.playerName}-${pe.eventType}`,
        type: "playerEvent" as const,
        time: pe.matchTime,
        playerEvent: pe,
        playerName: pe.playerName,
        teamName: pe.playerTeam,
        playerHero: pe.playerHero,
        playerRole: getRoleFromHero(pe.playerHero),
        isTeam1: pe.playerTeam === currentMatchData.team1Name,
      })),
      ...currentUltimateEvents.map((ue) => ({
        id: ue.id,
        type: "ultimateEvent" as const,
        time: ue.ultimateStartTime,
        ultimateEvent: ue,
        playerName: ue.playerName,
        teamName: ue.playerTeam,
        playerHero: ue.playerHero,
        playerRole: getRoleFromHero(ue.playerHero),
        isTeam1: ue.playerTeam === currentMatchData.team1Name,
      })),
    ].sort((a, b) => a.time - b.time);
  }, [currentPlayerInteractionEvents, currentPlayerEvents, currentUltimateEvents, currentMatchData]);

  // Create grouped events by (approximate) time + team to simplify display
  const groupedEvents: GroupedTimelineEvents[] = useMemo(() => {
    if (!events.length) return [];
    const threshold = 5; // seconds threshold to group events from the same team
    const result: GroupedTimelineEvents[] = [];

    for (const evt of events) {
      const lastGroup = result[result.length - 1];

      // If there's a group from the same team and close enough in time, add to it
      if (
        lastGroup &&
        lastGroup.isTeam1 === evt.isTeam1 &&
        Math.abs(lastGroup.time - evt.time) <= threshold
      ) {
        lastGroup.events.push(evt);
      } else {
        // Otherwise, create a new group
        result.push({
          time: evt.time,
          teamName: evt.teamName,
          isTeam1: evt.isTeam1,
          events: [evt],
        });
      }
    }
    return result;
  }, [events]);

  const dataLoaded =
    currentMatchData &&
    currentMapTime &&
    currentRoundTimes &&
    currentTeamfights &&
    typeof events !== "undefined";

  const loadedData = dataLoaded
    ? {
      matchData: currentMatchData,
      mapTime: currentMapTime,
      roundTimes: currentRoundTimes,
      teamfights: currentTeamfights,
      events,
      groupedEvents,
      roundEndEvents: currentRoundEndEvents,
    }
    : undefined;

  return (
    <TimelineContext.Provider
      value={{
        matchId,
        currentTimeRange,
        setCurrentTimeRange,
        selectedEventId,
        setSelectedEventId,
        timeRangeLabel,
        loadedData,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimelineContext = (): TimelineContextType => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error(
      "useTimelineContext must be used within a TimelineProvider"
    );
  }
  return context;
};
