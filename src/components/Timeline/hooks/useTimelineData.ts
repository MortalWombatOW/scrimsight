import { useMemo } from 'react';
import { MapTimes } from '../../../atoms/mapTimesAtom';
import { PlayerEvent } from '../../../atoms/derived_events/playerEventsAtom';
import { PlayerInteractionEvent } from '../../../atoms/derived_events/playerInteractionEventsAtom';

// Interface for timeline event object
export interface TimelineEvent {
  id: string;
  time: number;
  type: string;
  playerName?: string;
  playerTeam?: string;
  playerHero?: string;
  relatedEvents?: string[];
  relatedPlayerName?: string;
  relatedPlayerTeam?: string;
  relatedPlayerHero?: string;
  metadata?: Record<string, any>;
}

// Interface for filter options
export interface TimelineFilters {
  players: string[];
  teams: string[];
  eventTypes: string[];
  timeRange: { start: number; end: number };
}

// Interface for processed timeline data
export interface TimelineData {
  events: TimelineEvent[];
  connections: Array<{ source: string; target: string; type: string }>;
  playerLanes: Array<{ playerName: string; team: string; hero: string }>;
  mapInfo: {
    matchId: string;
    startTime: number;
    endTime: number;
    duration: number;
  };
}

/**
 * Custom hook for processing timeline data from atoms
 */
export function useTimelineData(
  mapTimes: MapTimes,
  playerEvents: PlayerEvent[],
  playerInteractions: PlayerInteractionEvent[],
  filters: TimelineFilters
) {

  // Process all events
  const allEvents = useMemo(() => {
    return [
      ...processPlayerEvents(playerEvents),
      ...processPlayerInteractionEvents(playerInteractions),
    ];
  }, [playerEvents, playerInteractions]);

  // Extract unique players from events
  const players = useMemo(() => {
    const playerSet = new Set<string>();
    
    playerEvents.forEach(event => {
      playerSet.add(event.playerName);
    });
    
    playerInteractions.forEach(event => {
      playerSet.add(event.playerName);
      if (event.otherPlayerName) {
        playerSet.add(event.otherPlayerName);
      }
    });
    
    return Array.from(playerSet).sort();
  }, [playerEvents, playerInteractions]);

  // Extract unique teams from events
  const teams = useMemo(() => {
    const teamSet = new Set<string>();
    
    playerEvents.forEach(event => {
      teamSet.add(event.playerTeam);
    });
    
    playerInteractions.forEach(event => {
      teamSet.add(event.playerTeam);
    });
    
    return Array.from(teamSet).sort();
  }, [playerEvents, playerInteractions]);

  // Extract unique event types
  const eventTypes = useMemo(() => {
    const typeSet = new Set<string>();
    
    playerEvents.forEach(event => {
      typeSet.add(event.playerEventType);
    });
    
    playerInteractions.forEach(event => {
      typeSet.add(event.playerInteractionEventType);
    });
    
    return Array.from(typeSet).sort();
  }, [playerEvents, playerInteractions]);

  // Determine global time range
  const timeRange = useMemo(() => {
    if (!mapTimes) return { start: 0, end: 0 };
    return { start: mapTimes.startTime, end: mapTimes.endTime };
  }, [mapTimes]);

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Filter by player
      if (filters.players.length > 0 && 
          !filters.players.includes(event.playerName || '') &&
          !filters.players.includes(event.relatedPlayerName || '')) {
        return false;
      }
      
      // Filter by team
      if (filters.teams.length > 0 && 
          !filters.teams.includes(event.playerTeam || '') &&
          !filters.teams.includes(event.relatedPlayerTeam || '')) {
        return false;
      }
      
      // Filter by event type
      if (filters.eventTypes.length > 0 && 
          !filters.eventTypes.includes(event.type)) {
        return false;
      }
      
      // Filter by time range
      if (event.time < filters.timeRange.start || event.time > filters.timeRange.end) {
        return false;
      }
      
      return true;
    });
  }, [allEvents, filters]);

  // Create connections between related events
  const connections = useMemo(() => {
    const result: Array<{ source: string; target: string; type: string }> = [];
    
    // Map event IDs to their indices for quick lookup
    const eventMap = new Map<string, TimelineEvent>();
    filteredEvents.forEach(event => {
      eventMap.set(event.id, event);
    });
    
    // Create connections between related events
    filteredEvents.forEach(event => {
      if (event.relatedEvents && event.relatedEvents.length > 0) {
        event.relatedEvents.forEach(targetId => {
          if (eventMap.has(targetId)) {
            result.push({
              source: event.id,
              target: targetId,
              type: event.type
            });
          }
        });
      }
    });
    
    return result;
  }, [filteredEvents]);

  // Create player lanes for visualization
  const playerLanes = useMemo(() => {
    const uniquePlayers = new Map<string, { playerName: string; team: string; hero: string }>();
    
    // Add players from filtered events
    allEvents.forEach(event => {
      if (event.playerName && event.playerTeam) {
        uniquePlayers.set(event.playerName, {
          playerName: event.playerName,
          team: event.playerTeam,
          hero: event.playerHero || ''
        });
      }
      
      if (event.relatedPlayerName && event.relatedPlayerTeam) {
        uniquePlayers.set(event.relatedPlayerName, {
          playerName: event.relatedPlayerName,
          team: event.relatedPlayerTeam,
          hero: event.relatedPlayerHero || ''
        });
      }
    });
    
    // Sort by team and then player name
    return Array.from(uniquePlayers.values()).sort((a, b) => {
      if (a.team !== b.team) return a.team.localeCompare(b.team);
      return a.playerName.localeCompare(b.playerName);
    });
  }, [allEvents]);

  // Build the final timeline data object
  const timelineData: TimelineData = useMemo(() => {
    // Use mapTimes for overall info
    const mapInfo = mapTimes || {
      matchId: '',
      startTime: 0,
      endTime: 0,
      duration: 0
    };
    
    return {
      events: filteredEvents,
      connections,
      playerLanes,
      mapInfo
    };
  }, [filteredEvents, connections, playerLanes, mapTimes]);

  return {
    timelineData,
    players,
    teams,
    eventTypes,
    timeRange
  };
}

/**
 * Helper function to convert player events to timeline events
 */
function processPlayerEvents(events: PlayerEvent[]): TimelineEvent[] {
  // Keep a counter for events with the same basic identifiers
  const eventCounts = new Map<string, number>();
  
  return events.map(event => {
    // Create a base key to track duplicates
    const baseKey = `${event.matchId}_${event.playerName}_${event.playerEventType}_${event.playerEventTime}`;
    
    // Get current count or initialize to 0
    const count = eventCounts.get(baseKey) || 0;
    // Increment for next time
    eventCounts.set(baseKey, count + 1);
    
    // Add the counter to ensure uniqueness
    const id = `player_${baseKey}_${count}`;
    
    return {
      id,
      time: event.playerEventTime,
      type: event.playerEventType,
      playerName: event.playerName,
      playerTeam: event.playerTeam,
      playerHero: event.playerHero,
      metadata: { raw: event }
    };
  });
}

/**
 * Helper function to convert player interaction events to timeline events
 */
function processPlayerInteractionEvents(events: PlayerInteractionEvent[]): TimelineEvent[] {
  // Keep a counter for events with the same basic identifiers
  const eventCounts = new Map<string, number>();
  
  return events.map(event => {
    // Create a base key to track duplicates
    const baseKey = `${event.matchId}_${event.playerName}_${event.playerInteractionEventType}_${event.playerInteractionEventTime}`;
    const relatedBaseKey = `${event.matchId}_${event.otherPlayerName}_${event.playerInteractionEventType}_${event.playerInteractionEventTime}`;
    
    // Get current count or initialize to 0
    const count = eventCounts.get(baseKey) || 0;
    const relatedCount = eventCounts.get(relatedBaseKey) || 0;
    
    // Increment for next time
    eventCounts.set(baseKey, count + 1);
    eventCounts.set(relatedBaseKey, relatedCount + 1);
    
    // Add the counter to ensure uniqueness
    const id = `interaction_${baseKey}_${count}`;
    const relatedId = `interaction_related_${relatedBaseKey}_${relatedCount}`;
    
    return {
      id,
      time: event.playerInteractionEventTime,
      type: event.playerInteractionEventType,
      playerName: event.playerName,
      playerTeam: event.playerTeam,
      playerHero: event.playerHero,
      relatedEvents: [relatedId],
      relatedPlayerName: event.otherPlayerName,
      relatedPlayerTeam: event.playerTeam, // Assuming same team, may need to adjust based on data
      relatedPlayerHero: '', // Would need additional data to determine this
      metadata: { raw: event }
    };
  });
} 