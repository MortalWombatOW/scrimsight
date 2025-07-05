
import * as ScrimsightDataModel from "../../ScrimsightDataModel";
import { getRoleFromHero } from "../../hero";
import * as R from "remeda";

export const calculatePlaytime = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, roundNumber: string, playerName: string): number => {
  const playerLivesInRound = R.pipe(
    dataModel.playerLives,
    R.filter(life => 
      life.matchId === matchId && 
      life.roundIndex === parseInt(roundNumber) && 
      life.player === playerName
    )
  );

  return R.pipe(
    playerLivesInRound,
    R.sumBy(life => life.duration)
  );
};

export const calculateUltsUsed = (statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  return statEvent.ultimatesUsed ?? 0;
};

export const calculateTotalAssists = (statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const offensive = statEvent.offensiveAssists ?? 0;
  const defensive = statEvent.defensiveAssists ?? 0;
  return offensive + defensive;
};

export const calculateRoleBasedKills = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): { tankKills: number; damageKills: number; supportKills: number } => {
  const playerKills = R.filter(
    dataModel.kill.map(k => ({
      ...k,
      playerName: k.attackerName,
      playerTeam: k.attackerTeam,
      playerHero: k.attackerHero
    })),
    kill => 
      kill.matchId === statEvent.matchId &&
      kill.playerName === statEvent.playerName &&
      kill.playerTeam === statEvent.playerTeam &&
      kill.playerHero === statEvent.playerHero
  );

  let tankKills = 0;
  let damageKills = 0;
  let supportKills = 0;

  playerKills.forEach(kill => {
    const victimRole = getRoleFromHero(kill.victimHero);
    switch (victimRole) {
      case 'tank':
        tankKills++;
        break;
      case 'damage':
        damageKills++;
        break;
      case 'support':
        supportKills++;
        break;
    }
  });

  return { tankKills, damageKills, supportKills };
};

export const calculateUltKills = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const ultimateActiveEvents = R.filter(dataModel.ultimateStart, ult =>
    ult.matchId === statEvent.matchId &&
    ult.playerName === statEvent.playerName &&
    ult.playerHero === statEvent.playerHero
  );
  const ultimateEndEvents = R.filter(dataModel.ultimateEnd, ult =>
    ult.matchId === statEvent.matchId &&
    ult.playerName === statEvent.playerName &&
    ult.playerHero === statEvent.playerHero
  );
  const killEvents = R.filter(dataModel.kill, kill =>
    kill.matchId === statEvent.matchId &&
    kill.attackerName === statEvent.playerName &&
    kill.attackerHero === statEvent.playerHero
  );

  let ultKills = 0;
  ultimateActiveEvents.forEach(ultStart => {
    const ultEnd = ultimateEndEvents.find(end =>
      end.ultimateId === ultStart.ultimateId &&
      end.playerName === ultStart.playerName &&
      end.matchTime >= ultStart.matchTime
    );

    const endTime = ultEnd?.matchTime || Infinity;
    const killsDuringUlt = killEvents.filter(kill =>
      kill.matchTime >= ultStart.matchTime &&
      kill.matchTime <= endTime &&
      kill.attackerName === ultStart.playerName
    );
    ultKills += killsDuringUlt.length;
  });
  return ultKills;
};

const isTeamfightRelevantForContext = (
  teamfight: ScrimsightDataModel.Teamfight,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent,
  dataModel: ScrimsightDataModel.ScrimsightDataModel
): boolean => {
  if (statEvent.matchId && teamfight.matchId !== statEvent.matchId) return false;

  const allParticipants = [
    ...teamfight.start.team1.alivePlayers,
    ...teamfight.end.team1.kills,
    ...teamfight.start.team2.alivePlayers,
    ...teamfight.end.team2.kills
  ];
  if (!allParticipants.includes(statEvent.playerName)) return false;

  const playerLifeDuringFight = R.find(dataModel.playerLives, life =>
    life.player === statEvent.playerName &&
    life.matchId === teamfight.matchId &&
    life.startTime <= teamfight.endTime &&
    life.endTime >= teamfight.startTime &&
    life.hero === statEvent.playerHero &&
    getRoleFromHero(life.hero) === getRoleFromHero(statEvent.playerHero)
  );
  if (!playerLifeDuringFight) return false;

  return true;
};

export const calculateTeamfightsParticipated = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const relevantTeamfights = R.filter(dataModel.teamfights, fight =>
    isTeamfightRelevantForContext(fight, statEvent, dataModel)
  );
  return relevantTeamfights.length;
};

export const calculateTeamfightsWon = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const relevantTeamfights = R.filter(dataModel.teamfights, fight =>
    isTeamfightRelevantForContext(fight, statEvent, dataModel)
  );
  return R.filter(relevantTeamfights, fight => {
    const playerTeamInFight = statEvent.playerTeam;
    return fight.winner === playerTeamInFight;
  }).length;
};

export const calculateTeamfightsWonWithUlt = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const relevantTeamfights = R.filter(dataModel.teamfights, fight =>
    isTeamfightRelevantForContext(fight, statEvent, dataModel)
  );
  return R.filter(relevantTeamfights, fight => {
    const playerTeamInFight = statEvent.playerTeam;
    if (fight.winner !== playerTeamInFight) return false;

    const teamUltsUsed = playerTeamInFight === fight.start.team1.teamName ?
      fight.end.team1.ultimatesUsed :
      fight.end.team2.ultimatesUsed;

    return teamUltsUsed.includes(statEvent.playerHero);
  }).length;
};

export const calculateTeamfightsWithFirstKill = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const relevantTeamfights = R.filter(dataModel.teamfights, fight =>
    isTeamfightRelevantForContext(fight, statEvent, dataModel)
  );
  return R.filter(relevantTeamfights, fight => {
    const fightKills = R.filter(dataModel.kill, kill =>
      kill.matchTime >= fight.startTime &&
      kill.matchTime <= fight.endTime &&
      kill.matchId === fight.matchId
    );
    const sortedKills = R.sortBy(fightKills, kill => kill.matchTime);
    if (sortedKills.length > 0) {
      const firstKill = sortedKills[0];
      return firstKill.attackerName === statEvent.playerName;
    }
    return false;
  }).length;
};

export const calculateTeamfightsWithFirstDeath = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const relevantTeamfights = R.filter(dataModel.teamfights, fight =>
    isTeamfightRelevantForContext(fight, statEvent, dataModel)
  );
  return R.filter(relevantTeamfights, fight => {
    const fightKills = R.filter(dataModel.kill, kill =>
      kill.matchTime >= fight.startTime &&
      kill.matchTime <= fight.endTime &&
      kill.matchId === fight.matchId
    );
    const sortedKills = R.sortBy(fightKills, kill => kill.matchTime);
    if (sortedKills.length > 0) {
      const firstDeath = sortedKills[0];
      return firstDeath.victimName === statEvent.playerName || firstDeath.victimTeam === statEvent.playerTeam;
    }
    return false;
  }).length;
};

export const calculateTeamfightsWonWithFirstKill = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const relevantTeamfights = R.filter(dataModel.teamfights, fight =>
    isTeamfightRelevantForContext(fight, statEvent, dataModel)
  );
  return R.filter(relevantTeamfights, fight => {
    const playerTeamInFight = statEvent.playerTeam;
    if (fight.winner !== playerTeamInFight) return false;

    const fightKills = R.filter(dataModel.kill, kill =>
      kill.matchTime >= fight.startTime &&
      kill.matchTime <= fight.endTime &&
      kill.matchId === fight.matchId
    );
    const sortedKills = R.sortBy(fightKills, kill => kill.matchTime);
    if (sortedKills.length > 0) {
      const firstKill = sortedKills[0];
      return firstKill.attackerName === statEvent.playerName;
    }
    return false;
  }).length;
};

export const calculateTeamfightsWonWithFirstDeath = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const relevantTeamfights = R.filter(dataModel.teamfights, fight =>
    isTeamfightRelevantForContext(fight, statEvent, dataModel)
  );
  return R.filter(relevantTeamfights, fight => {
    const playerTeamInFight = statEvent.playerTeam;
    if (fight.winner !== playerTeamInFight) return false;

    const fightKills = R.filter(dataModel.kill, kill =>
      kill.matchTime >= fight.startTime &&
      kill.matchTime <= fight.endTime &&
      kill.matchId === fight.matchId
    );
    const sortedKills = R.sortBy(fightKills, kill => kill.matchTime);
    if (sortedKills.length > 0) {
      const firstDeath = sortedKills[0];
      return firstDeath.victimName === statEvent.playerName || firstDeath.victimTeam === statEvent.playerTeam;
    }
    return false;
  }).length;
};

export const calculateDeathsWithUltAvailable = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  statEvent: ScrimsightDataModel.PlayerStatLogEvent
): number => {
  const deathEvents = R.filter(dataModel.kill, kill =>
    kill.matchId === statEvent.matchId &&
    kill.victimName === statEvent.playerName &&
    kill.victimHero === statEvent.playerHero
  );
  const ultimateChargedEvents = R.filter(dataModel.ultimateCharged, ult =>
    ult.matchId === statEvent.matchId &&
    ult.playerName === statEvent.playerName &&
    ult.playerHero === statEvent.playerHero
  );
  const ultimateStartEvents = R.filter(dataModel.ultimateStart, ult =>
    ult.matchId === statEvent.matchId &&
    ult.playerName === statEvent.playerName &&
    ult.playerHero === statEvent.playerHero
  );

  let deathsWithUltAvailable = 0;
  deathEvents.forEach(death => {
    const availableUlts = ultimateChargedEvents.filter(charged =>
      charged.matchTime <= death.matchTime
    );
    const usedUlts = ultimateStartEvents.filter(used =>
      used.matchTime <= death.matchTime
    );
    if (availableUlts.length > usedUlts.length) {
      deathsWithUltAvailable++;
    }
  });
  return deathsWithUltAvailable;
};