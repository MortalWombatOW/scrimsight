import {useMemo} from 'react';
import {useDataManager} from '../../../WombatDataFramework/DataContext';
import {
  MatchStart,
  MapTimes,
  PlayerEvent,
  PlayerInteractionEvent,
  UltimateEvent,
  RoundTimes,
  UltimateAdvantageData,
} from '../types/timeline.types';

export interface TimelineData {
  team1Name: string;
  team2Name: string;
  team1EventsByPlayer: {[playerName: string]: PlayerEvent[]};
  team2EventsByPlayer: {[playerName: string]: PlayerEvent[]};
  team1InteractionEventsByPlayer: {[playerName: string]: PlayerInteractionEvent[]};
  team2InteractionEventsByPlayer: {[playerName: string]: PlayerInteractionEvent[]};
  team1UltimateEventsByPlayer: {[playerName: string]: UltimateEvent[]};
  team2UltimateEventsByPlayer: {[playerName: string]: UltimateEvent[]};
  mapStartTime: number;
  mapEndTime: number;
  roundTimes: RoundTimes[];
  eventTimes: number[];
  ultimateAdvantageData: UltimateAdvantageData[];
}

export const useTimelineData = (mapId: number): TimelineData | null => {
  const dataManager = useDataManager();
  const tick = dataManager.getTick();

  return useMemo(() => {
    console.log('Fetching data for mapId:', mapId, 'tick:', tick);

    // Check if all required outputs exist
    const outputs = {
      matchStart: dataManager.hasNodeOutput('match_start_object_store'),
      playerEvents: dataManager.hasNodeOutput('player_events'),
      interactionEvents: dataManager.hasNodeOutput('player_interaction_events'),
      roundTimes: dataManager.hasNodeOutput('round_times'),
      ultimateEvents: dataManager.hasNodeOutput('ultimate_events'),
      mapTimes: dataManager.hasNodeOutput('map_times'),
      playerStats: dataManager.hasNodeOutput('player_stat_expanded'),
    };
    console.log('Available outputs:', outputs);

    // Add a delay before checking outputs
    const missingOutputs = Object.entries(outputs)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingOutputs.length > 0) {
      console.log('Waiting for outputs:', missingOutputs);
      return null;
    }

    // Check if the outputs have data
    const outputData = {
      matchStart: dataManager.getNodeOutput('match_start_object_store'),
      playerEvents: dataManager.getNodeOutput('player_events'),
      interactionEvents: dataManager.getNodeOutput('player_interaction_events'),
      roundTimes: dataManager.getNodeOutput('round_times'),
      ultimateEvents: dataManager.getNodeOutput('ultimate_events'),
      mapTimes: dataManager.getNodeOutput('map_times'),
    };

    // Check if any of the outputs are empty arrays
    const emptyOutputs = Object.entries(outputData)
      .filter(([_, value]) => Array.isArray(value) && value.length === 0)
      .map(([key]) => key);

    if (emptyOutputs.length > 0) {
      console.log('Waiting for data in outputs:', emptyOutputs);
      return null;
    }

    console.log('All outputs have data:', {
      matchStartLength: outputData.matchStart.length,
      playerEventsLength: outputData.playerEvents.length,
      interactionEventsLength: outputData.interactionEvents.length,
      roundTimesLength: outputData.roundTimes.length,
      ultimateEventsLength: outputData.ultimateEvents.length,
      mapTimesLength: outputData.mapTimes.length,
    });

    const matchStart = outputData.matchStart.find((row) => row['mapId'] === mapId) as MatchStart | undefined;
    if (!matchStart) {
      console.error(`No match start data found for map ${mapId}. Available mapIds:`, 
        outputData.matchStart.map(row => row['mapId'])
      );
      return null;
    }

    const mapTimes = outputData.mapTimes.find((row) => row['mapId'] === mapId) as MapTimes | undefined;
    if (!mapTimes) {
      console.error(`No map times data found for map ${mapId}. Available mapIds:`, 
        outputData.mapTimes.map(row => row['mapId'])
      );
      return null;
    }

    console.log('Found match data:', { matchStart, mapTimes });

    // Log raw event data before filtering
    const allPlayerEvents = outputData.playerEvents;
    const allInteractionEvents = outputData.interactionEvents;
    const allUltimateEvents = outputData.ultimateEvents;
    const allRoundTimes = outputData.roundTimes;

    console.log('Event counts before filtering:', {
      playerEvents: allPlayerEvents.length,
      interactionEvents: allInteractionEvents.length,
      ultimateEvents: allUltimateEvents.length,
      roundTimes: allRoundTimes.length,
    });

    // Filter events for this map
    const playerEvents = allPlayerEvents.filter((row) => row['mapId'] === mapId) as PlayerEvent[];
    const interactionEvents = allInteractionEvents.filter((row) => row['mapId'] === mapId) as PlayerInteractionEvent[];
    const ultimateEvents = allUltimateEvents.filter((row) => row['mapId'] === mapId) as UltimateEvent[];
    const roundTimes = allRoundTimes.filter((row) => row['mapId'] === mapId) as RoundTimes[];

    console.log('Event counts after filtering for mapId:', {
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

    const eventTimes = [
      ...playerEvents.map((row) => row.playerEventTime),
      ...interactionEvents.map((row) => row.playerInteractionEventTime),
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

    // Add ultimate advantage data
    const ultimateAdvantageData = dataManager.hasNodeOutput('team_ultimate_advantage') 
      ? dataManager.getNodeOutput('team_ultimate_advantage')
          .filter(row => row['mapId'] === mapId)
          .map(row => ({
            matchTime: row['matchTime'],
            team1ChargedUltimateCount: row['team1ChargedUltimateCount'],
            team2ChargedUltimateCount: row['team2ChargedUltimateCount'],
            ultimateAdvantageDiff: row['ultimateAdvantageDiff']
          })) as UltimateAdvantageData[]
      : [];

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
    };
  }, [dataManager, mapId, tick]);
}; 