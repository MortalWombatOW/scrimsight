// in: files
// out: data model

import { parseFile } from "./scrimtime";
import * as ScrimsightDataModel from "./ScrimsightDataModel";
import * as R from "remeda";
import { extractEventsFromFiles } from "./eventExtractionUtils";

export const buildDataModel = (files: {fileName: string, fileModified: number, fileContent: string}[]): ScrimsightDataModel.ScrimsightDataModel => {
    
  const dataModel: ScrimsightDataModel.ScrimsightDataModel = {
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
  };
  
  
  const parsedFiles = 
    R.map(files, (file) => {
      return {
      ...parseFile(file.fileContent),
      fileName: file.fileName,
      fileModified: file.fileModified,
      };
    });

    dataModel.ability1Used = extractEventsFromFiles<ScrimsightDataModel.Ability1UsedLogEvent>('ability1Used', parsedFiles);
    dataModel.ability2Used = extractEventsFromFiles<ScrimsightDataModel.Ability2UsedLogEvent>('ability2Used', parsedFiles);
    dataModel.damage = extractEventsFromFiles<ScrimsightDataModel.DamageLogEvent>('damage', parsedFiles);
    dataModel.defensiveAssist = extractEventsFromFiles<ScrimsightDataModel.DefensiveAssistLogEvent>('defensiveAssist', parsedFiles);
    dataModel.dvaDemech = extractEventsFromFiles<ScrimsightDataModel.DvaDemechLogEvent>('dvaDemech', parsedFiles);
    dataModel.dvaRemech = extractEventsFromFiles<ScrimsightDataModel.DvaRemechLogEvent>('dvaRemech', parsedFiles);
    dataModel.healing = extractEventsFromFiles<ScrimsightDataModel.HealingLogEvent>('healing', parsedFiles);
    dataModel.heroSpawn = extractEventsFromFiles<ScrimsightDataModel.HeroSpawnLogEvent>('heroSpawn', parsedFiles);
    dataModel.heroSwap = extractEventsFromFiles<ScrimsightDataModel.HeroSwapLogEvent>('heroSwap', parsedFiles);
    dataModel.kill = extractEventsFromFiles<ScrimsightDataModel.KillLogEvent>('kill', parsedFiles);
    dataModel.matchEnd = extractEventsFromFiles<ScrimsightDataModel.MatchEndLogEvent>('matchEnd', parsedFiles);
    dataModel.matchStart = extractEventsFromFiles<ScrimsightDataModel.MatchStartLogEvent>('matchStart', parsedFiles);
    dataModel.mercyRez = extractEventsFromFiles<ScrimsightDataModel.MercyRezLogEvent>('mercyRez', parsedFiles);
    dataModel.offensiveAssist = extractEventsFromFiles<ScrimsightDataModel.OffensiveAssistLogEvent>('offensiveAssist', parsedFiles);
    dataModel.playerStat = extractEventsFromFiles<ScrimsightDataModel.PlayerStatLogEvent>('playerStat', parsedFiles);
    dataModel.roundEnd = extractEventsFromFiles<ScrimsightDataModel.RoundEndLogEvent>('roundEnd', parsedFiles);
    dataModel.roundStart = extractEventsFromFiles<ScrimsightDataModel.RoundStartLogEvent>('roundStart', parsedFiles);
    dataModel.setupComplete = extractEventsFromFiles<ScrimsightDataModel.SetupCompleteLogEvent>('setupComplete', parsedFiles);
    dataModel.ultimateCharged = extractEventsFromFiles<ScrimsightDataModel.UltimateChargedLogEvent>('ultimateCharged', parsedFiles);
    dataModel.ultimateEnd = extractEventsFromFiles<ScrimsightDataModel.UltimateEndLogEvent>('ultimateEnd', parsedFiles);
    dataModel.ultimateStart = extractEventsFromFiles<ScrimsightDataModel.UltimateStartLogEvent>('ultimateStart', parsedFiles);
    


  return dataModel;


};