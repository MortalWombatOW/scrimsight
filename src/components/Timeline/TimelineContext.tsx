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
} from "../../atoms";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { playerLivesAtom } from "../../atoms/playerLivesAtom";
import { formatDuration, getRoleFromHero } from "../../lib";

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
  };
}

const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined
);

interface TimelineProviderProps {
  children: ReactNode;
  matchId: string;
}

export const TimelineProvider: React.FC<TimelineProviderProps> = ({
  children,
  matchId,
}) => {
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>({
    start: 0,
    end: 100,
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const allMatchData = useAtomValue(matchDataAtom);
  const matchData = useMemo(
    () => allMatchData.find((matchData) => matchData.matchId === matchId),
    [allMatchData, matchId]
  );

  const allMapTimes = useAtomValue(mapTimesAtom);
  const mapTime = useMemo(
    () => allMapTimes.find((mapTime) => mapTime.matchId === matchId),
    [allMapTimes, matchId]
  );

  const allRoundTimes = useAtomValue(roundTimesAtom);
  const roundTimes = useMemo(
    () => allRoundTimes.filter((roundTime) => roundTime.matchId === matchId),
    [allRoundTimes, matchId]
  );

  const allTeamfights = useAtomValue(teamfightsAtom);
  const teamfights = useMemo(
    () => allTeamfights.filter((teamfight) => teamfight.matchId === matchId),
    [allTeamfights, matchId]
  );

  const allPlayerLives = useAtomValue(playerLivesAtom);
  const playerLives = useMemo(
    () => allPlayerLives.filter((playerLife) => playerLife.matchId === matchId),
    [allPlayerLives, matchId]
  );

  console.log(playerLives);

  const allPlayerEvents = useAtomValue(playerEventsAtom);
  const playerEvents = useMemo(
    () =>
      allPlayerEvents.filter(
        (playerEvent) =>
          playerEvent.matchId === matchId &&
          playerEvent.playerEventTime >= currentTimeRange.start &&
          playerEvent.playerEventTime <= currentTimeRange.end
      ),
    [allPlayerEvents, matchId, currentTimeRange]
  );

  const allPlayerInteractionEvents = useAtomValue(playerInteractionEventsAtom);
  const playerInteractionEvents = useMemo(
    () =>
      allPlayerInteractionEvents.filter(
        (playerInteractionEvent) =>
          playerInteractionEvent.matchId === matchId &&
          playerInteractionEvent.playerInteractionEventTime >=
            currentTimeRange.start &&
          playerInteractionEvent.playerInteractionEventTime <=
            currentTimeRange.end &&
          playerInteractionEvent.direction === "outgoing"
      ),
    [allPlayerInteractionEvents, matchId, currentTimeRange]
  );

  const allUltimateEvents = useAtomValue(ultimateEventsAtom);
  const ultimateEvents = useMemo(
    () =>
      allUltimateEvents.filter(
        (ultimateEvent) =>
          ultimateEvent.matchId === matchId &&
          ultimateEvent.ultimateStartTime >= currentTimeRange.start &&
          ultimateEvent.ultimateStartTime <= currentTimeRange.end
      ),
    [allUltimateEvents, matchId, currentTimeRange]
  );

  const timeRangeLabel = useMemo(() => {
    const start = mapTime?.startTime;
    const end = mapTime?.endTime;
    if (currentTimeRange.start === start && currentTimeRange.end === end) {
      return "Entire Match";
    }
    const maybeRound = roundTimes.find(
      (roundTime) =>
        roundTime.roundStartTime === currentTimeRange.start &&
        roundTime.roundEndTime === currentTimeRange.end
    );
    if (maybeRound) {
      return `Round ${maybeRound.roundNumber}`;
    }
    const maybeTeamfight = teamfights.find(
      (teamfight) =>
        teamfight.startTime === currentTimeRange.start &&
        teamfight.endTime === currentTimeRange.end
    );
    if (maybeTeamfight) {
      return `Teamfight ${maybeTeamfight.startTime} - ${maybeTeamfight.endTime} ${maybeTeamfight.team1Kills} - ${maybeTeamfight.team2Kills}`;
    }
    return `${formatDuration(currentTimeRange.end - currentTimeRange.start)}`;
  }, [mapTime, currentTimeRange]);

  const events: TimelineEvent[] = useMemo(() => {
    if (!matchData) {
      return [];
    }
    return [
      ...playerInteractionEvents.map((playerInteractionEvent) => ({
        id: playerInteractionEvent.id,
        type: "playerInteractionEvent" as const,
        time: playerInteractionEvent.playerInteractionEventTime,
        playerInteractionEvent: playerInteractionEvent,
        playerName: playerInteractionEvent.playerName,
        teamName: playerInteractionEvent.playerTeam,
        playerHero: playerInteractionEvent.playerHero,
        playerRole: getRoleFromHero(playerInteractionEvent.playerHero),
        isTeam1: playerInteractionEvent.playerTeam === matchData.team1Name,
      })),
      ...playerEvents.map((playerEvent) => ({
        id: playerEvent.id,
        type: "playerEvent" as const,
        time: playerEvent.playerEventTime,
        playerEvent: playerEvent,
        playerName: playerEvent.playerName,
        teamName: playerEvent.playerTeam,
        playerHero: playerEvent.playerHero,
        playerRole: getRoleFromHero(playerEvent.playerHero),
        isTeam1: playerEvent.playerTeam === matchData.team1Name,
      })),
      ...ultimateEvents.map((ultimateEvent) => ({
        id: ultimateEvent.id,
        type: "ultimateEvent" as const,
        time: ultimateEvent.ultimateStartTime,
        ultimateEvent: ultimateEvent,
        playerName: ultimateEvent.playerName,
        teamName: ultimateEvent.playerTeam,
        playerHero: ultimateEvent.playerHero,
        playerRole: getRoleFromHero(ultimateEvent.playerHero),
        isTeam1: ultimateEvent.playerTeam === matchData.team1Name,
      })),
    ].sort((a, b) => a.time - b.time);
  }, [playerInteractionEvents, playerEvents, ultimateEvents, matchData]);

  const dataLoaded =
    matchData &&
    mapTime &&
    roundTimes &&
    teamfights &&
    playerEvents &&
    playerInteractionEvents &&
    ultimateEvents;

  return (
    <TimelineContext.Provider
      value={{
        matchId,
        currentTimeRange,
        setCurrentTimeRange,
        selectedEventId,
        setSelectedEventId,
        timeRangeLabel,
        loadedData: dataLoaded
          ? {
              matchData,
              mapTime,
              roundTimes,
              teamfights,
              events,
            }
          : undefined,
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
