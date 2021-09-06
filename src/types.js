// @flow

export type AbilityType = 'primary' | 'secondary' | 'ultimate';

export type RawEvent = {
    timestamp: number;
    eventType: string;
    value1: string;
    value2: string;
    value3: string;
}

export type TeamMapping = {
    player: string;
    teamName: string;
}

export type WorldPosition = {
    x: number;
    y: number;
    z: number;
}

export type StatusEvent = {
    timestamp: number;
    player: string;
    hero: string;
    position: WorldPosition;
}

export type HealthEvent = {
    timestamp: number;
    player: string;
    health: number;
    max_health: number;
}

export type UltChargeEvent = {
    timestamp: number;
    player: string;
    ult_percent: number;
}

export type UsedAbilityEvent = {
    timestamp: number;
    player: string;
    hero: string;
    ability: AbilityType;
}

export type DamageEvent = {
    timestamp: number;
    player: string;
    target_player: string;
    damage: number;
}

export type HealingEvent = {
    timestamp: number;
    player: string;
    target_player: string;
    healing: number;
}

export type EliminationEvent = {
    timestamp: number;
    player: string;
    target_player: string;
    damage: number;
    is_final_blow: boolean;
};

// export type OWEvent = TeamMapping | StatusEvent | HealthEvent | UltChargeEvent | UsedAbilityEvent | DamageEvent | HealingEvent | EliminationEvent;

export type Extractor<T> = (events: Array<RawEvent>) => Array<T>;
export type Filter<T> = (events: Array<T>) => Array<T>;


export type CategoricalAggregationResult = {
    category: string;
    value: number;
}
