import { useAtomValue } from "jotai";
import {
  MapTimes,
  mapTimesAtom,
  MatchData,
  matchDataAtom,
  PlayerEvent,
  playerEventsAtom,
  PlayerInteractionEvent,
  playerInteractionEventsAtom,
  RoundTimes,
  roundTimesAtom,
  Teamfight,
  teamfightsAtom,
  UltimateEvent,
  ultimateEventsAtom,
} from "@atoms";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { playerLivesAtom } from "@atoms/playerLivesAtom";
import { formatDuration, getRoleFromHero } from "@lib";

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
  playerEvent?: PlayerEvent;
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
    matchData: MatchData;
    mapTime: MapTimes;
    roundTimes: RoundTimes[];
    teamfights: Teamfight[];
    events: TimelineEvent[];
    groupedEvents: GroupedTimelineEvents[];
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

  const allMatchData = useAtomValue(matchDataAtom);
  const matchData = useMemo(
    () => allMatchData.find((m) => m.matchId === matchId),
    [allMatchData, matchId]
  );

  const allMapTimes = useAtomValue(mapTimesAtom);
  const mapTime = useMemo(
    () => allMapTimes.find((mt) => mt.matchId === matchId),
    [allMapTimes, matchId]
  );

  const allRoundTimes = useAtomValue(roundTimesAtom);
  const roundTimes = useMemo(
    () => allRoundTimes.filter((rt) => rt.matchId === matchId),
    [allRoundTimes, matchId]
  );

  const allTeamfights = useAtomValue(teamfightsAtom);
  const teamfights = useMemo(
    () => allTeamfights.filter((tf) => tf.matchId === matchId),
    [allTeamfights, matchId]
  );

  const allPlayerLives = useAtomValue(playerLivesAtom);
  const playerLives = useMemo(
    () => allPlayerLives.filter((pl) => pl.matchId === matchId),
    [allPlayerLives, matchId]
  );
  console.log(playerLives);

  // Filter to only the events within our current time range:
  const allPlayerEvents = useAtomValue(playerEventsAtom);
  const playerEvents = useMemo(
    () =>
      allPlayerEvents.filter(
        (pe) =>
          pe.matchId === matchId &&
          pe.playerEventTime >= currentTimeRange.start &&
          pe.playerEventTime <= currentTimeRange.end
      ),
    [allPlayerEvents, matchId, currentTimeRange]
  );

  const allPlayerInteractionEvents = useAtomValue(playerInteractionEventsAtom);
  const playerInteractionEvents = useMemo(
    () =>
      allPlayerInteractionEvents.filter(
        (pie) =>
          pie.matchId === matchId &&
          pie.playerInteractionEventTime >= currentTimeRange.start &&
          pie.playerInteractionEventTime <= currentTimeRange.end &&
          pie.direction === "outgoing"
      ),
    [allPlayerInteractionEvents, matchId, currentTimeRange]
  );

  const allUltimateEvents = useAtomValue(ultimateEventsAtom);
  const ultimateEvents = useMemo(
    () =>
      allUltimateEvents.filter(
        (ue) =>
          ue.matchId === matchId &&
          ue.ultimateStartTime >= currentTimeRange.start &&
          ue.ultimateStartTime <= currentTimeRange.end
      ),
    [allUltimateEvents, matchId, currentTimeRange]
  );

  // A nicely formatted label for the current time range
  const timeRangeLabel = useMemo(() => {
    const start = mapTime?.startTime;
    const end = mapTime?.endTime;
    if (currentTimeRange.start === start && currentTimeRange.end === end) {
      return "Entire Match";
    }
    const maybeRound = roundTimes.find(
      (r) =>
        r.roundStartTime === currentTimeRange.start &&
        r.roundEndTime === currentTimeRange.end
    );
    if (maybeRound) {
      return `Round ${maybeRound.roundNumber}`;
    }
    const maybeTeamfight = teamfights.find(
      (tf) =>
        tf.startTime === currentTimeRange.start &&
        tf.endTime === currentTimeRange.end
    );
    if (maybeTeamfight) {
      return `Teamfight ${maybeTeamfight.startTime} - ${maybeTeamfight.endTime}  (${maybeTeamfight.team1Kills} - ${maybeTeamfight.team2Kills})`;
    }
    return `${formatDuration(currentTimeRange.end - currentTimeRange.start)}`;
  }, [mapTime, currentTimeRange, roundTimes, teamfights]);

  // Combine all relevant events into a single array
  const events: TimelineEvent[] = useMemo(() => {
    if (!matchData) {
      return [];
    }
    return [
      ...playerInteractionEvents.map((pie) => ({
        id: pie.id,
        type: "playerInteractionEvent" as const,
        time: pie.playerInteractionEventTime,
        playerInteractionEvent: pie,
        playerName: pie.playerName,
        teamName: pie.playerTeam,
        playerHero: pie.playerHero,
        playerRole: getRoleFromHero(pie.playerHero),
        isTeam1: pie.playerTeam === matchData.team1Name,
      })),
      ...playerEvents.map((pe) => ({
        id: pe.id,
        type: "playerEvent" as const,
        time: pe.playerEventTime,
        playerEvent: pe,
        playerName: pe.playerName,
        teamName: pe.playerTeam,
        playerHero: pe.playerHero,
        playerRole: getRoleFromHero(pe.playerHero),
        isTeam1: pe.playerTeam === matchData.team1Name,
      })),
      ...ultimateEvents.map((ue) => ({
        id: ue.id,
        type: "ultimateEvent" as const,
        time: ue.ultimateStartTime,
        ultimateEvent: ue,
        playerName: ue.playerName,
        teamName: ue.playerTeam,
        playerHero: ue.playerHero,
        playerRole: getRoleFromHero(ue.playerHero),
        isTeam1: ue.playerTeam === matchData.team1Name,
      })),
    ].sort((a, b) => a.time - b.time);
  }, [playerInteractionEvents, playerEvents, ultimateEvents, matchData]);

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
    matchData &&
    mapTime &&
    roundTimes &&
    teamfights &&
    typeof events !== "undefined";

  const loadedData = dataLoaded
    ? {
      matchData,
      mapTime,
      roundTimes,
      teamfights,
      events,
      groupedEvents,
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
