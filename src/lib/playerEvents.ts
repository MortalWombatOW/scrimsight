import type {
  DefensiveAssistType,
  OffensiveAssistType,
  HeroSpawnType,
  HeroSwapType,
  Ability1UsedType,
  Ability2UsedType,
  DefensiveAssistLogEvent, // Individual event types for clarity if needed, or use *Type
  OffensiveAssistLogEvent,
  HeroSpawnLogEvent,
  HeroSwapLogEvent,
  Ability1UsedLogEvent,
  Ability2UsedLogEvent
} from '@atoms';

/**
 * Interface for combined player events
 */
export interface PlayerEvent {
  id: string;
  matchId: string;
  playerEventTime: number;
  playerName: string;
  playerTeam: string;
  playerEventType: string;
  playerHero: string;
}

/**
 * Transform defensive assist events to player events
 */
export function transformDefensiveAssists(defensiveAssists: DefensiveAssistType): PlayerEvent[] {
  return defensiveAssists.map((e: DefensiveAssistLogEvent, i: number) => ({
    id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-defensiveAssist-${i}`,
    matchId: e.matchId,
    playerEventTime: e.matchTime,
    playerName: e.playerName,
    playerTeam: e.playerTeam,
    playerEventType: 'defensiveAssist',
    playerHero: e.playerHero
  }));
}

/**
 * Transform offensive assist events to player events
 */
export function transformOffensiveAssists(offensiveAssists: OffensiveAssistType): PlayerEvent[] {
  return offensiveAssists.map((e: OffensiveAssistLogEvent, i: number) => ({
    id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-offensiveAssist-${i}`,
    matchId: e.matchId,
    playerEventTime: e.matchTime,
    playerName: e.playerName,
    playerTeam: e.playerTeam,
    playerEventType: 'offensiveAssist',
    playerHero: e.playerHero
  }));
}

/**
 * Transform hero spawn events to player events
 */
export function transformHeroSpawns(heroSpawns: HeroSpawnType): PlayerEvent[] {
  return heroSpawns.map((e: HeroSpawnLogEvent, i: number) => ({
    id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-heroSpawn-${i}`,
    matchId: e.matchId,
    playerEventTime: e.matchTime,
    playerName: e.playerName,
    playerTeam: e.playerTeam,
    playerEventType: 'heroSpawn',
    playerHero: e.playerHero
  }));
}

/**
 * Transform hero swap events to player events
 */
export function transformHeroSwaps(heroSwaps: HeroSwapType): PlayerEvent[] {
  return heroSwaps.map((e: HeroSwapLogEvent, i: number) => ({
    id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-heroSwap-${i}`,
    matchId: e.matchId,
    playerEventTime: e.matchTime,
    playerName: e.playerName,
    playerTeam: e.playerTeam,
    playerEventType: 'heroSwap',
    playerHero: e.playerHero
  }));
}

/**
 * Transform ability1 usage events to player events
 */
export function transformAbility1Used(ability1Used: Ability1UsedType): PlayerEvent[] {
  return ability1Used.map((e: Ability1UsedLogEvent, i: number) => ({
    id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-ability1Used-${i}`,
    matchId: e.matchId,
    playerEventTime: e.matchTime,
    playerName: e.playerName,
    playerTeam: e.playerTeam,
    playerEventType: 'ability1Used',
    playerHero: e.playerHero
  }));
}

/**
 * Transform ability2 usage events to player events
 */
export function transformAbility2Used(ability2Used: Ability2UsedType): PlayerEvent[] {
  return ability2Used.map((e: Ability2UsedLogEvent, i: number) => ({
    id: `${e.matchId}-${e.matchTime}-${e.playerName}-${e.playerHero}-ability2Used-${i}`,
    matchId: e.matchId,
    playerEventTime: e.matchTime,
    playerName: e.playerName,
    playerTeam: e.playerTeam,
    playerEventType: 'ability2Used',
    playerHero: e.playerHero
  }));
}

/**
 * Combine and sort all player events
 */
export function combinePlayerEvents(
  defensiveAssists: DefensiveAssistType,
  offensiveAssists: OffensiveAssistType,
  heroSpawns: HeroSpawnType,
  heroSwaps: HeroSwapType,
  ability1Used: Ability1UsedType,
  ability2Used: Ability2UsedType
): PlayerEvent[] {
  if (!defensiveAssists || !offensiveAssists || !heroSpawns || !heroSwaps || !ability1Used || !ability2Used) {
    return [];
  }

  const events: PlayerEvent[] = [
    ...transformDefensiveAssists(defensiveAssists),
    ...transformOffensiveAssists(offensiveAssists),
    ...transformHeroSpawns(heroSpawns),
    ...transformHeroSwaps(heroSwaps),
    ...transformAbility1Used(ability1Used),
    ...transformAbility2Used(ability2Used)
  ];

  // Sort by event time
  return events.sort((a, b) => a.playerEventTime - b.playerEventTime);
}
