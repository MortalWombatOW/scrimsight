import { parseFile, ParsedLogFile } from '../lib/scrimtime';
import { 
  ProcessedMatch, 
  MatchEvents, 
  MatchMetadata,
  Ability1UsedLogEvent,
  Ability2UsedLogEvent,
  DamageLogEvent,
  DefensiveAssistLogEvent,
  DvaDemechLogEvent,
  DvaRemechLogEvent,
  HealingLogEvent,
  HeroSpawnLogEvent,
  HeroSwapLogEvent,
  KillLogEvent,
  MatchEndLogEvent,
  MatchStartLogEvent,
  MercyRezLogEvent,
  OffensiveAssistLogEvent,
  PlayerStatLogEvent,
  RoundEndLogEvent,
  RoundStartLogEvent,
  SetupCompleteLogEvent,
  UltimateChargedLogEvent,
  UltimateEndLogEvent,
  UltimateStartLogEvent,
} from '../types';
import { calculateTeamfights } from '../domain/teamfights';
import { calculatePlayerStats } from '../domain/stats';
import { calculateRoundTimes, calculateMapTimes, calculatePlayerStatusTimeline } from '../domain/timeline';
import { calculateUltimateEvents } from '../domain/ultimateEvents';

interface IngestFileParams {
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
 * Casts log data to the appropriate event type.
 * The data comes from the parser as Record<string, unknown>[] but we know
 * the structure matches our log event interfaces based on the specName.
 */
function castEventData<T>(data: Record<string, unknown>[]): T {
  // The parser guarantees the structure matches the specName, so this cast is safe
  return data as unknown as T;
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

    // Use the type-safe mapping to assign events
    switch (specName) {
      case 'ability_1_used':
        events.ability1Used = castEventData<Ability1UsedLogEvent[]>(data);
        break;
      case 'ability_2_used':
        events.ability2Used = castEventData<Ability2UsedLogEvent[]>(data);
        break;
      case 'damage':
        events.damage = castEventData<DamageLogEvent[]>(data);
        break;
      case 'defensive_assist':
        events.defensiveAssist = castEventData<DefensiveAssistLogEvent[]>(data);
        break;
      case 'dva_demech':
        events.dvaDemech = castEventData<DvaDemechLogEvent[]>(data);
        break;
      case 'dva_remech':
        events.dvaRemech = castEventData<DvaRemechLogEvent[]>(data);
        break;
      case 'healing':
        events.healing = castEventData<HealingLogEvent[]>(data);
        break;
      case 'hero_spawn':
        events.heroSpawn = castEventData<HeroSpawnLogEvent[]>(data);
        break;
      case 'hero_swap':
        events.heroSwap = castEventData<HeroSwapLogEvent[]>(data);
        break;
      case 'kill':
        events.kills = castEventData<KillLogEvent[]>(data);
        break;
      case 'match_end':
        events.matchEnd = castEventData<MatchEndLogEvent[]>(data);
        break;
      case 'match_start':
        events.matchStart = castEventData<MatchStartLogEvent[]>(data);
        break;
      case 'mercy_rez':
        events.mercyRez = castEventData<MercyRezLogEvent[]>(data);
        break;
      case 'offensive_assist':
        events.offensiveAssist = castEventData<OffensiveAssistLogEvent[]>(data);
        break;
      case 'player_stat':
        events.playerStat = castEventData<PlayerStatLogEvent[]>(data);
        break;
      case 'round_end':
        events.roundEnd = castEventData<RoundEndLogEvent[]>(data);
        break;
      case 'round_start':
        events.roundStart = castEventData<RoundStartLogEvent[]>(data);
        break;
      case 'setup_complete':
        events.setupComplete = castEventData<SetupCompleteLogEvent[]>(data);
        break;
      case 'ultimate_charged':
        events.ultimateCharged = castEventData<UltimateChargedLogEvent[]>(data);
        break;
      case 'ultimate_end':
        events.ultimateEnd = castEventData<UltimateEndLogEvent[]>(data);
        break;
      case 'ultimate_start':
        events.ultimateStart = castEventData<UltimateStartLogEvent[]>(data);
        break;
    }
  }

  return events;
}

function extractMetadata(
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
  const teamfights = calculateTeamfights(events, metadata, ultimateEvents);
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
  };

  return processedMatch;
}
