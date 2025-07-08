import * as ScrimsightDataModel from "../ScrimsightDataModel";
import { getRoleFromHero } from "../hero";
import * as R from "remeda";

export const calculatePlaytime = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, roundNumber: string, playerName: string): number => {
  const playerLives = dataModel.playerLives.filter(
    (life) =>
      life.matchId === matchId &&
        life.roundIndex === parseInt(roundNumber) &&
        life.player === playerName
  );
  return R.sumBy(playerLives, (life) => life.duration);
}

export const calculateUltsUsed = (statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  return statEvent.ultimatesUsed ?? 0;
}

export const calculateTotalAssists = (statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  return (statEvent.offensiveAssists ?? 0) + (statEvent.defensiveAssists ?? 0);
}

export const calculateRoleBasedKills = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): { tankKills: number; damageKills: number; supportKills: number } => {
  const kills = dataModel.kill.filter(
    (kill) =>
      kill.matchId === statEvent.matchId &&
        kill.attackerName === statEvent.playerName &&
        kill.attackerHero === statEvent.playerHero
  );
    
  const tankKills = kills.filter((kill) => getRoleFromHero(kill.victimHero) === "tank").length;
  const damageKills = kills.filter((kill) => getRoleFromHero(kill.victimHero) === "damage").length;
  const supportKills = kills.filter((kill) => getRoleFromHero(kill.victimHero) === "support").length;
    
  return { tankKills, damageKills, supportKills };
}

export const calculateUltKills = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const ultEvents = dataModel.ultimateEnd.filter(
    (ult) =>
      ult.matchId === statEvent.matchId &&
        ult.playerName === statEvent.playerName &&
        ult.playerHero === statEvent.playerHero
  );
    
  const kills = dataModel.kill.filter(
    (kill) =>
      kill.matchId === statEvent.matchId &&
        kill.attackerName === statEvent.playerName &&
        kill.attackerHero === statEvent.playerHero
  );
    
  let ultKills = 0;
  for (const kill of kills) {
    for (const ult of ultEvents) {
      if (kill.matchTime >= ult.matchTime - 15 && kill.matchTime <= ult.matchTime) {
        ultKills++;
        break;
      }
    }
  }
    
  return ultKills;
}

export const calculateTeamfightsParticipated = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const teamfights = dataModel.teamfights.filter(
    (tf) =>
      tf.matchId === statEvent.matchId &&
        (tf.start.team1.alivePlayers.includes(statEvent.playerName) ||
            tf.start.team2.alivePlayers.includes(statEvent.playerName))
  );
    
  return teamfights.length;
}

export const calculateTeamfightsWon = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const teamfights = dataModel.teamfights.filter(
    (tf) =>
      tf.matchId === statEvent.matchId &&
        tf.winner === statEvent.playerTeam &&
        (tf.start.team1.alivePlayers.includes(statEvent.playerName) ||
            tf.start.team2.alivePlayers.includes(statEvent.playerName))
  );
    
  return teamfights.length;
}

export const calculateTeamfightsWonWithUlt = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const teamfights = dataModel.teamfights.filter(
    (tf) =>
      tf.matchId === statEvent.matchId &&
        tf.winner === statEvent.playerTeam &&
        (tf.start.team1.alivePlayers.includes(statEvent.playerName) ||
            tf.start.team2.alivePlayers.includes(statEvent.playerName))
  );
    
  const ults = dataModel.ultimateEnd.filter(
    (ult) =>
      ult.matchId === statEvent.matchId &&
        ult.playerName === statEvent.playerName &&
        ult.playerHero === statEvent.playerHero
  );
    
  let teamfightsWonWithUlt = 0;
  for (const tf of teamfights) {
    for (const ult of ults) {
      if (ult.matchTime >= tf.startTime && ult.matchTime <= tf.endTime) {
        teamfightsWonWithUlt++;
        break;
      }
    }
  }
    
  return teamfightsWonWithUlt;
}

export const calculateTeamfightsWithFirstKill = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const teamfights = dataModel.teamfights.filter(
    (tf) =>
      tf.matchId === statEvent.matchId &&
        (tf.start.team1.alivePlayers.includes(statEvent.playerName) ||
            tf.start.team2.alivePlayers.includes(statEvent.playerName))
  );
    
  let teamfightsWithFirstKill = 0;
  for (const tf of teamfights) {
    const firstKill = R.pipe(
      dataModel.kill,
      R.filter(
        (kill) =>
          kill.matchId === tf.matchId &&
            kill.matchTime >= tf.startTime &&
            kill.matchTime <= tf.endTime
      ),
      R.sortBy((kill) => kill.matchTime),
      R.first()
    );
    if (firstKill && firstKill.attackerName === statEvent.playerName) {
      teamfightsWithFirstKill++;
    }
  }
    
  return teamfightsWithFirstKill;
}

export const calculateTeamfightsWithFirstDeath = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const teamfights = dataModel.teamfights.filter(
    (tf) =>
      tf.matchId === statEvent.matchId &&
        (tf.start.team1.alivePlayers.includes(statEvent.playerName) ||
            tf.start.team2.alivePlayers.includes(statEvent.playerName))
  );
    
  let teamfightsWithFirstDeath = 0;
  for (const tf of teamfights) {
    const firstDeath = R.pipe(
      dataModel.kill,
      R.filter(
        (kill) =>
          kill.matchId === tf.matchId &&
            kill.matchTime >= tf.startTime &&
            kill.matchTime <= tf.endTime
      ),
      R.sortBy((kill) => kill.matchTime),
      R.first()
    );
    if (firstDeath && firstDeath.victimName === statEvent.playerName) {
      teamfightsWithFirstDeath++;
    }
  }
    
  return teamfightsWithFirstDeath;
}

export const calculateTeamfightsWonWithFirstKill = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const teamfights = dataModel.teamfights.filter(
    (tf) =>
      tf.matchId === statEvent.matchId &&
        tf.winner === statEvent.playerTeam &&
        (tf.start.team1.alivePlayers.includes(statEvent.playerName) ||
            tf.start.team2.alivePlayers.includes(statEvent.playerName))
  );
    
  let teamfightsWonWithFirstKill = 0;
  for (const tf of teamfights) {
    const firstKill = R.pipe(
      dataModel.kill,
      R.filter(
        (kill) =>
          kill.matchId === tf.matchId &&
            kill.matchTime >= tf.startTime &&
            kill.matchTime <= tf.endTime
      ),
      R.sortBy((kill) => kill.matchTime),
      R.first()
    );
    if (firstKill && firstKill.attackerName === statEvent.playerName) {
      teamfightsWonWithFirstKill++;
    }
  }
    
  return teamfightsWonWithFirstKill;
}

export const calculateTeamfightsWonWithFirstDeath = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const teamfights = dataModel.teamfights.filter(
    (tf) =>
      tf.matchId === statEvent.matchId &&
        tf.winner === statEvent.playerTeam &&
        (tf.start.team1.alivePlayers.includes(statEvent.playerName) ||
            tf.start.team2.alivePlayers.includes(statEvent.playerName))
  );
    
  let teamfightsWonWithFirstDeath = 0;
  for (const tf of teamfights) {
    const firstDeath = R.pipe(
      dataModel.kill,
      R.filter(
        (kill) =>
          kill.matchId === tf.matchId &&
            kill.matchTime >= tf.startTime &&
            kill.matchTime <= tf.endTime
      ),
      R.sortBy((kill) => kill.matchTime),
      R.first()
    );
    if (firstDeath && firstDeath.victimName === statEvent.playerName) {
      teamfightsWonWithFirstDeath++;
    }
  }
    
  return teamfightsWonWithFirstDeath;
}

export const calculateDeathsWithUltAvailable = (dataModel: ScrimsightDataModel.ScrimsightDataModel, statEvent: ScrimsightDataModel.PlayerStatLogEvent): number => {
  const deaths = dataModel.kill.filter(
    (kill) =>
      kill.matchId === statEvent.matchId &&
        kill.victimName === statEvent.playerName &&
        kill.victimHero === statEvent.playerHero
  );
    
  const ultsCharged = dataModel.ultimateCharged.filter(
    (ult) =>
      ult.matchId === statEvent.matchId &&
        ult.playerName === statEvent.playerName &&
        ult.playerHero === statEvent.playerHero
  );
    
  const ultsUsed = dataModel.ultimateEnd.filter(
    (ult) =>
      ult.matchId === statEvent.matchId &&
        ult.playerName === statEvent.playerName &&
        ult.playerHero === statEvent.playerHero
  );
    
  let deathsWithUltAvailable = 0;
  for (const death of deaths) {
    // Check if the player had ultimate available at the time of death
    // An ultimate is available if it was charged before the death AND not used before the death
    const hasUltAvailable = ultsCharged.some(chargedUlt => {
      // Ultimate was charged before death
      if (death.matchTime <= chargedUlt.matchTime) {
        return false;
      }
            
      // Check if this ultimate was used before the death
      const wasUsedBeforeDeath = ultsUsed.some(usedUlt => 
        usedUlt.ultimateId === chargedUlt.ultimateId &&
                usedUlt.matchTime > chargedUlt.matchTime &&
                usedUlt.matchTime < death.matchTime
      );
            
      return !wasUsedBeforeDeath;
    });
        
    if (hasUltAvailable) {
      deathsWithUltAvailable++;
    }
  }
    
  return deathsWithUltAvailable;
}
