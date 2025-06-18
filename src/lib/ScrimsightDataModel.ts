
export type ScrimID = string;
export type MatchID = string;
export type RoundNumber = 1 | 2 | 3;
export type PlayerName = string;
export type TeamName = string;
export type HeroName = string;
export type MapName = string;
export type Role = 'tank' | 'damage' | 'support';

// These interfaces are used to parse the raw log data into structured events
export interface Ability1UsedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export interface Ability2UsedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export interface DamageLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: string; victimTeam: string; victimName: string; victimHero: string; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export interface DefensiveAssistLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export interface DvaDemechLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: string; victimTeam: string; victimName: string; victimHero: string; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export interface DvaRemechLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; ultimateId: number; }
export interface HealingLogEvent { matchId: string; type: string; matchTime: number; healerTeam: string; healerName: string; healeeTeam: string; healeeName: string; healeeHero: string; eventAbility: string; eventHealing: number; isHealthPack: boolean; }
export interface HeroSpawnLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; previousHero: string; heroTimePlayed: number; }
export interface HeroSwapLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; previousHero: string; heroTimePlayed: number; }
export interface KillLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: string; victimTeam: string; victimName: string; victimHero: string; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export interface MatchEndLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; team1Score: number; team2Score: number; }
export interface MatchStartLogEvent { matchId: string; type: string; matchTime: number; mapName: string; mapType: string; team1Name: string; team2Name: string; }
export interface MercyRezLogEvent { matchId: string; type: string; matchTime: number; mercyTeam: string; mercyName: string; revivedTeam: string; revivedName: string; revivedHero: string; eventAbility: string; }
export interface OffensiveAssistLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export interface PlayerStatLogEvent { matchId: string; type: string; matchTime: number; roundNumber: string; playerTeam: string; playerName: string; playerHero: string; eliminations: number; finalBlows: number; deaths: number; allDamageDealt: number; barrierDamageDealt: number; heroDamageDealt: number; healingDealt: number; healingReceived: number; selfHealing: number; damageTaken: number; damageBlocked: number; defensiveAssists: number; offensiveAssists: number; ultimatesEarned: number; ultimatesUsed: number; multikillBest: number; multikills: number; soloKills: number; objectiveKills: number; environmentalKills: number; environmentalDeaths: number; criticalHits: number; criticalHitAccuracy: number; scopedAccuracy: number; scopedCriticalHitAccuracy: number; scopedCriticalHitKills: number; shotsFired: number; shotsHit: number; shotsMissed: number; scopedShotsFired: number; scopedShotsHit: number; weaponAccuracy: number; }
export interface RoundEndLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; capturingTeam: string; team1Score: number; team2Score: number; objectiveIndex: number; controlTeam1Progress: number; controlTeam2Progress: number; matchTimeRemaining: number; }
export interface RoundStartLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; capturingTeam: string; team1Score: number; team2Score: number; objectiveIndex: number; }
export interface SetupCompleteLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; matchTimeRemaining: number; }
export interface UltimateChargedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; ultimateId: number; }
export interface UltimateEndLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; ultimateId: number; }
export interface UltimateStartLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; ultimateId: number; }


// Player Stats related types
export type PlayerStatsCategoryKeys = 'matchId' | 'roundNumber' | 'playerTeam' | 'playerName' | 'playerHero' | 'playerRole';
export type PlayerStatsBaseNumericalKeys = 'playtime' | 'eliminations' | 'finalBlows' | 'deaths' | 'allDamageDealt' | 'barrierDamageDealt' | 'heroDamageDealt' | 'healingDealt' | 'healingReceived' | 'selfHealing' | 'damageTaken' | 'damageBlocked' | 'defensiveAssists' | 'offensiveAssists' | 'ultimatesEarned' | 'ultimatesUsed' | 'multikills' | 'soloKills' | 'objectiveKills' | 'environmentalKills' | 'environmentalDeaths' | 'criticalHits' | 'shotsFired' | 'shotsHit' | 'shotsMissed' | 'scopedShotsFired' | 'scopedShotsHit';
export type PlayerStatsBase = {[k in PlayerStatsCategoryKeys]: string} & {[k in PlayerStatsBaseNumericalKeys]: number};
export type PlayerStatsDerivedNumericalKeys = 'eliminationsPer10Minutes' | 'finalBlowsPer10Minutes' | 'deathsPer10Minutes' | 'allDamageDealtPer10Minutes' | 'barrierDamageDealtPer10Minutes' | 'heroDamageDealtPer10Minutes' | 'healingDealtPer10Minutes' | 'healingReceivedPer10Minutes' | 'selfHealingPer10Minutes' | 'damageTakenPer10Minutes' | 'damageBlockedPer10Minutes' | 'defensiveAssistsPer10Minutes' | 'offensiveAssistsPer10Minutes' | 'ultimatesEarnedPer10Minutes' | 'ultimatesUsedPer10Minutes' | 'multikillsPer10Minutes' | 'soloKillsPer10Minutes' | 'objectiveKillsPer10Minutes' | 'environmentalKillsPer10Minutes' | 'environmentalDeathsPer10Minutes' | 'criticalHitsPer10Minutes' | 'shotsFiredPer10Minutes' | 'shotsHitPer10Minutes' | 'shotsMissedPer10Minutes' | 'scopedShotsFiredPer10Minutes' | 'scopedShotsHitPer10Minutes' | 'weaponAccuracy' | 'scopedWeaponAccuracy' | 'criticalHitRate';
export type PlayerStats = PlayerStatsBase & {[k in PlayerStatsDerivedNumericalKeys]: number};
export type PlayerStatsNumericalKeys = PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys;

export const playerStatsBaseNumericalKeys: PlayerStatsBaseNumericalKeys[] = [ 'playtime', 'eliminations', 'finalBlows', 'deaths', 'allDamageDealt', 'barrierDamageDealt', 'heroDamageDealt', 'healingDealt', 'healingReceived', 'selfHealing', 'damageTaken', 'damageBlocked', 'defensiveAssists', 'offensiveAssists', 'ultimatesEarned', 'ultimatesUsed', 'multikills', 'soloKills', 'objectiveKills', 'environmentalKills', 'environmentalDeaths', 'criticalHits', 'shotsFired', 'shotsHit', 'shotsMissed', 'scopedShotsFired', 'scopedShotsHit', ];
export const playerStatsDerivedNumericalKeys: PlayerStatsDerivedNumericalKeys[] = [ 'eliminationsPer10Minutes', 'finalBlowsPer10Minutes', 'deathsPer10Minutes', 'allDamageDealtPer10Minutes', 'barrierDamageDealtPer10Minutes', 'heroDamageDealtPer10Minutes', 'healingDealtPer10Minutes', 'healingReceivedPer10Minutes', 'selfHealingPer10Minutes', 'damageTakenPer10Minutes', 'damageBlockedPer10Minutes', 'defensiveAssistsPer10Minutes', 'offensiveAssistsPer10Minutes', 'ultimatesEarnedPer10Minutes', 'ultimatesUsedPer10Minutes', 'multikillsPer10Minutes', 'soloKillsPer10Minutes', 'objectiveKillsPer10Minutes', 'environmentalKillsPer10Minutes', 'environmentalDeathsPer10Minutes', 'criticalHitsPer10Minutes', 'shotsFiredPer10Minutes', 'shotsHitPer10Minutes', 'shotsMissedPer10Minutes', 'scopedShotsFiredPer10Minutes', 'scopedShotsHitPer10Minutes', 'weaponAccuracy', 'scopedWeaponAccuracy', 'criticalHitRate' ];
export const playerStatsNumericalKeys = [...playerStatsBaseNumericalKeys, ...playerStatsDerivedNumericalKeys] as PlayerStatsNumericalKeys[];
export const playerStatsCategoryKeys: PlayerStatsCategoryKeys[] = ['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'];

// Relationships between entities in the data model, used for joining entities

export interface MatchRelationships {
  match: MatchID;
  scrim: ScrimID;
  teams: [TeamName, TeamName];
  map: MapName;
  date: Date;
  rounds: RoundNumber[];
}

export interface ScrimRelationships {
  scrim: ScrimID;
  teams: [TeamName, TeamName];
  matches: MatchID[];
  date: Date;
}

export interface TeamRelationships {
  team: TeamName;
  players: PlayerName[];
  scrims: ScrimID[];
}

export interface PlayerRelationships {
  player: PlayerName;
  teams: TeamName[];
  scrims: ScrimID[];
  matches: MatchID[];
}


// Time segments of a match derived from the log data
export interface MatchTimeSegment {
  matchId: MatchID;
  roundIndex: RoundNumber;
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
}

export interface PlayerLife extends MatchTimeSegment {
  player: PlayerName;
  hero: HeroName;
  causeOfStart: 'spawn' | 'swap';
  causeOfEnd: 'death' | 'swap' | 'round_end';
  eliminations: number;
  assists: number;
  ultimatesUsed: number;
}

interface TeamfightTeamStartState {
  alivePlayers: PlayerName[];
  ultimatesReady: HeroName[];
}

interface TeamfightTeamEndState extends TeamfightTeamStartState {
  ultimatesUsed: HeroName[];
  kills: PlayerName[];
}

export interface Teamfight extends MatchTimeSegment {
  start: {
    team1: TeamfightTeamStartState
    team2: TeamfightTeamStartState;
  };
  end: {
    team1: TeamfightTeamEndState;
    team2: TeamfightTeamEndState;
  };
};

export interface ScrimsightDataModel {
  // Relationships between entities
  matches: MatchRelationships[];
  scrims: ScrimRelationships[];
  teams: TeamRelationships[];
  players: PlayerRelationships[];

  // Computed time segments
  playerLives: PlayerLife[];
  teamfights: Teamfight[];

  // Log events parsed from the raw log files
  ability1Used: Ability1UsedLogEvent[];
  ability2Used: Ability2UsedLogEvent[];
  damage: DamageLogEvent[];
  defensiveAssist: DefensiveAssistLogEvent[];
  dvaDemech: DvaDemechLogEvent[];
  dvaRemech: DvaRemechLogEvent[];
  healing: HealingLogEvent[];
  heroSpawn: HeroSpawnLogEvent[];
  heroSwap: HeroSwapLogEvent[];
  kill: KillLogEvent[];
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
  
