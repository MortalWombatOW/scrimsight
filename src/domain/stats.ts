import { Metric } from '@library';
import { getRoleFromHero } from '@library';
import {
  PlayerStatsBase,
  PlayerStatsCategoryKeys,
  PlayerStatsBaseNumericalKeys,
  MatchEvents,
  RoundTimes,
} from '../types';

interface PlayerEventForPlaytime {
  matchId: string;
  playerName: string;
  playerHero: string;
  matchTime: number;
  eventType: string;
  playerEventTime?: number;
}

function createPlayerEvents(events: MatchEvents): PlayerEventForPlaytime[] {
  const playerEvents: PlayerEventForPlaytime[] = [];

  for (const spawn of events.heroSpawn) {
    playerEvents.push({
      matchId: spawn.matchId,
      playerName: spawn.playerName,
      playerHero: spawn.playerHero,
      matchTime: spawn.matchTime,
      eventType: 'heroSpawn',
      playerEventTime: spawn.matchTime,
    });
  }

  for (const swap of events.heroSwap) {
    playerEvents.push({
      matchId: swap.matchId,
      playerName: swap.playerName,
      playerHero: swap.playerHero,
      matchTime: swap.matchTime,
      eventType: 'heroSwap',
      playerEventTime: swap.matchTime,
    });
  }

  return playerEvents.sort((a, b) => (a.playerEventTime ?? a.matchTime) - (b.playerEventTime ?? b.matchTime));
}

function calculateHeroPlaytime(
  events: MatchEvents,
  roundTimes: RoundTimes[]
): Map<string, number> {
  const playerEvents = createPlayerEvents(events);
  const playtimeMap = new Map<string, number>();

  const eventsByPlayer = new Map<string, PlayerEventForPlaytime[]>();

  for (const event of playerEvents) {
    const eventTime = event.playerEventTime ?? event.matchTime;
    const round = roundTimes.find(
      (rt) =>
        rt.matchId === event.matchId &&
        eventTime >= rt.roundStartTime &&
        eventTime <= rt.roundEndTime
    );

    if (!round) continue;

    const key = `${event.playerName}-${event.matchId}-${round.roundNumber}`;
    if (!eventsByPlayer.has(key)) {
      eventsByPlayer.set(key, []);
    }
    eventsByPlayer.get(key)?.push(event);
  }

  for (const [playerKey, playerEventsList] of eventsByPlayer) {
    const [playerName, matchId, roundNumberStr] = playerKey.split('-');
    const roundNumber = parseInt(roundNumberStr);
    const round = roundTimes.find(
      (rt) => rt.matchId === matchId && rt.roundNumber === roundNumber
    );

    if (!round) continue;

    const sortedEvents = playerEventsList.sort(
      (a, b) => (a.playerEventTime ?? a.matchTime) - (b.playerEventTime ?? b.matchTime)
    );

    let currentHero = '';
    let lastHeroChangeTime = round.roundSetupCompleteTime;

    for (const event of sortedEvents) {
      const eventType = event.eventType;
      if (eventType === 'heroSpawn' || eventType === 'heroSwap') {
        if (currentHero) {
          const eventTime = event.playerEventTime ?? event.matchTime;
          const duration = eventTime - lastHeroChangeTime;
          const playtimeKey = `${playerName}-${matchId}-${roundNumber}-${currentHero}`;

          playtimeMap.set(playtimeKey, (playtimeMap.get(playtimeKey) || 0) + duration);
        }

        currentHero = event.playerHero;
        lastHeroChangeTime = event.playerEventTime ?? event.matchTime;
      }
    }

    if (currentHero) {
      const duration = round.roundEndTime - lastHeroChangeTime;
      const playtimeKey = `${playerName}-${matchId}-${roundNumber}-${currentHero}`;

      playtimeMap.set(playtimeKey, (playtimeMap.get(playtimeKey) || 0) + duration);
    }
  }

  return playtimeMap;
}

export function calculatePlayerStats(
  events: MatchEvents,
  roundTimes: RoundTimes[]
): Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> {
  const playtimeMap = calculateHeroPlaytime(events, roundTimes);

  const playerStatsCategoryKeys: PlayerStatsCategoryKeys[] = [
    'matchId',
    'roundNumber',
    'playerTeam',
    'playerName',
    'playerHero',
    'playerRole',
  ];

  const playerStatsBaseNumericalKeys: PlayerStatsBaseNumericalKeys[] = [
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

  const mergedStats: PlayerStatsBase[] = events.playerStat.map((stat) => {
    const playtime =
      playtimeMap.get(`${stat.playerName}-${stat.matchId}-${stat.roundNumber}-${stat.playerHero}`) || 0;

    const baseStat: PlayerStatsBase = {
      matchId: stat.matchId,
      roundNumber: stat.roundNumber,
      playerTeam: stat.playerTeam,
      playerName: stat.playerName,
      playerHero: stat.playerHero,
      playerRole: getRoleFromHero(stat.playerHero),
      playtime: playtime,
      eliminations: stat.eliminations,
      finalBlows: stat.finalBlows,
      deaths: stat.deaths,
      allDamageDealt: stat.allDamageDealt,
      barrierDamageDealt: stat.barrierDamageDealt,
      heroDamageDealt: stat.heroDamageDealt,
      healingDealt: stat.healingDealt,
      healingReceived: stat.healingReceived,
      selfHealing: stat.selfHealing,
      damageTaken: stat.damageTaken,
      damageBlocked: stat.damageBlocked,
      defensiveAssists: stat.defensiveAssists,
      offensiveAssists: stat.offensiveAssists,
      ultimatesEarned: stat.ultimatesEarned,
      ultimatesUsed: stat.ultimatesUsed,
      multikills: stat.multikills,
      soloKills: stat.soloKills,
      objectiveKills: stat.objectiveKills,
      environmentalKills: stat.environmentalKills,
      environmentalDeaths: stat.environmentalDeaths,
      criticalHits: stat.criticalHits,
      shotsFired: stat.shotsFired,
      shotsHit: stat.shotsHit,
      shotsMissed: stat.shotsMissed,
      scopedShotsFired: stat.scopedShotsFired,
      scopedShotsHit: stat.scopedShotsHit,
    };
    return baseStat;
  });

  return {
    categoryKeys: playerStatsCategoryKeys,
    numericalKeys: playerStatsBaseNumericalKeys,
    rows: mergedStats,
  };
}
