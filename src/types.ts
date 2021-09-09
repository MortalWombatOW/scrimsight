/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-shadow
export enum AbilityType {
  Primary,
  Secondary,
  Ultimate,
}

export interface RawEvent {
  timestamp: number;
  eventType: string;
  value1: string;
  value2: string;
  value3: string;

}

export type TeamMapping = {
  player: string;
  teamName: string;
};

export type WorldPosition = {
  x: number;
  y: number;
  z: number;
};

export type StatusEvent = {
  timestamp: number;
  player: string;
  hero: string;
  position: WorldPosition;
};

export type HealthEvent = {
  timestamp: number;
  player: string;
  health: number;
  maxHealth: number;
};

export type UltChargeEvent = {
  timestamp: number;
  player: string;
  ultPercent: number;
};

export type UsedAbilityEvent = {
  timestamp: number;
  player: string;
  hero: string;
  ability: AbilityType;
};

export type DamageEvent = {
  timestamp: number;
  player: string;
  targetPlayer: string;
  damage: number;
};

export type HealingEvent = {
  timestamp: number;
  player: string;
  targetPlayer: string;
  healing: number;
};

export interface OWEvent {
  eventType: string;
}

export interface EliminationEvent extends OWEvent {
  timestamp: number;
  player: string;
  targetPlayer: string;
  damage: number;
  isFinalBlow: boolean;
}

export type Extractor<T> = (events: Array<RawEvent>) => Array<T>;
export type Filter<T> = (events: Array<T>) => Array<T>;

export type CategoricalAggregationResult = {
  category: string;
  value: number;
};

export interface StrIndexable {
  [key: string]: any;
}
