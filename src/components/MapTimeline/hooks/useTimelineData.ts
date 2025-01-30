import {useWombatDataManager, useWombatDataNode} from 'wombat-data-framework';
import {MatchStart, MapTimes, PlayerEvent, PlayerInteractionEvent, UltimateEvent, RoundTimes, TimelineData, TeamAdvantageData} from '../types/timeline.types';

export const useTimelineData = (matchId: string): TimelineData | null => {
  const dataManager = useWombatDataManager();
  const tick = dataManager.getTick();

  console.log('Fetching data for matchId:', matchId, 'tick:', tick);

  const [matchStartNode] = useWombatDataNode('match_start_object_store');
  const [playerEventsNode] = useWombatDataNode('player_events');
  const [interactionEventsNode] = useWombatDataNode('player_interaction_events');
  const [roundTimesNode] = useWombatDataNode('round_times');
  const [ultimateEventsNode] = useWombatDataNode('ultimate_events');
  const [mapTimesNode] = useWombatDataNode('map_times');
  const [ultimateAdvantageNode] = useWombatDataNode('team_ultimate_advantage');
  const [aliveAdvantageNode] = useWombatDataNode('team_alive_advantage');

  if (!matchStartNode || !playerEventsNode || !interactionEventsNode || !roundTimesNode || !ultimateEventsNode || !mapTimesNode || !ultimateAdvantageNode || !aliveAdvantageNode) {
    return {
      team1Name: '',
      team2Name: '',
      team1EventsByPlayer: {},
      team2EventsByPlayer: {},
      team1InteractionEventsByPlayer: {},
      team2InteractionEventsByPlayer: {},
      team1UltimateEventsByPlayer: {},
      team2UltimateEventsByPlayer: {},
      mapStartTime: 0,
      mapEndTime: 0,
      roundTimes: [],
      eventTimes: [],
      ultimateAdvantageData: [],
      aliveAdvantageData: [],
    };
  }

  const matchStart = matchStartNode.getOutput<MatchStart[]>().find((row) => row['matchId'] === matchId);
  if (!matchStart) {
    console.error(
      `No match start data found for map ${matchId}. Available matchIds:`,
      matchStartNode.getOutput<MatchStart[]>().map((row) => row['matchId']),
    );
    return null;
  }

  const mapTimes = mapTimesNode.getOutput<MapTimes[]>().find((row) => row['matchId'] === matchId);
  if (!mapTimes) {
    console.error(
      `No map times data found for map ${matchId}. Available matchIds:`,
      mapTimesNode.getOutput<MapTimes[]>().map((row) => row['matchId']),
    );
    return null;
  }

  console.log('Found match data:', {matchStart, mapTimes});

  // Log raw event data before filtering

  console.log('Event counts before filtering:', {
    playerEvents: playerEventsNode.getOutput<PlayerEvent[]>().length,
    interactionEvents: interactionEventsNode.getOutput<PlayerInteractionEvent[]>().length,
    ultimateEvents: ultimateEventsNode.getOutput<UltimateEvent[]>().length,
    roundTimes: roundTimesNode.getOutput<RoundTimes[]>().length,
  });

  // Filter events for this map
  const playerEvents = playerEventsNode.getOutput<PlayerEvent[]>().filter((row) => row['matchId'] === matchId);
  const interactionEvents = interactionEventsNode.getOutput<PlayerInteractionEvent[]>().filter((row) => row['matchId'] === matchId);
  const ultimateEvents = ultimateEventsNode.getOutput<UltimateEvent[]>().filter((row) => row['matchId'] === matchId);
  const roundTimes = roundTimesNode.getOutput<RoundTimes[]>().filter((row) => row['matchId'] === matchId);

  console.log('Event counts after filtering for matchId:', {
    playerEvents: playerEvents.length,
    interactionEvents: interactionEvents.length,
    ultimateEvents: ultimateEvents.length,
    roundTimes: roundTimes.length,
  });

  const {team1Name, team2Name} = matchStart;

  // Log team names and event counts per team
  console.log('Team names:', {team1Name, team2Name});

  const team1Events = playerEvents.filter((row) => row.playerTeam === team1Name);
  const team2Events = playerEvents.filter((row) => row.playerTeam === team2Name);

  console.log('Events per team:', {
    team1Events: team1Events.length,
    team2Events: team2Events.length,
  });

  const team1InteractionEvents = interactionEvents.filter((row) => row.playerTeam === team1Name);
  const team2InteractionEvents = interactionEvents.filter((row) => row.playerTeam === team2Name);
  const team1UltimateEvents = ultimateEvents.filter((row) => row.playerTeam === team1Name);
  const team2UltimateEvents = ultimateEvents.filter((row) => row.playerTeam === team2Name);

  const eventTimes = [...playerEvents.map((row) => row.playerEventTime), ...interactionEvents.map((row) => row.playerInteractionEventTime)];

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

  const ultimateAdvantageData = ultimateAdvantageNode.getOutput<TeamAdvantageData[]>().filter((row) => row['matchId'] as number === matchId);
  // TODO: fix this type
  const aliveAdvantageData = aliveAdvantageNode.getOutput<TeamAdvantageData[]>().filter((row) => (row['matchId'] as number) === matchId);
  return {
    team1Name,
    team2Name,
    team1EventsByPlayer: groupEventsByPlayer(team1Events),
    team2EventsByPlayer: groupEventsByPlayer(team2Events),
    team1InteractionEventsByPlayer: groupEventsByPlayer(team1InteractionEvents),
    team2InteractionEventsByPlayer: groupEventsByPlayer(team2InteractionEvents),
    team1UltimateEventsByPlayer: groupEventsByPlayer(team1UltimateEvents),
    team2UltimateEventsByPlayer: groupEventsByPlayer(team2UltimateEvents),
    mapStartTime: mapTimes.mapStartTime,
    mapEndTime: mapTimes.mapEndTime,
    roundTimes,
    eventTimes,
    ultimateAdvantageData,
    aliveAdvantageData,
  };
};
