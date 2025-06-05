import { Atom, WritableAtom, PrimitiveAtom } from 'jotai';
import { Metric } from '@library';
export type { Metric };
import { OverwatchRole } from '@library';
export type { OverwatchRole };
import teamPlayersAtom from '@atoms/teamPlayers'; // Changed: Removed named import of TeamPlayersType
import sampleDataEnabledAtom from '@atoms/sampleDataEnabled';
import sampleDataAtom from '@atoms/sampleData';
import logFileInputAtom from '@atoms/logFileInputAtom';
import logFileLoaderAtom from '@atoms/logFileLoaderAtom';
import logFileParserAtom from '@atoms/logFileParserAtom';
import averageMetricPerHeroAtom from '@atoms/averageMetricPerHeroAtom';
import averageMetricPerMapAtom from '@atoms/averageMetricPerMapAtom';
import averageMetricPerRoleAtom from '@atoms/averageMetricPerRoleAtom';
import firstKillImpactAtom from '@atoms/firstKillImpactAtom';
import teamfightsAtom from '@atoms/teamfightsAtom';
import playerInteractionEventsAtom from '@atoms/playerInteractionEventsAtom';
import ultimateEventsAtom from '@atoms/ultimateEventsAtom';
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
import teamfightParticipationAtom from '@atoms/teamfightParticipationAtom';
import uniquePlayerNamesAtom from '@atoms/uniquePlayerNamesAtom';
import roundTimesAtom from '@atoms/roundTimesAtom';
import playerStatusTimelineAtom from '@atoms/playerStatusTimelineAtom';
import playerEventsAtom from '@atoms/playerEventsAtom';
import playerFirstKillDeathRateAtom from '@atoms/playerFirstKillDeathRateAtom';
import matchDataAtom from '@atoms/matchDataAtom';
import uniqueMapNamesAtom from '@atoms/uniqueMapNamesAtom';
import scrimAtom from '@atoms/scrimAtom';
import teamStatsAtom from '@atoms/teamStatsAtom';
import mapTimesAtom from '@atoms/mapTimesAtom';
import matchExtractorAtom from '@atoms/matchExtractorAtom';
import heroPlaytimeAtom from '@atoms/heroPlaytimeAtom';

// All atoms are of this type
export type ScrimsightAtom<Value> = {
  name: string;
  description: string;
  atom: Atom<Value> | WritableAtom<Value, unknown[], unknown> | PrimitiveAtom<Value>;
};

// Event & Data Structure Types (Exported for use across the app)

export interface Ability1UsedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export type Ability1UsedType = Ability1UsedLogEvent[];
export interface Ability2UsedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export type Ability2UsedType = Ability2UsedLogEvent[];
export interface DamageLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: string; victimTeam: string; victimName: string; victimHero: string; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export type DamageType = DamageLogEvent[];
export interface DefensiveAssistLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export type DefensiveAssistType = DefensiveAssistLogEvent[];
export interface DvaDemechLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: string; victimTeam: string; victimName: string; victimHero: string; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export type DvaDemechType = DvaDemechLogEvent[];
export interface DvaRemechLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; ultimateId: number; }
export type DvaRemechType = DvaRemechLogEvent[];
export interface HealingLogEvent { matchId: string; type: string; matchTime: number; healerTeam: string; healerName: string; healeeTeam: string; healeeName: string; healeeHero: string; eventAbility: string; eventHealing: number; isHealthPack: boolean; }
export type HealingType = HealingLogEvent[];
export interface HeroSpawnLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; previousHero: string; heroTimePlayed: number; }
export type HeroSpawnType = HeroSpawnLogEvent[];
export interface HeroSwapLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; previousHero: string; heroTimePlayed: number; }
export type HeroSwapType = HeroSwapLogEvent[];
export interface KillLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: string; victimTeam: string; victimName: string; victimHero: string; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export type KillType = KillLogEvent[];
export interface MatchEndLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; team1Score: number; team2Score: number; }
export type MatchEndType = MatchEndLogEvent[];
export interface MatchStartLogEvent { matchId: string; type: string; matchTime: number; mapName: string; mapType: string; team1Name: string; team2Name: string; }
export type MatchStartType = MatchStartLogEvent[];
export interface MercyRezLogEvent { matchId: string; type: string; matchTime: number; mercyTeam: string; mercyName: string; revivedTeam: string; revivedName: string; revivedHero: string; eventAbility: string; }
export type MercyRezType = MercyRezLogEvent[];
export interface OffensiveAssistLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export type OffensiveAssistType = OffensiveAssistLogEvent[];
export interface PlayerStatLogEvent { matchId: string; type: string; matchTime: number; roundNumber: string; playerTeam: string; playerName: string; playerHero: string; eliminations: number; finalBlows: number; deaths: number; allDamageDealt: number; barrierDamageDealt: number; heroDamageDealt: number; healingDealt: number; healingReceived: number; selfHealing: number; damageTaken: number; damageBlocked: number; defensiveAssists: number; offensiveAssists: number; ultimatesEarned: number; ultimatesUsed: number; multikillBest: number; multikills: number; soloKills: number; objectiveKills: number; environmentalKills: number; environmentalDeaths: number; criticalHits: number; criticalHitAccuracy: number; scopedAccuracy: number; scopedCriticalHitAccuracy: number; scopedCriticalHitKills: number; shotsFired: number; shotsHit: number; shotsMissed: number; scopedShotsFired: number; scopedShotsHit: number; weaponAccuracy: number; }
export type PlayerStatType = PlayerStatLogEvent[];
export interface RoundEndLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; capturingTeam: string; team1Score: number; team2Score: number; objectiveIndex: number; controlTeam1Progress: number; controlTeam2Progress: number; matchTimeRemaining: number; }
export type RoundEndType = RoundEndLogEvent[];
export interface RoundStartLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; capturingTeam: string; team1Score: number; team2Score: number; objectiveIndex: number; }
export type RoundStartType = RoundStartLogEvent[];
export interface SetupCompleteLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; matchTimeRemaining: number; }
export type SetupCompleteType = SetupCompleteLogEvent[];
export interface UltimateChargedLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; ultimateId: number; }
export type UltimateChargedType = UltimateChargedLogEvent[];
export interface UltimateEndLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; ultimateId: number; }
export type UltimateEndType = UltimateEndLogEvent[];
export interface UltimateStartLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; ultimateId: number; }
export type UltimateStartType = UltimateStartLogEvent[];

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

// Aggregate / Derived Stats Types
export type AverageHeroStatsType = { [K in PlayerStatsNumericalKeys]?: number; };
export type AverageMetricPerHeroType = Record<string, AverageHeroStatsType>;
export type AverageMapStats = { [K in PlayerStatsNumericalKeys]?: number; };
export type AverageMetricPerMap = Record<string, AverageMapStats>;
export type AverageRoleStats = { [K in PlayerStatsNumericalKeys]?: number; };
export type AverageMetricPerRole = Record<OverwatchRole, AverageRoleStats>;

export interface TeamComposition { teamName: string; heroes: string[]; timePlayed: number; }
export interface MapModeStats { wins: number; losses: number; draws: number; gamesPlayed: number; winRate: number; }
export interface UltimateEvent { id: string; matchId: string; playerName: string; playerTeam: string; playerHero: string; ultimateId: string; ultimateChargedTime: number; ultimateStartTime: number; ultimateEndTime: number; ultimateHoldTime: number; }
export interface UniqueGameMode { mapType: string; }
export interface HeroUltimateImpactStats { heroName: string; ultsUsedInFights: number; totalKillsDuringUltWindow: number; fightWinsWithUlt: number; avgKillsPerUlt: number; fightWinRateWithUlt: number; }
export type UltimateImpactStats = Record<string, Record<string, HeroUltimateImpactStats>>;
export interface Scrim { dateString: string; team1Name: string; team2Name: string; team1Players: string[]; team2Players: string[]; team1Wins: number; team2Wins: number; draws: number; matchIds: string[]; duration: number; }
export interface CompositionMatchup { opponentComposition: string[]; playtimeSecondsAgainst: number; winsAgainst: number; lossesAgainst: number; drawsAgainst: number; winRateAgainst: number; }
export interface DetailedComposition { composition: string[]; playtimeSeconds: number; wins: number; losses: number; draws: number; winRate: number; frequency: number; matchups: CompositionMatchup[]; }
export interface TeamFirstKillImpactStats { teamName: string; totalFights: number; fightsWon: number; winRate: number; fightsWithFirstKill: number; fightsWonWithFirstKill: number; firstKillWinRate: number; fightsWithFirstDeath: number; fightsLostWithFirstDeath: number; firstDeathLossRate: number; }
export interface TeamStats { teamName: string; gamesPlayed: number; wins: number; losses: number; draws: number; mostRecentGameDate: Date | null; players: string[]; }
export interface FirstKillImpactStats { totalFights: number; overallWinRate: number; firstKillWinRate: number; firstDeathLossRate: number; teamStats: Record<string, TeamFirstKillImpactStats>; }
export type TeamPlayersType = { teamName: string; players: string[]; }; // Added definition
export interface HeroPlaytime { playerName: string; matchId: string; roundNumber: number; hero: string; playtime: number; }
export type HeroPlaytimeCategoryKeys = "playerName" | "matchId" | "roundNumber" | "hero";
export type HeroPlaytimeNumericalKeys = "playtime";

// Segment Stats Types
export interface SegmentParams {
  matchId: string;
  startTime: number;
  endTime: number;
  type: 'map' | 'round' | 'teamfight';
}

export interface SegmentStats {
  team1Kills: number;
  team2Kills: number;
  team1UltsUsed: number;
  team2UltsUsed: number;
  startPlayerCountTeam1: number;
  startPlayerCountTeam2: number;
  endPlayerCountTeam1: number;
  endPlayerCountTeam2: number;
}

// Player Comparison Types
export interface PlayerComparisonParams {
  playerName: string;
  heroName?: string; // Optional: Compare stats for a specific hero
}

export interface MetricComparison {
  metric: PlayerStatsNumericalKeys;
  playerValue: number;
  benchmarkValue?: number; // Benchmark might not exist for all metrics/contexts
  benchmarkType: 'Role Average' | 'Hero Average' | 'N/A';
  delta?: number; // Difference between player and benchmark
  percentDifference?: number; // Percentage difference
}

// Teamfight Types
export interface Teamfight {
  fightId: string; // Unique identifier for the fight (e.g., {matchId}-{startTime})
  matchId: string;
  startTime: number;
  endTime: number;
  team1Name: string;
  team2Name: string;
  winner: string | null; // Changed type from 'team1'|'team2'|'draw' to string | null
  duration: number;
  team1Kills: number;
  team2Kills: number;
  // names of players
  team1PlayersWithUltimatesChargedAtStart: string[];
  team2PlayersWithUltimatesChargedAtStart: string[];
  team1PlayersWithUltimatesUsed: string[];
  team2PlayersWithUltimatesUsed: string[];
  // First kill/death details
  firstKillPlayer?: string;
  firstKillTeam?: string;
  firstKillTime?: number;
  firstDeathPlayer?: string; // Victim of the first kill
  firstDeathTeam?: string;
  firstDeathTime?: number; // Same as firstKillTime
}

export type TeamfightPass1 = Pick<Teamfight, 'matchId' | 'startTime' | 'endTime' | 'duration' | 'team1Kills' | 'team2Kills' | 'team1Name' | 'team2Name'>;

// Kill Matrix Types
export interface PlayerTotals {
  kills: number;
  deaths: number;
}

export interface PlayerInteraction {
  sourcePlayerName: string;
  sourceTeamName: string;
  targetPlayerName: string;
  value: number;
}

export interface KillMatrixData {
  killMatrix: { [killer: string]: { [victim: string]: number } };
  playerTotals: { [player: string]: PlayerTotals };
  team1Players: string[];
  team2Players: string[];
  team1Name: string;
  team2Name: string;
  allPlayers: string[];
}

// Grouped Events Types
export interface GroupedKillOffensiveAssistEvent {
  matchId: string;
  matchTime: number;
  kills: KillLogEvent[];
  assists: OffensiveAssistLogEvent[];
}

// Additional derived atom types
export interface TeamfightParticipation {
  team1Players: string[];
  team2Players: string[];
}
export type TeamfightParticipationType = Map<string, TeamfightParticipation>;
export type PlayerStatusTimelineType = Map<string, PlayerStatusTimeline>;
export type RoundTimesType = RoundTimes[];

// Player stats types
export interface PlayerFirstKillDeathRateStats {
  playerName: string;
  firstKills: number;
  firstDeaths: number;
  teamfightsParticipated: number;
  firstKillRate: number; // firstKills / teamfightsParticipated
  firstDeathRate: number; // firstDeaths / teamfightsParticipated
}

// Contextual Stat Atoms Types
export interface PlayerMatchParams {
  matchId: string;
  playerId: string;
}

export interface TeamMatchParams {
  matchId: string;
  teamName: string;
}

export interface PlayerScrimParams {
  scrimId: string; // Derived from date/teams, e.g., "2023-08-28-Team A-vs-Team B"
  playerId: string;
}

export interface TeamScrimParams {
  scrimId: string; // Derived from date/teams
  teamName: string;
}

export interface PlayerTeamParams {
  teamName: string;
  playerId: string;
}

export interface MatchScrimParams {
  scrimId: string; // Derived from date/teams
}

// Team Compositions Types
export type HeroEvent = HeroSpawnLogEvent | HeroSwapLogEvent;

export interface AggregatedMatchupStats {
  opponentCompositionKey: string;
  opponentHeroes: string[];
  playtimeSecondsAgainst: number;
  winsAgainst: number;
  lossesAgainst: number;
  drawsAgainst: number;
}

export interface AggregatedCompStats {
  compositionKey: string; // Comma-separated sorted heroes
  heroes: string[];
  playtimeSeconds: number; // Total playtime for this friendly comp
  wins: number; // Overall wins attributed to this comp (match-based)
  losses: number; // Overall losses attributed to this comp (match-based)
  draws: number; // Overall draws attributed to this comp (match-based)
  matchesSeen: Set<string>; // Track distinct matches this friendly comp appeared in
  matchups: Map<string, AggregatedMatchupStats>; // Key: opponent comp key
}

// List Summary Types
export interface ScrimListSummary {
  scrimId: string; // Unique ID derived from date and teams
  teamNames: string[];
  dateString: string;
  mapCount: number;
  score: string; // e.g., "3-2-1" (W-L-D for team1)
  duration: number; // Total duration in seconds
}

export interface TeamListSummary {
  teamName: string;
  playerCount: number;
  winRate: number; // Calculated as wins / (wins + losses)
  gamesPlayed: number;
  firstKillWinRate: number; // Added: Win rate in teamfights where this team got the first kill
}

export interface PlayerListSummary {
  playerName: string;
  teamName: string; // Primary team (most playtime)
  topHero: string; // Hero with most playtime
  eliminations: number;
  deaths: number;
  assists: number; // Calculated as offensive + defensive assists
  role: OverwatchRole; // Role with most playtime
  firstKillRate: number; // Added: Percentage of teamfights participated in where player got first kill
}

// Map Times Types
export interface MapTimes {
  matchId: string;
  startTime: number;
  endTime: number;
  duration: number;
}

// Match Data Types
export interface MatchFileInfo {
  matchId: string;
  name: string;
  fileModified: number;
  dateString: string;
  timeString: string;
}

export interface MatchData {
  matchId: string;
  fileName: string;
  fileModified: number;
  dateString: string;
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
  winner: string | null; // Added: team1Name, team2Name, or null for draw
}

// Player Interaction Event Types
export interface PlayerInteractionEvent {
  id: string;
  matchId: string;
  playerName: string;
  playerTeam: string;
  playerHero: string;
  otherPlayerName: string;
  playerInteractionEventTime: number;
  playerInteractionEventType: string;
  direction: 'incoming' | 'outgoing';
}

// Player Lives Types
export interface PlayerLife {
  matchId: string;
  playerName: string;
  playerHero: string;
  startTime: number;
  endTime: number;
}

// Player Match History Types
export interface PlayerMatch {
  matchId: string;
  matchTime: number;   // for sorting purposes (from match start event)
  date: string;
  time: string;
  mapName: string;
  mapType: string;
  playerTeam: string;
  won: boolean;
}

// Player Stat Expanded Types
export interface PlayerStatsExpanded extends PlayerStatLogEvent {
  playerRole: string;
}

// Player Status Timeline Types
export interface LogEvent {
  timestamp: number;
  event_type: string;
  player_name?: string;
  player_team?: string;
  [key: string]: unknown;
}

export interface PlayerStatusEntry {
  timestamp: number;
  team1Players: Set<string>;
  team2Players: Set<string>;
}

export type PlayerStatusTimeline = PlayerStatusEntry[];

// Round Times Types
export interface RoundTimes {
  matchId: string;
  roundNumber: number;
  roundStartTime: number;
  roundSetupCompleteTime: number;
  roundEndTime: number;
  roundDuration: number;
}

// Re-exporting types from their source files
// UltimateEvent is now defined above
// TeamPlayersType is now defined above
// Scrim is now defined above

// Atom Registrations
export const teamPlayers: ScrimsightAtom<Promise<TeamPlayersType[]>> = { name: 'teamPlayers', description: 'All players for each team', atom: teamPlayersAtom };
export const playerStatsBase: ScrimsightAtom<Promise<Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>>> = { name: 'playerStatsBase', description: 'The most granular player stats for each round, merging player stat events with hero playtime data.', atom: playerStatsBaseAtom };
export const uniqueCategoryValues: ScrimsightAtom<Promise<Record<PlayerStatsCategoryKeys, string[]>>> = { name: 'uniqueCategoryValues', description: 'Unique values for each category key, useful for filter dropdowns.', atom: uniqueCategoryValuesAtom };
export const averageMetricPerHero: ScrimsightAtom<Promise<AverageMetricPerHeroType>> = { name: 'averageMetricPerHeroAtom', description: 'Average metrics per hero across all matches.', atom: averageMetricPerHeroAtom };
export const averageMetricPerMap: ScrimsightAtom<Promise<AverageMetricPerMap>> = { name: 'averageMetricPerMapAtom', description: 'Average metrics per map across all matches.', atom: averageMetricPerMapAtom };
export const averageMetricPerRole: ScrimsightAtom<Promise<AverageMetricPerRole>> = { name: 'averageMetricPerRoleAtom', description: 'Average metrics per role across all matches.', atom: averageMetricPerRoleAtom };
export const firstKillImpact: ScrimsightAtom<Promise<FirstKillImpactStats>> = { name: 'firstKillImpactAtom', description: 'Calculates the impact of first kills on teamfight outcomes.', atom: firstKillImpactAtom };
export const teamfights: ScrimsightAtom<Promise<Teamfight[]>> = { name: 'teamfightsAtom', description: 'Calculates teamfight periods and statistics based on kill events and ultimate usage.', atom: teamfightsAtom };
export const playerInteractionEvents: ScrimsightAtom<Promise<PlayerInteractionEvent[]>> = { name: 'playerInteractionEventsAtom', description: 'Derived player interaction events.', atom: playerInteractionEventsAtom };
export const ultimateEvents: ScrimsightAtom<Promise<UltimateEvent[]>> = { name: 'ultimateEventsAtom', description: 'Derived ultimate usage events.', atom: ultimateEventsAtom };

export type UniqueHeroNamesType = string[];
export const uniqueHeroNames: ScrimsightAtom<Promise<UniqueHeroNamesType>> = { name: 'uniqueHeroNamesAtom', description: 'A list of all unique hero names found in the log files.', atom: uniqueHeroNamesAtom };
export type SampleDataEnabledType = boolean;
export const sampleDataEnabled: ScrimsightAtom<SampleDataEnabledType> = { name: 'sampleDataEnabled', description: 'Whether sample data is enabled', atom: sampleDataEnabledAtom };
export type LogFileInputType = { files: File[]; };
export const logFileInput: ScrimsightAtom<LogFileInputType> = { name: 'logFileInput', description: 'Atom that stores the uploaded log files and provides a setter', atom: logFileInputAtom };
export type LogFileLoaderType = { fileName: string; fileModified: number; fileContent: string; }[];
export const sampleData: ScrimsightAtom<LogFileLoaderType> = { name: 'sampleData', description: 'Sample log file data', atom: sampleDataAtom };
export const logFileLoader: ScrimsightAtom<Promise<LogFileLoaderType>> = { name: 'logFileLoader', description: 'Loads the content of uploaded log files', atom: logFileLoaderAtom };
export interface LogFileParserOutput { fileName: string; matchId: string; logs: { specName: string; data: object[]; }[]; fileModified: number; }
export type LogFileParserAtomType = LogFileParserOutput[];
export const logFileParser: ScrimsightAtom<Promise<LogFileParserAtomType>> = { name: 'logFileParser', description: 'Parses loaded log files and sample data into structured LogFileParserOutput objects.', atom: logFileParserAtom };

// Event Extractor Atoms
export const ability1Used: ScrimsightAtom<Promise<Ability1UsedType>> = { name: 'ability1Used', description: 'Atom that extracts ability 1 used events from the parsed log files.', atom: ability1UsedAtom };
export const ability2Used: ScrimsightAtom<Promise<Ability2UsedType>> = { name: 'ability2Used', description: 'Atom that extracts ability 2 used events from the parsed log files.', atom: ability2UsedAtom };
export const damage: ScrimsightAtom<Promise<DamageType>> = { name: 'damage', description: 'Atom that extracts damage events from the parsed log files.', atom: damageAtom };
export const defensiveAssist: ScrimsightAtom<Promise<DefensiveAssistType>> = { name: 'defensiveAssist', description: 'Atom that extracts defensive assist events from the parsed log files.', atom: defensiveAssistAtom };
export const dvaDemech: ScrimsightAtom<Promise<DvaDemechType>> = { name: 'dvaDemech', description: 'Atom that extracts D.Va demech events from the parsed log files.', atom: dvaDemechAtom };
export const dvaRemech: ScrimsightAtom<Promise<DvaRemechType>> = { name: 'dvaRemech', description: 'Atom that extracts D.Va remech events from the parsed log files.', atom: dvaRemechAtom };
export const healing: ScrimsightAtom<Promise<HealingType>> = { name: 'healing', description: 'Atom that extracts healing events from the parsed log files.', atom: healingAtom };
export const heroSpawn: ScrimsightAtom<Promise<HeroSpawnType>> = { name: 'heroSpawn', description: 'Atom that extracts hero spawn events from the parsed log files.', atom: heroSpawnAtom };
export const heroSwap: ScrimsightAtom<Promise<HeroSwapType>> = { name: 'heroSwap', description: 'Atom that extracts hero swap events from the parsed log files.', atom: heroSwapAtom };
export const kill: ScrimsightAtom<Promise<KillType>> = { name: 'kill', description: 'Atom that extracts kill events from the parsed log files.', atom: killAtom };
export const matchEnd: ScrimsightAtom<Promise<MatchEndType>> = { name: 'matchEnd', description: 'Atom that extracts match end events from the parsed log files.', atom: matchEndAtom };
export const matchStart: ScrimsightAtom<Promise<MatchStartType>> = { name: 'matchStart', description: 'Atom that extracts match start events from the parsed log files.', atom: matchStartAtom };
export const mercyRez: ScrimsightAtom<Promise<MercyRezType>> = { name: 'mercyRez', description: 'Atom that extracts mercy rez events from the parsed log files.', atom: mercyRezAtom };
export const offensiveAssist: ScrimsightAtom<Promise<OffensiveAssistType>> = { name: 'offensiveAssist', description: 'Atom that extracts offensive assist events from the parsed log files.', atom: offensiveAssistAtom };
export const playerStat: ScrimsightAtom<Promise<PlayerStatType>> = { name: 'playerStat', description: 'Atom that extracts player stat events from the parsed log files.', atom: playerStatAtom };
export const roundEnd: ScrimsightAtom<Promise<RoundEndType>> = { name: 'roundEnd', description: 'Atom that extracts round end events from the parsed log files.', atom: roundEndAtom };
export const roundStart: ScrimsightAtom<Promise<RoundStartType>> = { name: 'roundStart', description: 'Atom that extracts round start events from the parsed log files.', atom: roundStartAtom };
export const setupComplete: ScrimsightAtom<Promise<SetupCompleteType>> = { name: 'setupComplete', description: 'Atom that extracts setup complete events from the parsed log files.', atom: setupCompleteAtom };
export const ultimateCharged: ScrimsightAtom<Promise<UltimateChargedType>> = { name: 'ultimateCharged', description: 'Atom that extracts ultimate charged events from the parsed log files.', atom: ultimateChargedAtom };
export const ultimateEnd: ScrimsightAtom<Promise<UltimateEndType>> = { name: 'ultimateEnd', description: 'Atom that extracts ultimate end events from the parsed log files.', atom: ultimateEndAtom };
export const ultimateStart: ScrimsightAtom<Promise<UltimateStartType>> = { name: 'ultimateStart', description: 'Atom that extracts ultimate start events from the parsed log files.', atom: ultimateStartAtom };

// Additional derived atoms
export const teamfightParticipation: ScrimsightAtom<Promise<TeamfightParticipationType>> = { name: 'teamfightParticipation', description: 'Atom that calculates player participation for each teamfight.', atom: teamfightParticipationAtom };
export const uniquePlayerNames: ScrimsightAtom<Promise<string[]>> = { name: 'uniquePlayerNames', description: 'Atom that extracts unique player names from all matches.', atom: uniquePlayerNamesAtom };
export const roundTimes: ScrimsightAtom<Promise<RoundTimesType>> = { name: 'roundTimes', description: 'Atom that combines round start, setup complete, and round end events to calculate round times.', atom: roundTimesAtom };
export const playerStatusTimeline: ScrimsightAtom<Promise<PlayerStatusTimelineType>> = { name: 'playerStatusTimeline', description: 'Atom that tracks the active players on each team over time for each match.', atom: playerStatusTimelineAtom };
export const playerEvents: ScrimsightAtom<Promise<any[]>> = { name: 'playerEvents', description: 'Atom that combines various player events into a unified timeline.', atom: playerEventsAtom };
export const playerFirstKillDeathRate: ScrimsightAtom<Promise<Record<string, PlayerFirstKillDeathRateStats>>> = { name: 'playerFirstKillDeathRate', description: 'Atom that calculates first kill and death rates for each player based on teamfight participation.', atom: playerFirstKillDeathRateAtom };

// Additional atoms for complex data structures
export const matchData: ScrimsightAtom<Promise<any[]>> = { name: 'matchData', description: 'Atom that combines match metadata with player statistics and game events.', atom: matchDataAtom };
export const uniqueMapNames: ScrimsightAtom<Promise<string[]>> = { name: 'uniqueMapNames', description: 'Atom that extracts unique map names from all matches.', atom: uniqueMapNamesAtom };
export const scrims: ScrimsightAtom<Promise<any[]>> = { name: 'scrims', description: 'Atom that groups matches into scrimmage sessions by date and teams.', atom: scrimAtom };
export const teamStats: ScrimsightAtom<Promise<any[]>> = { name: 'teamStats', description: 'Atom that calculates team-level statistics and performance metrics.', atom: teamStatsAtom };
export const mapTimes: ScrimsightAtom<Promise<any[]>> = { name: 'mapTimes', description: 'Atom that calculates duration and timing data for each map/match.', atom: mapTimesAtom };
export const matchExtractor: ScrimsightAtom<Promise<any[]>> = { name: 'matchExtractor', description: 'Atom that extracts match file information from log files.', atom: matchExtractorAtom };
export const heroPlaytime: ScrimsightAtom<Promise<Metric<HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys>>> = { name: 'heroPlaytime', description: 'Atom that calculates hero playtime for each player per round.', atom: heroPlaytimeAtom };
