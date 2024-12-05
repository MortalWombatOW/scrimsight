export interface TimelineEvent {
  mapId: number;
  matchTime: number;
  type: string;
  [key: string]: unknown;
}

export interface TeamAdvantageState<T> {
  team1Items: Set<T>;
  team2Items: Set<T>;
}

export interface TeamAdvantageResult {
  mapId: number;
  matchTime: number;
  team1Name: string;
  team2Name: string;
  team1Count: number;
  team2Count: number;
  teamWithAdvantage: string;
  diff: number;
}

export interface TeamAdvantageConfig<T> {
  // How to identify which team an event belongs to
  getTeamNumber: (event: TimelineEvent, teams: {team1Name: string; team2Name: string}) => 1 | 2 | null;

  // How to get a unique identifier for the tracked item
  getItemKey: (event: TimelineEvent) => T | null;

  // Whether this event should add the item
  isAddEvent: (event: TimelineEvent) => boolean;

  // Whether this event should remove the item
  isRemoveEvent: (event: TimelineEvent) => boolean;

  // Whether this event should trigger a state reset
  isResetEvent: (event: TimelineEvent) => boolean;

  // Whether to generate a data point before reset
  generatePreResetPoint: boolean;

  // Whether to generate a data point after reset
  generatePostResetPoint: boolean;

}

export function calculateAdvantage(state: TeamAdvantageState<unknown>, team1Name: string, team2Name: string, mapId: number, matchTime: number): TeamAdvantageResult {
  const team1Count = state.team1Items.size;
  const team2Count = state.team2Items.size;
  const advantageDiff = team1Count - team2Count;

  return {
    mapId,
    matchTime,
    team1Name,
    team2Name,
    team1Count,
    team2Count,
    teamWithAdvantage: advantageDiff > 0 ? team1Name : advantageDiff < 0 ? team2Name : 'None',
    diff: Math.abs(advantageDiff),
  };
}

export function processTeamAdvantageEvents<T>(events: TimelineEvent[], mapTeams: Map<number, {team1Name: string; team2Name: string}>, config: TeamAdvantageConfig<T>): TeamAdvantageResult[] {
  const results: TeamAdvantageResult[] = [];
  const state: TeamAdvantageState<T> = {
    team1Items: new Set<T>(),
    team2Items: new Set<T>(),
  };

  // Group events by map
  const mapGroups = new Map<number, TimelineEvent[]>();
  for (const event of events) {
    const events = mapGroups.get(event.mapId) || [];
    events.push(event);
    mapGroups.set(event.mapId, events);
  }

  // Process each map's events
  for (const [mapId, mapEvents] of mapGroups) {
    const teams = mapTeams.get(mapId);
    if (!teams) {
      throw new Error(`No team information found for map ${mapId}`);
    }

    // Sort events by time
    const sortedEvents = mapEvents.sort((a, b) => a.matchTime - b.matchTime);

    // Reset state at start of map
    state.team1Items.clear();
    state.team2Items.clear();

    let firstEventAfterReset = true;

    // Process each event
    for (const event of sortedEvents) {
      if (config.isResetEvent(event)) {
        // Generate pre-reset point if configured
        if (config.generatePreResetPoint) {
          results.push(calculateAdvantage(state, teams.team1Name, teams.team2Name, mapId, event.matchTime));
        }

        // Reset state
        state.team1Items.clear();
        state.team2Items.clear();

        // Generate post-reset point if configured
        if (config.generatePostResetPoint) {
          results.push(calculateAdvantage(state, teams.team1Name, teams.team2Name, mapId, event.matchTime));
        }

        firstEventAfterReset = true;
        continue;
      }

      const teamNumber = config.getTeamNumber(event, teams);
      const itemKey = config.getItemKey(event);

      if (teamNumber === null || itemKey === null) {
        continue;
      }

      const teamItems = teamNumber === 1 ? state.team1Items : state.team2Items;

      // Add or remove item based on event type
      if (config.isAddEvent(event)) {
        if (firstEventAfterReset) {
          results.push(calculateAdvantage(state, teams.team1Name, teams.team2Name, mapId, event.matchTime - 0.1));
          firstEventAfterReset = false;
        }
        teamItems.add(itemKey);
        results.push(calculateAdvantage(state, teams.team1Name, teams.team2Name, mapId, event.matchTime));
      } else if (config.isRemoveEvent(event)) {
        teamItems.delete(itemKey);
        results.push(calculateAdvantage(state, teams.team1Name, teams.team2Name, mapId, event.matchTime));
      }
    }
  }

  return results.sort((a, b) => a.matchTime - b.matchTime);
}
