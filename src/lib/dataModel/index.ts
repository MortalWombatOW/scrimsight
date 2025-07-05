
import { parseFile } from "../scrimtime";
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import { extractAllEvents } from "./eventExtraction";
import { groupMatchesIntoScrims } from "./scrimRelationships";
import { buildMatchRelationships } from "./matchRelationships";
import { buildTeamRelationships } from "./teamRelationships";
import { buildPlayerRelationships } from "./playerRelationships";
import { buildPlayerLives } from "./playerLivesBuilder";
import { buildTeamfights } from "./teamfightBuilder";
import { buildRounds } from "./roundBuilder";
import { buildTeamCompositions } from "./teamCompositionBuilder";
import { buildKillCounts } from "./killCountBuilder";
import { buildPlayerStatBreakdown } from "./playerStatBreakdown";
import { buildPlayerStatBreakdownRanks } from "./playerStatBreakdown/statRanking";
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
