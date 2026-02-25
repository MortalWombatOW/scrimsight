import { z } from 'zod';
import { parseFile, ParsedLogFile } from '../lib/scrimtime';
import { 
  ProcessedMatch, 
  MatchEvents, 
  MatchMetadata,
} from '../types';
import { calculateTeamfights } from '../domain/teamfights';
import { calculatePlayerStats } from '../domain/stats';
import { calculateRoundTimes, calculateMapTimes, calculatePlayerStatusTimeline } from '../domain/timeline';
import { calculateUltimateEvents } from '../domain/ultimateEvents';
import { calculateUltCycles } from '../domain/economy';
import {
  Ability1UsedLogEventSchema,
  Ability2UsedLogEventSchema,
  DamageLogEventSchema,
  DefensiveAssistLogEventSchema,
  DvaDemechLogEventSchema,
  DvaRemechLogEventSchema,
  HealingLogEventSchema,
  HeroSpawnLogEventSchema,
  HeroSwapLogEventSchema,
  KillLogEventSchema,
  MatchEndLogEventSchema,
  MatchStartLogEventSchema,
  MercyRezLogEventSchema,
  OffensiveAssistLogEventSchema,
  PlayerStatLogEventSchema,
  RoundEndLogEventSchema,
  RoundStartLogEventSchema,
  SetupCompleteLogEventSchema,
  UltimateChargedLogEventSchema,
  UltimateEndLogEventSchema,
  UltimateStartLogEventSchema,
} from './schemas';

export interface IngestFileParams {
  fileContent: string;
  fileName: string;
  fileModified: number;
}

/**
 * Maps MatchEvents property keys to their corresponding specName strings.
 * This provides a type-safe bidirectional mapping for the groupEventsByType function.
 */
const SPEC_NAME_TO_EVENTS_KEY = {
  ability_1_used: 'ability1Used',
  ability_2_used: 'ability2Used',
  damage: 'damage',
  defensive_assist: 'defensiveAssist',
  dva_demech: 'dvaDemech',
  dva_remech: 'dvaRemech',
  healing: 'healing',
  hero_spawn: 'heroSpawn',
  hero_swap: 'heroSwap',
  kill: 'kills',
  match_end: 'matchEnd',
  match_start: 'matchStart',
  mercy_rez: 'mercyRez',
  offensive_assist: 'offensiveAssist',
  player_stat: 'playerStat',
  round_end: 'roundEnd',
  round_start: 'roundStart',
  setup_complete: 'setupComplete',
  ultimate_charged: 'ultimateCharged',
  ultimate_end: 'ultimateEnd',
  ultimate_start: 'ultimateStart',
} as const;

type SpecNameKey = keyof typeof SPEC_NAME_TO_EVENTS_KEY;

/**
 * Type guard to check if a specName is one we handle.
 */
function isHandledSpecName(specName: string): specName is SpecNameKey {
  return specName in SPEC_NAME_TO_EVENTS_KEY;
}

/**
 * Parses and validates event data using Zod schemas.
 * Throws a ZodError if validation fails, providing detailed error messages.
 */
function parseEventData<T>(
  data: Record<string, unknown>[],
  schema: z.ZodSchema<T>,
  eventType: string
): T[] {
  try {
    return z.array(schema).parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Validation failed for event type: ${eventType}`, {
        errors: error.errors,
        firstItem: data[0],
      });
    }
    throw error;
  }
}

function groupEventsByType(parsedFile: ParsedLogFile): MatchEvents {
  const events: MatchEvents = {
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

  for (const log of parsedFile.logs) {
    const { specName, data } = log;
    
    // Skip unhandled event types (e.g., echo_duplicate_start, payload_progress)
    if (!isHandledSpecName(specName)) {
      continue;
    }

    try {
      // Use Zod schemas for runtime type validation
      switch (specName) {
        case 'ability_1_used':
          events.ability1Used = parseEventData(data, Ability1UsedLogEventSchema, specName);
          break;
        case 'ability_2_used':
          events.ability2Used = parseEventData(data, Ability2UsedLogEventSchema, specName);
          break;
        case 'damage':
          events.damage = parseEventData(data, DamageLogEventSchema, specName);
          break;
        case 'defensive_assist':
          events.defensiveAssist = parseEventData(data, DefensiveAssistLogEventSchema, specName);
          break;
        case 'dva_demech':
          events.dvaDemech = parseEventData(data, DvaDemechLogEventSchema, specName);
          break;
        case 'dva_remech':
          events.dvaRemech = parseEventData(data, DvaRemechLogEventSchema, specName);
          break;
        case 'healing':
          events.healing = parseEventData(data, HealingLogEventSchema, specName);
          break;
        case 'hero_spawn':
          events.heroSpawn = parseEventData(data, HeroSpawnLogEventSchema, specName);
          break;
        case 'hero_swap':
          events.heroSwap = parseEventData(data, HeroSwapLogEventSchema, specName);
          break;
        case 'kill':
          events.kills = parseEventData(data, KillLogEventSchema, specName);
          break;
        case 'match_end':
          events.matchEnd = parseEventData(data, MatchEndLogEventSchema, specName);
          break;
        case 'match_start':
          events.matchStart = parseEventData(data, MatchStartLogEventSchema, specName);
          break;
        case 'mercy_rez':
          events.mercyRez = parseEventData(data, MercyRezLogEventSchema, specName);
          break;
        case 'offensive_assist':
          events.offensiveAssist = parseEventData(data, OffensiveAssistLogEventSchema, specName);
          break;
        case 'player_stat':
          events.playerStat = parseEventData(data, PlayerStatLogEventSchema, specName);
          break;
        case 'round_end':
          events.roundEnd = parseEventData(data, RoundEndLogEventSchema, specName);
          break;
        case 'round_start':
          events.roundStart = parseEventData(data, RoundStartLogEventSchema, specName);
          break;
        case 'setup_complete':
          events.setupComplete = parseEventData(data, SetupCompleteLogEventSchema, specName);
          break;
        case 'ultimate_charged':
          events.ultimateCharged = parseEventData(data, UltimateChargedLogEventSchema, specName);
          break;
        case 'ultimate_end':
          events.ultimateEnd = parseEventData(data, UltimateEndLogEventSchema, specName);
          break;
        case 'ultimate_start':
          events.ultimateStart = parseEventData(data, UltimateStartLogEventSchema, specName);
          break;
      }
    } catch (error) {
      console.error(`Validation failed for event type: ${specName}`, error);
      throw error;
    }
  }

  return events;
}

export function extractMetadata(
  matchId: string,
  fileName: string,
  fileModified: number,
  events: MatchEvents
): MatchMetadata {
  const matchStart = events.matchStart[0];
  const matchEnd = events.matchEnd[0];

  const fileDate = new Date(fileModified);
  const dateString = fileDate.toISOString().split('T')[0];
  const timeString = fileDate.toTimeString().split(' ')[0];

  const team1Players = Array.from(
    new Set(
      events.playerStat
        .filter((s) => s.playerTeam === matchStart?.team1Name)
        .map((s) => s.playerName)
    )
  );

  const team2Players = Array.from(
    new Set(
      events.playerStat
        .filter((s) => s.playerTeam === matchStart?.team2Name)
        .map((s) => s.playerName)
    )
  );

  const roundWinners = events.roundEnd
    .sort((a, b) => a.roundNumber - b.roundNumber)
    .map((r) =>
      r.team1Score > r.team2Score ? ('team1' as const) : r.team1Score < r.team2Score ? ('team2' as const) : ('draw' as const)
    );

  const team1Score = matchEnd?.team1Score ?? 0;
  const team2Score = matchEnd?.team2Score ?? 0;
  const team1Name = matchStart?.team1Name ?? '';
  const team2Name = matchStart?.team2Name ?? '';

  let winner: string | null = null;
  if (team1Score > team2Score) {
    winner = team1Name;
  } else if (team2Score > team1Score) {
    winner = team2Name;
  }

  const duration = matchEnd && matchStart ? matchEnd.matchTime - matchStart.matchTime : 0;

  return {
    matchId,
    fileName,
    fileModified,
    dateString,
    timeString,
    map: matchStart?.mapName ?? '',
    mode: matchStart?.mapType ?? '',
    team1Name,
    team2Name,
    team1Score,
    team2Score,
    team1Players,
    team2Players,
    duration,
    roundWinners,
    winner,
  };
}

export async function ingestFile(params: IngestFileParams): Promise<ProcessedMatch> {
  const { fileContent, fileName, fileModified } = params;

  const parsedFile = parseFile(fileContent);
  const { matchId } = parsedFile;

  const events = groupEventsByType(parsedFile);

  const metadata = extractMetadata(matchId, fileName, fileModified, events);

  const roundTimes = calculateRoundTimes(events);
  const mapTimes = calculateMapTimes(events, roundTimes);
  const ultimateEvents = calculateUltimateEvents(events);
  const ultCycles = calculateUltCycles(events);
  const teamfights = calculateTeamfights(events, metadata, ultCycles);
  const playerStats = calculatePlayerStats(events, roundTimes);
  const playerStatusTimeline = calculatePlayerStatusTimeline(events, matchId);

  const processedMatch: ProcessedMatch = {
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

  return processedMatch;
}
