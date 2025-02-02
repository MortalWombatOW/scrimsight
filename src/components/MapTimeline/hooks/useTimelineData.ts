import { useAtom } from 'jotai';
import {
  type PlayerEvent,
  type PlayerInteractionEvent,
  type UltimateEvent,
  type RoundTimes,
  type TeamUltimateAdvantage,
  type TeamAliveAdvantage,
  matchStartExtractorAtom,
  mapTimesAtom,
  roundTimesAtom,
  playerEventsAtom,
  playerInteractionEventsAtom,
  ultimateEventsAtom,
  teamUltimateAdvantageAtom,
  teamAliveAdvantageAtom,
} from '~/atoms';

export interface TimelineData {
  team1Name: string;
  team2Name: string;
  team1EventsByPlayer: { [playerName: string]: PlayerEvent[] };
  team2EventsByPlayer: { [playerName: string]: PlayerEvent[] };
  team1InteractionEventsByPlayer: { [playerName: string]: PlayerInteractionEvent[] };
  team2InteractionEventsByPlayer: { [playerName: string]: PlayerInteractionEvent[] };
  team1UltimateEventsByPlayer: { [playerName: string]: UltimateEvent[] };
  team2UltimateEventsByPlayer: { [playerName: string]: UltimateEvent[] };
  startTime: number;
  endTime: number;
  roundTimes: RoundTimes[];
  eventTimes: number[];
  ultimateAdvantageData: TeamUltimateAdvantage[];
  aliveAdvantageData: TeamAliveAdvantage[];
}

export const useTimelineData = (matchId: string): TimelineData | null => {
  const [matchStarts] = useAtom(matchStartExtractorAtom);
  const [playerEvents] = useAtom(playerEventsAtom);
  const [interactionEvents] = useAtom(playerInteractionEventsAtom);
  const [roundTimes] = useAtom(roundTimesAtom);
  const [ultimateEvents] = useAtom(ultimateEventsAtom);
  const [mapTimes] = useAtom(mapTimesAtom);
  const [ultimateAdvantageData] = useAtom(teamUltimateAdvantageAtom);
  const [aliveAdvantageData] = useAtom(teamAliveAdvantageAtom);

  // Find match data
  const matchStart = matchStarts?.find((row) => row.matchId === matchId);
  if (!matchStart) {
    console.error(
      `No match start data found for map ${matchId}. Available matchIds:`,
      matchStarts?.map((row) => row.matchId),
    );
    return null;
  }

  const mapTime = mapTimes?.find((row) => row.matchId === matchId);
  if (!mapTime) {
    console.error(
      `No map times data found for map ${matchId}. Available matchIds:`,
      mapTimes?.map((row) => row.matchId),
    );
    return null;
  }

  // Filter events for this map
  const filteredPlayerEvents = playerEvents?.filter((row) => row.matchId === matchId) ?? [];
  const filteredInteractionEvents = interactionEvents?.filter((row) => row.matchId === matchId) ?? [];
  const filteredUltimateEvents = ultimateEvents?.filter((row) => row.matchId === matchId) ?? [];
  const filteredRoundTimes = roundTimes?.filter((row) => row.matchId === matchId) ?? [];

  const {team1Name, team2Name} = matchStart;

  const team1Events = filteredPlayerEvents.filter((row) => row.playerTeam === team1Name);
  const team2Events = filteredPlayerEvents.filter((row) => row.playerTeam === team2Name);
  const team1InteractionEvents = filteredInteractionEvents.filter((row) => row.playerTeam === team1Name);
  const team2InteractionEvents = filteredInteractionEvents.filter((row) => row.playerTeam === team2Name);
  const team1UltimateEvents = filteredUltimateEvents.filter((row) => row.playerTeam === team1Name);
  const team2UltimateEvents = filteredUltimateEvents.filter((row) => row.playerTeam === team2Name);

  const eventTimes = [
    ...filteredPlayerEvents.map((row) => row.playerEventTime),
    ...filteredInteractionEvents.map((row) => row.playerInteractionEventTime)
  ];

  const groupEventsByPlayer = <T extends {playerName: string}>(events: T[]): {[playerName: string]: T[]} => {
    const eventsByPlayer: {[playerName: string]: T[]} = {};
    for (const event of events) {
      const playerName = event.playerName;
      if (!eventsByPlayer[playerName]) {
        eventsByPlayer[playerName] = [];
      }
      eventsByPlayer[playerName].push(event);
    }
    return eventsByPlayer;
  };

  const filteredUltimateAdvantageData = ultimateAdvantageData?.filter((row) => row.matchId === matchId) ?? [];
  const filteredAliveAdvantageData = aliveAdvantageData?.filter((row) => row.matchId === matchId) ?? [];

  return {
    team1Name,
    team2Name,
    team1EventsByPlayer: groupEventsByPlayer(team1Events),
    team2EventsByPlayer: groupEventsByPlayer(team2Events),
    team1InteractionEventsByPlayer: groupEventsByPlayer(team1InteractionEvents),
    team2InteractionEventsByPlayer: groupEventsByPlayer(team2InteractionEvents),
    team1UltimateEventsByPlayer: groupEventsByPlayer(team1UltimateEvents),
    team2UltimateEventsByPlayer: groupEventsByPlayer(team2UltimateEvents),
    startTime: mapTime.startTime,
    endTime: mapTime.endTime,
    roundTimes: filteredRoundTimes,
    eventTimes,
    ultimateAdvantageData: filteredUltimateAdvantageData,
    aliveAdvantageData: filteredAliveAdvantageData,
  };
};
