/**
 * Zod schemas for runtime type validation of log events.
 * These schemas mirror the interfaces defined in src/types/logs.ts
 * and provide runtime type safety for the data ingestion layer.
 */

import { z } from 'zod';

// ============================================================================
// Base Schema - Common fields shared across most log events
// ============================================================================

/**
 * Base schema with fields common to most log events.
 * This can be extended for events that don't fit the specific schemas below.
 */
export const BaseLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
});

// ============================================================================
// Critical High-Volume Event Schemas
// ============================================================================

/**
 * Schema for kill events - critical high-volume event.
 * Validates: KillLogEvent
 */
export const KillLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  attackerTeam: z.string(),
  attackerName: z.string(),
  attackerHero: z.string(),
  victimTeam: z.string(),
  victimName: z.string(),
  victimHero: z.string(),
  eventAbility: z.string(),
  eventDamage: z.number(),
  isCriticalHit: z.boolean(),
  isEnvironmental: z.boolean(),
});

/**
 * Schema for player stat events - critical high-volume event.
 * Validates: PlayerStatLogEvent
 */
export const PlayerStatLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  roundNumber: z.string(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  eliminations: z.number(),
  finalBlows: z.number(),
  deaths: z.number(),
  allDamageDealt: z.number(),
  barrierDamageDealt: z.number(),
  heroDamageDealt: z.number(),
  healingDealt: z.number(),
  healingReceived: z.number(),
  selfHealing: z.number(),
  damageTaken: z.number(),
  damageBlocked: z.number(),
  defensiveAssists: z.number(),
  offensiveAssists: z.number(),
  ultimatesEarned: z.number(),
  ultimatesUsed: z.number(),
  multikillBest: z.number(),
  multikills: z.number(),
  soloKills: z.number(),
  objectiveKills: z.number(),
  environmentalKills: z.number(),
  environmentalDeaths: z.number(),
  criticalHits: z.number(),
  criticalHitAccuracy: z.number(),
  scopedAccuracy: z.number(),
  scopedCriticalHitAccuracy: z.number(),
  scopedCriticalHitKills: z.number(),
  shotsFired: z.number(),
  shotsHit: z.number(),
  shotsMissed: z.number(),
  scopedShotsFired: z.number(),
  scopedShotsHit: z.number(),
  weaponAccuracy: z.number(),
});

/**
 * Schema for match start events - critical event.
 * Validates: MatchStartLogEvent
 */
export const MatchStartLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  mapName: z.string(),
  mapType: z.string(),
  team1Name: z.string(),
  team2Name: z.string(),
});

/**
 * Schema for match end events - critical event.
 * Validates: MatchEndLogEvent
 */
export const MatchEndLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  roundNumber: z.number(),
  team1Score: z.number(),
  team2Score: z.number(),
});

/**
 * Schema for round end events - critical event.
 * Validates: RoundEndLogEvent
 */
export const RoundEndLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  roundNumber: z.number(),
  capturingTeam: z.string(),
  team1Score: z.number(),
  team2Score: z.number(),
  objectiveIndex: z.number(),
  controlTeam1Progress: z.number(),
  controlTeam2Progress: z.number(),
  matchTimeRemaining: z.number(),
});

/**
 * Schema for hero spawn events - critical high-volume event.
 * Validates: HeroSpawnLogEvent
 */
export const HeroSpawnLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  previousHero: z.string(),
  heroTimePlayed: z.number(),
});

// ============================================================================
// Additional Event Schemas (for complete coverage)
// ============================================================================

/**
 * Schema for ability 1 used events.
 * Validates: Ability1UsedLogEvent
 */
export const Ability1UsedLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  heroDuplicated: z.string(),
});

/**
 * Schema for ability 2 used events.
 * Validates: Ability2UsedLogEvent
 */
export const Ability2UsedLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  heroDuplicated: z.string(),
});

/**
 * Schema for damage events.
 * Validates: DamageLogEvent
 */
export const DamageLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  attackerTeam: z.string(),
  attackerName: z.string(),
  attackerHero: z.string(),
  victimTeam: z.string(),
  victimName: z.string(),
  victimHero: z.string(),
  eventAbility: z.string(),
  eventDamage: z.number(),
  isCriticalHit: z.boolean(),
  isEnvironmental: z.boolean(),
});

/**
 * Schema for defensive assist events.
 * Validates: DefensiveAssistLogEvent
 */
export const DefensiveAssistLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  heroDuplicated: z.string(),
});

/**
 * Schema for D.Va demech events.
 * Validates: DvaDemechLogEvent
 */
export const DvaDemechLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  attackerTeam: z.string(),
  attackerName: z.string(),
  attackerHero: z.string(),
  victimTeam: z.string(),
  victimName: z.string(),
  victimHero: z.string(),
  eventAbility: z.string(),
  eventDamage: z.number(),
  isCriticalHit: z.boolean(),
  isEnvironmental: z.boolean(),
});

/**
 * Schema for D.Va remech events.
 * Validates: DvaRemechLogEvent
 */
export const DvaRemechLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  ultimateId: z.number(),
});

/**
 * Schema for healing events.
 * Validates: HealingLogEvent
 */
export const HealingLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  healerTeam: z.string(),
  healerName: z.string(),
  healeeTeam: z.string(),
  healeeName: z.string(),
  healeeHero: z.string(),
  eventAbility: z.string(),
  eventHealing: z.number(),
  isHealthPack: z.boolean(),
});

/**
 * Schema for hero swap events.
 * Validates: HeroSwapLogEvent
 */
export const HeroSwapLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  previousHero: z.string(),
  heroTimePlayed: z.number(),
});

/**
 * Schema for Mercy resurrect events.
 * Validates: MercyRezLogEvent
 */
export const MercyRezLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  mercyTeam: z.string(),
  mercyName: z.string(),
  revivedTeam: z.string(),
  revivedName: z.string(),
  revivedHero: z.string(),
  eventAbility: z.string(),
});

/**
 * Schema for offensive assist events.
 * Validates: OffensiveAssistLogEvent
 */
export const OffensiveAssistLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  heroDuplicated: z.string(),
});

/**
 * Schema for round start events.
 * Validates: RoundStartLogEvent
 */
export const RoundStartLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  roundNumber: z.number(),
  capturingTeam: z.string(),
  team1Score: z.number(),
  team2Score: z.number(),
  objectiveIndex: z.number(),
});

/**
 * Schema for setup complete events.
 * Validates: SetupCompleteLogEvent
 */
export const SetupCompleteLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  roundNumber: z.number(),
  matchTimeRemaining: z.number(),
});

/**
 * Schema for ultimate charged events.
 * Validates: UltimateChargedLogEvent
 */
export const UltimateChargedLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  heroDuplicated: z.string(),
  ultimateId: z.number(),
});

/**
 * Schema for ultimate end events.
 * Validates: UltimateEndLogEvent
 */
export const UltimateEndLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  heroDuplicated: z.string(),
  ultimateId: z.number(),
});

/**
 * Schema for ultimate start events.
 * Validates: UltimateStartLogEvent
 */
export const UltimateStartLogEventSchema = z.object({
  matchId: z.string(),
  type: z.string(),
  matchTime: z.number(),
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string(),
  heroDuplicated: z.string(),
  ultimateId: z.number(),
});

// ============================================================================
// Inferred Types (for type compatibility verification)
// ============================================================================

export type KillLogEventSchemaType = z.infer<typeof KillLogEventSchema>;
export type PlayerStatLogEventSchemaType = z.infer<typeof PlayerStatLogEventSchema>;
export type MatchStartLogEventSchemaType = z.infer<typeof MatchStartLogEventSchema>;
export type MatchEndLogEventSchemaType = z.infer<typeof MatchEndLogEventSchema>;
export type RoundEndLogEventSchemaType = z.infer<typeof RoundEndLogEventSchema>;
export type HeroSpawnLogEventSchemaType = z.infer<typeof HeroSpawnLogEventSchema>;
