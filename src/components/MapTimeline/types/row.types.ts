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

export interface TimelineRowConfig {
  id: string;
  type: 'team' | 'player' | 'round' | 'ultimateAdvantage' | 'eventMap' | 'spacing' | 'header' | 'timeLabels';
  height: number;
  useWindowScale?: boolean;
  data?: any;
} 