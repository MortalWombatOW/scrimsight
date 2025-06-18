import { parseFile, type DataAndSpecName } from "./scrimtime";
import * as ScrimsightDataModel from "./ScrimsightDataModel";
import * as R from "remeda";
import { extractEventsFromFiles } from "./eventExtractionUtils";

const createEmptyDataModel = (): ScrimsightDataModel.ScrimsightDataModel => ({
  scrims: [],
  players: [],
  teams: [],
  matches: [],
  playerLives: [],
  teamfights: [],
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

export const buildDataModel = (files: {fileName: string, fileModified: number, fileContent: string}[]): ScrimsightDataModel.ScrimsightDataModel => {
  const dataModel = createEmptyDataModel();
  
  const parsedFiles = parseFiles(files);
  
  extractAllEvents(dataModel, parsedFiles);
  
  dataModel.scrims = groupMatchesIntoScrims(dataModel, parsedFiles);
  
  dataModel.matches = buildMatchRelationships(dataModel, parsedFiles);
  dataModel.teams = buildTeamRelationships(dataModel);
  dataModel.players = buildPlayerRelationships(dataModel);

  return dataModel;
};