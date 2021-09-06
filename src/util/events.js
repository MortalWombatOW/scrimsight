// @flow

import type { DamageEvent, Extractor, TeamMapping, HealingEvent } from "../types";

export const extractMapName: Extractor<string> = (events) => events.filter(e => e.eventType === 'map').map(e => e.value1);

export const extractTeamMappings: Extractor<TeamMapping> = (events) => events.filter(e => e.eventType === 'player_team').map(e => {
    return {
        player: e.value1,
        teamName: e.value2
    }
});

export const extractDamageEvents: Extractor<DamageEvent> = (events) => events.filter(e => e.eventType === 'damage_dealt').map(e => {
    return {
        timestamp: e.timestamp,
        player: e.value1,
        damage: parseFloat(e.value2),
        target_player: e.value3
    }
});

export const extractHealingEvents: Extractor<HealingEvent> = (events) => events.filter(e => e.eventType === 'did_healing').map(e => {
    return {
        timestamp: e.timestamp,
        player: e.value1,
        healing: parseFloat(e.value2),
        target_player: e.value3
    }
});