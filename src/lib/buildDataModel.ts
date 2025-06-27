import { parseFile, type DataAndSpecName } from "./scrimtime";
import * as ScrimsightDataModel from "./ScrimsightDataModel";
import { extractEventsFromFiles } from "./eventExtractionUtils";
import { getRoleFromHero } from "./hero";
import * as R from "remeda";


const createEmptyDataModel = (): ScrimsightDataModel.ScrimsightDataModel => ({
  scrims: [],
  players: [],
  teams: [],
  matches: [],
  playerLives: [],
  teamfights: [],
  rounds: [],
  teamCompositions: [],
  playerStatBreakdown: {
    total: {} as Record<ScrimsightDataModel.PlayerStatsNumericalKeys, number>,
    byPlayer: [],
    byTeam: [],
    byTeamAndPlayer: [],
    byTeamAndPlayerAndMatch: [],
    byTeamAndPlayerAndScrim: [],
    byPlayerAndHero: [],
    byRole: [],
    byHero: [],
    byTeamAndMatch: [],
    byTeamAndScrim: []
  },
  playerStatBreakdownRanks: {
    total: {} as Record<ScrimsightDataModel.PlayerStatsNumericalKeys, number>,
    byPlayer: [],
    byTeam: [],
    byTeamAndPlayer: [],
    byTeamAndPlayerAndMatch: [],
    byTeamAndPlayerAndScrim: [],
    byPlayerAndHero: [],
    byRole: [],
    byHero: [],
    byTeamAndMatch: [],
    byTeamAndScrim: []
  },
  killCounts: {
    byMatch: [],
    byMatchAndRound: []
  },
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
      
      // Calculate team1MatchesWon and team2MatchesWon by counting wins per team
      let team1MatchesWon = 0;
      let team2MatchesWon = 0;
      
      matchIds.forEach(matchId => {
        // Get final scores from match end event or last round end event
        const matchEnd = dataModel.matchEnd.find(event => event.matchId === matchId);
        const lastRoundEnd = R.pipe(
          dataModel.roundEnd,
          R.filter(event => event.matchId === matchId),
          R.sortBy(event => event.matchTime),
          R.last()
        );

        const team1Score = matchEnd?.team1Score ?? lastRoundEnd?.team1Score ?? 0;
        const team2Score = matchEnd?.team2Score ?? lastRoundEnd?.team2Score ?? 0;

        // Determine winning team and increment count
        if (team1Score > team2Score) {
          team1MatchesWon++;
        } else if (team2Score > team1Score) {
          team2MatchesWon++;
        } else {
          // In case of tie, award to team1 (consistent with match winner logic)
          team1MatchesWon++;
        }
      });
      
      return {
        scrim: scrimId,
        teams: [firstMatch.team1Name, firstMatch.team2Name] as [ScrimsightDataModel.TeamName, ScrimsightDataModel.TeamName],
        matches: matchIds,
        date: new Date(firstMatch.dateString),
        team1MatchesWon,
        team2MatchesWon
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

      // Calculate match duration by summing individual round durations (excluding time between rounds)
      const roundStarts = R.pipe(
        dataModel.roundStart,
        R.filter(event => event.matchId === matchStart.matchId),
        R.sortBy(event => event.matchTime),
        R.indexBy(event => event.roundNumber)
      );
      
      const roundEnds = R.pipe(
        dataModel.roundEnd,
        R.filter(event => event.matchId === matchStart.matchId),
        R.sortBy(event => event.matchTime),
        R.indexBy(event => event.roundNumber)
      );

      const duration = R.pipe(
        rounds,
        R.map(roundNumber => {
          const roundStart = roundStarts[roundNumber];
          const roundEnd = roundEnds[roundNumber];
          return (roundStart && roundEnd) ? roundEnd.matchTime - roundStart.matchTime : 0;
        }),
        R.sum()
      );

      // Get final scores from match end event or last round end event
      const matchEnd = dataModel.matchEnd.find(event => event.matchId === matchStart.matchId);
      const lastRoundEnd = R.pipe(
        dataModel.roundEnd,
        R.filter(event => event.matchId === matchStart.matchId),
        R.sortBy(event => event.matchTime),
        R.last()
      );

      const team1Score = matchEnd?.team1Score ?? lastRoundEnd?.team1Score ?? 0;
      const team2Score = matchEnd?.team2Score ?? lastRoundEnd?.team2Score ?? 0;

      // Determine winning team
      const winningTeam = team1Score > team2Score 
        ? matchStart.team1Name 
        : team2Score > team1Score 
          ? matchStart.team2Name 
          : matchStart.team1Name; // Default to team1 in case of tie

      return {
        match: matchStart.matchId,
        scrim: scrimInfo?.scrim.scrim || `unknown-scrim-${matchStart.matchId}`,
        teams: [matchStart.team1Name, matchStart.team2Name] as [ScrimsightDataModel.TeamName, ScrimsightDataModel.TeamName],
        map: matchStart.mapName,
        date: new Date(parsedFile?.fileModified || 0),
        rounds,
        duration,
        team1Score,
        team2Score,
        winningTeam,
        gameMode: matchStart.mapType
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

    // Calculate heroes with playtime directly from playerLives
    const playerLivesForPlayer = R.filter(dataModel.playerLives, life => life.player === playerName);
    
    const heroesWithPlaytime = R.pipe(
      playerLivesForPlayer,
      R.groupBy(life => life.hero),
      R.entries(),
      R.map(([hero, lives]) => ({
        hero: hero as ScrimsightDataModel.Hero,
        playtime: R.sumBy(lives, life => life.duration)
      })),
      R.sortBy(item => -item.playtime) // Sort by playtime descending
    );

    // Calculate roles with playtime from the hero playtime data
    const rolesWithPlaytime = R.pipe(
      heroesWithPlaytime,
      R.map(heroEntry => ({
        role: getRoleFromHero(heroEntry.hero),
        playtime: heroEntry.playtime
      })),
      R.groupBy(item => item.role),
      R.entries(),
      R.map(([role, items]) => ({
        role: role as ScrimsightDataModel.Role,
        playtime: R.sumBy(items, item => item.playtime)
      })),
      R.sortBy(item => -item.playtime) // Sort by playtime descending
    );

    return {
      player: playerName,
      teams: playerTeams,
      scrims: playerScrims,
      matches: playerMatches,
      heroes: heroesWithPlaytime,
      roles: rolesWithPlaytime
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

const buildRounds = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.Round[] => {
  const rounds: ScrimsightDataModel.Round[] = [];

  // Process each match to extract round information
  dataModel.matches.forEach(match => {
    match.rounds.forEach(roundNumber => {
      // Find round start and end events for this match and round
      const roundStart = dataModel.roundStart.find(event => 
        event.matchId === match.match && event.roundNumber === roundNumber
      );
      const roundEnd = dataModel.roundEnd.find(event => 
        event.matchId === match.match && event.roundNumber === roundNumber
      );

      if (roundStart && roundEnd) {
        // Determine winning team for this round
        const winningTeam = roundEnd.team1Score > roundEnd.team2Score 
          ? match.teams[0] 
          : roundEnd.team2Score > roundEnd.team1Score 
            ? match.teams[1] 
            : match.teams[0]; // Default to team1 in case of tie

        rounds.push({
          matchId: match.match,
          roundIndex: roundNumber,
          startTime: roundStart.matchTime,
          endTime: roundEnd.matchTime,
          duration: roundEnd.matchTime - roundStart.matchTime,
          team1Score: roundEnd.team1Score,
          team2Score: roundEnd.team2Score,
          winningTeam
        });
      }
    });
  });

  return rounds.sort((a, b) => {
    if (a.matchId !== b.matchId) {
      return a.matchId.localeCompare(b.matchId);
    }
    return a.roundIndex - b.roundIndex;
  });
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

const buildTeamCompositions = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.TeamCompositionSegment[] => {
  const compositions: ScrimsightDataModel.TeamCompositionSegment[] = [];

  // Process each match to track team compositions over time
  dataModel.matches.forEach(match => {
    const matchId = match.match;
    const teams = match.teams;

    teams.forEach(teamName => {
      // Find all hero spawn and swap events for this team in this match
      const heroEvents = [
        ...R.pipe(
          dataModel.heroSpawn,
          R.filter(e => e.matchId === matchId && e.playerTeam === teamName),
          R.map(e => ({ ...e, type: 'spawn' as const }))
        ),
        ...R.pipe(
          dataModel.heroSwap,
          R.filter(e => e.matchId === matchId && e.playerTeam === teamName),
          R.map(e => ({ ...e, type: 'swap' as const }))
        )
      ].sort((a, b) => a.matchTime - b.matchTime);

      // Group events by round
      const eventsByRound = R.groupBy(heroEvents, e => getRoundIndexForTime(dataModel, matchId, e.matchTime));

      // Process each round
      Object.entries(eventsByRound).forEach(([roundStr, roundEvents]) => {
        const roundNumber = parseInt(roundStr) as ScrimsightDataModel.RoundNumber;
        
        // Find round boundaries
        const roundStart = dataModel.roundStart.find(r => 
          r.matchId === matchId && r.roundNumber === roundNumber
        );
        const roundEnd = dataModel.roundEnd.find(r => 
          r.matchId === matchId && r.roundNumber === roundNumber
        );

        if (!roundStart || !roundEnd) return;

        // Track composition changes throughout the round
        let currentTime = roundStart.matchTime;
        const activeComposition = new Map<string, ScrimsightDataModel.Hero>(); // player -> hero

        // Initialize with spawn events at round start
        const initialSpawns = roundEvents.filter(e => e.type === 'spawn');
        initialSpawns.forEach(spawn => {
          activeComposition.set(spawn.playerName, spawn.playerHero);
        });

        // Process each composition change
        const compositionChanges = roundEvents.filter(e => e.type === 'swap');
        
        // Create composition segment for initial state
        if (activeComposition.size > 0) {
          const endTime = compositionChanges.length > 0 ? compositionChanges[0].matchTime : roundEnd.matchTime;
          // Only create segment if there's actual duration (avoid zero-duration segments)
          if (endTime > currentTime) {
            const compositionSegment = createCompositionSegment(
              matchId, 
              roundNumber, 
              teamName, 
              currentTime, 
              endTime, 
              Array.from(activeComposition.entries())
            );
            compositions.push(compositionSegment);
          }
          currentTime = endTime;
        }

        // Process each swap event
        compositionChanges.forEach((swapEvent, index) => {
          // Update composition
          activeComposition.set(swapEvent.playerName, swapEvent.playerHero);
          
          // Determine end time for this segment
          const nextSwap = compositionChanges[index + 1];
          const endTime = nextSwap ? nextSwap.matchTime : roundEnd.matchTime;
          
          // Only create segment if there's actual duration (avoid zero-duration segments)
          if (endTime > swapEvent.matchTime) {
            const compositionSegment = createCompositionSegment(
              matchId, 
              roundNumber, 
              teamName, 
              swapEvent.matchTime, 
              endTime, 
              Array.from(activeComposition.entries())
            );
            compositions.push(compositionSegment);
          }
          currentTime = endTime;
        });
      });
    });
  });

  return compositions.sort((a, b) => {
    if (a.matchId !== b.matchId) return a.matchId.localeCompare(b.matchId);
    if (a.roundIndex !== b.roundIndex) return a.roundIndex - b.roundIndex;
    return a.startTime - b.startTime;
  });
};

const createCompositionSegment = (
  matchId: string,
  roundIndex: ScrimsightDataModel.RoundNumber,
  teamName: string,
  startTime: number,
  endTime: number,
  playerHeroPairs: [string, ScrimsightDataModel.Hero][]
): ScrimsightDataModel.TeamCompositionSegment => {
  const playerHeroes = playerHeroPairs.map(([playerName, playerHero]) => ({
    playerName,
    playerHero
  }));

  // Group heroes by role
  const heroesByRole = R.pipe(
    playerHeroes,
    R.groupBy(ph => getRoleFromHero(ph.playerHero)),
    R.entries(),
    R.map(([role, phs]) => ({
      role: role as ScrimsightDataModel.Role,
      heroes: phs.map(ph => ph.playerHero)
    }))
  );

  // Create composition object
  const composition: ScrimsightDataModel.TeamComposition = {
    tank: heroesByRole.find(h => h.role === 'tank')?.heroes || [],
    damage: heroesByRole.find(h => h.role === 'damage')?.heroes || [],
    support: heroesByRole.find(h => h.role === 'support')?.heroes || []
  };

  return {
    matchId,
    roundIndex,
    startTime,
    endTime,
    duration: endTime - startTime,
    team: teamName,
    composition,
    playerHeroes,
    heroesByRole
  };
};

const buildKillCounts = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.ScrimsightDataModel['killCounts'] => {
  // Helper function to get round number for a kill event
  const getRoundNumber = (matchId: string, eventTime: number): ScrimsightDataModel.RoundNumber => {
    const roundStarts = R.pipe(
      dataModel.roundStart,
      R.filter(r => r.matchId === matchId),
      R.sortBy(r => r.matchTime)
    );
    
    const activeRound = R.findLast(roundStarts, r => r.matchTime <= eventTime);
    return (activeRound?.roundNumber || 1) as ScrimsightDataModel.RoundNumber;
  };

  // Build kill counts by match
  const killCountsByMatch = R.pipe(
    dataModel.kill,
    R.groupBy(kill => `${kill.matchId}|${kill.attackerName}|${kill.victimName}`),
    R.entries(),
    R.map(([key, killEvents]) => {
      const [matchId, attackerName, victimName] = key.split('|');
      return {
        matchId,
        player: attackerName,
        victim: victimName,
        killCount: killEvents.length
      };
    })
  );

  // Build kill counts by match and round
  const killCountsByMatchAndRound = R.pipe(
    dataModel.kill,
    R.map(kill => ({
      ...kill,
      roundNumber: getRoundNumber(kill.matchId, kill.matchTime)
    })),
    R.groupBy(kill => `${kill.matchId}|${kill.roundNumber}|${kill.attackerName}|${kill.victimName}`),
    R.entries(),
    R.map(([key, killEvents]) => {
      const [matchId, roundNumber, attackerName, victimName] = key.split('|');
      return {
        matchId,
        roundNumber: parseInt(roundNumber) as ScrimsightDataModel.RoundNumber,
        player: attackerName,
        victim: victimName,
        killCount: killEvents.length
      };
    })
  );

  return {
    byMatch: killCountsByMatch,
    byMatchAndRound: killCountsByMatchAndRound
  };
};

// Three-Stage Player Stats Computation for Statistical Soundness
// Stage 1: Collect base stats (only summable values)
// Stage 2: Aggregate base stats by grouping criteria
// Stage 3: Compute derived stats from aggregated base stats

const buildPlayerStatBreakdown = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.ScrimsightDataModel['playerStatBreakdown'] => {
  
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

  // STAGE 1: Base Stats Collection
  // Collect only raw, summable values with categorization information
  const basePlayerStats: ScrimsightDataModel.PlayerStatsBase[] = R.pipe(
    dataModel.playerStat,
    R.map((statEvent): ScrimsightDataModel.PlayerStatsBase => {
      const playtime = calculatePlaytime(statEvent.matchId, statEvent.roundNumber, statEvent.playerName);
      
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
        scopedShotsHit: statEvent.scopedShotsHit
      };
    })
  );

  // STAGE 2: Base Stats Aggregation
  // Sum only the base numerical fields across grouped records
  const aggregateBaseStats = (records: ScrimsightDataModel.PlayerStatsBase[]): ScrimsightDataModel.PlayerStatsAggregatedBase => {
    return R.pipe(
      ScrimsightDataModel.playerStatsBaseNumericalKeys,
      R.map(key => [key, R.sumBy(records, record => record[key as keyof ScrimsightDataModel.PlayerStatsBase] as number)] as const),
      R.fromEntries()
    ) as ScrimsightDataModel.PlayerStatsAggregatedBase;
  };

  // STAGE 3: Derived Stats Computation  
  // Calculate derived metrics from aggregated base stats for statistical correctness
  const computeDerivedStats = (
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

    // Additional derived metrics
    const killsPerUltimate = aggregatedBase.ultimatesUsed > 0 ? aggregatedBase.eliminations / aggregatedBase.ultimatesUsed : 0;

    // Helper function to filter events based on context
    const filterByContext = <T extends { matchId?: string; playerName?: string; playerTeam?: string; playerHero?: ScrimsightDataModel.Hero; }>(
      events: T[]
    ): T[] => {
      return R.filter(events, event => {
        if (filterContext.matchId && event.matchId !== filterContext.matchId) return false;
        if (filterContext.playerName && event.playerName !== filterContext.playerName) return false;
        if (filterContext.playerTeam && event.playerTeam !== filterContext.playerTeam) return false;
        if (filterContext.playerHero && event.playerHero !== filterContext.playerHero) return false;
        return true;
      });
    };

    // Ultimate-related derived stats
    const ultsUsed = aggregatedBase.ultimatesUsed; // Same as ultimatesUsed

    // Calculate ultKills - kills made while ultimate was active
    const ultimateActiveEvents = filterByContext(dataModel.ultimateStart);
    const ultimateEndEvents = filterByContext(dataModel.ultimateEnd);
    const killEvents = filterByContext(dataModel.kill.map(k => ({ ...k, playerName: k.attackerName, playerTeam: k.attackerTeam, playerHero: k.attackerHero })));
    
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
        kill.playerName === ultStart.playerName
      );
      ultKills += killsDuringUlt.length;
    });

    // Calculate ultimate timing stats
    const ultimateChargedEvents = filterByContext(dataModel.ultimateCharged);
    const ultimateStartEvents = filterByContext(dataModel.ultimateStart);
    
    let totalChargeTime = 0;
    let totalHoldTime = 0;
    let totalUseTime = 0;
    let chargeTimeCount = 0;
    let holdTimeCount = 0;
    let useTimeCount = 0;

    ultimateChargedEvents.forEach(charged => {
      // Find corresponding ultimate start
      const ultStart = ultimateStartEvents.find(start => 
        start.ultimateId === charged.ultimateId &&
        start.playerName === charged.playerName &&
        start.matchTime >= charged.matchTime
      );
      
      if (ultStart) {
        // Calculate hold time (charged to used)
        totalHoldTime += (ultStart.matchTime - charged.matchTime);
        holdTimeCount++;
        
        // Find corresponding ultimate end for use time
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

    // Calculate charge time by looking at time between ultimate uses
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

    // Deaths with ultimate available
    const deathEvents = filterByContext(dataModel.kill.map(k => ({ ...k, playerName: k.victimName, playerTeam: k.victimTeam, playerHero: k.victimHero })));
    let deathsWithUltAvailable = 0;
    
    deathEvents.forEach(death => {
      // Check if player had ultimate available at time of death
      const availableUlts = ultimateChargedEvents.filter(charged => 
        charged.playerName === death.playerName &&
        charged.matchTime <= death.matchTime
      );
      
      const usedUlts = ultimateStartEvents.filter(used => 
        used.playerName === death.playerName &&
        used.matchTime <= death.matchTime
      );
      
      // If more ultimates charged than used, player had ultimate available
      if (availableUlts.length > usedUlts.length) {
        deathsWithUltAvailable++;
      }
    });

    // Teamfight participation stats
    const relevantTeamfights = R.filter(dataModel.teamfights, fight => {
      if (filterContext.matchId && fight.matchId !== filterContext.matchId) return false;
      
      // Check if player participated in this teamfight
      if (filterContext.playerName) {
        const team1Players = [...fight.start.team1.alivePlayers, ...fight.end.team1.kills];
        const team2Players = [...fight.start.team2.alivePlayers, ...fight.end.team2.kills];
        const allParticipants = [...team1Players, ...team2Players];
        
        if (!allParticipants.includes(filterContext.playerName)) return false;
      }
      
      if (filterContext.playerTeam) {
        if (fight.start.team1.teamName !== filterContext.playerTeam && 
            fight.start.team2.teamName !== filterContext.playerTeam) return false;
      }
      
      return true;
    });

    const teamfightsParticipated = relevantTeamfights.length;
    
    const teamfightsWon = R.filter(relevantTeamfights, fight => {
      if (filterContext.playerTeam) {
        return fight.winner === filterContext.playerTeam;
      }
      // If no specific team context, count based on player name
      if (filterContext.playerName) {
        const winningTeamPlayers = fight.winner === fight.start.team1.teamName ? 
          [...fight.start.team1.alivePlayers, ...fight.end.team1.kills] :
          [...fight.start.team2.alivePlayers, ...fight.end.team2.kills];
        return winningTeamPlayers.includes(filterContext.playerName);
      }
      return false;
    }).length;

    // Teamfights won with/without ultimate
    let teamfightsWonWithUlt = 0;
    const wonTeamfights = R.filter(relevantTeamfights, fight => {
      if (filterContext.playerTeam) {
        return fight.winner === filterContext.playerTeam;
      }
      if (filterContext.playerName) {
        const winningTeamPlayers = fight.winner === fight.start.team1.teamName ? 
          [...fight.start.team1.alivePlayers, ...fight.end.team1.kills] :
          [...fight.start.team2.alivePlayers, ...fight.end.team2.kills];
        return winningTeamPlayers.includes(filterContext.playerName);
      }
      return false;
    });

    wonTeamfights.forEach(fight => {
      const playerTeam = filterContext.playerTeam || 
        (fight.start.team1.alivePlayers.includes(filterContext.playerName || '') ? fight.start.team1.teamName : fight.start.team2.teamName);
      
      const teamUltsUsed = playerTeam === fight.start.team1.teamName ? 
        fight.end.team1.ultimatesUsed : 
        fight.end.team2.ultimatesUsed;
      
      // Check if player used ultimate during this fight
      if (filterContext.playerName && filterContext.playerHero) {
        if (teamUltsUsed.includes(filterContext.playerHero)) {
          teamfightsWonWithUlt++;
        }
      } else if (teamUltsUsed.length > 0) {
        // If no specific player context, count if any ultimates were used
        teamfightsWonWithUlt++;
      }
    });

    const teamfightsWonWithoutUlt = teamfightsWon - teamfightsWonWithUlt;

    // Win rates
    const teamfightWinRate = teamfightsParticipated > 0 ? teamfightsWon / teamfightsParticipated : 0;
    const teamfightWinRateWithUlt = teamfightsParticipated > 0 ? teamfightsWonWithUlt / teamfightsParticipated : 0;
    const teamfightWinRateWithoutUlt = teamfightsParticipated > 0 ? teamfightsWonWithoutUlt / teamfightsParticipated : 0;

    // First kill/death teamfight stats  
    let teamfightsWithFirstKill = 0;
    let teamfightsWithFirstDeath = 0;
    let teamfightsWonWithFirstKill = 0;
    let teamfightsWonWithFirstDeath = 0;

    relevantTeamfights.forEach(fight => {
      const fightKills = R.filter(dataModel.kill, kill => 
        kill.matchTime >= fight.startTime && 
        kill.matchTime <= fight.endTime &&
        kill.matchId === fight.matchId
      );
      
      const sortedKills = R.sortBy(fightKills, kill => kill.matchTime);
      
      if (sortedKills.length > 0) {
        const firstKill = sortedKills[0];
        const firstDeath = sortedKills[0]; // Same event, different perspective
        
        // Check if player made first kill
        if (filterContext.playerName && firstKill.attackerName === filterContext.playerName) {
          teamfightsWithFirstKill++;
        }
        
        // Check if player/team had first death
        if (filterContext.playerName && firstDeath.victimName === filterContext.playerName) {
          teamfightsWithFirstDeath++;
        } else if (filterContext.playerTeam && firstDeath.victimTeam === filterContext.playerTeam) {
          teamfightsWithFirstDeath++;
        }
      }
    });

    // Now calculate won teamfights with first kill/death
    wonTeamfights.forEach(fight => {
      const fightKills = R.filter(dataModel.kill, kill => 
        kill.matchTime >= fight.startTime && 
        kill.matchTime <= fight.endTime &&
        kill.matchId === fight.matchId
      );
      
      const sortedKills = R.sortBy(fightKills, kill => kill.matchTime);
      
      if (sortedKills.length > 0) {
        const firstKill = sortedKills[0];
        const firstDeath = sortedKills[0]; // Same event, different perspective
        
        // Check if player made first kill
        if (filterContext.playerName && firstKill.attackerName === filterContext.playerName) {
          teamfightsWonWithFirstKill++;
        }
        
        // Check if player/team had first death
        if (filterContext.playerName && firstDeath.victimName === filterContext.playerName) {
          teamfightsWonWithFirstDeath++;
        } else if (filterContext.playerTeam && firstDeath.victimTeam === filterContext.playerTeam) {
          teamfightsWonWithFirstDeath++;
        }
      }
    });

    const firstKillRate = teamfightsParticipated > 0 ? teamfightsWithFirstKill / teamfightsParticipated : 0;
    const firstDeathRate = teamfightsParticipated > 0 ? teamfightsWithFirstDeath / teamfightsParticipated : 0;
    const teamfightWinRateWithFirstKill = teamfightsParticipated > 0 ? teamfightsWonWithFirstKill / teamfightsParticipated : 0;
    const teamfightWinRateWithFirstDeath = teamfightsParticipated > 0 ? teamfightsWonWithFirstDeath / teamfightsParticipated : 0;

    // Kill-by-role stats
    const playerKills = filterByContext(dataModel.kill.map(k => ({ ...k, playerName: k.attackerName, playerTeam: k.attackerTeam, playerHero: k.attackerHero })));
    
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

    // Focus rates
    const totalEliminations = aggregatedBase.eliminations;
    const tankFocusRate = totalEliminations > 0 ? tankKills / totalEliminations : 0;
    const damageFocusRate = totalEliminations > 0 ? damageKills / totalEliminations : 0;
    const supportFocusRate = totalEliminations > 0 ? supportKills / totalEliminations : 0;

    // Average life duration
    const relevantPlayerLives = R.filter(dataModel.playerLives, life => {
      if (filterContext.matchId && life.matchId !== filterContext.matchId) return false;
      if (filterContext.playerName && life.player !== filterContext.playerName) return false;
      if (filterContext.playerHero && life.hero !== filterContext.playerHero) return false;
      return true;
    });
    const averageLifeDuration = relevantPlayerLives.length > 0 ? 
      R.pipe(relevantPlayerLives, R.sumBy(life => life.duration)) / relevantPlayerLives.length : 0;

    // Total assists (offensive + defensive)
    const totalAssists = aggregatedBase.offensiveAssists + aggregatedBase.defensiveAssists;
    const totalAssistsPer10Minutes = totalAssists * per10MinuteMultiplier;

    // Damage per kill
    const damagePerKill = aggregatedBase.eliminations > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.eliminations : 0;

    // Damage done per healing received
    const damageDonePerHealingReceived = aggregatedBase.healingReceived > 0 ? aggregatedBase.allDamageDealt / aggregatedBase.healingReceived : 0;

    return {
      // Base stats
      playtime: aggregatedBase.playtime,
      eliminations: aggregatedBase.eliminations,
      finalBlows: aggregatedBase.finalBlows,
      deaths: aggregatedBase.deaths,
      allDamageDealt: aggregatedBase.allDamageDealt,
      barrierDamageDealt: aggregatedBase.barrierDamageDealt,
      heroDamageDealt: aggregatedBase.heroDamageDealt,
      healingDealt: aggregatedBase.healingDealt,
      healingReceived: aggregatedBase.healingReceived,
      selfHealing: aggregatedBase.selfHealing,
      damageTaken: aggregatedBase.damageTaken,
      damageBlocked: aggregatedBase.damageBlocked,
      defensiveAssists: aggregatedBase.defensiveAssists,
      offensiveAssists: aggregatedBase.offensiveAssists,
      ultimatesEarned: aggregatedBase.ultimatesEarned,
      ultimatesUsed: aggregatedBase.ultimatesUsed,
      multikills: aggregatedBase.multikills,
      soloKills: aggregatedBase.soloKills,
      objectiveKills: aggregatedBase.objectiveKills,
      environmentalKills: aggregatedBase.environmentalKills,
      environmentalDeaths: aggregatedBase.environmentalDeaths,
      criticalHits: aggregatedBase.criticalHits,
      shotsFired: aggregatedBase.shotsFired,
      shotsHit: aggregatedBase.shotsHit,
      shotsMissed: aggregatedBase.shotsMissed,
      scopedShotsFired: aggregatedBase.scopedShotsFired,
      scopedShotsHit: aggregatedBase.scopedShotsHit,
      // Derived stats
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
      ultsUsed,
      ultKills,
      killsPerUltimate,
      teamfightsParticipated,
      teamfightsWon,
      teamfightsWonWithUlt,
      teamfightsWonWithoutUlt,
      teamfightWinRate,
      teamfightWinRateWithUlt,
      teamfightWinRateWithoutUlt,
      teamfightsWithFirstKill,
      teamfightsWithFirstDeath,
      firstKillRate,
      firstDeathRate,
      teamfightsWonWithFirstKill,
      teamfightsWonWithFirstDeath,
      teamfightWinRateWithFirstKill,
      teamfightWinRateWithFirstDeath,
      ultimateChargeTime,
      ultimateHoldTime,
      ultimateUseTime,
      deathsWithUltAvailable,
      tankKills,
      damageKills,
      supportKills,
      tankFocusRate,
      damageFocusRate,
      supportFocusRate,
      averageLifeDuration,
      totalAssists,
      totalAssistsPer10Minutes,
      damagePerKill,
      damageDonePerHealingReceived
    };
  };

  // Apply three-stage computation to all groupings

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

// Ranking system for player stats
const rankValues = <T extends Record<string, number | string>>(
  records: T[], 
  metrics: ScrimsightDataModel.PlayerStatsNumericalKeys[]
): T[] => {
  if (records.length === 0) return [];
  
  // Rank each metric and build new records
  const rankedRecords = records.map(record => {
    // Create a new object with rankings for each metric
    const rankedRecord: T & Record<ScrimsightDataModel.PlayerStatsNumericalKeys, number> = { ...record } as T & Record<ScrimsightDataModel.PlayerStatsNumericalKeys, number>;
    
    metrics.forEach(metric => {
      // Extract values for this metric
      const values = records.map(r => r[metric] as number);
      const direction = ScrimsightDataModel.PLAYER_STAT_RANKING_DIRECTIONS[metric];
      
      // Sort values based on direction (higher is better vs lower is better)
      const sortedValues = [...new Set(values)].sort((a, b) => {
        return direction === 'higher' ? b - a : a - b; // descending for 'higher', ascending for 'lower'
      });
      
      // Create rank mapping
      const rankMap = new Map<number, number>();
      sortedValues.forEach((value, index) => {
        rankMap.set(value, index + 1); // rank starts at 1
      });
      
      // Assign rank to this record
      rankedRecord[metric] = rankMap.get(record[metric] as number) || 1;
    });
    
    return rankedRecord as T;
  });
  
  return rankedRecords;
};

const buildPlayerStatBreakdownRanks = (playerStatBreakdown: ScrimsightDataModel.PlayerStatBreakdown): ScrimsightDataModel.PlayerStatBreakdown => {
  const metrics = ScrimsightDataModel.playerStatsNumericalKeys;
  
  return {
    // Total ranking (all metrics get rank 1 since there's only one total)
    total: Object.fromEntries(metrics.map(metric => [metric, 1])) as Record<ScrimsightDataModel.PlayerStatsNumericalKeys, number>,
    
    // Rank each breakdown type
    byPlayer: rankValues(playerStatBreakdown.byPlayer, metrics),
    byTeam: rankValues(playerStatBreakdown.byTeam, metrics),
    byTeamAndPlayer: rankValues(playerStatBreakdown.byTeamAndPlayer, metrics),
    byTeamAndPlayerAndMatch: rankValues(playerStatBreakdown.byTeamAndPlayerAndMatch, metrics),
    byTeamAndPlayerAndScrim: rankValues(playerStatBreakdown.byTeamAndPlayerAndScrim, metrics),
    byPlayerAndHero: rankValues(playerStatBreakdown.byPlayerAndHero, metrics),
    byRole: rankValues(playerStatBreakdown.byRole, metrics),
    byHero: rankValues(playerStatBreakdown.byHero, metrics),
    byTeamAndMatch: rankValues(playerStatBreakdown.byTeamAndMatch, metrics),
    byTeamAndScrim: rankValues(playerStatBreakdown.byTeamAndScrim, metrics)
  };
};

export const buildDataModel = (files: {fileName: string, fileModified: number, fileContent: string}[]): ScrimsightDataModel.ScrimsightDataModel => {
  const dataModel = createEmptyDataModel();
  
  const parsedFiles = parseFiles(files);
  
  extractAllEvents(dataModel, parsedFiles);
  
  dataModel.scrims = groupMatchesIntoScrims(dataModel, parsedFiles);
  
  dataModel.matches = buildMatchRelationships(dataModel, parsedFiles);
  dataModel.teams = buildTeamRelationships(dataModel);
  
  // Build playerLives first so we can calculate playtime in playerRelationships
  dataModel.playerLives = buildPlayerLives(dataModel);
  dataModel.players = buildPlayerRelationships(dataModel);
  
  dataModel.teamfights = buildTeamfights(dataModel);
  dataModel.rounds = buildRounds(dataModel);
  dataModel.teamCompositions = buildTeamCompositions(dataModel);
  
  dataModel.playerStatBreakdown = buildPlayerStatBreakdown(dataModel);
  dataModel.playerStatBreakdownRanks = buildPlayerStatBreakdownRanks(dataModel.playerStatBreakdown);
  dataModel.killCounts = buildKillCounts(dataModel);

  return dataModel;
};