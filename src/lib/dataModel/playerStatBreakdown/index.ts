import * as ScrimsightDataModel from "../../ScrimsightDataModel";
import { getRoleFromHero } from "../../hero";
import * as R from "remeda";
import { calculatePlaytime, calculateUltsUsed, calculateTotalAssists, calculateRoleBasedKills, calculateUltKills, calculateTeamfightsParticipated, calculateTeamfightsWon, calculateTeamfightsWonWithUlt, calculateTeamfightsWithFirstKill, calculateTeamfightsWithFirstDeath, calculateTeamfightsWonWithFirstKill, calculateTeamfightsWonWithFirstDeath, calculateDeathsWithUltAvailable } from "./baseStatCollection";
import { aggregateBaseStats } from "./statAggregation";
import { computeDerivedStats } from "./derivedStatComputation";

// STAGE 1: Base Stats Collection
// Collect only raw, summable values with categorization information
const collectBasePlayerStats = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.PlayerStatsBase[] => {
  return R.pipe(
    dataModel.playerStat,
    R.map((statEvent): ScrimsightDataModel.PlayerStatsBase => {
      const playtime = calculatePlaytime(dataModel, statEvent.matchId, statEvent.roundNumber, statEvent.playerName);
      const roleKills = calculateRoleBasedKills(dataModel, statEvent);
      
      return {
        // Categorization fields for grouping
        matchId: statEvent.matchId,
        roundNumber: statEvent.roundNumber,
        playerTeam: statEvent.playerTeam,
        playerName: statEvent.playerName,
        playerHero: statEvent.playerHero,
        playerRole: getRoleFromHero(statEvent.playerHero),

        // Base numerical fields (summable values only)
        playtime,
        eliminations: statEvent.eliminations,
        finalBlows: statEvent.finalBlows,
        deaths: statEvent.deaths,
        allDamageDealt: statEvent.allDamageDealt,
        barrierDamageDealt: statEvent.barrierDamageDealt,
        heroDamageDealt: statEvent.heroDamageDealt,
        healingDealt: statEvent.healingDealt,
        healingReceived: statEvent.healingReceived,
        selfHealing: statEvent.selfHealing,
        damageTaken: statEvent.damageTaken,
        damageBlocked: statEvent.damageBlocked,
        defensiveAssists: statEvent.defensiveAssists,
        offensiveAssists: statEvent.offensiveAssists,
        ultimatesEarned: statEvent.ultimatesEarned,
        ultimatesUsed: statEvent.ultimatesUsed,
        multikills: statEvent.multikills,
        soloKills: statEvent.soloKills,
        objectiveKills: statEvent.objectiveKills,
        environmentalKills: statEvent.environmentalKills,
        environmentalDeaths: statEvent.environmentalDeaths,
        criticalHits: statEvent.criticalHits,
        shotsFired: statEvent.shotsFired,
        shotsHit: statEvent.shotsHit,
        shotsMissed: statEvent.shotsMissed,
        scopedShotsFired: statEvent.scopedShotsFired,
        scopedShotsHit: statEvent.scopedShotsHit,

        // Derived measures (simple granular calculations)
        ultsUsed: calculateUltsUsed(statEvent),
        totalAssists: calculateTotalAssists(statEvent),
        
        // Derived measures (complex calculations)
        ultKills: calculateUltKills(dataModel, statEvent),
        teamfightsParticipated: calculateTeamfightsParticipated(dataModel, statEvent),
        teamfightsWithFirstKill: calculateTeamfightsWithFirstKill(dataModel, statEvent),
        teamfightsWithFirstDeath: calculateTeamfightsWithFirstDeath(dataModel, statEvent),
        teamfightsWon: calculateTeamfightsWon(dataModel, statEvent),
        teamfightsWonWithUlt: calculateTeamfightsWonWithUlt(dataModel, statEvent),
        teamfightsWonWithoutUlt: calculateTeamfightsWon(dataModel, statEvent) - calculateTeamfightsWonWithUlt(dataModel, statEvent),
        teamfightsWonWithFirstKill: calculateTeamfightsWonWithFirstKill(dataModel, statEvent),
        teamfightsWonWithFirstDeath: calculateTeamfightsWonWithFirstDeath(dataModel, statEvent),
        deathsWithUltAvailable: calculateDeathsWithUltAvailable(dataModel, statEvent),
        tankKills: roleKills.tankKills,
        damageKills: roleKills.damageKills,
        supportKills: roleKills.supportKills
      };
    })
  );
};

export const buildPlayerStatBreakdown = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.ScrimsightDataModel['playerStatBreakdown'] => {
  const basePlayerStats = collectBasePlayerStats(dataModel);

  // Total aggregation
  const totalBase = aggregateBaseStats(basePlayerStats);
  const total = computeDerivedStats(totalBase, dataModel, {});

  // By Player aggregation
  const byPlayerGroups = R.groupBy(basePlayerStats, stat => stat.playerName);
  const byPlayer = R.pipe(
    byPlayerGroups,
    R.entries(),
    R.map(([playerName, records]) => {
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerName });
      return { playerName, ...finalStats };
    })
  );

  // By Team aggregation
  const byTeamGroups = R.groupBy(basePlayerStats, stat => stat.playerTeam);
  const byTeam = R.pipe(
    byTeamGroups,
    R.entries(),
    R.map(([playerTeam, records]) => {
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerTeam });
      return { playerTeam, ...finalStats };
    })
  );

  // By Team and Player aggregation
  const byTeamAndPlayerGroups = R.groupBy(basePlayerStats, stat => `${stat.playerTeam}|${stat.playerName}`);
  const byTeamAndPlayer = R.pipe(
    byTeamAndPlayerGroups,
    R.entries(),
    R.map(([key, records]) => {
      const [playerTeam, playerName] = key.split('|');
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerTeam, playerName });
      return { playerTeam, playerName, ...finalStats };
    })
  );

  // By Team, Player and Match aggregation
  const byTeamAndPlayerAndMatchGroups = R.groupBy(basePlayerStats, stat => `${stat.playerTeam}|${stat.playerName}|${stat.matchId}`);
  const byTeamAndPlayerAndMatch = R.pipe(
    byTeamAndPlayerAndMatchGroups,
    R.entries(),
    R.map(([key, records]) => {
      const [playerTeam, playerName, matchId] = key.split('|');
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerTeam, playerName, matchId });
      return { playerTeam, playerName, matchId, ...finalStats };
    })
  );

  // By Team, Player and Scrim aggregation
  const byTeamAndPlayerAndScrimGroups = R.groupBy(basePlayerStats, stat => {
    const matchRelation = dataModel.matches.find(match => match.match === stat.matchId);
    const scrimId = matchRelation?.scrim || `unknown-scrim-${stat.matchId}`;
    return `${stat.playerTeam}|${stat.playerName}|${scrimId}`;
  });
  const byTeamAndPlayerAndScrim = R.pipe(
    byTeamAndPlayerAndScrimGroups,
    R.entries(),
    R.map(([key, records]) => {
      const [playerTeam, playerName, scrim] = key.split('|');
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerTeam, playerName, scrim });
      return { playerTeam, playerName, scrim, ...finalStats };
    })
  );

  // By Player and Hero aggregation
  const byPlayerAndHeroGroups = R.groupBy(basePlayerStats, stat => `${stat.playerName}|${stat.playerHero}`);
  const byPlayerAndHero = R.pipe(
    byPlayerAndHeroGroups,
    R.entries(),
    R.map(([key, records]) => {
      const [playerName, playerHero] = key.split('|');
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerName, playerHero: playerHero as ScrimsightDataModel.Hero });
      return { playerName, playerHero: playerHero as ScrimsightDataModel.Hero, ...finalStats };
    })
  );

  // By Role aggregation
  const byRoleGroups = R.groupBy(basePlayerStats, stat => stat.playerRole);
  const byRole = R.pipe(
    byRoleGroups,
    R.entries(),
    R.map(([playerRole, records]) => {
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerRole: playerRole as ScrimsightDataModel.Role });
      return { playerRole: playerRole as ScrimsightDataModel.Role, ...finalStats };
    })
  );

  // By Hero aggregation
  const byHeroGroups = R.groupBy(basePlayerStats, stat => stat.playerHero);
  const byHero = R.pipe(
    byHeroGroups,
    R.entries(),
    R.map(([playerHero, records]) => {
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerHero: playerHero as ScrimsightDataModel.Hero });
      return { playerHero: playerHero as ScrimsightDataModel.Hero, ...finalStats };
    })
  );

  // By Team and Match aggregation
  const byTeamAndMatchGroups = R.groupBy(basePlayerStats, stat => `${stat.playerTeam}|${stat.matchId}`);
  const byTeamAndMatch = R.pipe(
    byTeamAndMatchGroups,
    R.entries(),
    R.map(([key, records]) => {
      const [playerTeam, matchId] = key.split('|');
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerTeam, matchId });
      return { playerTeam, matchId, ...finalStats };
    })
  );

  // By Team and Scrim aggregation
  const byTeamAndScrimGroups = R.groupBy(basePlayerStats, stat => {
    const matchRelation = dataModel.matches.find(match => match.match === stat.matchId);
    const scrimId = matchRelation?.scrim || `unknown-scrim-${stat.matchId}`;
    return `${stat.playerTeam}|${scrimId}`;
  });
  const byTeamAndScrim = R.pipe(
    byTeamAndScrimGroups,
    R.entries(),
    R.map(([key, records]) => {
      const [playerTeam, scrim] = key.split('|');
      const aggregatedBase = aggregateBaseStats(records);
      const finalStats = computeDerivedStats(aggregatedBase, dataModel, { playerTeam, scrim });
      return { playerTeam, scrim, ...finalStats };
    })
  );

  return {
    total,
    byPlayer,
    byTeam,
    byTeamAndPlayer,
    byTeamAndPlayerAndMatch,
    byTeamAndPlayerAndScrim,
    byPlayerAndHero,
    byRole,
    byHero,
    byTeamAndMatch,
    byTeamAndScrim
  };
};
