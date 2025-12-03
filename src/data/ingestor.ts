import { parseFile, ParsedLogFile } from '../lib/scrimtime';
import { ProcessedMatch, MatchEvents, MatchMetadata } from './types';
import { calculateTeamfights } from '../domain/teamfights';
import { calculatePlayerStats } from '../domain/stats';
import { calculateRoundTimes, calculateMapTimes, calculatePlayerStatusTimeline } from '../domain/timeline';
import { calculateUltimateEvents } from '../domain/ultimateEvents';

interface IngestFileParams {
  fileContent: string;
  fileName: string;
  fileModified: number;
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
    switch (log.specName) {
      case 'ability_1_used':
        events.ability1Used = log.data as any;
        break;
      case 'ability_2_used':
        events.ability2Used = log.data as any;
        break;
      case 'damage':
        events.damage = log.data as any;
        break;
      case 'defensive_assist':
        events.defensiveAssist = log.data as any;
        break;
      case 'dva_demech':
        events.dvaDemech = log.data as any;
        break;
      case 'dva_remech':
        events.dvaRemech = log.data as any;
        break;
      case 'healing':
        events.healing = log.data as any;
        break;
      case 'hero_spawn':
        events.heroSpawn = log.data as any;
        break;
      case 'hero_swap':
        events.heroSwap = log.data as any;
        break;
      case 'kill':
        events.kills = log.data as any;
        break;
      case 'match_end':
        events.matchEnd = log.data as any;
        break;
      case 'match_start':
        events.matchStart = log.data as any;
        break;
      case 'mercy_rez':
        events.mercyRez = log.data as any;
        break;
      case 'offensive_assist':
        events.offensiveAssist = log.data as any;
        break;
      case 'player_stat':
        events.playerStat = log.data as any;
        break;
      case 'round_end':
        events.roundEnd = log.data as any;
        break;
      case 'round_start':
        events.roundStart = log.data as any;
        break;
      case 'setup_complete':
        events.setupComplete = log.data as any;
        break;
      case 'ultimate_charged':
        events.ultimateCharged = log.data as any;
        break;
      case 'ultimate_end':
        events.ultimateEnd = log.data as any;
        break;
      case 'ultimate_start':
        events.ultimateStart = log.data as any;
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
