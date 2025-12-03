import { Metric, OverwatchRole } from '@library';

// ============================================================================
// Event Types - Raw log events from parsed files
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

export interface DefensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

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

export interface MatchEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  team1Score: number;
  team2Score: number;
}

export interface MatchStartLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
}

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

export interface OffensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

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

export interface SetupCompleteLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  matchTimeRemaining: number;
}

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
// Match Events - Grouped events for a single match
// ============================================================================

export interface MatchEvents {
  ability1Used: Ability1UsedLogEvent[];
  ability2Used: Ability2UsedLogEvent[];
  damage: DamageLogEvent[];
  defensiveAssist: DefensiveAssistLogEvent[];
  dvaDemech: DvaDemechLogEvent[];
  dvaRemech: DvaRemechLogEvent[];
  healing: HealingLogEvent[];
  heroSpawn: HeroSpawnLogEvent[];
  heroSwap: HeroSwapLogEvent[];
  kills: KillLogEvent[];
  matchEnd: MatchEndLogEvent[];
  matchStart: MatchStartLogEvent[];
  mercyRez: MercyRezLogEvent[];
  offensiveAssist: OffensiveAssistLogEvent[];
  playerStat: PlayerStatLogEvent[];
  roundEnd: RoundEndLogEvent[];
  roundStart: RoundStartLogEvent[];
  setupComplete: SetupCompleteLogEvent[];
  ultimateCharged: UltimateChargedLogEvent[];
  ultimateEnd: UltimateEndLogEvent[];
  ultimateStart: UltimateStartLogEvent[];
}

// ============================================================================
// Player Stats Types
// ============================================================================

export type PlayerStatsCategoryKeys =
  | 'matchId'
  | 'roundNumber'
  | 'playerTeam'
  | 'playerName'
  | 'playerHero'
  | 'playerRole';

export type PlayerStatsBaseNumericalKeys =
  | 'playtime'
  | 'eliminations'
  | 'finalBlows'
  | 'deaths'
  | 'allDamageDealt'
  | 'barrierDamageDealt'
  | 'heroDamageDealt'
  | 'healingDealt'
  | 'healingReceived'
  | 'selfHealing'
  | 'damageTaken'
  | 'damageBlocked'
  | 'defensiveAssists'
  | 'offensiveAssists'
  | 'ultimatesEarned'
  | 'ultimatesUsed'
  | 'multikills'
  | 'soloKills'
  | 'objectiveKills'
  | 'environmentalKills'
  | 'environmentalDeaths'
  | 'criticalHits'
  | 'shotsFired'
  | 'shotsHit'
  | 'shotsMissed'
  | 'scopedShotsFired'
  | 'scopedShotsHit';

export type PlayerStatsDerivedNumericalKeys =
  | 'eliminationsPer10Minutes'
  | 'finalBlowsPer10Minutes'
  | 'deathsPer10Minutes'
  | 'allDamageDealtPer10Minutes'
  | 'barrierDamageDealtPer10Minutes'
  | 'heroDamageDealtPer10Minutes'
  | 'healingDealtPer10Minutes'
  | 'healingReceivedPer10Minutes'
  | 'selfHealingPer10Minutes'
  | 'damageTakenPer10Minutes'
  | 'damageBlockedPer10Minutes'
  | 'defensiveAssistsPer10Minutes'
  | 'offensiveAssistsPer10Minutes'
  | 'ultimatesEarnedPer10Minutes'
  | 'ultimatesUsedPer10Minutes'
  | 'multikillsPer10Minutes'
  | 'soloKillsPer10Minutes'
  | 'objectiveKillsPer10Minutes'
  | 'environmentalKillsPer10Minutes'
  | 'environmentalDeathsPer10Minutes'
  | 'criticalHitsPer10Minutes'
  | 'shotsFiredPer10Minutes'
  | 'shotsHitPer10Minutes'
  | 'shotsMissedPer10Minutes'
  | 'scopedShotsFiredPer10Minutes'
  | 'scopedShotsHitPer10Minutes'
  | 'weaponAccuracy'
  | 'scopedWeaponAccuracy'
  | 'criticalHitRate';

export type PlayerStatsNumericalKeys = PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys;

export type PlayerStatsBase = { [k in PlayerStatsCategoryKeys]: string } & {
  [k in PlayerStatsBaseNumericalKeys]: number;
};

export type PlayerStats = PlayerStatsBase & { [k in PlayerStatsDerivedNumericalKeys]: number };

// ============================================================================
// Teamfight Types
// ============================================================================

export interface Teamfight {
  fightId: string;
  matchId: string;
  startTime: number;
  endTime: number;
  team1Name: string;
  team2Name: string;
  winner: string | null;
  duration: number;
  team1Kills: number;
  team2Kills: number;
  team1PlayersWithUltimatesChargedAtStart: string[];
  team2PlayersWithUltimatesChargedAtStart: string[];
  team1PlayersWithUltimatesUsed: string[];
  team2PlayersWithUltimatesUsed: string[];
  firstKillPlayer?: string;
  firstKillTeam?: string;
  firstKillTime?: number;
  firstDeathPlayer?: string;
  firstDeathTeam?: string;
  firstDeathTime?: number;
}

// ============================================================================
// Timeline Types
// ============================================================================

export interface RoundTimes {
  matchId: string;
  roundNumber: number;
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
  roundDuration: number;
}

export interface MapTimes {
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface PlayerStatusEntry {
  timestamp: number;
  team1Players: Set<string>;
  team2Players: Set<string>;
}

export type PlayerStatusTimeline = PlayerStatusEntry[];

// ============================================================================
// Ultimate Event Types
// ============================================================================

export interface UltimateEvent {
  id: string;
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  ultimateId: string;
  ultimateChargedTime: number;
  ultimateStartTime: number;
  ultimateEndTime: number;
  ultimateHoldTime: number;
}

// ============================================================================
// Scrim Types
// ============================================================================

export interface Scrim {
  dateString: string;
  team1Name: string;
  team2Name: string;
  team1Players: string[];
  team2Players: string[];
  team1Wins: number;
  team2Wins: number;
  draws: number;
  matchIds: string[];
  duration: number;
}

// ============================================================================
// Team Stats Types
// ============================================================================

export interface TeamStats {
  teamName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  mostRecentGameDate: Date | null;
  players: string[];
}

// ============================================================================
// Match Metadata
// ============================================================================

export interface MatchMetadata {
  matchId: string;
  fileName: string;
  fileModified: number;
  dateString: string;
  timeString: string;
  map: string;
  mode: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  team1Players: string[];
  team2Players: string[];
  duration: number;
  roundWinners: ('team1' | 'team2' | 'draw')[];
  winner: string | null;
}

// ============================================================================
// Processed Match - The "Database Schema"
// ============================================================================

export interface ProcessedMatch {
  // Core metadata
  metadata: MatchMetadata;

  // Raw events (grouped by type)
  events: MatchEvents;

  // Pre-calculated derived data
  teamfights: Teamfight[];
  playerStats: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>;
  roundTimes: RoundTimes[];
  mapTimes: MapTimes;
  playerStatusTimeline: Map<string, PlayerStatusTimeline>;
  ultimateEvents: UltimateEvent[];
}

// ============================================================================
// Repository State
// ============================================================================

export type RepositoryState = Record<string, ProcessedMatch>;

// ============================================================================
// Legacy exports for backward compatibility during migration
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

// Re-export types from library
export type { Metric, OverwatchRole };
