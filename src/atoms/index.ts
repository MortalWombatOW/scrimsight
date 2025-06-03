import { Atom, WritableAtom, PrimitiveAtom, atom } from 'jotai'; // Consolidated import
import { Metric } from '@library';
export type { Metric };
import { OverwatchRole } from '@library';

// Default-exported atom logic
import teamPlayersAtomLogic from '@atoms/teamPlayers'; // Assuming teamPlayers.ts will be refactored
import sampleDataEnabledLogic from '@atoms/sampleDataEnabled';
import sampleDataAtomLogic from '@atoms/sampleData'; // Assuming sampleData.ts will be refactored
import logFileInputLogic from '@atoms/logFileInputAtom';
import logFileLoaderLogic from '@atoms/logFileLoaderAtom';
import logFileParserLogic from '@atoms/logFileParserAtom'; // Assuming logFileParser.ts will be refactored
import averageMetricPerHeroLogic from '@atoms/averageMetricPerHeroAtom';
import averageMetricPerMapLogic from '@atoms/averageMetricPerMapAtom';
import averageMetricPerRoleLogic from '@atoms/averageMetricPerRoleAtom';
import firstKillImpactLogic from '@atoms/firstKillImpactAtom';
import teamfightsLogic from '@atoms/teamfightsAtom';
import playerInteractionEventsLogic from '@atoms/playerInteractionEventsAtom';
import ultimateEventsLogic from '@atoms/ultimateEventsAtom';
import uniqueHeroNamesLogic from '@atoms/uniqueHeroNamesAtom';
import playerStatsBaseLogic from '@atoms/playerStatsBaseAtom';
import uniqueCategoryValuesLogic from '@atoms/uniqueCategoryValuesAtom';
import ability1UsedLogic from '@atoms/ability1Used';
import ability2UsedLogic from '@atoms/ability2Used';
import damageLogic from '@atoms/damage';
import defensiveAssistLogic from '@atoms/defensiveAssist';
import dvaDemechLogic from '@atoms/dvaDemech';
import dvaRemechLogic from '@atoms/dvaRemech'; // Assuming refactor
import healingLogic from '@atoms/healing'; // Assuming refactor
import heroSpawnLogic from '@atoms/heroSpawn'; // Assuming refactor
import heroSwapLogic from '@atoms/heroSwap'; // Assuming refactor
import killLogic from '@atoms/kill'; // Assuming refactor
import matchEndLogic from '@atoms/matchEnd'; // Assuming refactor
import matchStartLogic from '@atoms/matchStart'; // Assuming refactor
import mercyRezLogic from '@atoms/mercyRez'; // Assuming refactor
import offensiveAssistLogic from '@atoms/offensiveAssist'; // Assuming refactor
import playerStatLogic from '@atoms/playerStat'; // Assuming refactor
import roundEndLogic from '@atoms/roundEnd'; // Assuming refactor
import roundStartLogic from '@atoms/roundStart'; // Assuming refactor
import setupCompleteLogic from '@atoms/setupComplete'; // Assuming refactor
import ultimateChargedLogic from '@atoms/ultimateCharged'; // Assuming refactor
import ultimateEndLogic from '@atoms/ultimateEnd'; // Assuming refactor
import ultimateStartLogic from '@atoms/ultimateStart'; // Assuming refactor
import teamfightParticipationLogic from '@atoms/teamfightParticipationAtom';
import uniquePlayerNamesLogic from '@atoms/uniquePlayerNamesAtom';
import roundTimesLogic from '@atoms/roundTimesAtom';
import playerStatusTimelineLogic from '@atoms/playerStatusTimelineAtom';
import playerEventsLogic from '@atoms/playerEventsAtom';
import playerFirstKillDeathRateLogic from '@atoms/playerFirstKillDeathRateAtom';
import matchDataLogic from '@atoms/matchDataAtom';
import uniqueMapNamesLogic from '@atoms/uniqueMapNamesAtom';
import scrimLogic from '@atoms/scrimAtom';
import teamStatsLogic from '@atoms/teamStatsAtom';
import mapTimesLogic from '@atoms/mapTimesAtom';
import matchExtractorLogic from '@atoms/matchExtractorAtom';
import killMatrixFamilyLogic from '@atoms/killMatrixAtom';
import groupedEventsLogic from '@atoms/groupedEventsAtom';
import playerComparisonFamilyLogic from '@atoms/playerComparisonAtomFamily';

// Re-exporting functions from helper files
export { generateKillMatrixData } from '@atoms/killMatrix';
export { generatePlayerComparisonFn as generatePlayerComparison, getPlayerStatsFilterFn as getPlayerStatsFilter } from '@atoms/playerComparison';

// --- TYPE DEFINITIONS ---

// All atoms are of this type
export type ScrimsightAtom<Value> = {
  name: string;
  description: string;
  atom: Atom<Value> | WritableAtom<Value, unknown[], unknown> | PrimitiveAtom<Value>;
};

// Type for atom families
export interface ScrimsightAtomFamily<Value, Param> {
  name: string;
  description: string;
  family: (param: Param) => Atom<Value>;
}

// Base Event & Log Types (essential for many other types)
export interface KillLogEvent { matchId: string; type: string; matchTime: number; attackerTeam: string; attackerName: string; attackerHero: string; victimTeam: string; victimName: string; victimHero: string; eventAbility: string; eventDamage: number; isCriticalHit: boolean; isEnvironmental: boolean; }
export type KillType = KillLogEvent[];
export interface OffensiveAssistLogEvent { matchId: string; type: string; matchTime: number; playerTeam: string; playerName: string; playerHero: string; heroDuplicated: string; }
export type OffensiveAssistType = OffensiveAssistLogEvent[];
export interface PlayerStatLogEvent { matchId: string; type: string; matchTime: number; roundNumber: string; playerTeam: string; playerName: string; playerHero: string; eliminations: number; finalBlows: number; deaths: number; allDamageDealt: number; barrierDamageDealt: number; heroDamageDealt: number; healingDealt: number; healingReceived: number; selfHealing: number; damageTaken: number; damageBlocked: number; defensiveAssists: number; offensiveAssists: number; ultimatesEarned: number; ultimatesUsed: number; multikillBest: number; multikills: number; soloKills: number; objectiveKills: number; environmentalKills: number; environmentalDeaths: number; criticalHits: number; criticalHitAccuracy: number; scopedAccuracy: number; scopedCriticalHitAccuracy: number; scopedCriticalHitKills: number; shotsFired: number; shotsHit: number; shotsMissed: number; scopedShotsFired: number; scopedShotsHit: number; weaponAccuracy: number; }
export type PlayerStatType = PlayerStatLogEvent[];
export interface MatchStartLogEvent { matchId: string; type: string; matchTime: number; mapName: string; mapType: string; team1Name: string; team2Name: string; }
export type MatchStartType = MatchStartLogEvent[];

// Player Stats related types (needed for MetricComparison, etc.)
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

// Specific Event & Data Structure Types
export interface MapTimes { matchId: string; startTime: number; endTime: number; duration: number; }
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
export interface MatchEndLogEvent { matchId: string; type: string; matchTime: number; roundNumber: number; team1Score: number; team2Score: number; }
export type MatchEndType = MatchEndLogEvent[];
export interface MercyRezLogEvent { matchId: string; type: string; matchTime: number; mercyTeam: string; mercyName: string; revivedTeam: string; revivedName: string; revivedHero: string; eventAbility: string; }
export type MercyRezType = MercyRezLogEvent[];
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

export interface PlayerComparisonParams { playerName: string; heroName?: string; }
export interface MetricComparison { metric: PlayerStatsNumericalKeys; playerValue: number; benchmarkValue?: number; benchmarkType: 'Role Average' | 'Hero Average' | 'N/A'; delta?: number; percentDifference?: number; }

interface _PlayerTotals { kills: number; deaths: number; } // Made internal by underscore
interface _PlayerInteraction { sourcePlayerName: string; sourceTeamName: string; targetPlayerName: string; value: number;} // Made internal
export interface KillMatrixData {
  killMatrix: { [killer: string]: { [victim: string]: number } };
  playerTotals: { [player: string]: _PlayerTotals }; // Uses internal _PlayerTotals
  team1Players: string[];
  team2Players: string[];
  team1Name: string;
  team2Name: string;
  allPlayers: string[];
}
export type TeamPlayersType = { teamName: string; players: string[]; }; // Moved here

// Aggregate / Derived Stats Types
export type AverageHeroStatsType = { [K in PlayerStatsNumericalKeys]?: number; };
export type AverageMetricPerHeroType = Record<string, AverageHeroStatsType>;
export type AverageMapStats = { [K in PlayerStatsNumericalKeys]?: number; };
export type AverageMetricPerMap = Record<string, AverageMapStats>;
export type AverageRoleStats = { [K in PlayerStatsNumericalKeys]?: number; };
export type AverageMetricPerRole = Record<OverwatchRole, AverageRoleStats>;
export interface CompositionMatchup { opponentComposition: string[]; playtimeSecondsAgainst: number; winsAgainst: number; lossesAgainst: number; drawsAgainst: number; winRateAgainst: number; }
export interface DetailedComposition { composition: string[]; playtimeSeconds: number; wins: number; losses: number; draws: number; winRate: number; frequency: number; matchups: CompositionMatchup[]; }
export interface TeamFirstKillImpactStats { teamName: string; totalFights: number; fightsWon: number; winRate: number; fightsWithFirstKill: number; fightsWonWithFirstKill: number; firstKillWinRate: number; fightsWithFirstDeath: number; fightsLostWithFirstDeath: number; firstDeathLossRate: number; }
export interface TeamStats { teamName: string; gamesPlayed: number; wins: number; losses: number; draws: number; mostRecentGameDate: Date | null; players: string[]; }
export interface FirstKillImpactStats { totalFights: number; overallWinRate: number; firstKillWinRate: number; firstDeathLossRate: number; teamStats: Record<string, TeamFirstKillImpactStats>; }
export interface HeroPlaytime { playerName: string; matchId: string; roundNumber: number; hero: string; playtime: number; }
export type HeroPlaytimeCategoryKeys = "playerName" | "matchId" | "roundNumber" | "hero";
export type HeroPlaytimeNumericalKeys = "playtime";
export interface TeamfightParticipation { team1Players: string[]; team2Players: string[]; }
export type { RoundTimes };
export type { PlayerStatusTimeline };
export type TeamfightParticipationType = Map<string, TeamfightParticipation>;
export type PlayerStatusTimelineType = Map<string, PlayerStatusTimeline>;
export type RoundTimesType = RoundTimes[];
export interface PlayerFirstKillDeathRateStats { playerName: string; firstKills: number; firstDeaths: number; teamfightsParticipated: number; firstKillRate: number;  firstDeathRate: number; }
export interface GroupedKillOffensiveAssistEvent { matchId: string; matchTime: number; kills: KillLogEvent[]; assists: OffensiveAssistLogEvent[]; }
export type LogFileInputType = { files: File[]; }; // Moved higher, as logFileInput uses it
export type LogFileLoaderType = { fileName: string; fileModified: number; fileContent: string; }[];
export interface LogFileParserOutput { fileName: string; matchId: string; logs: { specName: string; data: object[]; }[]; fileModified: number; }
export type LogFileParserAtomType = LogFileParserOutput[];
export type UniqueHeroNamesType = string[];
export type SampleDataEnabledType = boolean;

// Re-exporting types from (now former) atom files if they were complex and not moved above
export type { Teamfight }; // from teamfightsAtom.ts (if it was a type export)
export type { PlayerInteractionEvent }; // from playerInteractionEventsAtom.ts
export type { UltimateEvent }; // from ultimateEventsAtom.ts
export type { MatchData } from '@atoms/matchDataAtom'; // Assuming MatchData is complex, defined in its file and re-exported
export type { Scrim } from '@atoms/scrimAtom'; // Assuming Scrim is complex, defined in its file and re-exported

// Re-exporting functions from helper files
export { generateKillMatrixData } from '@atoms/killMatrix';
export { generatePlayerComparisonFn as generatePlayerComparison, getPlayerStatsFilterFn as getPlayerStatsFilter } from '@atoms/playerComparison';

// Atom Registrations
export const teamPlayers: ScrimsightAtom<Promise<TeamPlayersType[]>> = { name: 'teamPlayers', description: 'All players for each team', atom: atom(teamPlayersAtomLogic) };
export const playerStatsBase: ScrimsightAtom<Promise<Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>>> = { name: 'playerStatsBase', description: 'The most granular player stats for each round, merging player stat events with hero playtime data.', atom: atom(playerStatsBaseLogic) };
export const uniqueCategoryValues: ScrimsightAtom<Promise<Record<PlayerStatsCategoryKeys, string[]>>> = { name: 'uniqueCategoryValues', description: 'Unique values for each category key, useful for filter dropdowns.', atom: atom(uniqueCategoryValuesLogic) };
export const averageMetricPerHero: ScrimsightAtom<Promise<AverageMetricPerHeroType>> = { name: 'averageMetricPerHeroAtom', description: 'Average metrics per hero across all matches.', atom: atom(averageMetricPerHeroLogic) };
export const averageMetricPerMap: ScrimsightAtom<Promise<AverageMetricPerMap>> = { name: 'averageMetricPerMapAtom', description: 'Average metrics per map across all matches.', atom: atom(averageMetricPerMapLogic) };
export const averageMetricPerRole: ScrimsightAtom<Promise<AverageMetricPerRole>> = { name: 'averageMetricPerRoleAtom', description: 'Average metrics per role across all matches.', atom: atom(averageMetricPerRoleLogic) };
export const firstKillImpact: ScrimsightAtom<Promise<FirstKillImpactStats>> = { name: 'firstKillImpactAtom', description: 'Calculates the impact of first kills on teamfight outcomes.', atom: atom(firstKillImpactLogic) };
export const teamfights: ScrimsightAtom<Promise<Teamfight[]>> = { name: 'teamfightsAtom', description: 'Calculates teamfight periods and statistics based on kill events and ultimate usage.', atom: atom(teamfightsLogic) };
export const playerInteractionEvents: ScrimsightAtom<Promise<PlayerInteractionEvent[]>> = { name: 'playerInteractionEventsAtom', description: 'Derived player interaction events.', atom: atom(playerInteractionEventsLogic) };
export const ultimateEvents: ScrimsightAtom<Promise<UltimateEvent[]>> = { name: 'ultimateEventsAtom', description: 'Derived ultimate usage events.', atom: atom(ultimateEventsLogic) };
export const uniqueHeroNames: ScrimsightAtom<Promise<UniqueHeroNamesType>> = { name: 'uniqueHeroNamesAtom', description: 'A list of all unique hero names found in the log files.', atom: atom(uniqueHeroNamesLogic) };
export const sampleDataEnabled: ScrimsightAtom<SampleDataEnabledType> = { name: 'sampleDataEnabled', description: 'Whether sample data is enabled', atom: sampleDataEnabledLogic }; // This logic is already an atom
export const logFileInput: ScrimsightAtom<LogFileInputType> = { name: 'logFileInput', description: 'Atom that stores the uploaded log files and provides a setter', atom: logFileInputLogic }; // This logic is already an atom
export const sampleData: ScrimsightAtom<LogFileLoaderType> = { name: 'sampleData', description: 'Sample log file data', atom: atom(sampleDataAtomLogic) };
export const logFileLoader: ScrimsightAtom<Promise<LogFileLoaderType>> = { name: 'logFileLoader', description: 'Loads the content of uploaded log files', atom: atom(logFileLoaderLogic) };
export const logFileParser: ScrimsightAtom<Promise<LogFileParserAtomType>> = { name: 'logFileParser', description: 'Parses loaded log files and sample data into structured LogFileParserOutput objects.', atom: atom(logFileParserLogic) };

// Event Extractor Atoms
export const ability1Used: ScrimsightAtom<Promise<Ability1UsedType>> = { name: 'ability1Used', description: 'Atom that extracts ability 1 used events from the parsed log files.', atom: atom(ability1UsedLogic) };
export const ability2Used: ScrimsightAtom<Promise<Ability2UsedType>> = { name: 'ability2Used', description: 'Atom that extracts ability 2 used events from the parsed log files.', atom: atom(ability2UsedLogic) };
export const damage: ScrimsightAtom<Promise<DamageType>> = { name: 'damage', description: 'Atom that extracts damage events from the parsed log files.', atom: atom(damageLogic) };
export const defensiveAssist: ScrimsightAtom<Promise<DefensiveAssistType>> = { name: 'defensiveAssist', description: 'Atom that extracts defensive assist events from the parsed log files.', atom: atom(defensiveAssistLogic) };
export const dvaDemech: ScrimsightAtom<Promise<DvaDemechType>> = { name: 'dvaDemech', description: 'Atom that extracts D.Va demech events from the parsed log files.', atom: atom(dvaDemechLogic) };
export const dvaRemech: ScrimsightAtom<Promise<DvaRemechType>> = { name: 'dvaRemech', description: 'Atom that extracts D.Va remech events from the parsed log files.', atom: atom(dvaRemechLogic) };
export const healing: ScrimsightAtom<Promise<HealingType>> = { name: 'healing', description: 'Atom that extracts healing events from the parsed log files.', atom: atom(healingLogic) };
export const heroSpawn: ScrimsightAtom<Promise<HeroSpawnType>> = { name: 'heroSpawn', description: 'Atom that extracts hero spawn events from the parsed log files.', atom: atom(heroSpawnLogic) };
export const heroSwap: ScrimsightAtom<Promise<HeroSwapType>> = { name: 'heroSwap', description: 'Atom that extracts hero swap events from the parsed log files.', atom: atom(heroSwapLogic) };
export const kill: ScrimsightAtom<Promise<KillType>> = { name: 'kill', description: 'Atom that extracts kill events from the parsed log files.', atom: atom(killLogic) };
export const matchEnd: ScrimsightAtom<Promise<MatchEndType>> = { name: 'matchEnd', description: 'Atom that extracts match end events from the parsed log files.', atom: atom(matchEndLogic) };
export const matchStart: ScrimsightAtom<Promise<MatchStartType>> = { name: 'matchStart', description: 'Atom that extracts match start events from the parsed log files.', atom: atom(matchStartLogic) };
export const mercyRez: ScrimsightAtom<Promise<MercyRezType>> = { name: 'mercyRez', description: 'Atom that extracts mercy rez events from the parsed log files.', atom: atom(mercyRezLogic) };
export const offensiveAssist: ScrimsightAtom<Promise<OffensiveAssistType>> = { name: 'offensiveAssist', description: 'Atom that extracts offensive assist events from the parsed log files.', atom: atom(offensiveAssistLogic) };
export const playerStat: ScrimsightAtom<Promise<PlayerStatType>> = { name: 'playerStat', description: 'Atom that extracts player stat events from the parsed log files.', atom: atom(playerStatLogic) };
export const roundEnd: ScrimsightAtom<Promise<RoundEndType>> = { name: 'roundEnd', description: 'Atom that extracts round end events from the parsed log files.', atom: atom(roundEndLogic) };
export const roundStart: ScrimsightAtom<Promise<RoundStartType>> = { name: 'roundStart', description: 'Atom that extracts round start events from the parsed log files.', atom: atom(roundStartLogic) };
export const setupComplete: ScrimsightAtom<Promise<SetupCompleteType>> = { name: 'setupComplete', description: 'Atom that extracts setup complete events from the parsed log files.', atom: atom(setupCompleteLogic) };
export const ultimateCharged: ScrimsightAtom<Promise<UltimateChargedType>> = { name: 'ultimateCharged', description: 'Atom that extracts ultimate charged events from the parsed log files.', atom: atom(ultimateChargedLogic) };
export const ultimateEnd: ScrimsightAtom<Promise<UltimateEndType>> = { name: 'ultimateEnd', description: 'Atom that extracts ultimate end events from the parsed log files.', atom: atom(ultimateEndLogic) };
export const ultimateStart: ScrimsightAtom<Promise<UltimateStartType>> = { name: 'ultimateStart', description: 'Atom that extracts ultimate start events from the parsed log files.', atom: atom(ultimateStartLogic) };

// Additional derived atoms
import teamNamesLogic from '@atoms/teamNamesAtom';
export const teamfightParticipation: ScrimsightAtom<Promise<TeamfightParticipationType>> = { name: 'teamfightParticipation', description: 'Atom that calculates player participation for each teamfight.', atom: atom(teamfightParticipationLogic) };
export const uniquePlayerNames: ScrimsightAtom<Promise<string[]>> = { name: 'uniquePlayerNames', description: 'Atom that extracts unique player names from all matches.', atom: atom(uniquePlayerNamesLogic) };
export const teamNames: ScrimsightAtom<Promise<string[]>> = { name: 'teamNames', description: 'Extracts all unique team names from matches.', atom: atom(teamNamesLogic) };
export const roundTimes: ScrimsightAtom<Promise<RoundTimesType>> = { name: 'roundTimes', description: 'Atom that combines round start, setup complete, and round end events to calculate round times.', atom: atom(roundTimesLogic) };
export const playerStatusTimeline: ScrimsightAtom<Promise<PlayerStatusTimelineType>> = { name: 'playerStatusTimeline', description: 'Atom that tracks the active players on each team over time for each match.', atom: atom(playerStatusTimelineLogic) };
export const playerEvents: ScrimsightAtom<Promise<any[]>> = { name: 'playerEvents', description: 'Atom that combines various player events into a unified timeline.', atom: atom(playerEventsLogic) };
export const playerFirstKillDeathRate: ScrimsightAtom<Promise<Record<string, PlayerFirstKillDeathRateStats>>> = { name: 'playerFirstKillDeathRate', description: 'Atom that calculates first kill and death rates for each player based on teamfight participation.', atom: atom(playerFirstKillDeathRateLogic) };
export const groupedEvents: ScrimsightAtom<Promise<GroupedKillOffensiveAssistEvent[]>> = { name: 'groupedEvents', description: 'Groups kill and offensive assist events by matchId and time.', atom: atom(groupedEventsLogic) };
export const playerComparison: ScrimsightAtomFamily<Promise<MetricComparison[]>, PlayerComparisonParams> = { name: 'playerComparison', description: 'Compares player stats against role and hero benchmarks.', family: playerComparisonFamilyLogic };

// Additional atoms for complex data structures
export const matchData: ScrimsightAtom<Promise<any[]>> = { name: 'matchData', description: 'Atom that combines match metadata with player statistics and game events.', atom: atom(matchDataLogic) };
export const uniqueMapNames: ScrimsightAtom<Promise<string[]>> = { name: 'uniqueMapNames', description: 'Atom that extracts unique map names from all matches.', atom: atom(uniqueMapNamesLogic) };
export const scrims: ScrimsightAtom<Promise<any[]>> = { name: 'scrims', description: 'Atom that groups matches into scrimmage sessions by date and teams.', atom: atom(scrimLogic) };
export const teamStats: ScrimsightAtom<Promise<any[]>> = { name: 'teamStats', description: 'Atom that calculates team-level statistics and performance metrics.', atom: atom(teamStatsLogic) };
export const mapTimes: ScrimsightAtom<Promise<MapTimes[]>> = { name: 'mapTimes', description: 'Atom that calculates duration and timing data for each map/match.', atom: atom(mapTimesLogic) };
export const matchExtractor: ScrimsightAtom<Promise<any[]>> = { name: 'matchExtractor', description: 'Atom that extracts match file information from log files.', atom: atom(matchExtractorLogic) };
export const killMatrix: ScrimsightAtomFamily<Promise<KillMatrixData | null>, string> = {
  name: 'killMatrixFamily',
  description: 'Provides a kill matrix for a given match ID, detailing kills between players.',
  family: killMatrixFamilyLogic
};
