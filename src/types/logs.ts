/**
 * Raw Log Event Types
 * These interfaces represent the raw events parsed from Overwatch log files.
 */

// ============================================================================
// Ability Events
// ============================================================================

export interface Ability1UsedLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface Ability2UsedLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

// ============================================================================
// Combat Events
// ============================================================================

export interface DamageLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}

export interface KillLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}

export interface HealingLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  healerTeam: string;
  healerName: string;
  healeeTeam: string;
  healeeName: string;
  healeeHero: string;
  eventAbility: string;
  eventHealing: number;
  isHealthPack: boolean;
}

// ============================================================================
// Assist Events
// ============================================================================

export interface DefensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export interface OffensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

// ============================================================================
// Hero Events
// ============================================================================

export interface HeroSpawnLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}

export interface HeroSwapLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  previousHero: string;
  heroTimePlayed: number;
}

// ============================================================================
// D.Va Events
// ============================================================================

export interface DvaDemechLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  attackerTeam: string;
  attackerName: string;
  attackerHero: string;
  victimTeam: string;
  victimName: string;
  victimHero: string;
  eventAbility: string;
  eventDamage: number;
  isCriticalHit: boolean;
  isEnvironmental: boolean;
}

export interface DvaRemechLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}

// ============================================================================
// Ultimate Events
// ============================================================================

export interface UltimateChargedLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface UltimateEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

export interface UltimateStartLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
  ultimateId: number;
}

// ============================================================================
// Mercy Events
// ============================================================================

export interface MercyRezLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  mercyTeam: string;
  mercyName: string;
  revivedTeam: string;
  revivedName: string;
  revivedHero: string;
  eventAbility: string;
}

// ============================================================================
// Match Flow Events
// ============================================================================

export interface MatchStartLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
}

export interface MatchEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  team1Score: number;
  team2Score: number;
}

export interface RoundStartLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
}

export interface RoundEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  capturingTeam: string;
  team1Score: number;
  team2Score: number;
  objectiveIndex: number;
  controlTeam1Progress: number;
  controlTeam2Progress: number;
  matchTimeRemaining: number;
}

export interface SetupCompleteLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  matchTimeRemaining: number;
}

// ============================================================================
// Player Stats Event
// ============================================================================

export interface PlayerStatLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: string;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  eliminations: number;
  finalBlows: number;
  deaths: number;
  allDamageDealt: number;
  barrierDamageDealt: number;
  heroDamageDealt: number;
  healingDealt: number;
  healingReceived: number;
  selfHealing: number;
  damageTaken: number;
  damageBlocked: number;
  defensiveAssists: number;
  offensiveAssists: number;
  ultimatesEarned: number;
  ultimatesUsed: number;
  multikillBest: number;
  multikills: number;
  soloKills: number;
  objectiveKills: number;
  environmentalKills: number;
  environmentalDeaths: number;
  criticalHits: number;
  criticalHitAccuracy: number;
  scopedAccuracy: number;
  scopedCriticalHitAccuracy: number;
  scopedCriticalHitKills: number;
  shotsFired: number;
  shotsHit: number;
  shotsMissed: number;
  scopedShotsFired: number;
  scopedShotsHit: number;
  weaponAccuracy: number;
}

// ============================================================================
// Spec Name Mapping - Maps specName strings to their corresponding types
// ============================================================================

/**
 * Union type of all valid spec names from the LOG_SPEC in scrimtime.ts.
 * This is used for type-safe event handling in the ingestor.
 */
export type LogSpecName =
  | 'ability_1_used'
  | 'ability_2_used'
  | 'damage'
  | 'defensive_assist'
  | 'dva_demech'
  | 'dva_remech'
  | 'healing'
  | 'hero_spawn'
  | 'hero_swap'
  | 'kill'
  | 'match_end'
  | 'match_start'
  | 'mercy_rez'
  | 'offensive_assist'
  | 'player_stat'
  | 'round_end'
  | 'round_start'
  | 'setup_complete'
  | 'ultimate_charged'
  | 'ultimate_end'
  | 'ultimate_start'
  | 'echo_duplicate_start'
  | 'echo_duplicate_end'
  | 'remech_charged'
  | 'objective_captured'
  | 'point_progress'
  | 'payload_progress';

/**
 * Maps a specName to its corresponding log event type.
 * This enables strictly typed event handling without `as any` casts.
 */
export interface LogEventTypeMap {
  ability_1_used: Ability1UsedLogEvent[];
  ability_2_used: Ability2UsedLogEvent[];
  damage: DamageLogEvent[];
  defensive_assist: DefensiveAssistLogEvent[];
  dva_demech: DvaDemechLogEvent[];
  dva_remech: DvaRemechLogEvent[];
  healing: HealingLogEvent[];
  hero_spawn: HeroSpawnLogEvent[];
  hero_swap: HeroSwapLogEvent[];
  kill: KillLogEvent[];
  match_end: MatchEndLogEvent[];
  match_start: MatchStartLogEvent[];
  mercy_rez: MercyRezLogEvent[];
  offensive_assist: OffensiveAssistLogEvent[];
  player_stat: PlayerStatLogEvent[];
  round_end: RoundEndLogEvent[];
  round_start: RoundStartLogEvent[];
  setup_complete: SetupCompleteLogEvent[];
  ultimate_charged: UltimateChargedLogEvent[];
  ultimate_end: UltimateEndLogEvent[];
  ultimate_start: UltimateStartLogEvent[];
}

// ============================================================================
// Legacy Type Aliases (for backward compatibility)
// ============================================================================

export type Ability1UsedType = Ability1UsedLogEvent[];
export type Ability2UsedType = Ability2UsedLogEvent[];
export type DamageType = DamageLogEvent[];
export type DefensiveAssistType = DefensiveAssistLogEvent[];
export type DvaDemechType = DvaDemechLogEvent[];
export type DvaRemechType = DvaRemechLogEvent[];
export type HealingType = HealingLogEvent[];
export type HeroSpawnType = HeroSpawnLogEvent[];
export type HeroSwapType = HeroSwapLogEvent[];
export type KillType = KillLogEvent[];
export type MatchEndType = MatchEndLogEvent[];
export type MatchStartType = MatchStartLogEvent[];
export type MercyRezType = MercyRezLogEvent[];
export type OffensiveAssistType = OffensiveAssistLogEvent[];
export type PlayerStatType = PlayerStatLogEvent[];
export type RoundEndType = RoundEndLogEvent[];
export type RoundStartType = RoundStartLogEvent[];
export type SetupCompleteType = SetupCompleteLogEvent[];
export type UltimateChargedType = UltimateChargedLogEvent[];
export type UltimateEndType = UltimateEndLogEvent[];
export type UltimateStartType = UltimateStartLogEvent[];
