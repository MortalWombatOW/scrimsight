
// Hero lists by role
export const TANK_HEROES = [ 'D.Va', 'Orisa', 'Reinhardt', 'Roadhog', 'Winston', 'Sigma', 'Wrecking Ball', 'Zarya', 'Rammatra', 'Mauga', 'Junker Queen', 'Hazard'] as const;
export const DAMAGE_HEROES = ['Ashe', 'Bastion', 'Cassidy', 'McCree', 'Doomfist', 'Echo', 'Genji', 'Hanzo', 'Junkrat', 'Mei', 'Pharah', 'Reaper', 'Soldier: 76', 'Sombra', 'Symmetra', 'Torbjörn', 'Tracer', 'Widowmaker', 'Sojourn'] as const;
export const SUPPORT_HEROES = ['Ana', 'Baptiste', 'Brigitte', 'Lúcio', 'Mercy', 'Moira', 'Zenyatta', 'Kiriko', 'Lifeweaver', 'Illari', 'Juno'] as const;
export const ROLES = ['tank', 'damage', 'support'] as const;
export const MAP_NAMES = ['Antarctic Peninsula', 'Busan', 'Ilios', 'Lijiang Tower', 'Nepal', 'Oasis', 'Samoa', 'Circuit Royal', 'Dorado', 'Havana', 'Junkertown', 'Rialto', 'Route 66', 'Shambali Monastary', 'Watchpoint: Gibraltar', 'New Junk City', 'Suravasa', 'Blizzard World', 'Eichenwalde', 'Hollywood', 'King\'s Row', 'Midtown', 'Numbani', 'Paraiso', 'Colosseo', 'Esperanca', 'New Queen Street', 'Runasapi', 'Hanaoka', 'Throne of Anubis'] as const;
export const GAME_MODES = ['Control', 'Escort', 'Hybrid', 'Flashpoint', 'Push', 'Clash'] as const;


export type ScrimID = string;
export type MatchID = string;
export type RoundNumber = 1 | 2 | 3;
export type PlayerName = string;
export type TeamName = string;
export type Hero = typeof TANK_HEROES[number] | typeof DAMAGE_HEROES[number] | typeof SUPPORT_HEROES[number];

export type GameMode = typeof GAME_MODES[number];
export type Role = typeof ROLES[number];
export type MapName = typeof MAP_NAMES[number];

// These interfaces are used to parse the raw log data into structured events
export interface Ability1UsedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; heroDuplicated: string; }
export interface Ability2UsedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; heroDuplicated: string; }
export interface DamageLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: Hero; victimTeam: string; victimName: string; victimHero: Hero; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export interface DefensiveAssistLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; heroDuplicated: string; }
export interface DvaDemechLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: Hero; victimTeam: string; victimName: string; victimHero: Hero; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export interface DvaRemechLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; ultimateId: number; }
export interface HealingLogEvent { matchId: string; type: string; matchTime: number; healerTeam: string; healerName: string; healeeTeam: string; healeeName: string; healeeHero: Hero; eventAbility: string; eventHealing: number; isHealthPack: boolean; }
export interface HeroSpawnLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; previousHero: Hero; heroTimePlayed: number; }
export interface HeroSwapLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; previousHero: Hero; heroTimePlayed: number; }
export interface KillLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: Hero; victimTeam: string; victimName: string; victimHero: Hero; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export interface MatchEndLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; team1Score: number; team2Score: number; }
export interface MatchStartLogEvent { matchId: string; type: string; matchTime: number; mapName: MapName; mapType: GameMode; team1Name: string; team2Name: string; }
export interface MercyRezLogEvent { matchId: string; type: string; matchTime: number; mercyTeam: string; mercyName: string; revivedTeam: string; revivedName: string; revivedHero: Hero; eventAbility: string; }
export interface OffensiveAssistLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; heroDuplicated: string; }
export interface PlayerStatLogEvent { matchId: string; type: string; matchTime: number; roundNumber: string; playerTeam: string; playerName: string; playerHero: Hero; eliminations: number; finalBlows: number; deaths: number; allDamageDealt: number; barrierDamageDealt: number; heroDamageDealt: number; healingDealt: number; healingReceived: number; selfHealing: number; damageTaken: number; damageBlocked: number; defensiveAssists: number; offensiveAssists: number; ultimatesEarned: number; ultimatesUsed: number; multikillBest: number; multikills: number; soloKills: number; objectiveKills: number; environmentalKills: number; environmentalDeaths: number; criticalHits: number; criticalHitAccuracy: number; scopedAccuracy: number; scopedCriticalHitAccuracy: number; scopedCriticalHitKills: number; shotsFired: number; shotsHit: number; shotsMissed: number; scopedShotsFired: number; scopedShotsHit: number; weaponAccuracy: number; }
export interface RoundEndLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; capturingTeam: string; team1Score: number; team2Score: number; objectiveIndex: number; controlTeam1Progress: number; controlTeam2Progress: number; matchTimeRemaining: number; }
export interface RoundStartLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; capturingTeam: string; team1Score: number; team2Score: number; objectiveIndex: number; }
export interface SetupCompleteLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; matchTimeRemaining: number; }
export interface UltimateChargedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; heroDuplicated: string; ultimateId: number; }
export interface UltimateEndLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; heroDuplicated: string; ultimateId: number; }
export interface UltimateStartLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: Hero; heroDuplicated: string; ultimateId: number; }

// Player Stats - Three-Stage Computation System
// Stage 1: Base stats collection (summable values only)
// Stage 2: Aggregation (group and sum base stats)  
// Stage 3: Derived computation (calculate ratios and per-time metrics)

// Categories by which to group player stats
export const playerStatsCategoryKeys = ['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'] as const;
export type PlayerStatsCategoryKeys = typeof playerStatsCategoryKeys[number];

// Base numerical stats that can be safely summed across players/rounds/matches
export const playerStatsBaseNumericalKeys = [ 
  'playtime', 'eliminations', 'finalBlows', 'deaths', 'allDamageDealt', 'barrierDamageDealt', 
  'heroDamageDealt', 'healingDealt', 'healingReceived', 'selfHealing', 'damageTaken', 
  'damageBlocked', 'defensiveAssists', 'offensiveAssists', 'ultimatesEarned', 'ultimatesUsed', 
  'multikills', 'soloKills', 'objectiveKills', 'environmentalKills', 'environmentalDeaths', 
  'criticalHits', 'shotsFired', 'shotsHit', 'shotsMissed', 'scopedShotsFired', 'scopedShotsHit'
] as const;
export type PlayerStatsBaseNumericalKeys = typeof playerStatsBaseNumericalKeys[number];

// Derived stats computed from aggregated base stats (NOT summable)
export const playerStatsDerivedNumericalKeys = [ 
  'eliminationsPer10Minutes', 'finalBlowsPer10Minutes', 'deathsPer10Minutes', 'allDamageDealtPer10Minutes', 
  'barrierDamageDealtPer10Minutes', 'heroDamageDealtPer10Minutes', 'healingDealtPer10Minutes', 
  'healingReceivedPer10Minutes', 'selfHealingPer10Minutes', 'damageTakenPer10Minutes', 
  'damageBlockedPer10Minutes', 'defensiveAssistsPer10Minutes', 'offensiveAssistsPer10Minutes', 
  'ultimatesEarnedPer10Minutes', 'ultimatesUsedPer10Minutes', 'multikillsPer10Minutes', 
  'soloKillsPer10Minutes', 'objectiveKillsPer10Minutes', 'environmentalKillsPer10Minutes', 
  'environmentalDeathsPer10Minutes', 'criticalHitsPer10Minutes', 'shotsFiredPer10Minutes', 
  'shotsHitPer10Minutes', 'shotsMissedPer10Minutes', 'scopedShotsFiredPer10Minutes', 
  'scopedShotsHitPer10Minutes', 'weaponAccuracy', 'scopedWeaponAccuracy', 'criticalHitRate',
  'ultsUsed', // The number of ultimates used by this player
  'ultKills', // The number of kills by this player while their ultimate was active (between ult used/start and ult end)
  'killsPerUltimate', // = ultKills / ultsUsed
  'teamfightsParticipated', // The number of teamfights this player participated in
  'teamfightsWithFirstKill', // The number of teamfights this player participated in and the player made the first kill during the fight
  'teamfightsWithFirstDeath', // The number of teamfights this player participated in and the player/team had the first death during the fight
  'firstKillRate', // = teamfightsWithFirstKill / teamfightsParticipated
  'firstDeathRate', // = teamfightsWithFirstDeath / teamfightsParticipated
  'teamfightsWon', // The number of teamfights this player participated in and their team won
  'teamfightsWonWithUlt', // The number of teamfights this player participated in and their team won and the player used their ultimate during the fight
  'teamfightsWonWithoutUlt', // = teamfightsWon - teamfightsWonWithUlt
  'teamfightWinRate', // = teamfightsWon / teamfightsParticipated
  'teamfightWinRateWithUlt', // = teamfightsWonWithUlt / teamfightsParticipated
  'teamfightWinRateWithoutUlt', // = teamfightsWonWithoutUlt / teamfightsParticipated
  'teamfightsWonWithFirstKill', // The number of teamfights this player/team participated in and their team won and the player made the first kill during the fight
  'teamfightsWonWithFirstDeath', // The number of teamfights this player/team participated in and their team won and the player/team had the first death during the fight
  'teamfightWinRateWithFirstKill', // = teamfightsWonWithFirstKill / teamfightsParticipated
  'teamfightWinRateWithFirstDeath', // = teamfightsWonWithFirstDeath / teamfightsParticipated
  'ultimateChargeTime', // The time in seconds it took for this player to charge their ultimate
  'ultimateHoldTime', // The time in seconds it took for this player to use their ultimate after it was charged
  'ultimateUseTime', // The time in seconds it this player had their ultimate active
  'deathsWithUltAvailable', // The number of deaths while the player had their ultimate available
  'tankKills', // The number of tank kills this player made
  'damageKills', // The number of damage kills this player made
  'supportKills', // The number of support kills this player made
  'tankFocusRate', // = tankKills / eliminations
  'damageFocusRate', // = damageKills / eliminations
  'supportFocusRate', // = supportKills / eliminations
  'averageLifeDuration', // The average life duration of this player
  'totalAssists', // The total number of assists this player made, both offensive and defensive
  'totalAssistsPer10Minutes', // The total number of assists this player made, both offensive and defensive, per 10 minutes
  'damagePerKill', // The average damage per kill this player made
  'damageDonePerHealingReceived', // The average damage done per healing received this player received
] as const;
export type PlayerStatsDerivedNumericalKeys = typeof playerStatsDerivedNumericalKeys[number];

// Stage 1: Raw base stats with categorization info
export type PlayerStatsBase = {
  // Categorization fields, declared inline because of specific types
  matchId: MatchID;
  roundNumber: string;
  playerTeam: TeamName;
  playerName: PlayerName;
  playerHero: Hero;
  playerRole: Role;
} & Record<PlayerStatsBaseNumericalKeys, number>;

// Stage 2: Aggregated base stats (base numerical fields only)
export type PlayerStatsAggregatedBase = Record<PlayerStatsBaseNumericalKeys, number>;

// Stage 3: Final stats with derived calculations
export type PlayerStatsFinal = PlayerStatsAggregatedBase & Record<PlayerStatsDerivedNumericalKeys, number>;

// Helper interface for numerical stats only (used in intersection types)
export type PlayerStatsNumerical = Record<PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys, number>;

// Legacy interface for backward compatibility
export type PlayerStats = PlayerStatsBase & Record<PlayerStatsDerivedNumericalKeys, number>;
export type PlayerStatsNumericalKeys = PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys;
export const playerStatsNumericalKeys = [...playerStatsBaseNumericalKeys, ...playerStatsDerivedNumericalKeys] as PlayerStatsNumericalKeys[];

// Ranking direction for each player stat metric
// 'higher' means rank 1 = highest value, 'lower' means rank 1 = lowest value
export const PLAYER_STAT_RANKING_DIRECTIONS: Record<PlayerStatsNumericalKeys, 'higher' | 'lower'> = {
  // Base stats - generally higher is better except for deaths
  playtime: 'higher',
  eliminations: 'higher',
  finalBlows: 'higher',
  deaths: 'lower', // Lower deaths = better
  allDamageDealt: 'higher',
  barrierDamageDealt: 'higher',
  heroDamageDealt: 'higher',
  healingDealt: 'higher',
  healingReceived: 'higher',
  selfHealing: 'higher',
  damageTaken: 'higher', // Context-dependent, but generally tanking damage for team is positive
  damageBlocked: 'higher',
  defensiveAssists: 'higher',
  offensiveAssists: 'higher',
  ultimatesEarned: 'higher',
  ultimatesUsed: 'higher',
  multikills: 'higher',
  soloKills: 'higher',
  objectiveKills: 'higher',
  environmentalKills: 'higher',
  environmentalDeaths: 'lower', // Lower environmental deaths = better
  criticalHits: 'higher',
  shotsFired: 'higher',
  shotsHit: 'higher',
  shotsMissed: 'lower', // Lower missed shots = better
  scopedShotsFired: 'higher',
  scopedShotsHit: 'higher',
  
  // Per-10-minute derived stats (same direction as base stats)
  eliminationsPer10Minutes: 'higher',
  finalBlowsPer10Minutes: 'higher',
  deathsPer10Minutes: 'lower', // Lower deaths per 10 minutes = better
  allDamageDealtPer10Minutes: 'higher',
  barrierDamageDealtPer10Minutes: 'higher',
  heroDamageDealtPer10Minutes: 'higher',
  healingDealtPer10Minutes: 'higher',
  healingReceivedPer10Minutes: 'higher',
  selfHealingPer10Minutes: 'higher',
  damageTakenPer10Minutes: 'higher',
  damageBlockedPer10Minutes: 'higher',
  defensiveAssistsPer10Minutes: 'higher',
  offensiveAssistsPer10Minutes: 'higher',
  ultimatesEarnedPer10Minutes: 'higher',
  ultimatesUsedPer10Minutes: 'higher',
  multikillsPer10Minutes: 'higher',
  soloKillsPer10Minutes: 'higher',
  objectiveKillsPer10Minutes: 'higher',
  environmentalKillsPer10Minutes: 'higher',
  environmentalDeathsPer10Minutes: 'lower', // Lower environmental deaths per 10 minutes = better
  criticalHitsPer10Minutes: 'higher',
  shotsFiredPer10Minutes: 'higher',
  shotsHitPer10Minutes: 'higher',
  shotsMissedPer10Minutes: 'lower', // Lower missed shots per 10 minutes = better
  scopedShotsFiredPer10Minutes: 'higher',
  scopedShotsHitPer10Minutes: 'higher',
  
  // Percentage/ratio derived stats - higher is better
  weaponAccuracy: 'higher',
  scopedWeaponAccuracy: 'higher',
  criticalHitRate: 'higher',
  
  // Ultimate-related derived stats
  ultsUsed: 'higher',
  ultKills: 'higher',
  killsPerUltimate: 'higher',
  ultimateChargeTime: 'lower', // Faster charge time = better
  ultimateHoldTime: 'lower', // Faster hold time = better
  ultimateUseTime: 'higher', // Longer ultimate duration = better
  deathsWithUltAvailable: 'lower', // Lower deaths with ult available = better
  
  // Teamfight participation stats
  teamfightsParticipated: 'higher',
  teamfightsWithFirstKill: 'higher',
  teamfightsWithFirstDeath: 'lower', // Lower first deaths = better
  firstKillRate: 'higher',
  firstDeathRate: 'lower', // Lower first death rate = better
  teamfightsWon: 'higher',
  teamfightsWonWithUlt: 'higher',
  teamfightsWonWithoutUlt: 'higher',
  teamfightWinRate: 'higher',
  teamfightWinRateWithUlt: 'higher',
  teamfightWinRateWithoutUlt: 'higher',
  teamfightsWonWithFirstKill: 'higher',
  teamfightsWonWithFirstDeath: 'higher', // Still positive if team wins despite first death
  teamfightWinRateWithFirstKill: 'higher',
  teamfightWinRateWithFirstDeath: 'higher', // Still positive if team wins despite first death
  
  // Kill-by-role stats
  tankKills: 'higher',
  damageKills: 'higher',
  supportKills: 'higher',
  tankFocusRate: 'higher', // Context-dependent, but generally good to prioritize tanks
  damageFocusRate: 'higher',
  supportFocusRate: 'higher', // High support focus is generally good
  
  // Additional derived stats
  averageLifeDuration: 'higher', // Longer life duration = better
  totalAssists: 'higher',
  totalAssistsPer10Minutes: 'higher',
  damagePerKill: 'higher', // More damage per kill = more efficient
  damageDonePerHealingReceived: 'higher' // More damage output per healing received = efficient
} as const;

// Display names for all player stat metrics
export const METRIC_DISPLAY_NAME: Record<PlayerStatsNumericalKeys, string> = {
  // Base stats
  playtime: "Playtime",
  eliminations: "Eliminations",
  finalBlows: "Final Blows",
  deaths: "Deaths",
  allDamageDealt: "All Damage Dealt",
  barrierDamageDealt: "Barrier Damage Dealt",
  heroDamageDealt: "Hero Damage Dealt",
  healingDealt: "Healing Dealt",
  healingReceived: "Healing Received",
  selfHealing: "Self Healing",
  damageTaken: "Damage Taken",
  damageBlocked: "Damage Blocked",
  defensiveAssists: "Defensive Assists",
  offensiveAssists: "Offensive Assists",
  ultimatesEarned: "Ultimates Earned",
  ultimatesUsed: "Ultimates Used",
  multikills: "Multikills",
  soloKills: "Solo Kills",
  objectiveKills: "Objective Kills",
  environmentalKills: "Environmental Kills",
  environmentalDeaths: "Environmental Deaths",
  criticalHits: "Critical Hits",
  shotsFired: "Shots Fired",
  shotsHit: "Shots Hit",
  shotsMissed: "Shots Missed",
  scopedShotsFired: "Scoped Shots Fired",
  scopedShotsHit: "Scoped Shots Hit",

  // Per-10-minute derived stats
  eliminationsPer10Minutes: "Eliminations/10min",
  finalBlowsPer10Minutes: "Final Blows/10min",
  deathsPer10Minutes: "Deaths/10min",
  allDamageDealtPer10Minutes: "All Damage/10min",
  barrierDamageDealtPer10Minutes: "Barrier Damage/10min",
  heroDamageDealtPer10Minutes: "Hero Damage/10min",
  healingDealtPer10Minutes: "Healing/10min",
  healingReceivedPer10Minutes: "Healing Received/10min",
  selfHealingPer10Minutes: "Self Healing/10min",
  damageTakenPer10Minutes: "Damage Taken/10min",
  damageBlockedPer10Minutes: "Damage Blocked/10min",
  defensiveAssistsPer10Minutes: "Defensive Assists/10min",
  offensiveAssistsPer10Minutes: "Offensive Assists/10min",
  ultimatesEarnedPer10Minutes: "Ultimates Earned/10min",
  ultimatesUsedPer10Minutes: "Ultimates Used/10min",
  multikillsPer10Minutes: "Multikills/10min",
  soloKillsPer10Minutes: "Solo Kills/10min",
  objectiveKillsPer10Minutes: "Objective Kills/10min",
  environmentalKillsPer10Minutes: "Environmental Kills/10min",
  environmentalDeathsPer10Minutes: "Environmental Deaths/10min",
  criticalHitsPer10Minutes: "Critical Hits/10min",
  shotsFiredPer10Minutes: "Shots Fired/10min",
  shotsHitPer10Minutes: "Shots Hit/10min",
  shotsMissedPer10Minutes: "Shots Missed/10min",
  scopedShotsFiredPer10Minutes: "Scoped Shots Fired/10min",
  scopedShotsHitPer10Minutes: "Scoped Shots Hit/10min",

  // Percentage/ratio derived stats
  weaponAccuracy: "Weapon Accuracy",
  scopedWeaponAccuracy: "Scoped Accuracy",
  criticalHitRate: "Critical Hit Rate",

  // Ultimate-related derived stats
  ultsUsed: "Ultimates Used",
  ultKills: "Ultimate Kills",
  killsPerUltimate: "Kills/Ultimate",
  ultimateChargeTime: "Ultimate Charge Time",
  ultimateHoldTime: "Ultimate Hold Time",
  ultimateUseTime: "Ultimate Use Time",
  deathsWithUltAvailable: "Deaths w/ Ult Available",

  // Teamfight participation stats
  teamfightsParticipated: "Teamfights Participated",
  teamfightsWithFirstKill: "Teamfights w/ First Kill",
  teamfightsWithFirstDeath: "Teamfights w/ First Death",
  firstKillRate: "First Kill Rate",
  firstDeathRate: "First Death Rate",
  teamfightsWon: "Teamfights Won",
  teamfightsWonWithUlt: "Teamfights Won w/ Ult",
  teamfightsWonWithoutUlt: "Teamfights Won w/o Ult",
  teamfightWinRate: "Teamfight Win Rate",
  teamfightWinRateWithUlt: "Win Rate w/ Ult",
  teamfightWinRateWithoutUlt: "Win Rate w/o Ult",
  teamfightsWonWithFirstKill: "Teamfights Won w/ First Kill",
  teamfightsWonWithFirstDeath: "Teamfights Won w/ First Death",
  teamfightWinRateWithFirstKill: "Win Rate w/ First Kill",
  teamfightWinRateWithFirstDeath: "Win Rate w/ First Death",

  // Kill-by-role stats
  tankKills: "Tank Kills",
  damageKills: "Damage Kills",
  supportKills: "Support Kills",
  tankFocusRate: "Tank Focus Rate",
  damageFocusRate: "Damage Focus Rate",
  supportFocusRate: "Support Focus Rate",

  // Additional derived stats
  averageLifeDuration: "Avg Life Duration",
  totalAssists: "Total Assists",
  totalAssistsPer10Minutes: "Assists/10min",
  damagePerKill: "Damage/Kill",
  damageDonePerHealingReceived: "Damage/Healing Received",
} as const;


// Relationships between entities in the data model, used for joining entities

export interface MatchRelationships {
  match: MatchID;
  scrim: ScrimID;
  teams: [TeamName, TeamName];
  map: MapName;
  date: Date;
  rounds: RoundNumber[];
  duration: number; // in seconds, sum of all round durations
  team1Score: number;
  team2Score: number;
  winningTeam: TeamName;
  gameMode: GameMode;
}

export interface ScrimRelationships {
  scrim: ScrimID;
  teams: [TeamName, TeamName];
  matches: MatchID[];
  date: Date;
  team1MatchesWon: number;
  team2MatchesWon: number;
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

export interface Round extends MatchTimeSegment {
  team1Score: number;
  team2Score: number;
  winningTeam: TeamName;
}

export interface PlayerLife extends MatchTimeSegment {
  player: PlayerName;
  hero: Hero;
  causeOfStart: 'spawn' | 'swap';
  causeOfEnd: 'death' | 'swap' | 'round_end';
  eliminations: number;
  assists: number;
  ultimatesUsed: number;
}

interface TeamfightTeamStartState {
  teamName: TeamName;
  alivePlayers: PlayerName[];
  ultimatesReady: Hero[];
}

interface TeamfightTeamEndState extends TeamfightTeamStartState {
  ultimatesUsed: Hero[];
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
  // Team with most players alive at the end of the fight
  winner: TeamName;
  team1KillsPerUlt: number;
  team2KillsPerUlt: number;
};

export interface TeamComposition {
  tank: Hero[];
  damage: Hero[];
  support: Hero[];
}

// Tracks the composition of each team during a match
export interface TeamCompositionSegment extends MatchTimeSegment {
  team: TeamName;
  composition: TeamComposition;
  // Who was playing what heroes
  playerHeroes: {
    playerName: PlayerName;
    playerHero: Hero;
  }[];
  // Broken down by tank, damage, and support roles
  heroesByRole: {
    role: Role;
    heroes: Hero[];
  }[];
};

export interface TeamCompositionTotals {
  team: TeamName;
  composition: TeamComposition;
  totalDuration: number;
  totalEliminations: number;
  totalDeaths: number;
  kdr: number; // = totalEliminations / totalDeaths
  totalTeamfightsParticipated: number;
  totalTeamfightsWon: number;
  teamfightWinRate: number; // = totalTeamfightsWon / totalTeamfightsParticipated
};
  

export interface PlayerVictimKillCount {
  player: PlayerName;
  victim: PlayerName;
  killCount: number;
}

export interface PlayerStatBreakdown {
  total: PlayerStatsNumerical;
  byPlayer: ({playerName: PlayerName} & PlayerStatsNumerical)[];
  byTeam: ({playerTeam: TeamName} & PlayerStatsNumerical)[];
  byTeamAndPlayer: ({playerTeam: TeamName, playerName: PlayerName} & PlayerStatsNumerical)[];
  byTeamAndPlayerAndMatch: ({playerTeam: TeamName, playerName: PlayerName, matchId: MatchID} & PlayerStatsNumerical)[];
  byTeamAndPlayerAndScrim: ({playerTeam: TeamName, playerName: PlayerName, scrim: ScrimID} & PlayerStatsNumerical)[];
  byPlayerAndHero: ({playerName: PlayerName, playerHero: Hero} & PlayerStatsNumerical)[];
  byRole: ({playerRole: Role} & PlayerStatsNumerical)[];
  byHero: ({playerHero: Hero} & PlayerStatsNumerical)[];
  byTeamAndMatch: ({playerTeam: TeamName, matchId: MatchID} & PlayerStatsNumerical)[];
  byTeamAndScrim: ({playerTeam: TeamName, scrim: ScrimID} & PlayerStatsNumerical)[];
 };

export interface ScrimsightDataModel {
 
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

  // Relationships between entities
   matches: MatchRelationships[];
   scrims: ScrimRelationships[];
   teams: TeamRelationships[];
   players: PlayerRelationships[];

   // Computed time segments
   playerLives: PlayerLife[];
   teamfights: Teamfight[];
   rounds: Round[];
   teamCompositions: TeamCompositionSegment[];
 
   // Player stats with three-stage computation (base aggregation + derived calculations)
   // PlayerStatBreakdown holds the values of the statistics
   playerStatBreakdown: PlayerStatBreakdown;
   // PlayerStatBreakdownRanks holds the ranks of the statistics
   playerStatBreakdownRanks: PlayerStatBreakdown;

    // Tracks the number of kills per player and victim
    killCounts: {
      byMatch: ({matchId: MatchID} & PlayerVictimKillCount)[]; // grouped by match
      byMatchAndRound: ({matchId: MatchID, roundNumber: RoundNumber} & PlayerVictimKillCount)[]; // grouped by match and round
    };
}

  
export interface ScrimsightMetricFocus {
  focus: string;
  description: string;
  primaryMetrics: PlayerStatsNumericalKeys[];
  secondaryMetrics: PlayerStatsNumericalKeys[];
}

export const METRIC_FOCUS: ScrimsightMetricFocus[] = [
  {
    focus: 'Offensive Impact',
    description: 'The ability to secure kills and deal damage to your opponents is critical for securing wins.',
    primaryMetrics: ['finalBlowsPer10Minutes', 'heroDamageDealtPer10Minutes', 'firstKillRate', ],
    secondaryMetrics: ['eliminationsPer10Minutes', 'allDamageDealtPer10Minutes', 'tankFocusRate', 'damageFocusRate', 'supportFocusRate']
  },
  {
    focus: 'Survivability',
    description: 'The ability to survive and withstand enemy attacks is essential, as losing a player early can be costly.',
    primaryMetrics: ['deathsPer10Minutes', 'firstDeathRate', 'teamfightWinRateWithFirstDeath'],
    secondaryMetrics: ['damageTakenPer10Minutes', 'averageLifeDuration', 'deathsWithUltAvailable', 'selfHealingPer10Minutes']
  },
  {
    focus: 'Utility',
    description: 'Support and space creation are essential to enabling a team to win.',
    primaryMetrics: ['healingDealtPer10Minutes', 'totalAssistsPer10Minutes', 'damageBlockedPer10Minutes'],
    secondaryMetrics: ['offensiveAssistsPer10Minutes', 'defensiveAssistsPer10Minutes', 'ultimatesUsedPer10Minutes', 'teamfightWinRate']
  },
  {
    focus: 'Efficiency',
    description: 'Being able to take advantage of opportunities and make the most of your resources is crucial.',
    primaryMetrics: ['weaponAccuracy', 'killsPerUltimate', 'damageDonePerHealingReceived', 'damagePerKill'],
    secondaryMetrics: ['criticalHitRate', 'scopedWeaponAccuracy', 'criticalHitsPer10Minutes', 'barrierDamageDealtPer10Minutes', 'teamfightWinRateWithUlt']
  }
];