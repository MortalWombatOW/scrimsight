import { ReactNode } from 'react';
import { TimelineData, TimelineDimensions } from './timeline.types';

export interface BaseTimelineRowProps {
  width: number;
  height: number;
  y: number;
  dimensions: TimelineDimensions;
  useWindowScale?: boolean;
  children?: ReactNode;
  label: string;
  labelWidth: number;
  onLabelWidthChange: (width: number) => void;
  onDelete: () => void;
}

export interface TimelineRowProps extends BaseTimelineRowProps {
  timelineData: TimelineData;
}

export interface PlayerTimelineRowProps extends BaseTimelineRowProps {
  playerName: string;
  events: any[];
  interactionEvents: any[];
  ultimateEvents: any[];
}

export type TimelineRowType = 
  | 'player'
  | 'round'
  | 'teamAdvantage'
  | 'eventMap'
  | 'spacing'
  | 'header'
  | 'timeLabels';

export interface PlayerRowConfig {
  type: 'player';
  playerName: string;
  team: string;
}

export interface HeaderRowConfig {
  type: 'header';
  text: string;
}

export interface TeamAdvantageRowConfig {
  type: 'teamAdvantage';
  values: any[];
  fieldNames: {
    team1Count: string;
    team2Count: string;
  };
  label: string;
}

export interface TimeLabelsRowConfig {
  type: 'timeLabels';
}

export interface RoundRowConfig {
  type: 'round';
}

export interface EventMapRowConfig {
  type: 'eventMap';
}

export type RowConfigData = 
  | PlayerRowConfig 
  | HeaderRowConfig 
  | TeamAdvantageRowConfig
  | TimeLabelsRowConfig
  | RoundRowConfig
  | EventMapRowConfig;

export interface TimelineRowConfig {
  id: string;
  type: TimelineRowType;
  height: number;
  useWindowScale?: boolean;
  data: RowConfigData;
} 