import { ReactNode } from 'react';

export interface MatchStart {
  mapId: number;
  team1Name: string;
  team2Name: string;
}

export interface TimelineEventProps {
  time: number;
  timeToX: (time: number) => number;
  color: string;
  icon: ReactNode;
  tooltipTitle: string;
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
  ultimateAdvantageData: UltimateAdvantageData[];
}

export interface RoundTime {
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
}

export interface MapTimelineProps {
  mapId: number;
}

export interface MapTimes {
  mapId: number;
  mapStartTime: number;
  mapEndTime: number;
}

export interface PlayerEvent {
  mapId: number;
  playerTeam: string;
  playerName: string;
  playerEventTime: number;
  playerEventType: string;
  playerHero: string;
}

export interface PlayerInteractionEvent {
  mapId: number;
  playerTeam: string;
  playerName: string;
  playerInteractionEventTime: number;
  playerInteractionEventType: string;
  otherPlayerName: string;
}

export interface UltimateEvent {
  mapId: number;
  playerTeam: string;
  playerName: string;
  ultimateStartTime: number;
  ultimateEndTime: number;
  ultimateChargedTime: number;
}

export interface RoundTimes {
  mapId: number;
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
}

export interface UltimateAdvantageData {
  matchTime: number;
  team1ChargedUltimateCount: number;
  team2ChargedUltimateCount: number;
  ultimateAdvantageDiff: number;
} 