import { z } from 'zod';

// Base schema for all Bronze events
export const BronzeBaseSchema = z.object({
  match_id: z.string(),
  event_type: z.string(),
  match_time: z.number(),
  source_filename: z.string(),
  load_timestamp: z.number()
});

export type BronzeBase = z.infer<typeof BronzeBaseSchema>;

// Common field groups
const playerFields = z.object({
  playerTeam: z.string(),
  playerName: z.string(),
  playerHero: z.string()
});

const attackFields = z.object({
  attackerTeam: z.string(),
  attackerName: z.string(),
  attackerHero: z.string(),
  victimTeam: z.string(),
  victimName: z.string(),
  victimHero: z.string()
});

// Match Start Event
export const MatchStartBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('match_start'),
  mapName: z.string(),
  mapType: z.string(),
  team1Name: z.string(),
  team2Name: z.string()
});

export type MatchStartBronze = z.infer<typeof MatchStartBronzeSchema>;

// Match End Event
export const MatchEndBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('match_end'),
  roundNumber: z.number(),
  team1Score: z.number(),
  team2Score: z.number()
});

export type MatchEndBronze = z.infer<typeof MatchEndBronzeSchema>;

// Round Start Event
export const RoundStartBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('round_start'),
  roundNumber: z.number(),
  capturingTeam: z.string(),
  team1Score: z.number(),
  team2Score: z.number(),
  objectiveIndex: z.number()
});

export type RoundStartBronze = z.infer<typeof RoundStartBronzeSchema>;

// Round End Event
export const RoundEndBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('round_end'),
  roundNumber: z.number(),
  capturingTeam: z.string(),
  team1Score: z.number(),
  team2Score: z.number(),
  objectiveIndex: z.number(),
  controlTeam1Progress: z.number(),
  controlTeam2Progress: z.number(),
  matchTimeRemaining: z.number()
});

export type RoundEndBronze = z.infer<typeof RoundEndBronzeSchema>;

// Setup Complete Event
export const SetupCompleteBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('setup_complete'),
  roundNumber: z.number(),
  matchTimeRemaining: z.number()
});

export type SetupCompleteBronze = z.infer<typeof SetupCompleteBronzeSchema>;

// Objective Captured Event
export const ObjectiveCapturedBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('objective_captured'),
  roundNumber: z.number(),
  capturingTeam: z.string(),
  objectiveIndex: z.number(),
  controlTeam1Progress: z.number(),
  controlTeam2Progress: z.number(),
  matchTimeRemaining: z.number()
});

export type ObjectiveCapturedBronze = z.infer<typeof ObjectiveCapturedBronzeSchema>;

// Point Progress Event
export const PointProgressBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('point_progress'),
  roundNumber: z.number(),
  capturingTeam: z.string(),
  objectiveIndex: z.number(),
  pointCaptureProgress: z.number()
});

export type PointProgressBronze = z.infer<typeof PointProgressBronzeSchema>;

// Payload Progress Event
export const PayloadProgressBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('payload_progress'),
  roundNumber: z.number(),
  capturingTeam: z.string(),
  objectiveIndex: z.number(),
  payloadCaptureProgress: z.number()
});

export type PayloadProgressBronze = z.infer<typeof PayloadProgressBronzeSchema>;

// Hero Spawn Event
export const HeroSpawnBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('hero_spawn')
}).merge(playerFields).extend({
  previousHero: z.string(),
  heroTimePlayed: z.number()
});

export type HeroSpawnBronze = z.infer<typeof HeroSpawnBronzeSchema>;

// Hero Swap Event
export const HeroSwapBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('hero_swap')
}).merge(playerFields).extend({
  previousHero: z.string(),
  heroTimePlayed: z.number()
});

export type HeroSwapBronze = z.infer<typeof HeroSwapBronzeSchema>;

// Ability 1 Used Event
export const Ability1UsedBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('ability_1_used')
}).merge(playerFields).extend({
  heroDuplicated: z.string()
});

export type Ability1UsedBronze = z.infer<typeof Ability1UsedBronzeSchema>;

// Ability 2 Used Event
export const Ability2UsedBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('ability_2_used')
}).merge(playerFields).extend({
  heroDuplicated: z.string()
});

export type Ability2UsedBronze = z.infer<typeof Ability2UsedBronzeSchema>;

// Offensive Assist Event
export const OffensiveAssistBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('offensive_assist')
}).merge(playerFields).extend({
  heroDuplicated: z.string()
});

export type OffensiveAssistBronze = z.infer<typeof OffensiveAssistBronzeSchema>;

// Defensive Assist Event
export const DefensiveAssistBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('defensive_assist')
}).merge(playerFields).extend({
  heroDuplicated: z.string()
});

export type DefensiveAssistBronze = z.infer<typeof DefensiveAssistBronzeSchema>;

// Ultimate Charged Event
export const UltimateChargedBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('ultimate_charged')
}).merge(playerFields).extend({
  heroDuplicated: z.string(),
  ultimateId: z.number()
});

export type UltimateChargedBronze = z.infer<typeof UltimateChargedBronzeSchema>;

// Ultimate Start Event
export const UltimateStartBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('ultimate_start')
}).merge(playerFields).extend({
  heroDuplicated: z.string(),
  ultimateId: z.number()
});

export type UltimateStartBronze = z.infer<typeof UltimateStartBronzeSchema>;

// Ultimate End Event
export const UltimateEndBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('ultimate_end')
}).merge(playerFields).extend({
  heroDuplicated: z.string(),
  ultimateId: z.number()
});

export type UltimateEndBronze = z.infer<typeof UltimateEndBronzeSchema>;

// Kill Event
export const KillBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('kill')
}).merge(attackFields).extend({
  eventAbility: z.string(),
  eventDamage: z.number(),
  isCriticalHit: z.boolean(),
  isEnvironmental: z.boolean()
});

export type KillBronze = z.infer<typeof KillBronzeSchema>;

// Damage Event
export const DamageBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('damage')
}).merge(attackFields).extend({
  eventAbility: z.string(),
  eventDamage: z.number(),
  isCriticalHit: z.boolean(),
  isEnvironmental: z.boolean()
});

export type DamageBronze = z.infer<typeof DamageBronzeSchema>;

// Healing Event
export const HealingBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('healing'),
  healerTeam: z.string(),
  healerName: z.string(),
  healerHero: z.string(),
  healeeTeam: z.string(),
  healeeName: z.string(),
  healeeHero: z.string(),
  eventAbility: z.string(),
  eventHealing: z.number(),
  isHealthPack: z.boolean()
});

export type HealingBronze = z.infer<typeof HealingBronzeSchema>;

// Mercy Rez Event
export const MercyRezBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('mercy_rez'),
  mercyTeam: z.string(),
  mercyName: z.string(),
  revivedTeam: z.string(),
  revivedName: z.string(),
  revivedHero: z.string(),
  eventAbility: z.string()
});

export type MercyRezBronze = z.infer<typeof MercyRezBronzeSchema>;

// Echo Duplicate Start Event
export const EchoDuplicateStartBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('echo_duplicate_start')
}).merge(playerFields).extend({
  heroDuplicated: z.string(),
  ultimateId: z.number()
});

export type EchoDuplicateStartBronze = z.infer<typeof EchoDuplicateStartBronzeSchema>;

// Echo Duplicate End Event
export const EchoDuplicateEndBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('echo_duplicate_end')
}).merge(playerFields).extend({
  ultimateId: z.number()
});

export type EchoDuplicateEndBronze = z.infer<typeof EchoDuplicateEndBronzeSchema>;

// D.Va Demech Event
export const DvaDemechBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('dva_demech')
}).merge(attackFields).extend({
  eventAbility: z.string(),
  eventDamage: z.number(),
  isCriticalHit: z.boolean(),
  isEnvironmental: z.boolean()
});

export type DvaDemechBronze = z.infer<typeof DvaDemechBronzeSchema>;

// D.Va Remech Event
export const DvaRemechBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('dva_remech')
}).merge(playerFields).extend({
  ultimateId: z.number()
});

export type DvaRemechBronze = z.infer<typeof DvaRemechBronzeSchema>;

// Remech Charged Event
export const RemechChargedBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('remech_charged')
}).merge(playerFields).extend({
  heroDuplicated: z.string(),
  ultimateId: z.number()
});

export type RemechChargedBronze = z.infer<typeof RemechChargedBronzeSchema>;

// Player Stat Event
export const PlayerStatBronzeSchema = BronzeBaseSchema.extend({
  event_type: z.literal('player_stat'),
  roundNumber: z.string().transform(val => parseInt(val, 10)),
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
  heroTimePlayed: z.number()
});

export type PlayerStatBronze = z.infer<typeof PlayerStatBronzeSchema>;

// Map of event types to their schemas
export const BronzeSchemaMap = {
  match_start: MatchStartBronzeSchema,
  match_end: MatchEndBronzeSchema,
  round_start: RoundStartBronzeSchema,
  round_end: RoundEndBronzeSchema,
  setup_complete: SetupCompleteBronzeSchema,
  objective_captured: ObjectiveCapturedBronzeSchema,
  point_progress: PointProgressBronzeSchema,
  payload_progress: PayloadProgressBronzeSchema,
  hero_spawn: HeroSpawnBronzeSchema,
  hero_swap: HeroSwapBronzeSchema,
  ability_1_used: Ability1UsedBronzeSchema,
  ability_2_used: Ability2UsedBronzeSchema,
  offensive_assist: OffensiveAssistBronzeSchema,
  defensive_assist: DefensiveAssistBronzeSchema,
  ultimate_charged: UltimateChargedBronzeSchema,
  ultimate_start: UltimateStartBronzeSchema,
  ultimate_end: UltimateEndBronzeSchema,
  kill: KillBronzeSchema,
  damage: DamageBronzeSchema,
  healing: HealingBronzeSchema,
  mercy_rez: MercyRezBronzeSchema,
  echo_duplicate_start: EchoDuplicateStartBronzeSchema,
  echo_duplicate_end: EchoDuplicateEndBronzeSchema,
  dva_demech: DvaDemechBronzeSchema,
  dva_remech: DvaRemechBronzeSchema,
  remech_charged: RemechChargedBronzeSchema,
  player_stat: PlayerStatBronzeSchema
};