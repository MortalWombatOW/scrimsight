import * as ScrimsightDataModel from "../ScrimsightDataModel";
import * as R from "remeda";

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
        ultimateChargeTime: 0, // TODO
        ultimateHoldTime: 0, // TODO
        ultimateUseTime: 0, // TODO
        tankFocusRate: aggregatedBase.eliminations > 0 ? aggregatedBase.tankKills / aggregatedBase.eliminations : 0,
        damageFocusRate: aggregatedBase.eliminations > 0 ? aggregatedBase.damageKills / aggregatedBase.eliminations : 0,
        supportFocusRate: aggregatedBase.eliminations > 0 ? aggregatedBase.supportKills / aggregatedBase.eliminations : 0,
        averageLifeDuration: 0, // TODO
        totalAssistsPer10Minutes: playtimeMinutes > 0 ? (aggregatedBase.totalAssists / playtimeMinutes) * 10 : 0,
        damagePerKill: aggregatedBase.eliminations > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.eliminations : 0,
        damageDonePerHealingReceived: aggregatedBase.healingReceived > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.healingReceived : 0,
        kdr: aggregatedBase.deaths > 0 ? aggregatedBase.finalBlows / aggregatedBase.deaths : aggregatedBase.finalBlows,
    };
    
    return { ...aggregatedBase, ...derivedRatios };
    }
