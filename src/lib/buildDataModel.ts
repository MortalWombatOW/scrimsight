import { parseFile, type DataAndSpecName } from "@library/scrimtime";
import * as ScrimsightDataModel from "@library/ScrimsightDataModel";
import { extractEventsFromFiles } from "@library/eventExtractionUtils";
import { getRoleFromHero } from "@library/hero";
import * as R from "remeda";


const createEmptyDataModel = (): ScrimsightDataModel.ScrimsightDataModel => ({
  scrims: [],
  players: [],
  teams: [],
  matches: [],
  playerLives: [],
  teamfights: [],
  playerStats: [],
  ability1Used: [],
  ability2Used: [],
  damage: [],
  defensiveAssist: [],
  dvaDemech: [],
  dvaRemech: [],
  healing: [],
  heroSpawn: [],
  heroSwap: [],
  kill: [],
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
});

const parseFiles = (files: {fileName: string, fileModified: number, fileContent: string}[]) => {
  return R.map(files, (file) => ({
    ...parseFile(file.fileContent),
    fileName: file.fileName,
    fileModified: file.fileModified,
  }));
};

const extractAllEvents = (dataModel: ScrimsightDataModel.ScrimsightDataModel, parsedFiles: {matchId: string, logs: DataAndSpecName[], fileName: string, fileModified: number}[]) => {
  dataModel.ability1Used = extractEventsFromFiles<ScrimsightDataModel.Ability1UsedLogEvent>('ability1_used', parsedFiles);
  dataModel.ability2Used = extractEventsFromFiles<ScrimsightDataModel.Ability2UsedLogEvent>('ability2_used', parsedFiles);
  dataModel.damage = extractEventsFromFiles<ScrimsightDataModel.DamageLogEvent>('damage', parsedFiles);
  dataModel.defensiveAssist = extractEventsFromFiles<ScrimsightDataModel.DefensiveAssistLogEvent>('defensive_assist', parsedFiles);
  dataModel.dvaDemech = extractEventsFromFiles<ScrimsightDataModel.DvaDemechLogEvent>('dva_demech', parsedFiles);
  dataModel.dvaRemech = extractEventsFromFiles<ScrimsightDataModel.DvaRemechLogEvent>('dva_remech', parsedFiles);
  dataModel.healing = extractEventsFromFiles<ScrimsightDataModel.HealingLogEvent>('healing', parsedFiles);
  dataModel.heroSpawn = extractEventsFromFiles<ScrimsightDataModel.HeroSpawnLogEvent>('hero_spawn', parsedFiles);
  dataModel.heroSwap = extractEventsFromFiles<ScrimsightDataModel.HeroSwapLogEvent>('hero_swap', parsedFiles);
  dataModel.kill = extractEventsFromFiles<ScrimsightDataModel.KillLogEvent>('kill', parsedFiles);
  dataModel.matchEnd = extractEventsFromFiles<ScrimsightDataModel.MatchEndLogEvent>('match_end', parsedFiles);
  dataModel.matchStart = extractEventsFromFiles<ScrimsightDataModel.MatchStartLogEvent>('match_start', parsedFiles);
  dataModel.mercyRez = extractEventsFromFiles<ScrimsightDataModel.MercyRezLogEvent>('mercy_rez', parsedFiles);
  dataModel.offensiveAssist = extractEventsFromFiles<ScrimsightDataModel.OffensiveAssistLogEvent>('offensive_assist', parsedFiles);
  dataModel.playerStat = extractEventsFromFiles<ScrimsightDataModel.PlayerStatLogEvent>('player_stat', parsedFiles);
  dataModel.roundEnd = extractEventsFromFiles<ScrimsightDataModel.RoundEndLogEvent>('round_end', parsedFiles);
  dataModel.roundStart = extractEventsFromFiles<ScrimsightDataModel.RoundStartLogEvent>('round_start', parsedFiles);
  dataModel.setupComplete = extractEventsFromFiles<ScrimsightDataModel.SetupCompleteLogEvent>('setup_complete', parsedFiles);
  dataModel.ultimateCharged = extractEventsFromFiles<ScrimsightDataModel.UltimateChargedLogEvent>('ultimate_charged', parsedFiles);
  dataModel.ultimateEnd = extractEventsFromFiles<ScrimsightDataModel.UltimateEndLogEvent>('ultimate_end', parsedFiles);
  dataModel.ultimateStart = extractEventsFromFiles<ScrimsightDataModel.UltimateStartLogEvent>('ultimate_start', parsedFiles);
};

const groupMatchesIntoScrims = (dataModel: ScrimsightDataModel.ScrimsightDataModel, parsedFiles: {matchId: string, logs: DataAndSpecName[], fileName: string, fileModified: number}[]): ScrimsightDataModel.ScrimRelationships[] => {
  const matchesWithDate = R.pipe(
    dataModel.matchStart,
    R.map(matchStart => {
      const parsedFile = parsedFiles.find(f => f.matchId === matchStart.matchId);
      const date = new Date(parsedFile!.fileModified);
      const dateString = date.toISOString().split('T')[0];
      return {
        matchId: matchStart.matchId,
        dateString,
        team1Name: matchStart.team1Name,
        team2Name: matchStart.team2Name,
        fileModified: parsedFile!.fileModified
      };
    }),
    R.sortBy(match => match.fileModified)
  );

  const scrimGroups = R.pipe(
    matchesWithDate,
    R.groupBy(match => `${match.dateString}-${match.team1Name}-${match.team2Name}`),
    R.mapValues(matches => R.map(matches, m => m.matchId))
  );

  return R.pipe(
    scrimGroups,
    R.entries(),
    R.map(([scrimId, matchIds]) => {
      const firstMatch = matchesWithDate.find(m => m.matchId === matchIds[0])!;
      return {
        scrim: scrimId,
        teams: [firstMatch.team1Name, firstMatch.team2Name] as [ScrimsightDataModel.TeamName, ScrimsightDataModel.TeamName],
        matches: matchIds,
        date: new Date(firstMatch.dateString)
      };
    })
  );
};

const buildMatchRelationships = (dataModel: ScrimsightDataModel.ScrimsightDataModel, parsedFiles: {matchId: string, logs: DataAndSpecName[], fileName: string, fileModified: number}[]): ScrimsightDataModel.MatchRelationships[] => {
  const scrimByMatchId = R.pipe(
    dataModel.scrims,
    R.flatMap(scrim => R.map(scrim.matches, matchId => ({ matchId, scrim }))),
    R.indexBy(item => item.matchId)
  );

  return R.pipe(
    dataModel.matchStart,
    R.map(matchStart => {
      const parsedFile = parsedFiles.find(f => f.matchId === matchStart.matchId);
      const scrimInfo = scrimByMatchId[matchStart.matchId];
      
      const rounds = R.pipe(
        [...dataModel.roundStart, ...dataModel.roundEnd],
        R.filter(event => event.matchId === matchStart.matchId),
        R.map(event => event.roundNumber as ScrimsightDataModel.RoundNumber),
        R.unique(),
        R.sortBy(x => x)
      );

      return {
        match: matchStart.matchId,
        scrim: scrimInfo?.scrim.scrim || `unknown-scrim-${matchStart.matchId}`,
        teams: [matchStart.team1Name, matchStart.team2Name] as [ScrimsightDataModel.TeamName, ScrimsightDataModel.TeamName],
        map: matchStart.mapName,
        date: new Date(parsedFile?.fileModified || 0),
        rounds
      };
    })
  );
};

const buildTeamRelationships = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.TeamRelationships[] => {
  const allTeams = R.pipe(
    dataModel.scrims,
    R.flatMap(scrim => scrim.teams),
    R.unique()
  );

  return R.map(allTeams, teamName => {
    const teamScrims = R.pipe(
      dataModel.scrims,
      R.filter(scrim => scrim.teams.includes(teamName)),
      R.map(scrim => scrim.scrim)
    );

    const teamPlayers = R.pipe(
      dataModel.playerStat,
      R.filter(event => event.playerTeam === teamName),
      R.map(event => event.playerName),
      R.unique()
    );

    return {
      team: teamName,
      players: teamPlayers,
      scrims: teamScrims
    };
  });
};

const buildPlayerRelationships = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.PlayerRelationships[] => {
  const allPlayerEvents = [
    ...R.map(dataModel.heroSpawn, e => ({ playerName: e.playerName, playerTeam: e.playerTeam })),
    ...R.map(dataModel.heroSwap, e => ({ playerName: e.playerName, playerTeam: e.playerTeam })),
    ...R.map(dataModel.kill, e => ({ playerName: e.attackerName, playerTeam: e.attackerTeam })),
    ...R.map(dataModel.damage, e => ({ playerName: e.attackerName, playerTeam: e.attackerTeam }))
  ];

  const allPlayers = R.pipe(
    allPlayerEvents,
    R.map(event => event.playerName),
    R.unique()
  );

  return R.map(allPlayers, playerName => {
    const playerTeams = R.pipe(
      allPlayerEvents,
      R.filter(event => event.playerName === playerName),
      R.map(event => event.playerTeam),
      R.unique()
    );

    const playerScrims = R.pipe(
      dataModel.scrims,
      R.filter(scrim => scrim.teams.some(team => playerTeams.includes(team))),
      R.map(scrim => scrim.scrim)
    );

    const playerMatches = R.pipe(
      dataModel.matches,
      R.filter(match => match.teams.some(team => playerTeams.includes(team))),
      R.map(match => match.match)
    );

    return {
      player: playerName,
      teams: playerTeams,
      scrims: playerScrims,
      matches: playerMatches
    };
  });
};

const buildPlayerLives = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.PlayerLife[] => {
  const lives: ScrimsightDataModel.PlayerLife[] = [];
  const activeLifeByPlayer: Map<string, ScrimsightDataModel.PlayerLife> = new Map();

  const getPlayerKey = (matchId: string, playerName: string) => `${matchId}-${playerName}`;

  const getRoundIndex = (matchId: string, eventTime: number): ScrimsightDataModel.RoundNumber => {
    const roundStarts = R.pipe(
      dataModel.roundStart,
      R.filter(r => r.matchId === matchId),
      R.sortBy(r => r.matchTime)
    );
    
    const activeRound = R.findLast(roundStarts, r => r.matchTime <= eventTime);
    return (activeRound?.roundNumber || 1) as ScrimsightDataModel.RoundNumber;
  };

  const endPlayerLife = (matchId: string, playerName: string, endTime: number, causeOfEnd: 'death' | 'swap' | 'round_end') => {
    const playerKey = getPlayerKey(matchId, playerName);
    const currentLife = activeLifeByPlayer.get(playerKey);
    if (currentLife) {
      currentLife.endTime = endTime;
      currentLife.duration = endTime - currentLife.startTime;
      currentLife.causeOfEnd = causeOfEnd;
      lives.push(currentLife);
      activeLifeByPlayer.delete(playerKey);
    }
  };

  const allEvents = R.pipe([
    ...R.map(dataModel.heroSpawn, e => ({
      matchId: e.matchId,
      playerName: e.playerName,
      playerHero: e.playerHero,
      time: e.matchTime,
      type: 'heroSpawn' as const
    })),
    ...R.map(dataModel.heroSwap, e => ({
      matchId: e.matchId,
      playerName: e.playerName,
      playerHero: e.playerHero,
      time: e.matchTime,
      type: 'heroSwap' as const
    })),
    ...R.map(dataModel.kill, e => ({
      matchId: e.matchId,
      playerName: e.victimName,
      playerHero: e.victimHero,
      time: e.matchTime,
      type: 'death' as const
    }))
  ], R.sortBy(event => event.time));

  for (const event of allEvents) {
    const playerKey = getPlayerKey(event.matchId, event.playerName);
    const roundIndex = getRoundIndex(event.matchId, event.time);

    switch (event.type) {
      case 'heroSpawn':
        endPlayerLife(event.matchId, event.playerName, event.time, 'round_end');
        activeLifeByPlayer.set(playerKey, {
          matchId: event.matchId,
          roundIndex,
          startTime: event.time,
          endTime: Infinity,
          duration: 0,
          player: event.playerName,
          hero: event.playerHero,
          causeOfStart: 'spawn',
          causeOfEnd: 'round_end',
          eliminations: 0,
          assists: 0,
          ultimatesUsed: 0
        });
        break;

      case 'heroSwap':
        endPlayerLife(event.matchId, event.playerName, event.time, 'swap');
        activeLifeByPlayer.set(playerKey, {
          matchId: event.matchId,
          roundIndex,
          startTime: event.time,
          endTime: Infinity,
          duration: 0,
          player: event.playerName,
          hero: event.playerHero,
          causeOfStart: 'swap',
          causeOfEnd: 'round_end',
          eliminations: 0,
          assists: 0,
          ultimatesUsed: 0
        });
        break;

      case 'death':
        endPlayerLife(event.matchId, event.playerName, event.time, 'death');
        break;
    }
  }

  activeLifeByPlayer.forEach((life) => {
    const roundEnd = R.pipe(
      dataModel.roundEnd,
      R.filter(r => r.matchId === life.matchId),
      R.sortBy(r => r.matchTime),
      R.findLast(r => r.matchTime > life.startTime)
    );

    if (roundEnd) {
      life.endTime = roundEnd.matchTime;
      life.duration = life.endTime - life.startTime;
      life.causeOfEnd = 'round_end';
      lives.push(life);
    }
  });

  return lives.sort((a, b) => {
    if (a.matchId !== b.matchId) {
      return a.matchId.localeCompare(b.matchId);
    }
    return a.startTime - b.startTime;
  });
};

const buildTeamfights = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.Teamfight[] => {
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

  return {
    matchId,
    roundIndex,
    startTime,
    endTime,
    duration: endTime - startTime,
    start: {
      team1: {
        alivePlayers: team1PlayersAliveAtStart,
        ultimatesReady: team1UltimatesReadyAtStart
      },
      team2: {
        alivePlayers: team2PlayersAliveAtStart,
        ultimatesReady: team2UltimatesReadyAtStart
      }
    },
    end: {
      team1: {
        alivePlayers: team1PlayersAliveAtEnd,
        ultimatesReady: team1UltimatesReadyAtEnd,
        ultimatesUsed: team1UltimatesUsed,
        kills: team1Kills
      },
      team2: {
        alivePlayers: team2PlayersAliveAtEnd,
        ultimatesReady: team2UltimatesReadyAtEnd,
        ultimatesUsed: team2UltimatesUsed,
        kills: team2Kills
      }
    }
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

const getUltimatesReadyAtTime = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, teamName: string, time: number): ScrimsightDataModel.HeroName[] => {
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

  return Array.from(ultimatesReadyByPlayer.values());
};

const getUltimatesUsedDuring = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, teamName: string, startTime: number, endTime: number): ScrimsightDataModel.HeroName[] => {
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

const buildPlayerStats = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.PlayerStats[] => {
  // Helper function to calculate playtime for a player in a match/round
  const calculatePlaytime = (matchId: string, roundNumber: string, playerName: string): number => {
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


  return R.pipe(
    dataModel.playerStat,
    R.map((statEvent): ScrimsightDataModel.PlayerStats => {
      const playtime = calculatePlaytime(statEvent.matchId, statEvent.roundNumber, statEvent.playerName);
      const playtimeMinutes = playtime / 60;
      const per10Minutes = playtimeMinutes > 0 ? (10 / playtimeMinutes) : 0;

      // Calculate derived metrics
      const weaponAccuracy = statEvent.shotsFired > 0 ? (statEvent.shotsHit / statEvent.shotsFired) * 100 : 0;
      const scopedWeaponAccuracy = statEvent.scopedShotsFired > 0 ? (statEvent.scopedShotsHit / statEvent.scopedShotsFired) * 100 : 0;
      const criticalHitRate = statEvent.shotsHit > 0 ? (statEvent.criticalHits / statEvent.shotsHit) * 100 : 0;

      return {
        // Category fields
        matchId: statEvent.matchId,
        roundNumber: statEvent.roundNumber,
        playerTeam: statEvent.playerTeam,
        playerName: statEvent.playerName,
        playerHero: statEvent.playerHero,
        playerRole: getRoleFromHero(statEvent.playerHero),

        // Base numerical fields (including calculated playtime)
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

        // Derived per-10-minute metrics
        eliminationsPer10Minutes: statEvent.eliminations * per10Minutes,
        finalBlowsPer10Minutes: statEvent.finalBlows * per10Minutes,
        deathsPer10Minutes: statEvent.deaths * per10Minutes,
        allDamageDealtPer10Minutes: statEvent.allDamageDealt * per10Minutes,
        barrierDamageDealtPer10Minutes: statEvent.barrierDamageDealt * per10Minutes,
        heroDamageDealtPer10Minutes: statEvent.heroDamageDealt * per10Minutes,
        healingDealtPer10Minutes: statEvent.healingDealt * per10Minutes,
        healingReceivedPer10Minutes: statEvent.healingReceived * per10Minutes,
        selfHealingPer10Minutes: statEvent.selfHealing * per10Minutes,
        damageTakenPer10Minutes: statEvent.damageTaken * per10Minutes,
        damageBlockedPer10Minutes: statEvent.damageBlocked * per10Minutes,
        defensiveAssistsPer10Minutes: statEvent.defensiveAssists * per10Minutes,
        offensiveAssistsPer10Minutes: statEvent.offensiveAssists * per10Minutes,
        ultimatesEarnedPer10Minutes: statEvent.ultimatesEarned * per10Minutes,
        ultimatesUsedPer10Minutes: statEvent.ultimatesUsed * per10Minutes,
        multikillsPer10Minutes: statEvent.multikills * per10Minutes,
        soloKillsPer10Minutes: statEvent.soloKills * per10Minutes,
        objectiveKillsPer10Minutes: statEvent.objectiveKills * per10Minutes,
        environmentalKillsPer10Minutes: statEvent.environmentalKills * per10Minutes,
        environmentalDeathsPer10Minutes: statEvent.environmentalDeaths * per10Minutes,
        criticalHitsPer10Minutes: statEvent.criticalHits * per10Minutes,
        shotsFiredPer10Minutes: statEvent.shotsFired * per10Minutes,
        shotsHitPer10Minutes: statEvent.shotsHit * per10Minutes,
        shotsMissedPer10Minutes: statEvent.shotsMissed * per10Minutes,
        scopedShotsFiredPer10Minutes: statEvent.scopedShotsFired * per10Minutes,
        scopedShotsHitPer10Minutes: statEvent.scopedShotsHit * per10Minutes,

        // Derived percentage metrics
        weaponAccuracy,
        scopedWeaponAccuracy,
        criticalHitRate
      };
    })
  );
};

export const buildDataModel = (files: {fileName: string, fileModified: number, fileContent: string}[]): ScrimsightDataModel.ScrimsightDataModel => {
  const dataModel = createEmptyDataModel();
  
  const parsedFiles = parseFiles(files);
  
  extractAllEvents(dataModel, parsedFiles);
  
  dataModel.scrims = groupMatchesIntoScrims(dataModel, parsedFiles);
  
  dataModel.matches = buildMatchRelationships(dataModel, parsedFiles);
  dataModel.teams = buildTeamRelationships(dataModel);
  dataModel.players = buildPlayerRelationships(dataModel);
  
  dataModel.playerLives = buildPlayerLives(dataModel);
  dataModel.teamfights = buildTeamfights(dataModel);
  
  dataModel.playerStats = buildPlayerStats(dataModel);

  return dataModel;
};