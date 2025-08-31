import * as ScrimsightDataModel from "../../ScrimsightDataModel";
import * as R from "remeda";

const calculateUltimateChargeTime = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  grouping: {
    playerName?: string;
    playerHero?: ScrimsightDataModel.Hero;
    matchId?: string;
  }
): number => {
  if (!grouping.playerName || !grouping.playerHero || !grouping.matchId) {
    return 0;
  }

  const ultChargedEvents = dataModel.ultimateCharged.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.playerName === grouping.playerName &&
      event.playerHero === grouping.playerHero
  );

  if (ultChargedEvents.length === 0) {
    return 0;
  }

  const heroSpawnEvents = dataModel.heroSpawn.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.playerName === grouping.playerName &&
      event.playerHero === grouping.playerHero
  );

  const deathEvents = dataModel.kill.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.victimName === grouping.playerName &&
      event.victimHero === grouping.playerHero
  );

  const ultUsedEvents = dataModel.ultimateEnd.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.playerName === grouping.playerName &&
      event.playerHero === grouping.playerHero
  );

  const chargeTimes: number[] = [];
  
  // Find the initial spawn time or use 0
  let lastResetTime = 0;
  const initialSpawn = heroSpawnEvents.find(event => event.matchTime === 0);
  if (initialSpawn) {
    lastResetTime = initialSpawn.matchTime;
  }

  for (const chargedEvent of ultChargedEvents.sort((a, b) => a.matchTime - b.matchTime)) {
    // Find the most recent reset time before this charge (death or ultimate use)
    const allResetEvents = [...deathEvents, ...ultUsedEvents]
      .filter(event => event.matchTime < chargedEvent.matchTime)
      .sort((a, b) => a.matchTime - b.matchTime);
    
    // Use the most recent reset event or the initial spawn/0
    const mostRecentReset = allResetEvents[allResetEvents.length - 1];
    const resetTime = mostRecentReset ? mostRecentReset.matchTime : lastResetTime;

    const chargeTime = chargedEvent.matchTime - resetTime;
    chargeTimes.push(chargeTime);
  }

  return chargeTimes.length > 0 ? R.mean(chargeTimes) as number : 0;
};

const calculateUltimateHoldTime = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  grouping: {
    playerName?: string;
    playerHero?: ScrimsightDataModel.Hero;
    matchId?: string;
  }
): number => {
  if (!grouping.playerName || !grouping.playerHero || !grouping.matchId) {
    return 0;
  }

  const ultChargedEvents = dataModel.ultimateCharged.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.playerName === grouping.playerName &&
      event.playerHero === grouping.playerHero
  );

  const ultStartEvents = dataModel.ultimateStart.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.playerName === grouping.playerName &&
      event.playerHero === grouping.playerHero
  );

  const holdTimes: number[] = [];

  for (const chargedEvent of ultChargedEvents) {
    const correspondingStart = ultStartEvents.find(
      (start) => start.ultimateId === chargedEvent.ultimateId
    );
    
    if (correspondingStart) {
      const holdTime = correspondingStart.matchTime - chargedEvent.matchTime;
      holdTimes.push(holdTime);
    }
  }

  return holdTimes.length > 0 ? R.mean(holdTimes) as number : 0;
};

const calculateUltimateUseTime = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  grouping: {
    playerName?: string;
    playerHero?: ScrimsightDataModel.Hero;
    matchId?: string;
  }
): number => {
  if (!grouping.playerName || !grouping.playerHero || !grouping.matchId) {
    return 0;
  }

  const ultStartEvents = dataModel.ultimateStart.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.playerName === grouping.playerName &&
      event.playerHero === grouping.playerHero
  );

  const ultEndEvents = dataModel.ultimateEnd.filter(
    (event) =>
      event.matchId === grouping.matchId &&
      event.playerName === grouping.playerName &&
      event.playerHero === grouping.playerHero
  );

  const useTimes: number[] = [];

  for (const startEvent of ultStartEvents) {
    const correspondingEnd = ultEndEvents.find(
      (end) => end.ultimateId === startEvent.ultimateId
    );
    
    if (correspondingEnd) {
      const useTime = correspondingEnd.matchTime - startEvent.matchTime;
      useTimes.push(useTime);
    }
  }

  return useTimes.length > 0 ? R.mean(useTimes) as number : 0;
};

const calculateAverageLifeDuration = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  grouping: {
    playerName?: string;
    matchId?: string;
  }
): number => {
  if (!grouping.playerName || !grouping.matchId) {
    return 0;
  }

  const playerLives = dataModel.playerLives.filter(
    (life) =>
      life.matchId === grouping.matchId &&
      life.player === grouping.playerName
  );

  if (playerLives.length === 0) {
    return 0;
  }

  const totalDuration = R.sumBy(playerLives, (life) => life.duration);
  return totalDuration / playerLives.length;
};

export const computeDerivedStats = (
  aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase,
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  grouping: {
    playerName?: string;
    playerTeam?: string;
    playerHero?: ScrimsightDataModel.Hero;
    playerRole?: ScrimsightDataModel.Role;
    matchId?: string;
    scrim?: string;
  }
): ScrimsightDataModel.PlayerStatsFinal => {
  const playtimeMinutes = aggregatedBase.playtime / 60;
  
  const derivedRatios = {
    eliminationsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.eliminations / playtimeMinutes) * 10 : 0,
    finalBlowsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.finalBlows / playtimeMinutes) * 10 : 0,
    deathsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.deaths / playtimeMinutes) * 10 : 0,
    allDamageDealtPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.allDamageDealt / playtimeMinutes) * 10 : 0,
    barrierDamageDealtPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.barrierDamageDealt / playtimeMinutes) * 10 : 0,
    heroDamageDealtPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.heroDamageDealt / playtimeMinutes) * 10 : 0,
    healingDealtPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.healingDealt / playtimeMinutes) * 10 : 0,
    healingReceivedPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.healingReceived / playtimeMinutes) * 10 : 0,
    selfHealingPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.selfHealing / playtimeMinutes) * 10 : 0,
    damageTakenPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.damageTaken / playtimeMinutes) * 10 : 0,
    damageBlockedPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.damageBlocked / playtimeMinutes) * 10 : 0,
    defensiveAssistsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.defensiveAssists / playtimeMinutes) * 10 : 0,
    offensiveAssistsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.offensiveAssists / playtimeMinutes) * 10 : 0,
    ultimatesEarnedPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.ultimatesEarned / playtimeMinutes) * 10 : 0,
    ultimatesUsedPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.ultimatesUsed / playtimeMinutes) * 10 : 0,
    multikillsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.multikills / playtimeMinutes) * 10 : 0,
    soloKillsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.soloKills / playtimeMinutes) * 10 : 0,
    objectiveKillsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.objectiveKills / playtimeMinutes) * 10 : 0,
    environmentalKillsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.environmentalKills / playtimeMinutes) * 10 : 0,
    environmentalDeathsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.environmentalDeaths / playtimeMinutes) * 10 : 0,
    criticalHitsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.criticalHits / playtimeMinutes) * 10 : 0,
    shotsFiredPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.shotsFired / playtimeMinutes) * 10 : 0,
    shotsHitPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.shotsHit / playtimeMinutes) * 10 : 0,
    shotsMissedPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.shotsMissed / playtimeMinutes) * 10 : 0,
    scopedShotsFiredPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.scopedShotsFired / playtimeMinutes) * 10 : 0,
    scopedShotsHitPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.scopedShotsHit / playtimeMinutes) * 10 : 0,
    weaponAccuracy: aggregatedBase.shotsFired > 0 ? (aggregatedBase.shotsHit / aggregatedBase.shotsFired) * 100 : 0,
    scopedWeaponAccuracy: aggregatedBase.scopedShotsFired > 0 ? (aggregatedBase.scopedShotsHit / aggregatedBase.scopedShotsFired) * 100 : 0,
    criticalHitRate: aggregatedBase.shotsHit > 0 ? (aggregatedBase.criticalHits / aggregatedBase.shotsHit) * 100 : 0,
    killsPerUltimate: aggregatedBase.ultsUsed > 0 ? aggregatedBase.ultKills / aggregatedBase.ultsUsed : 0,
    firstKillRate: aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWithFirstKill / aggregatedBase.teamfightsParticipated : 0,
    firstDeathRate: aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWithFirstDeath / aggregatedBase.teamfightsParticipated : 0,
    teamfightWinRate: aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWon / aggregatedBase.teamfightsParticipated : 0,
    teamfightWinRateWithUlt: aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithUlt / aggregatedBase.teamfightsParticipated : 0,
    teamfightWinRateWithoutUlt: aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithoutUlt / aggregatedBase.teamfightsParticipated : 0,
    teamfightWinRateWithFirstKill: aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithFirstKill / aggregatedBase.teamfightsParticipated : 0,
    teamfightWinRateWithFirstDeath: aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithFirstDeath / aggregatedBase.teamfightsParticipated : 0,
    ultimateChargeTime: calculateUltimateChargeTime(dataModel, grouping),
    ultimateHoldTime: calculateUltimateHoldTime(dataModel, grouping),
    ultimateUseTime: calculateUltimateUseTime(dataModel, grouping),
    tankFocusRate: aggregatedBase.eliminations > 0 ? aggregatedBase.tankKills / aggregatedBase.eliminations : 0,
    damageFocusRate: aggregatedBase.eliminations > 0 ? aggregatedBase.damageKills / aggregatedBase.eliminations : 0,
    supportFocusRate: aggregatedBase.eliminations > 0 ? aggregatedBase.supportKills / aggregatedBase.eliminations : 0,
    averageLifeDuration: calculateAverageLifeDuration(dataModel, grouping),
    totalAssistsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.totalAssists / playtimeMinutes) * 10 : 0,
    damagePerKill: aggregatedBase.eliminations > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.eliminations : 0,
    damageDonePerHealingReceived: aggregatedBase.healingReceived > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.healingReceived : 0,
    kdr: aggregatedBase.deaths > 0 ? aggregatedBase.finalBlows / aggregatedBase.deaths : aggregatedBase.finalBlows,
  };
  
  return { ...aggregatedBase, ...derivedRatios };
};
