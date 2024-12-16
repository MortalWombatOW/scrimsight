import {ReactNode} from 'react';

export interface MatchStart {
  matchId: string;
  team1Name: string;
  team2Name: string;
}

export interface TimelineEventProps {
  time: number;
  color: string;
  icon: ReactNode;
  tooltipTitle: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export interface UltimateBarProps {
  startTime: number;
  endTime: number;
  chargedTime: number;
  timeToX: (time: number) => number;
  windowStartTime: number;
  windowEndTime: number;
}

export interface TimelineRowProps {
  width: number;
  events: PlayerEvent[];
  interactionEvents: PlayerInteractionEvent[];
  ultimateEvents: UltimateEvent[];
  timeToX: (time: number) => number;
  windowStartTime: number;
  windowEndTime: number;
}

export interface XAxisProps {
  width: number;
  timeToX: (time: number) => number;
  xToTime: (x: number) => number;
  mapStartTime: number;
  mapEndTime: number;
  roundTimes: RoundTime[];
  windowStartTime: number;
  setWindowStartTime: (time: number) => void;
  windowEndTime: number;
  setWindowEndTime: (time: number) => void;
  eventTimes: number[];
  team1Name: string;
  team2Name: string;
  ultimateAdvantageData: TeamAdvantageData[];
}

export interface RoundTime {
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
}

export interface MapTimelineProps {
  matchId: string;
}

export interface MapTimes {
  matchId: string;
  mapStartTime: number;
  mapEndTime: number;
}

export interface PlayerEvent {
  matchId: string;
  playerTeam: string;
  playerName: string;
  playerEventTime: number;
  playerEventType: string;
  playerHero: string;
}

export interface PlayerInteractionEvent {
  matchId: string;
  playerTeam: string;
  playerName: string;
  playerInteractionEventTime: number;
  playerInteractionEventType: string;
  otherPlayerName: string;
}

export interface UltimateEvent {
  matchId: string;
  playerTeam: string;
  playerName: string;
  ultimateStartTime: number;
  ultimateEndTime: number;
  ultimateChargedTime: number;
}

export interface RoundTimes {
  matchId: string;
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
}

export interface TeamAdvantageData {
  matchId: string;
  matchTime: number;
  team1Count: number;
  team2Count: number;
  diff: number;
}

export interface UltimateAdvantageChartProps {
  width: number;
  timeToX: (time: number) => number;
  windowStartTime: number;
  windowEndTime: number;
  team1Name: string;
  team2Name: string;
  ultimateAdvantageData: TeamAdvantageData[];
}

export interface TimelineData {
  mapStartTime: number;
  mapEndTime: number;
  team1Name: string;
  team2Name: string;
  team1EventsByPlayer: Record<string, PlayerEvent[]>;
  team2EventsByPlayer: Record<string, PlayerEvent[]>;
  team1InteractionEventsByPlayer: Record<string, PlayerInteractionEvent[]>;
  team2InteractionEventsByPlayer: Record<string, PlayerInteractionEvent[]>;
  team1UltimateEventsByPlayer: Record<string, UltimateEvent[]>;
  team2UltimateEventsByPlayer: Record<string, UltimateEvent[]>;
  roundTimes: RoundTimes[];
  eventTimes: number[];
  ultimateAdvantageData: TeamAdvantageData[];
  aliveAdvantageData: TeamAdvantageData[];
}

export interface TimelineDimensions {
  width: number | undefined;
  timeToX: (time: number) => number;
  timeToXWindow: (time: number) => number;
  xToTime: (x: number) => number;
  xToTimeWindow: (x: number) => number;
  windowStartTime: number;
  windowEndTime: number;
  mapStartTime: number;
  mapEndTime: number;
  setWindowStartTime: (time: number) => void;
  setWindowEndTime: (time: number) => void;
  handleMouseDown?: (e: React.MouseEvent, type: 'start' | 'end') => void;
  handleMouseUp?: () => void;
  handleMouseMove?: (e: React.MouseEvent) => void;
  gridRef: React.RefObject<HTMLDivElement>;
}

export interface PixiMapTimelineProps {
  width: number;
  height: number;
  timelineData: TimelineData;
  dimensions: TimelineDimensions;
}
