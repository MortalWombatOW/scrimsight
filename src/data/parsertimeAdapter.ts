import { stringHash } from '@library';
import {
  ProcessedMatch,
  MatchEvents,
  KillLogEvent,
  MatchStartLogEvent,
  MatchEndLogEvent,
  RoundStartLogEvent,
  RoundEndLogEvent,
  SetupCompleteLogEvent,
  PlayerStatLogEvent,
  HeroSpawnLogEvent,
  HeroSwapLogEvent,
  UltimateChargedLogEvent,
  UltimateStartLogEvent,
  UltimateEndLogEvent,
  MercyRezLogEvent,
  OffensiveAssistLogEvent,
  DefensiveAssistLogEvent,
  DvaRemechLogEvent,
} from '../types';
import { extractMetadata } from './ingestor';
import { calculateTeamfights } from '../domain/teamfights';
import { calculatePlayerStats } from '../domain/stats';
import { calculateRoundTimes, calculateMapTimes, calculatePlayerStatusTimeline } from '../domain/timeline';
import { calculateUltimateEvents } from '../domain/ultimateEvents';
import { calculateUltCycles } from '../domain/economy';

// ============================================================================
// Constants
// ============================================================================

const BASE_URL = 'https://raw.githubusercontent.com/luxdotdev/dataset/main/ptime-pscale-prod-anonymized-2025-12-01';

const CSV_FILES = [
  'MatchStart.csv',
  'MatchEnd.csv',
  'RoundStart.csv',
  'RoundEnd.csv',
  'SetupComplete.csv',
  'Kill.csv',
  'PlayerStat.csv',
  'HeroSpawn.csv',
  'HeroSwap.csv',
  'UltimateCharged.csv',
  'UltimateStart.csv',
  'UltimateEnd.csv',
  'MercyRez.csv',
  'OffensiveAssist.csv',
  'DefensiveAssist.csv',
  'DvaRemech.csv',
  'Scrim.csv',
] as const;

const CRITICAL_FILES = new Set(['MatchStart.csv', 'MatchEnd.csv', 'Kill.csv', 'PlayerStat.csv']);

// ============================================================================
// Progress Type
// ============================================================================

export interface ParsertimeProgress {
  phase: 'downloading' | 'processing';
  filesCompleted: number;
  filesTotal: number;
  matchesProcessed: number;
  matchesTotal: number;
}

// ============================================================================
// CSV Parsing
// ============================================================================

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (values[j] ?? '').trim();
    }
    rows.push(row);
  }

  return rows;
}

// ============================================================================
// Helpers
// ============================================================================

function parseNum(val: string | undefined): number {
  if (val === undefined || val === '') return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

function parseBool(val: string | undefined): boolean {
  if (val === undefined) return false;
  return val === '1' || val.toLowerCase() === 'true';
}

function parseMatchTime(val: string | undefined): number {
  return parseNum(val);
}

function makeMatchId(mapDataId: string): string {
  return stringHash('parsertime-' + mapDataId).toString();
}

// ============================================================================
// Row Converters
// ============================================================================

export function convertMatchStartRow(row: Record<string, string>, matchId: string): MatchStartLogEvent {
  return {
    matchId,
    type: 'match_start',
    matchTime: parseMatchTime(row['match_time']),
    mapName: row['map_name'] ?? '',
    mapType: row['map_type'] ?? '',
    team1Name: row['team_1_name'] ?? '',
    team2Name: row['team_2_name'] ?? '',
  };
}

export function convertMatchEndRow(row: Record<string, string>, matchId: string): MatchEndLogEvent {
  return {
    matchId,
    type: 'match_end',
    matchTime: parseMatchTime(row['match_time']),
    roundNumber: parseNum(row['round_number']),
    team1Score: parseNum(row['team_1_score']),
    team2Score: parseNum(row['team_2_score']),
  };
}

export function convertRoundStartRow(row: Record<string, string>, matchId: string): RoundStartLogEvent {
  return {
    matchId,
    type: 'round_start',
    matchTime: parseMatchTime(row['match_time']),
    roundNumber: parseNum(row['round_number']),
    capturingTeam: row['capturing_team'] ?? '',
    team1Score: parseNum(row['team_1_score']),
    team2Score: parseNum(row['team_2_score']),
    objectiveIndex: parseNum(row['objective_index']),
  };
}

export function convertRoundEndRow(row: Record<string, string>, matchId: string): RoundEndLogEvent {
  return {
    matchId,
    type: 'round_end',
    matchTime: parseMatchTime(row['match_time']),
    roundNumber: parseNum(row['round_number']),
    capturingTeam: row['capturing_team'] ?? '',
    team1Score: parseNum(row['team_1_score']),
    team2Score: parseNum(row['team_2_score']),
    objectiveIndex: parseNum(row['objective_index']),
    controlTeam1Progress: parseNum(row['control_team_1_progress']),
    controlTeam2Progress: parseNum(row['control_team_2_progress']),
    matchTimeRemaining: parseNum(row['match_time_remaining']),
  };
}

export function convertSetupCompleteRow(row: Record<string, string>, matchId: string): SetupCompleteLogEvent {
  return {
    matchId,
    type: 'setup_complete',
    matchTime: parseMatchTime(row['match_time']),
    roundNumber: parseNum(row['round_number']),
    matchTimeRemaining: parseNum(row['match_time_remaining']),
  };
}

export function convertKillRow(row: Record<string, string>, matchId: string): KillLogEvent {
  return {
    matchId,
    type: 'kill',
    matchTime: parseMatchTime(row['match_time']),
    attackerTeam: row['attacker_team'] ?? '',
    attackerName: row['attacker_name'] ?? '',
    attackerHero: row['attacker_hero'] ?? '',
    victimTeam: row['victim_team'] ?? '',
    victimName: row['victim_name'] ?? '',
    victimHero: row['victim_hero'] ?? '',
    eventAbility: row['event_ability'] ?? '',
    eventDamage: parseNum(row['event_damage']),
    isCriticalHit: parseBool(row['is_critical_hit']),
    isEnvironmental: parseBool(row['is_environmental']),
  };
}

export function convertPlayerStatRow(row: Record<string, string>, matchId: string): PlayerStatLogEvent {
  return {
    matchId,
    type: 'player_stat',
    matchTime: parseMatchTime(row['match_time']),
    roundNumber: row['round_number'] ?? '0',
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    eliminations: parseNum(row['eliminations']),
    finalBlows: parseNum(row['final_blows']),
    deaths: parseNum(row['deaths']),
    allDamageDealt: parseNum(row['all_damage_dealt']),
    barrierDamageDealt: parseNum(row['barrier_damage_dealt']),
    heroDamageDealt: parseNum(row['hero_damage_dealt']),
    healingDealt: parseNum(row['healing_dealt']),
    healingReceived: parseNum(row['healing_received']),
    selfHealing: parseNum(row['self_healing']),
    damageTaken: parseNum(row['damage_taken']),
    damageBlocked: parseNum(row['damage_blocked']),
    defensiveAssists: parseNum(row['defensive_assists']),
    offensiveAssists: parseNum(row['offensive_assists']),
    ultimatesEarned: parseNum(row['ultimates_earned']),
    ultimatesUsed: parseNum(row['ultimates_used']),
    multikillBest: parseNum(row['multikill_best']),
    multikills: parseNum(row['multikills']),
    soloKills: parseNum(row['solo_kills']),
    objectiveKills: parseNum(row['objective_kills']),
    environmentalKills: parseNum(row['environmental_kills']),
    environmentalDeaths: parseNum(row['environmental_deaths']),
    criticalHits: parseNum(row['critical_hits']),
    criticalHitAccuracy: parseNum(row['critical_hit_accuracy']),
    scopedAccuracy: parseNum(row['scoped_accuracy']),
    scopedCriticalHitAccuracy: parseNum(row['scoped_critical_hit_accuracy']),
    scopedCriticalHitKills: parseNum(row['scoped_critical_hit_kills']),
    shotsFired: parseNum(row['shots_fired']),
    shotsHit: parseNum(row['shots_hit']),
    shotsMissed: parseNum(row['shots_missed']),
    scopedShotsFired: parseNum(row['scoped_shots']),
    scopedShotsHit: parseNum(row['scoped_shots_hit']),
    weaponAccuracy: parseNum(row['weapon_accuracy']),
  };
}

export function convertHeroSpawnRow(row: Record<string, string>, matchId: string): HeroSpawnLogEvent {
  return {
    matchId,
    type: 'hero_spawn',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    previousHero: row['previous_hero'] === '0' ? '' : (row['previous_hero'] ?? ''),
    heroTimePlayed: parseNum(row['hero_time_played']),
  };
}

export function convertHeroSwapRow(row: Record<string, string>, matchId: string): HeroSwapLogEvent {
  return {
    matchId,
    type: 'hero_swap',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    previousHero: row['previous_hero'] === '0' ? '' : (row['previous_hero'] ?? ''),
    heroTimePlayed: parseNum(row['hero_time_played']),
  };
}

export function convertUltimateChargedRow(row: Record<string, string>, matchId: string): UltimateChargedLogEvent {
  return {
    matchId,
    type: 'ultimate_charged',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    heroDuplicated: row['hero_duplicated'] === '0' ? '' : (row['hero_duplicated'] ?? ''),
    ultimateId: parseNum(row['ultimate_id']),
  };
}

export function convertUltimateStartRow(row: Record<string, string>, matchId: string): UltimateStartLogEvent {
  return {
    matchId,
    type: 'ultimate_start',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    heroDuplicated: row['hero_duplicated'] === '0' ? '' : (row['hero_duplicated'] ?? ''),
    ultimateId: parseNum(row['ultimate_id']),
  };
}

export function convertUltimateEndRow(row: Record<string, string>, matchId: string): UltimateEndLogEvent {
  return {
    matchId,
    type: 'ultimate_end',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    heroDuplicated: row['hero_duplicated'] === '0' ? '' : (row['hero_duplicated'] ?? ''),
    ultimateId: parseNum(row['ultimate_id']),
  };
}

export function convertMercyRezRow(row: Record<string, string>, matchId: string): MercyRezLogEvent {
  return {
    matchId,
    type: 'mercy_rez',
    matchTime: parseMatchTime(row['match_time']),
    mercyTeam: row['resurrecter_team'] ?? '',
    mercyName: row['resurrecter_player'] ?? '',
    revivedTeam: row['resurrectee_team'] ?? '',
    revivedName: row['resurrectee_player'] ?? '',
    revivedHero: row['resurrectee_hero'] ?? '',
    eventAbility: 'Resurrect',
  };
}

export function convertOffensiveAssistRow(row: Record<string, string>, matchId: string): OffensiveAssistLogEvent {
  return {
    matchId,
    type: 'offensive_assist',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    heroDuplicated: row['hero_duplicated'] === '0' ? '' : (row['hero_duplicated'] ?? ''),
  };
}

export function convertDefensiveAssistRow(row: Record<string, string>, matchId: string): DefensiveAssistLogEvent {
  return {
    matchId,
    type: 'defensive_assist',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    heroDuplicated: row['hero_duplicated'] === '0' ? '' : (row['hero_duplicated'] ?? ''),
  };
}

export function convertDvaRemechRow(row: Record<string, string>, matchId: string): DvaRemechLogEvent {
  return {
    matchId,
    type: 'dva_remech',
    matchTime: parseMatchTime(row['match_time']),
    playerTeam: row['player_team'] ?? '',
    playerName: row['player_name'] ?? '',
    playerHero: row['player_hero'] ?? '',
    ultimateId: parseNum(row['ultimate_id']),
  };
}

// ============================================================================
// Internal Types
// ============================================================================

interface MatchEventsAccumulator {
  scrimId: string;
  events: MatchEvents;
}

function createEmptyMatchEvents(): MatchEvents {
  return {
    ability1Used: [],
    ability2Used: [],
    damage: [],
    defensiveAssist: [],
    dvaDemech: [],
    dvaRemech: [],
    healing: [],
    heroSpawn: [],
    heroSwap: [],
    kills: [],
    matchEnd: [],
    matchStart: [],
    mercyRez: [],
    offensiveAssist: [],
    playerStat: [],
    roundEnd: [],
    roundStart: [],
    setupComplete: [],
    ultimateCharged: [],
    ultimateEnd: [],
    ultimateStart: [],
  };
}

// ============================================================================
// Grouping
// ============================================================================

export function groupRowsByMatch(
  csvData: Map<string, Record<string, string>[]>
): Map<string, MatchEventsAccumulator> {
  const matches = new Map<string, MatchEventsAccumulator>();

  function getOrCreate(mapDataId: string, scrimId: string): MatchEventsAccumulator {
    let acc = matches.get(mapDataId);
    if (!acc) {
      acc = { scrimId, events: createEmptyMatchEvents() };
      matches.set(mapDataId, acc);
    }
    return acc;
  }

  // Generic helper to process rows for a given event type
  function processRows<T>(
    fileName: string,
    convert: (row: Record<string, string>, matchId: string) => T,
    push: (acc: MatchEventsAccumulator, event: T) => void,
  ) {
    const rows = csvData.get(fileName);
    if (!rows) return;
    for (const row of rows) {
      const mapDataId = row['MapDataId'];
      if (!mapDataId) continue;
      const matchId = makeMatchId(mapDataId);
      const acc = getOrCreate(mapDataId, row['scrimId'] ?? '');
      try {
        push(acc, convert(row, matchId));
      } catch (e) {
        console.warn(`Skipping malformed ${fileName} row`, e);
      }
    }
  }

  processRows('MatchStart.csv', convertMatchStartRow, (a, e) => a.events.matchStart.push(e));
  processRows('MatchEnd.csv', convertMatchEndRow, (a, e) => a.events.matchEnd.push(e));
  processRows('RoundStart.csv', convertRoundStartRow, (a, e) => a.events.roundStart.push(e));
  processRows('RoundEnd.csv', convertRoundEndRow, (a, e) => a.events.roundEnd.push(e));
  processRows('SetupComplete.csv', convertSetupCompleteRow, (a, e) => a.events.setupComplete.push(e));
  processRows('Kill.csv', convertKillRow, (a, e) => a.events.kills.push(e));
  processRows('PlayerStat.csv', convertPlayerStatRow, (a, e) => a.events.playerStat.push(e));
  processRows('HeroSpawn.csv', convertHeroSpawnRow, (a, e) => a.events.heroSpawn.push(e));
  processRows('HeroSwap.csv', convertHeroSwapRow, (a, e) => a.events.heroSwap.push(e));
  processRows('UltimateCharged.csv', convertUltimateChargedRow, (a, e) => a.events.ultimateCharged.push(e));
  processRows('UltimateStart.csv', convertUltimateStartRow, (a, e) => a.events.ultimateStart.push(e));
  processRows('UltimateEnd.csv', convertUltimateEndRow, (a, e) => a.events.ultimateEnd.push(e));
  processRows('MercyRez.csv', convertMercyRezRow, (a, e) => a.events.mercyRez.push(e));
  processRows('OffensiveAssist.csv', convertOffensiveAssistRow, (a, e) => a.events.offensiveAssist.push(e));
  processRows('DefensiveAssist.csv', convertDefensiveAssistRow, (a, e) => a.events.defensiveAssist.push(e));
  processRows('DvaRemech.csv', convertDvaRemechRow, (a, e) => a.events.dvaRemech.push(e));

  return matches;
}

// ============================================================================
// Match Building
// ============================================================================

function buildProcessedMatch(
  mapDataId: string,
  scrimId: string,
  events: MatchEvents,
  scrimDates: Map<string, number>,
): ProcessedMatch {
  const matchId = makeMatchId(mapDataId);
  const fileName = `parsertime-${mapDataId}.csv`;
  const fileModified = scrimDates.get(scrimId) ?? Date.now();

  const metadata = extractMetadata(matchId, fileName, fileModified, events);

  const roundTimes = calculateRoundTimes(events);
  const mapTimes = calculateMapTimes(events, roundTimes);
  const ultimateEvents = calculateUltimateEvents(events);
  const ultCycles = calculateUltCycles(events);
  const teamfights = calculateTeamfights(events, metadata, ultCycles);
  const playerStats = calculatePlayerStats(events, roundTimes);
  const playerStatusTimeline = calculatePlayerStatusTimeline(events, matchId);

  return {
    metadata,
    events,
    teamfights,
    playerStats,
    roundTimes,
    mapTimes,
    playerStatusTimeline,
    ultimateEvents,
    ultCycles,
  };
}

// ============================================================================
// Scrim Date Extraction
// ============================================================================

function buildScrimDates(scrimRows: Record<string, string>[]): Map<string, number> {
  const dates = new Map<string, number>();
  for (const row of scrimRows) {
    const id = row['id'];
    const dateStr = row['date'] ?? row['createdAt'];
    if (id && dateStr) {
      const ts = new Date(dateStr).getTime();
      if (!isNaN(ts)) {
        dates.set(id, ts);
      }
    }
  }
  return dates;
}

// ============================================================================
// Orchestrator
// ============================================================================

export async function fetchParsertimeDataset(
  onProgress: (progress: ParsertimeProgress) => void,
): Promise<ProcessedMatch[]> {
  const filesTotal = CSV_FILES.length;

  // Phase 1: Download all CSVs in parallel
  onProgress({ phase: 'downloading', filesCompleted: 0, filesTotal, matchesProcessed: 0, matchesTotal: 0 });

  let filesCompleted = 0;
  const csvData = new Map<string, Record<string, string>[]>();

  const fetchResults = await Promise.allSettled(
    CSV_FILES.map(async (fileName) => {
      const response = await fetch(`${BASE_URL}/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${response.status}`);
      }
      const text = await response.text();
      const rows = parseCsv(text);
      filesCompleted++;
      onProgress({ phase: 'downloading', filesCompleted, filesTotal, matchesProcessed: 0, matchesTotal: 0 });
      return { fileName, rows };
    })
  );

  // Process results, checking critical files
  for (const result of fetchResults) {
    if (result.status === 'fulfilled') {
      csvData.set(result.value.fileName, result.value.rows);
    } else {
      const errorMsg = result.reason?.message ?? '';
      const isCritical = Array.from(CRITICAL_FILES).some((f) => errorMsg.includes(f));
      if (isCritical) {
        throw new Error(`Critical CSV fetch failed: ${errorMsg}`);
      }
      console.warn('Non-critical CSV fetch failed:', errorMsg);
    }
  }

  // Verify all critical files were fetched
  for (const critical of CRITICAL_FILES) {
    if (!csvData.has(critical)) {
      throw new Error(`Critical CSV missing: ${critical}`);
    }
  }

  // Phase 2: Group rows by match and process
  const scrimDates = buildScrimDates(csvData.get('Scrim.csv') ?? []);
  const matchGroups = groupRowsByMatch(csvData);

  // Filter out matches missing MatchStart or MatchEnd
  const validMatches: [string, MatchEventsAccumulator][] = [];
  for (const [mapDataId, acc] of matchGroups) {
    if (acc.events.matchStart.length === 0 || acc.events.matchEnd.length === 0) {
      console.warn(`Skipping match ${mapDataId}: missing MatchStart or MatchEnd`);
      continue;
    }
    validMatches.push([mapDataId, acc]);
  }

  const matchesTotal = validMatches.length;
  onProgress({ phase: 'processing', filesCompleted: filesTotal, filesTotal, matchesProcessed: 0, matchesTotal });

  // Process in batches, yielding to event loop
  const BATCH_SIZE = 50;
  const results: ProcessedMatch[] = [];
  let matchesProcessed = 0;

  for (let i = 0; i < validMatches.length; i += BATCH_SIZE) {
    const batch = validMatches.slice(i, i + BATCH_SIZE);

    for (const [mapDataId, acc] of batch) {
      try {
        const match = buildProcessedMatch(mapDataId, acc.scrimId, acc.events, scrimDates);
        results.push(match);
      } catch (e) {
        console.warn(`Failed to process match ${mapDataId}:`, e);
      }
      matchesProcessed++;
    }

    onProgress({ phase: 'processing', filesCompleted: filesTotal, filesTotal, matchesProcessed, matchesTotal });

    // Yield to event loop between batches
    if (i + BATCH_SIZE < validMatches.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return results;
}
