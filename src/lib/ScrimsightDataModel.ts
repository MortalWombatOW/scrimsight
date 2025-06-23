
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

// Player Stats

// Categories by which to group player stats
export const playerStatsCategoryKeys = ['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'];
export type PlayerStatsCategoryKeys = typeof playerStatsCategoryKeys[number];

// Base player stats are loaded directly from the PlayerStatLogEvent
export const playerStatsBaseNumericalKeys = [ 'playtime', 'eliminations', 'finalBlows', 'deaths', 'allDamageDealt', 'barrierDamageDealt', 'heroDamageDealt', 'healingDealt', 'healingReceived', 'selfHealing', 'damageTaken', 'damageBlocked', 'defensiveAssists', 'offensiveAssists', 'ultimatesEarned', 'ultimatesUsed', 'multikills', 'soloKills', 'objectiveKills', 'environmentalKills', 'environmentalDeaths', 'criticalHits', 'shotsFired', 'shotsHit', 'shotsMissed', 'scopedShotsFired', 'scopedShotsHit', ];
export type PlayerStatsBaseNumericalKeys = typeof playerStatsBaseNumericalKeys[number];
export type PlayerStatsBase = {[k in PlayerStatsCategoryKeys]: string} & {[k in PlayerStatsBaseNumericalKeys]: number};

// Derived player stats are computed from the base stats, for example ratios or normalizing by time played
export const playerStatsDerivedNumericalKeys = [ 'eliminationsPer10Minutes', 'finalBlowsPer10Minutes', 'deathsPer10Minutes', 'allDamageDealtPer10Minutes', 'barrierDamageDealtPer10Minutes', 'heroDamageDealtPer10Minutes', 'healingDealtPer10Minutes', 'healingReceivedPer10Minutes', 'selfHealingPer10Minutes', 'damageTakenPer10Minutes', 'damageBlockedPer10Minutes', 'defensiveAssistsPer10Minutes', 'offensiveAssistsPer10Minutes', 'ultimatesEarnedPer10Minutes', 'ultimatesUsedPer10Minutes', 'multikillsPer10Minutes', 'soloKillsPer10Minutes', 'objectiveKillsPer10Minutes', 'environmentalKillsPer10Minutes', 'environmentalDeathsPer10Minutes', 'criticalHitsPer10Minutes', 'shotsFiredPer10Minutes', 'shotsHitPer10Minutes', 'shotsMissedPer10Minutes', 'scopedShotsFiredPer10Minutes', 'scopedShotsHitPer10Minutes', 'weaponAccuracy', 'scopedWeaponAccuracy', 'criticalHitRate' ];
export type PlayerStatsDerivedNumericalKeys = typeof playerStatsDerivedNumericalKeys[number];

// Interfaces combining all levels of player stats
export type PlayerStats = PlayerStatsBase & {[k in PlayerStatsDerivedNumericalKeys]: number};
export type PlayerStatsNumericalKeys = PlayerStatsBaseNumericalKeys | PlayerStatsDerivedNumericalKeys;
export const playerStatsNumericalKeys = [...playerStatsBaseNumericalKeys, ...playerStatsDerivedNumericalKeys] as PlayerStatsNumericalKeys[];


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
 
   // Enriched player stats
   playerStatBreakdown: {
     total: {[k in PlayerStatsNumericalKeys]: number};
     byPlayer: ({playerName: string} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by player
     byTeam: ({playerTeam: string} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by team
     byTeamAndPlayer: ({playerTeam: string, playerName: string} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by team and player
     byTeamAndPlayerAndMatch: ({playerTeam: string, playerName: string, matchId: MatchID} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by team, player and match
     byTeamAndPlayerAndScrim: ({playerTeam: string, playerName: string, scrim: ScrimID} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by team, player and scrim
     byPlayerAndHero: ({playerName: string, playerHero: Hero} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by player and hero
     byRole: ({playerRole: Role} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by role
     byHero: ({playerHero: Hero} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by hero
     byTeamAndMatch: ({playerTeam: string, matchId: MatchID} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by team and match
     byTeamAndScrim: ({playerTeam: string, scrim: ScrimID} & {[k in PlayerStatsNumericalKeys]: number})[]; // grouped by team and scrim
    };

    // Tracks the number of kills per player and victim
    killCounts: {
      byMatch: ({matchId: MatchID} & PlayerVictimKillCount)[]; // grouped by match
      byMatchAndRound: ({matchId: MatchID, roundNumber: RoundNumber} & PlayerVictimKillCount)[]; // grouped by match and round
    };
}
  
export interface ScrimsightMetricFramework {
  metricCategories: {

  }[];