import { Atom, WritableAtom, PrimitiveAtom } from 'jotai';
import { Metric } from '@library/metricUtils';
import teamPlayersAtom from '@atoms/teamPlayers';
import sampleDataEnabledAtom from '@atoms/sampleDataEnabled';
import sampleDataAtom from '@atoms/sampleData';
import logFileInputAtom from '@atoms/logFileInputAtom';
import logFileLoaderAtom from '@atoms/logFileLoaderAtom';
import logFileParserAtom from '@atoms/logFileParserAtom';
import averageMetricPerHeroAtom from '@atoms/averageMetricPerHeroAtom';
import uniqueHeroNamesAtom from '@atoms/uniqueHeroNamesAtom';
import playerStatsBaseAtom from '@atoms/playerStatsBaseAtom';
import uniqueCategoryValuesAtom from '@atoms/uniqueCategoryValuesAtom';
import ability1UsedAtom from '@atoms/ability1Used';
import ability2UsedAtom from '@atoms/ability2Used';
import damageAtom from '@atoms/damage';
import defensiveAssistAtom from '@atoms/defensiveAssist';
import dvaDemechAtom from '@atoms/dvaDemech';
import dvaRemechAtom from '@atoms/dvaRemech';
import healingAtom from '@atoms/healing';
import heroSpawnAtom from '@atoms/heroSpawn';
import heroSwapAtom from '@atoms/heroSwap';
import killAtom from '@atoms/kill';
import matchEndAtom from '@atoms/matchEnd';
import matchStartAtom from '@atoms/matchStart';
import mercyRezAtom from '@atoms/mercyRez';
import offensiveAssistAtom from '@atoms/offensiveAssist';
import playerStatAtom from '@atoms/playerStat';
import roundEndAtom from '@atoms/roundEnd';
import roundStartAtom from '@atoms/roundStart';
import setupCompleteAtom from '@atoms/setupComplete';
import ultimateChargedAtom from '@atoms/ultimateCharged';
import ultimateEndAtom from '@atoms/ultimateEnd';
import ultimateStartAtom from '@atoms/ultimateStart';

// All atoms are of this type
export type ScrimsightAtom<Value> = {
  name: string;
  description: string;
  atom: Atom<Value> | WritableAtom<Value, unknown[], unknown> | PrimitiveAtom<Value>;
};

/**
 * Interface for ability 1 used events
 */
export interface Ability1UsedLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export type Ability1UsedType = Ability1UsedLogEvent[];

/**
 * Interface for ability 2 used events
 */
export interface Ability2UsedLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export type Ability2UsedType = Ability2UsedLogEvent[];

/**
 * Interface for damage events
 */
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

export type DamageType = DamageLogEvent[];

/**
 * Interface for defensive assist events
 */
export interface DefensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export type DefensiveAssistType = DefensiveAssistLogEvent[];

/**
 * Interface for D.Va demech events
 */
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

export type DvaDemechType = DvaDemechLogEvent[];

/**
 * Interface for D.Va remech events
 */
export interface DvaRemechLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  ultimateId: number;
}

export type DvaRemechType = DvaRemechLogEvent[];

/**
 * Interface for healing events
 */
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

export type HealingType = HealingLogEvent[];

/**
 * Interface for hero spawn events
 */
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

export type HeroSpawnType = HeroSpawnLogEvent[];

/**
 * Interface for hero swap events
 */
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

export type HeroSwapType = HeroSwapLogEvent[];

/**
 * Interface for kill events
 */
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

export type KillType = KillLogEvent[];

/**
 * Interface for match end events
 */
export interface MatchEndLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  team1Score: number;
  team2Score: number;
}

export type MatchEndType = MatchEndLogEvent[];

/**
 * Interface for match start events
 */
export interface MatchStartLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  mapName: string;
  mapType: string;
  team1Name: string;
  team2Name: string;
}

export type MatchStartType = MatchStartLogEvent[];

/**
 * Interface for mercy rez events
 */
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

export type MercyRezType = MercyRezLogEvent[];

/**
 * Interface for offensive assist events
 */
export interface OffensiveAssistLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  playerTeam: string;
  playerName: string;
  playerHero: string;
  heroDuplicated: string;
}

export type OffensiveAssistType = OffensiveAssistLogEvent[];

/**
 * Interface for player stat events
 */
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
  // heroTimePlayed: number; // This is always 0 in the log files
}

export type PlayerStatType = PlayerStatLogEvent[];

/**
 * Interface for round end events
 */
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

export type RoundEndType = RoundEndLogEvent[];

/**
 * Interface for round start events
 */
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

export type RoundStartType = RoundStartLogEvent[];

/**
 * Interface for setup complete events
 */
export interface SetupCompleteLogEvent {
  matchId: string;
  type: string;
  matchTime: number;
  roundNumber: number;
  matchTimeRemaining: number;
}

export type SetupCompleteType = SetupCompleteLogEvent[];

/**
 * Interface for ultimate charged events
 */
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

export type UltimateChargedType = UltimateChargedLogEvent[];

/**
 * Interface for ultimate end events
 */
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

export type UltimateEndType = UltimateEndLogEvent[];

/**
 * Interface for ultimate start events
 */
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

export type UltimateStartType = UltimateStartLogEvent[];

export type TeamPlayersType = {
  teamName: string;
  players: string[];
};
export const teamPlayers: ScrimsightAtom<Promise<TeamPlayersType[]>> = {
  name: 'teamPlayers',
  description: 'All players for each team',
  atom: teamPlayersAtom,
};

export type PlayerStatsCategoryKeys = 'matchId' | 'roundNumber' | 'playerTeam' | 'playerName' | 'playerHero' | 'playerRole';

export type PlayerStatsBaseNumericalKeys = 'playtime' | 'eliminations' | 'finalBlows' | 'deaths' | 'allDamageDealt' | 'barrierDamageDealt'
| 'heroDamageDealt' | 'healingDealt' | 'healingReceived' | 'selfHealing' | 'damageTaken' 
| 'damageBlocked' | 'defensiveAssists' | 'offensiveAssists' | 'ultimatesEarned' | 'ultimatesUsed' | 'multikills'
| 'soloKills' | 'objectiveKills' | 'environmentalKills' | 'environmentalDeaths' | 'criticalHits' | 'shotsFired' | 'shotsHit' | 'shotsMissed' | 'scopedShotsFired' | 'scopedShotsHit';

export type PlayerStatsBase = {[k in PlayerStatsCategoryKeys]: string} & {[k in PlayerStatsBaseNumericalKeys]: number};

export type PlayerStatsDerivedNumericalKeys = 'eliminationsPer10Minutes' | 'finalBlowsPer10Minutes' | 'deathsPer10Minutes' | 'allDamageDealtPer10Minutes' | 'barrierDamageDealtPer10Minutes'
| 'heroDamageDealtPer10Minutes' | 'healingDealtPer10Minutes' | 'healingReceivedPer10Minutes' | 'selfHealingPer10Minutes' | 'damageTakenPer10Minutes'
| 'damageBlockedPer10Minutes' | 'defensiveAssistsPer10Minutes' | 'offensiveAssistsPer10Minutes' | 'ultimatesEarnedPer10Minutes' | 'ultimatesUsedPer10Minutes'
| 'multikillsPer10Minutes' | 'soloKillsPer10Minutes' | 'objectiveKillsPer10Minutes' | 'environmentalKillsPer10Minutes' | 'environmentalDeathsPer10Minutes'
| 'criticalHitsPer10Minutes' | 'shotsFiredPer10Minutes' | 'shotsHitPer10Minutes' | 'shotsMissedPer10Minutes' | 'scopedShotsFiredPer10Minutes' | 'scopedShotsHitPer10Minutes'
| 'weaponAccuracy' | 'scopedWeaponAccuracy' | 'criticalHitRate';

export type PlayerStats = PlayerStatsBase & {[k in PlayerStatsDerivedNumericalKeys]: number};

export type PlayerStatsNumericalKeys = PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys;

export const playerStatsBaseNumericalKeys: PlayerStatsBaseNumericalKeys[] = [
  'playtime',
  'eliminations',
  'finalBlows', 
  'deaths',
  'allDamageDealt',
  'barrierDamageDealt',
  'heroDamageDealt',
  'healingDealt',
  'healingReceived',
  'selfHealing',
  'damageTaken',
  'damageBlocked',
  'defensiveAssists',
  'offensiveAssists',
  'ultimatesEarned',
  'ultimatesUsed',
  'multikills',
  'soloKills',
  'objectiveKills',
  'environmentalKills',
  'environmentalDeaths',
  'criticalHits',
  'shotsFired',
  'shotsHit',
  'shotsMissed',
  'scopedShotsFired',
  'scopedShotsHit',
];

export const playerStatsDerivedNumericalKeys: PlayerStatsDerivedNumericalKeys[] = [
  'eliminationsPer10Minutes', 'finalBlowsPer10Minutes',
  'deathsPer10Minutes', 'allDamageDealtPer10Minutes', 'barrierDamageDealtPer10Minutes', 'heroDamageDealtPer10Minutes',
  'healingDealtPer10Minutes', 'healingReceivedPer10Minutes', 'selfHealingPer10Minutes', 'damageTakenPer10Minutes',
  'damageBlockedPer10Minutes', 'defensiveAssistsPer10Minutes', 'offensiveAssistsPer10Minutes', 'ultimatesEarnedPer10Minutes',
  'ultimatesUsedPer10Minutes', 'multikillsPer10Minutes', 'soloKillsPer10Minutes', 'objectiveKillsPer10Minutes', 'environmentalKillsPer10Minutes',
  'environmentalDeathsPer10Minutes', 'criticalHitsPer10Minutes', 'shotsFiredPer10Minutes', 'shotsHitPer10Minutes', 'shotsMissedPer10Minutes', 'scopedShotsFiredPer10Minutes',
  'scopedShotsHitPer10Minutes', 'weaponAccuracy', 'scopedWeaponAccuracy', 'criticalHitRate'
];

export const playerStatsNumericalKeys = [
  ...playerStatsBaseNumericalKeys,
  ...playerStatsDerivedNumericalKeys,
] as PlayerStatsNumericalKeys[];

export const playerStatsCategoryKeys: PlayerStatsCategoryKeys[] = [
  'matchId',
  'roundNumber', 
  'playerTeam',
  'playerName',
  'playerHero',
  'playerRole'
];

export type PlayerStatsBaseType = Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>;
export const playerStatsBase: ScrimsightAtom<Promise<PlayerStatsBaseType>> = {
  name: 'playerStatsBase',
  description: 'The most granular player stats for each round, merging player stat events with hero playtime data.',
  atom: playerStatsBaseAtom,
};

export type UniqueCategoryValuesType = Record<PlayerStatsCategoryKeys, string[]>;
export const uniqueCategoryValues: ScrimsightAtom<Promise<UniqueCategoryValuesType>> = {
  name: 'uniqueCategoryValues',
  description: 'Unique values for each category key, useful for filter dropdowns.',
  atom: uniqueCategoryValuesAtom,
};

export type AverageHeroStatsType = {
  [K in PlayerStatsNumericalKeys]?: number;
};

export type AverageMetricPerHeroType = Record<string, AverageHeroStatsType>; // Explicitly export this type
export const averageMetricPerHero: ScrimsightAtom<Promise<AverageMetricPerHeroType>> = {
  name: 'averageMetricPerHeroAtom',
  description: 'Average metrics per hero across all matches.',
  atom: averageMetricPerHeroAtom,
};

export type UniqueHeroNamesType = string[];
export const uniqueHeroNames: ScrimsightAtom<Promise<UniqueHeroNamesType>> = {
  name: 'uniqueHeroNamesAtom',
  description: 'A list of all unique hero names found in the log files.',
  atom: uniqueHeroNamesAtom,
};

export type SampleDataEnabledType = boolean;
export const sampleDataEnabled: ScrimsightAtom<SampleDataEnabledType> = {
  name: 'sampleDataEnabled',
  description: 'Whether sample data is enabled',
  atom: sampleDataEnabledAtom,
};


export type LogFileInputType = {
  files: File[];
};
export const logFileInput: ScrimsightAtom<LogFileInputType> = {
  name: 'logFileInput',
  description: 'Atom that stores the uploaded log files and provides a setter',
  atom: logFileInputAtom,
};

export type LogFileLoaderType = {
  fileName: string;
  fileModified: number;
  fileContent: string;
}[];
export const sampleData: ScrimsightAtom<LogFileLoaderType> = {
  name: 'sampleData',
  description: 'Sample log file data',
  atom: sampleDataAtom,
};

export const logFileLoader: ScrimsightAtom<Promise<LogFileLoaderType>> = {
  name: 'logFileLoader',
  description: 'Loads the content of uploaded log files',
  atom: logFileLoaderAtom,
};

export interface LogFileParserOutput {
  fileName: string;
  matchId: string;
  logs: {
    specName: string;
    data: object[]; // Changed from object to object[]
  }[];
  fileModified: number;
}

export type LogFileParserAtomType = LogFileParserOutput[];

export const logFileParser: ScrimsightAtom<Promise<LogFileParserAtomType>> = {
  name: 'logFileParser',
  description: 'Parses loaded log files and sample data into structured LogFileParserOutput objects.',
  atom: logFileParserAtom,
};

export const ability1Used: ScrimsightAtom<Promise<Ability1UsedType>> = {
  name: 'ability1Used',
  description: 'Atom that extracts ability 1 used events from the parsed log files.',
  atom: ability1UsedAtom,
};

export const ability2Used: ScrimsightAtom<Promise<Ability2UsedType>> = {
  name: 'ability2Used',
  description: 'Atom that extracts ability 2 used events from the parsed log files.',
  atom: ability2UsedAtom,
};

export const damage: ScrimsightAtom<Promise<DamageType>> = {
  name: 'damage',
  description: 'Atom that extracts damage events from the parsed log files.',
  atom: damageAtom,
};

export const defensiveAssist: ScrimsightAtom<Promise<DefensiveAssistType>> = {
  name: 'defensiveAssist',
  description: 'Atom that extracts defensive assist events from the parsed log files.',
  atom: defensiveAssistAtom,
};

export const dvaDemech: ScrimsightAtom<Promise<DvaDemechType>> = {
  name: 'dvaDemech',
  description: 'Atom that extracts D.Va demech events from the parsed log files.',
  atom: dvaDemechAtom,
};

export const dvaRemech: ScrimsightAtom<Promise<DvaRemechType>> = {
  name: 'dvaRemech',
  description: 'Atom that extracts D.Va remech events from the parsed log files.',
  atom: dvaRemechAtom,
};

export const healing: ScrimsightAtom<Promise<HealingType>> = {
  name: 'healing',
  description: 'Atom that extracts healing events from the parsed log files.',
  atom: healingAtom,
};

export const heroSpawn: ScrimsightAtom<Promise<HeroSpawnType>> = {
  name: 'heroSpawn',
  description: 'Atom that extracts hero spawn events from the parsed log files.',
  atom: heroSpawnAtom,
};

export const heroSwap: ScrimsightAtom<Promise<HeroSwapType>> = {
  name: 'heroSwap',
  description: 'Atom that extracts hero swap events from the parsed log files.',
  atom: heroSwapAtom,
};

export const kill: ScrimsightAtom<Promise<KillType>> = {
  name: 'kill',
  description: 'Atom that extracts kill events from the parsed log files.',
  atom: killAtom,
};

export const matchEnd: ScrimsightAtom<Promise<MatchEndType>> = {
  name: 'matchEnd',
  description: 'Atom that extracts match end events from the parsed log files.',
  atom: matchEndAtom,
};

export const matchStart: ScrimsightAtom<Promise<MatchStartType>> = {
  name: 'matchStart',
  description: 'Atom that extracts match start events from the parsed log files.',
  atom: matchStartAtom,
};

export const mercyRez: ScrimsightAtom<Promise<MercyRezType>> = {
  name: 'mercyRez',
  description: 'Atom that extracts mercy rez events from the parsed log files.',
  atom: mercyRezAtom,
};

export const offensiveAssist: ScrimsightAtom<Promise<OffensiveAssistType>> = {
  name: 'offensiveAssist',
  description: 'Atom that extracts offensive assist events from the parsed log files.',
  atom: offensiveAssistAtom,
};

export const playerStat: ScrimsightAtom<Promise<PlayerStatType>> = {
  name: 'playerStat',
  description: 'Atom that extracts player stat events from the parsed log files.',
  atom: playerStatAtom,
};

export const roundEnd: ScrimsightAtom<Promise<RoundEndType>> = {
  name: 'roundEnd',
  description: 'Atom that extracts round end events from the parsed log files.',
  atom: roundEndAtom,
};

export const roundStart: ScrimsightAtom<Promise<RoundStartType>> = {
  name: 'roundStart',
  description: 'Atom that extracts round start events from the parsed log files.',
  atom: roundStartAtom,
};

export const setupComplete: ScrimsightAtom<Promise<SetupCompleteType>> = {
  name: 'setupComplete',
  description: 'Atom that extracts setup complete events from the parsed log files.',
  atom: setupCompleteAtom,
};

export const ultimateCharged: ScrimsightAtom<Promise<UltimateChargedType>> = {
  name: 'ultimateCharged',
  description: 'Atom that extracts ultimate charged events from the parsed log files.',
  atom: ultimateChargedAtom,
};

export const ultimateEnd: ScrimsightAtom<Promise<UltimateEndType>> = {
  name: 'ultimateEnd',
  description: 'Atom that extracts ultimate end events from the parsed log files.',
  atom: ultimateEndAtom,
};

export const ultimateStart: ScrimsightAtom<Promise<UltimateStartType>> = {
  name: 'ultimateStart',
  description: 'Atom that extracts ultimate start events from the parsed log files.',
  atom: ultimateStartAtom,
};

// Export types that are used by other atoms/modules
export type { PlayerInteractionEvent } from '@atoms/playerInteractionEventsAtom';
export type { MatchData } from '@atoms/matchDataAtom';
