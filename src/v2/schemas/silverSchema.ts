import { z } from 'zod';

// Base schema for all Silver entities
export const SilverBaseSchema = z.object({
  id: z.string(),
  match_id: z.string(),
  source_filename: z.string(),
  load_timestamp: z.number()
});

export type SilverBase = z.infer<typeof SilverBaseSchema>;

// Match Schema
export const MatchSchemaSilver = SilverBaseSchema.extend({
  map_name: z.string(),
  map_type: z.string(),
  team1_name: z.string(),
  team2_name: z.string(),
  team1_score: z.number(),
  team2_score: z.number(),
  duration: z.number(),
  winner: z.string().nullable(),
  start_time: z.number(),
  end_time: z.number(),
  team1_players: z.array(z.string()),
  team2_players: z.array(z.string())
});

export type MatchSilver = z.infer<typeof MatchSchemaSilver>;

// Round Schema
export const RoundSchemaSilver = SilverBaseSchema.extend({
  match_id: z.string(),
  round_number: z.number(),
  start_time: z.number(),
  end_time: z.number(),
  duration: z.number(),
  setup_complete_time: z.number().optional(),
  team1_score: z.number(),
  team2_score: z.number(),
  winner: z.string().nullable(),
  objective_index: z.number(),
  capturing_team: z.string()
});

export type RoundSilver = z.infer<typeof RoundSchemaSilver>;

// Player Hero Round Playtime Schema
export const PlayerHeroRoundPlaytimeSchemaSilver = SilverBaseSchema.extend({
  player_name: z.string(),
  player_team: z.string(),
  hero: z.string(),
  match_id: z.string(),
  round_number: z.number(),
  playtime: z.number(),
  start_time: z.number(),
  end_time: z.number()
});

export type PlayerHeroRoundPlaytimeSilver = z.infer<typeof PlayerHeroRoundPlaytimeSchemaSilver>;

// Player Round Stats Schema
export const PlayerRoundStatsSchemaSilver = SilverBaseSchema.extend({
  player_name: z.string(),
  player_team: z.string(),
  hero: z.string(),
  player_role: z.string(), // Added based on hero
  match_id: z.string(),
  round_number: z.number(),
  playtime: z.number().optional(),
  eliminations: z.number(),
  final_blows: z.number(),
  deaths: z.number(),
  all_damage_dealt: z.number(),
  barrier_damage_dealt: z.number(),
  hero_damage_dealt: z.number(),
  healing_dealt: z.number(),
  healing_received: z.number(),
  self_healing: z.number(),
  damage_taken: z.number(),
  damage_blocked: z.number(),
  defensive_assists: z.number(),
  offensive_assists: z.number(),
  ultimates_earned: z.number(),
  ultimates_used: z.number(),
  multikill_best: z.number(),
  multikills: z.number(),
  solo_kills: z.number(),
  objective_kills: z.number(),
  environmental_kills: z.number(),
  environmental_deaths: z.number(),
  critical_hits: z.number(),
  critical_hit_accuracy: z.number(),
  scoped_accuracy: z.number(),
  scoped_critical_hit_accuracy: z.number(),
  scoped_critical_hit_kills: z.number(),
  shots_fired: z.number(),
  shots_hit: z.number(),
  shots_missed: z.number(),
  scoped_shots_fired: z.number(),
  scoped_shots_hit: z.number(),
  weapon_accuracy: z.number()
});

export type PlayerRoundStatsSilver = z.infer<typeof PlayerRoundStatsSchemaSilver>;

// Unified Interaction Event Schema (kills, damage, healing, etc.)
export const UnifiedInteractionEventSchemaSilver = SilverBaseSchema.extend({
  event_id: z.string(),
  event_type: z.string(),
  match_time: z.number(),
  round_number: z.number().optional(),
  
  // Source/target fields
  source_team: z.string(),
  source_player: z.string(),
  source_hero: z.string(),
  target_team: z.string().optional(),
  target_player: z.string().optional(),
  target_hero: z.string().optional(),
  
  // Event details
  ability: z.string().optional(),
  amount: z.number().optional(),
  is_critical: z.boolean().optional(),
  is_environmental: z.boolean().optional(),
  is_health_pack: z.boolean().optional(),
  
  // For pairing outgoing/incoming events
  pair_id: z.string().optional(),
  is_outgoing: z.boolean().default(true)
});

export type UnifiedInteractionEventSilver = z.infer<typeof UnifiedInteractionEventSchemaSilver>;

// Unified Player Event Schema (hero spawns, swaps, ult status, etc.)
export const UnifiedPlayerEventSchemaSilver = SilverBaseSchema.extend({
  event_id: z.string(),
  event_type: z.string(),
  match_time: z.number(),
  round_number: z.number().optional(),
  
  player_team: z.string(),
  player_name: z.string(),
  player_hero: z.string(),
  
  // Hero swaps
  previous_hero: z.string().optional(),
  hero_time_played: z.number().optional(),
  
  // Ultimate events
  ultimate_id: z.number().optional(),
  hero_duplicated: z.string().optional()
});

export type UnifiedPlayerEventSilver = z.infer<typeof UnifiedPlayerEventSchemaSilver>;

// Ultimate Cycle Schema
export const UltimateCycleSchemaSilver = SilverBaseSchema.extend({
  player_name: z.string(),
  player_team: z.string(),
  hero: z.string(),
  match_id: z.string(),
  ultimate_id: z.number(),
  charged_time: z.number(),
  start_time: z.number().optional(),
  end_time: z.number().optional(),
  duration: z.number().optional(),
  was_used: z.boolean()
});

export type UltimateCycleSilver = z.infer<typeof UltimateCycleSchemaSilver>;

// Teamfight Schema
export const TeamfightSchemaSilver = SilverBaseSchema.extend({
  fight_id: z.string(),
  match_id: z.string(),
  round_number: z.number(),
  start_time: z.number(),
  end_time: z.number(),
  duration: z.number(),
  team1_name: z.string(),
  team2_name: z.string(),
  team1_kills: z.number(),
  team2_kills: z.number(),
  winner: z.string().nullable(),
  first_kill_time: z.number().optional(),
  first_kill_player: z.string().optional(),
  first_kill_team: z.string().optional(),
  first_death_player: z.string().optional(),
  first_death_team: z.string().optional()
});

export type TeamfightSilver = z.infer<typeof TeamfightSchemaSilver>;

// Player Life Schema
export const PlayerLifeSchemaSilver = SilverBaseSchema.extend({
  life_id: z.string(),
  player_name: z.string(),
  player_team: z.string(),
  hero: z.string(),
  match_id: z.string(),
  round_number: z.number(),
  start_time: z.number(),
  end_time: z.number().optional(),
  duration: z.number().optional(),
  end_reason: z.enum(['death', 'swap', 'round_end']).optional(),
  damage_taken: z.number().default(0),
  healing_received: z.number().default(0),
  final_blow_player: z.string().optional(),
  final_blow_team: z.string().optional(),
  final_blow_hero: z.string().optional(),
  final_blow_ability: z.string().optional()
});

export type PlayerLifeSilver = z.infer<typeof PlayerLifeSchemaSilver>;