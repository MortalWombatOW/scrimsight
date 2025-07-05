
import * as ScrimsightDataModel from "../../ScrimsightDataModel";
import * as R from "remeda";

export const computeDerivedStats = (
  aggregatedBase: ScrimsightDataModel.PlayerStatsAggregatedBase, 
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  filterContext: { playerName?: string; playerTeam?: string; matchId?: string; playerHero?: ScrimsightDataModel.Hero; playerRole?: ScrimsightDataModel.Role; scrim?: string; }
): ScrimsightDataModel.PlayerStatsNumerical => {
  const playtimeMinutes = aggregatedBase.playtime / 60;
  const per10MinuteMultiplier = playtimeMinutes > 0 ? (10 * 60) / aggregatedBase.playtime : 0;

  // Per-10-minute metrics (rate calculations)
  const eliminationsPer10Minutes = aggregatedBase.eliminations * per10MinuteMultiplier;
  const finalBlowsPer10Minutes = aggregatedBase.finalBlows * per10MinuteMultiplier;
  const deathsPer10Minutes = aggregatedBase.deaths * per10MinuteMultiplier;
  const allDamageDealtPer10Minutes = aggregatedBase.allDamageDealt * per10MinuteMultiplier;
  const barrierDamageDealtPer10Minutes = aggregatedBase.barrierDamageDealt * per10MinuteMultiplier;
  const heroDamageDealtPer10Minutes = aggregatedBase.heroDamageDealt * per10MinuteMultiplier;
  const healingDealtPer10Minutes = aggregatedBase.healingDealt * per10MinuteMultiplier;
  const healingReceivedPer10Minutes = aggregatedBase.healingReceived * per10MinuteMultiplier;
  const selfHealingPer10Minutes = aggregatedBase.selfHealing * per10MinuteMultiplier;
  const damageTakenPer10Minutes = aggregatedBase.damageTaken * per10MinuteMultiplier;
  const damageBlockedPer10Minutes = aggregatedBase.damageBlocked * per10MinuteMultiplier;
  const defensiveAssistsPer10Minutes = aggregatedBase.defensiveAssists * per10MinuteMultiplier;
  const offensiveAssistsPer10Minutes = aggregatedBase.offensiveAssists * per10MinuteMultiplier;
  const ultimatesEarnedPer10Minutes = aggregatedBase.ultimatesEarned * per10MinuteMultiplier;
  const ultimatesUsedPer10Minutes = aggregatedBase.ultimatesUsed * per10MinuteMultiplier;
  const multikillsPer10Minutes = aggregatedBase.multikills * per10MinuteMultiplier;
  const soloKillsPer10Minutes = aggregatedBase.soloKills * per10MinuteMultiplier;
  const objectiveKillsPer10Minutes = aggregatedBase.objectiveKills * per10MinuteMultiplier;
  const environmentalKillsPer10Minutes = aggregatedBase.environmentalKills * per10MinuteMultiplier;
  const environmentalDeathsPer10Minutes = aggregatedBase.environmentalDeaths * per10MinuteMultiplier;
  const criticalHitsPer10Minutes = aggregatedBase.criticalHits * per10MinuteMultiplier;
  const shotsFiredPer10Minutes = aggregatedBase.shotsFired * per10MinuteMultiplier;
  const shotsHitPer10Minutes = aggregatedBase.shotsHit * per10MinuteMultiplier;
  const shotsMissedPer10Minutes = aggregatedBase.shotsMissed * per10MinuteMultiplier;
  const scopedShotsFiredPer10Minutes = aggregatedBase.scopedShotsFired * per10MinuteMultiplier;
  const scopedShotsHitPer10Minutes = aggregatedBase.scopedShotsHit * per10MinuteMultiplier;

  // Percentage/ratio metrics (accuracy calculations)
  const weaponAccuracy = aggregatedBase.shotsFired > 0 ? (aggregatedBase.shotsHit / aggregatedBase.shotsFired) * 100 : 0;
  const scopedWeaponAccuracy = aggregatedBase.scopedShotsFired > 0 ? (aggregatedBase.scopedShotsHit / aggregatedBase.scopedShotsFired) * 100 : 0;
  const criticalHitRate = aggregatedBase.shotsHit > 0 ? (aggregatedBase.criticalHits / aggregatedBase.shotsHit) * 100 : 0;

  // Derived Ratios (calculated from aggregated measures)
  const killsPerUltimate = aggregatedBase.ultsUsed > 0 ? aggregatedBase.ultKills / aggregatedBase.ultsUsed : 0;
  const firstKillRate = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWithFirstKill / aggregatedBase.teamfightsParticipated : 0;
  const firstDeathRate = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWithFirstDeath / aggregatedBase.teamfightsParticipated : 0;
  const teamfightWinRate = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWon / aggregatedBase.teamfightsParticipated : 0;
  const teamfightWinRateWithUlt = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithUlt / aggregatedBase.teamfightsParticipated : 0;
  const teamfightWinRateWithoutUlt = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithoutUlt / aggregatedBase.teamfightsParticipated : 0;
  const teamfightWinRateWithFirstKill = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithFirstKill / aggregatedBase.teamfightsParticipated : 0;
  const teamfightWinRateWithFirstDeath = aggregatedBase.teamfightsParticipated > 0 ? aggregatedBase.teamfightsWonWithFirstDeath / aggregatedBase.teamfightsParticipated : 0;
  const tankFocusRate = aggregatedBase.eliminations > 0 ? aggregatedBase.tankKills / aggregatedBase.eliminations : 0;
  const damageFocusRate = aggregatedBase.eliminations > 0 ? aggregatedBase.damageKills / aggregatedBase.eliminations : 0;
  const supportFocusRate = aggregatedBase.eliminations > 0 ? aggregatedBase.supportKills / aggregatedBase.eliminations : 0;
  const totalAssistsPer10Minutes = aggregatedBase.totalAssists * per10MinuteMultiplier;
  const damagePerKill = aggregatedBase.eliminations > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.eliminations : 0;
  const damageDonePerHealingReceived = aggregatedBase.healingReceived > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.healingReceived : 0;
  const kdr = aggregatedBase.deaths > 0 ? aggregatedBase.finalBlows / aggregatedBase.deaths : aggregatedBase.finalBlows;

  // Ultimate timing stats (these still rely on raw events and filterContext)
  const ultimateChargedEvents = R.filter(dataModel.ultimateCharged, ult => {
    if (filterContext.matchId && ult.matchId !== filterContext.matchId) return false;
    if (filterContext.playerName && ult.playerName !== filterContext.playerName) return false;
    if (filterContext.playerHero && ult.playerHero !== filterContext.playerHero) return false;
    return true;
  });
  const ultimateStartEvents = R.filter(dataModel.ultimateStart, ult => {
    if (filterContext.matchId && ult.matchId !== filterContext.matchId) return false;
    if (filterContext.playerName && ult.playerName !== filterContext.playerName) return false;
    if (filterContext.playerHero && ult.playerHero !== filterContext.playerHero) return false;
    return true;
  });
  const ultimateEndEvents = R.filter(dataModel.ultimateEnd, ult => {
    if (filterContext.matchId && ult.matchId !== filterContext.matchId) return false;
    if (filterContext.playerName && ult.playerName !== filterContext.playerName) return false;
    if (filterContext.playerHero && ult.playerHero !== filterContext.playerHero) return false;
    return true;
  });

  let totalChargeTime = 0;
  let totalHoldTime = 0;
  let totalUseTime = 0;
  let chargeTimeCount = 0;
  let holdTimeCount = 0;
  let useTimeCount = 0;

  ultimateChargedEvents.forEach(charged => {
    const ultStart = ultimateStartEvents.find(start =>
      start.ultimateId === charged.ultimateId &&
      start.playerName === charged.playerName &&
      start.matchTime >= charged.matchTime
    );
    if (ultStart) {
      totalHoldTime += (ultStart.matchTime - charged.matchTime);
      holdTimeCount++;
      const ultEnd = ultimateEndEvents.find(end =>
        end.ultimateId === ultStart.ultimateId &&
        end.playerName === ultStart.playerName &&
        end.matchTime >= ultStart.matchTime
      );
      if (ultEnd) {
        totalUseTime += (ultEnd.matchTime - ultStart.matchTime);
        useTimeCount++;
      }
    }
  });

  const sortedUltStarts = R.sortBy(ultimateStartEvents, e => e.matchTime);
  for (let i = 1; i < sortedUltStarts.length; i++) {
    const prevUlt = sortedUltStarts[i - 1];
    const currentUlt = sortedUltStarts[i];
    if (prevUlt.playerName === currentUlt.playerName) {
      totalChargeTime += (currentUlt.matchTime - prevUlt.matchTime);
      chargeTimeCount++;
    }
  }

  const ultimateChargeTime = chargeTimeCount > 0 ? totalChargeTime / chargeTimeCount : 0;
  const ultimateHoldTime = holdTimeCount > 0 ? totalHoldTime / holdTimeCount : 0;
  const ultimateUseTime = useTimeCount > 0 ? totalUseTime / useTimeCount : 0;

  // Average life duration (still relies on raw events and filterContext)
  const relevantPlayerLives = R.filter(dataModel.playerLives, life => {
    if (filterContext.matchId && life.matchId !== filterContext.matchId) return false;
    if (filterContext.playerName && life.player !== filterContext.playerName) return false;
    if (filterContext.playerHero && life.hero !== filterContext.playerHero) return false;
    return true;
  });
  const averageLifeDuration = relevantPlayerLives.length > 0 ?
    R.pipe(relevantPlayerLives, R.sumBy(life => life.duration)) / relevantPlayerLives.length : 0;

  return {
    // Base stats and derived measures (from aggregatedBase)
    ...aggregatedBase,
    // Derived ratios (calculated here)
    eliminationsPer10Minutes,
    finalBlowsPer10Minutes,
    deathsPer10Minutes,
    allDamageDealtPer10Minutes,
    barrierDamageDealtPer10Minutes,
    heroDamageDealtPer10Minutes,
    healingDealtPer10Minutes,
    healingReceivedPer10Minutes,
    selfHealingPer10Minutes,
    damageTakenPer10Minutes,
    damageBlockedPer10Minutes,
    defensiveAssistsPer10Minutes,
    offensiveAssistsPer10Minutes,
    ultimatesEarnedPer10Minutes,
    ultimatesUsedPer10Minutes,
    multikillsPer10Minutes,
    soloKillsPer10Minutes,
    objectiveKillsPer10Minutes,
    environmentalKillsPer10Minutes,
    environmentalDeathsPer10Minutes,
    criticalHitsPer10Minutes,
    shotsFiredPer10Minutes,
    shotsHitPer10Minutes,
    shotsMissedPer10Minutes,
    scopedShotsFiredPer10Minutes,
    scopedShotsHitPer10Minutes,
    weaponAccuracy,
    scopedWeaponAccuracy,
    criticalHitRate,
    killsPerUltimate,
    firstKillRate,
    firstDeathRate,
    teamfightWinRate,
    teamfightWinRateWithUlt,
    teamfightWinRateWithoutUlt,
    teamfightWinRateWithFirstKill,
    teamfightWinRateWithFirstDeath,
    ultimateChargeTime,
    ultimateHoldTime,
    ultimateUseTime,
    tankFocusRate,
    damageFocusRate,
    supportFocusRate,
    averageLifeDuration,
    totalAssistsPer10Minutes,
    damagePerKill,
    damageDonePerHealingReceived,
    kdr
  };
};