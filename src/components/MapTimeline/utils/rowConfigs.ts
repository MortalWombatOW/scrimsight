import { TimelineData } from '../types/timeline.types';
import { TimelineRowConfig } from '../types/row.types';

export const getDefaultRowConfigs = (timelineData: TimelineData | null): TimelineRowConfig[] => {
  if (!timelineData) return [];

  const configs: TimelineRowConfig[] = [];

  // Top time labels
  configs.push({
    id: 'time-labels-top',
    type: 'timeLabels',
    height: 25,
    useWindowScale: true,
  });

  // Team 1 header and players
  configs.push({
    id: 'team1-header',
    type: 'header',
    height: 25,
    data: { text: timelineData.team1Name }
  });

  // Team 1 players
  Object.entries(timelineData.team1EventsByPlayer).forEach(([playerName]) => {
    configs.push({
      id: `team1-${playerName}`,
      type: 'player',
      height: 25,
      useWindowScale: true,
      data: {
        playerName,
        team: 'team1',
      }
    });
  });

  // Team 2 header and players
  configs.push({
    id: 'team2-header',
    type: 'header',
    height: 25,
    data: { text: timelineData.team2Name }
  });

  // Team 2 players
  Object.entries(timelineData.team2EventsByPlayer).forEach(([playerName]) => {
    configs.push({
      id: `team2-${playerName}`,
      type: 'player',
      height: 25,
      useWindowScale: true,
      data: {
        playerName,
        team: 'team2',
      }
    });
  });

  // Bottom sections
  configs.push(
    {
      id: 'rounds',
      type: 'round',
      height: 35,
      useWindowScale: false,
    },
    {
      id: 'ultimateAdvantage',
      type: 'ultimateAdvantage',
      height: 60,
      useWindowScale: false,
    },
    {
      id: 'eventMap',
      type: 'eventMap',
      height: 25,
      useWindowScale: false,
    },
    {
      id: 'time-labels-bottom',
      type: 'timeLabels',
      height: 25,
      useWindowScale: false,
    }
  );

  return configs;
}; 