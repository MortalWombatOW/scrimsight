
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import * as R from "remeda";

const createTeamfight = (
  dataModel: ScrimsightDataModel.ScrimsightDataModel,
  matchId: string,
  team1Name: string,
  team2Name: string,
  startTime: number,
  endTime: number,
  killEvents: ScrimsightDataModel.KillLogEvent[]
): ScrimsightDataModel.Teamfight => {
  // Get round index for this teamfight
  const roundIndex = getRoundIndexForTime(dataModel, matchId, startTime);

  // Find all players alive at the start of the teamfight
  const team1PlayersAliveAtStart = getPlayersAliveAtTime(dataModel, matchId, team1Name, startTime);
  const team2PlayersAliveAtStart = getPlayersAliveAtTime(dataModel, matchId, team2Name, startTime);

  // Find all players alive at the end of the teamfight
  const team1PlayersAliveAtEnd = getPlayersAliveAtTime(dataModel, matchId, team1Name, endTime);
  const team2PlayersAliveAtEnd = getPlayersAliveAtTime(dataModel, matchId, team2Name, endTime);

  // Find ultimates ready at start
  const team1UltimatesReadyAtStart = getUltimatesReadyAtTime(dataModel, matchId, team1Name, startTime);
  const team2UltimatesReadyAtStart = getUltimatesReadyAtTime(dataModel, matchId, team2Name, startTime);

  // Find ultimates ready at end
  const team1UltimatesReadyAtEnd = getUltimatesReadyAtTime(dataModel, matchId, team1Name, endTime);
  const team2UltimatesReadyAtEnd = getUltimatesReadyAtTime(dataModel, matchId, team2Name, endTime);

  // Find ultimates used during the teamfight
  const team1UltimatesUsed = getUltimatesUsedDuring(dataModel, matchId, team1Name, startTime, endTime);
  const team2UltimatesUsed = getUltimatesUsedDuring(dataModel, matchId, team2Name, startTime, endTime);

  // Find kills during the teamfight
  const team1Kills = R.pipe(
    killEvents,
    R.filter(kill => kill.attackerTeam === team1Name),
    R.map(kill => kill.victimName)
  );

  const team2Kills = R.pipe(
    killEvents,
    R.filter(kill => kill.attackerTeam === team2Name),
    R.map(kill => kill.victimName)
  );

  // Determine winner based on which team has more players alive at the end
  const winner = team1PlayersAliveAtEnd.length > team2PlayersAliveAtEnd.length 
    ? team1Name 
    : team2PlayersAliveAtEnd.length > team1PlayersAliveAtEnd.length 
      ? team2Name 
      : team1Name; // Default to team1 in case of tie

  // Calculate kills per ultimate used
  const team1KillsPerUlt = team1UltimatesUsed.length > 0 ? team1Kills.length / team1UltimatesUsed.length : 0;
  const team2KillsPerUlt = team2UltimatesUsed.length > 0 ? team2Kills.length / team2UltimatesUsed.length : 0;

  return {
    matchId,
    roundIndex,
    startTime,
    endTime,
    duration: endTime - startTime,
    start: {
      team1: {
        teamName: team1Name,
        alivePlayers: team1PlayersAliveAtStart,
        ultimatesReady: team1UltimatesReadyAtStart
      },
      team2: {
        teamName: team2Name,
        alivePlayers: team2PlayersAliveAtStart,
        ultimatesReady: team2UltimatesReadyAtStart
      }
    },
    end: {
      team1: {
        teamName: team1Name,
        alivePlayers: team1PlayersAliveAtEnd,
        ultimatesReady: team1UltimatesReadyAtEnd,
        ultimatesUsed: team1UltimatesUsed,
        kills: team1Kills
      },
      team2: {
        teamName: team2Name,
        alivePlayers: team2PlayersAliveAtEnd,
        ultimatesReady: team2UltimatesReadyAtEnd,
        ultimatesUsed: team2UltimatesUsed,
        kills: team2Kills
      }
    },
    winner,
    team1KillsPerUlt,
    team2KillsPerUlt
  };
};

const getRoundIndexForTime = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, time: number): ScrimsightDataModel.RoundNumber => {
  const roundStarts = R.pipe(
    dataModel.roundStart,
    R.filter(r => r.matchId === matchId),
    R.sortBy(r => r.matchTime)
  );
  
  const activeRound = R.findLast(roundStarts, r => r.matchTime <= time);
  return (activeRound?.roundNumber || 1) as ScrimsightDataModel.RoundNumber;
};

const getPlayersAliveAtTime = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, teamName: string, time: number): ScrimsightDataModel.PlayerName[] => {
  // Find all player lives that were active at the given time
  const activeLives = R.pipe(
    dataModel.playerLives,
    R.filter(life => 
      life.matchId === matchId &&
      life.startTime <= time &&
      life.endTime >= time
    )
  );

  // Get team players from player stats
  const teamPlayers = R.pipe(
    dataModel.playerStat,
    R.filter(stat => stat.matchId === matchId && stat.playerTeam === teamName),
    R.map(stat => stat.playerName),
    R.unique()
  );

  // Return players who are both on the team and have an active life
  return R.pipe(
    activeLives,
    R.filter(life => teamPlayers.includes(life.player)),
    R.map(life => life.player),
    R.unique()
  );
};

const getUltimatesReadyAtTime = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, teamName: string, time: number): ScrimsightDataModel.Hero[] => {
  // Find ultimates that were charged before the time and not yet used
  const readyUltimates = R.pipe(
    dataModel.ultimateCharged,
    R.filter(ultimate => 
      ultimate.matchId === matchId &&
      ultimate.matchTime <= time
    )
  );

  // Find ultimates that were used before or at the time
  const usedUltimates = R.pipe(
    dataModel.ultimateStart,
    R.filter(ultimate => 
      ultimate.matchId === matchId &&
      ultimate.matchTime <= time
    )
  );

  // Get team players
  const teamPlayers = R.pipe(
    dataModel.playerStat,
    R.filter(stat => stat.matchId === matchId && stat.playerTeam === teamName),
    R.map(stat => stat.playerName),
    R.unique()
  );

  // Find ultimates ready but not used
  const ultimatesReadyByPlayer = new Map<string, string>(); // player -> hero

  // Add charged ultimates
  readyUltimates.forEach(ultimate => {
    if (teamPlayers.includes(ultimate.playerName)) {
      ultimatesReadyByPlayer.set(ultimate.playerName, ultimate.playerHero);
    }
  });

  // Remove used ultimates
  usedUltimates.forEach(ultimate => {
    if (teamPlayers.includes(ultimate.playerName)) {
      ultimatesReadyByPlayer.delete(ultimate.playerName);
    }
  });

  const rawHeroes = Array.from(ultimatesReadyByPlayer.values());

  // validate heroes
  const invalidHeroes = R.difference(rawHeroes, [...ScrimsightDataModel.DAMAGE_HEROES, ...ScrimsightDataModel.TANK_HEROES, ...ScrimsightDataModel.SUPPORT_HEROES]);
  if (invalidHeroes.length > 0) {
    console.warn(`Invalid heroes detected in ultimates ready: ${invalidHeroes.join(', ')}`);
  }

  return rawHeroes as ScrimsightDataModel.Hero[];
};

const getUltimatesUsedDuring = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, teamName: string, startTime: number, endTime: number): ScrimsightDataModel.Hero[] => {
  // Get team players
  const teamPlayers = R.pipe(
    dataModel.playerStat,
    R.filter(stat => stat.matchId === matchId && stat.playerTeam === teamName),
    R.map(stat => stat.playerName),
    R.unique()
  );

  return R.pipe(
    dataModel.ultimateStart,
    R.filter(ultimate => 
      ultimate.matchId === matchId &&
      ultimate.matchTime >= startTime &&
      ultimate.matchTime <= endTime &&
      teamPlayers.includes(ultimate.playerName)
    ),
    R.map(ultimate => ultimate.playerHero)
  );
};

export const buildTeamfights = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.Teamfight[] => {
  const TEAMFIGHT_BUFFER_TIME = 10; // seconds
  const TEAMFIGHT_PADDING = 2; // seconds to add before/after deaths to better capture full teamfight

  // Group kill events by match
  const killEventsByMatch = R.pipe(
    dataModel.kill,
    R.groupBy(event => event.matchId)
  );

  const teamfights: ScrimsightDataModel.Teamfight[] = [];

  // Process each match
  R.entries(killEventsByMatch).forEach(([matchId, killEvents]) => {
    // Sort kills chronologically
    const sortedKills = R.sortBy(killEvents, event => event.matchTime);

    // Get match and team information
    const matchStart = dataModel.matchStart.find(m => m.matchId === matchId);
    if (!matchStart) return;

    const team1Name = matchStart.team1Name;
    const team2Name = matchStart.team2Name;

    // Find teamfight periods
    let teamfightStartTime: number | null = null;
    let teamfightKills: ScrimsightDataModel.KillLogEvent[] = [];

    for (let i = 0; i < sortedKills.length; i++) {
      const currentKill = sortedKills[i];
      const currentTime = currentKill.matchTime;

      // If this is the first death or there was a long gap before this death,
      // start a new teamfight
      if (teamfightStartTime === null || 
          (i > 0 && currentTime - sortedKills[i-1].matchTime > TEAMFIGHT_BUFFER_TIME)) {
        
        // If we had an ongoing teamfight, end it before the gap
        if (teamfightStartTime !== null && i > 0) {
          const endTime = sortedKills[i-1].matchTime + TEAMFIGHT_PADDING;
          const startTime = Math.max(0, teamfightStartTime - TEAMFIGHT_PADDING);
          
          const teamfight = createTeamfight(dataModel, matchId, team1Name, team2Name, startTime, endTime, teamfightKills);
          teamfights.push(teamfight);
        }
        
        // Start a new teamfight
        teamfightStartTime = currentTime;
        teamfightKills = [currentKill];
      } else {
        // Continue the current teamfight
        teamfightKills.push(currentKill);
      }
      
      // If this is the last death, end the current teamfight
      if (i === sortedKills.length - 1 && teamfightStartTime !== null) {
        const startTime = Math.max(0, teamfightStartTime - TEAMFIGHT_PADDING);
        const endTime = currentTime + TEAMFIGHT_PADDING;
        
        const teamfight = createTeamfight(dataModel, matchId, team1Name, team2Name, startTime, endTime, teamfightKills);
        teamfights.push(teamfight);
      }
    }
  });

  return teamfights;
};