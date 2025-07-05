
import { type DataAndSpecName } from "../scrimtime";
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import { extractEventsFromFiles } from "../eventExtractionUtils";

export const extractAllEvents = (dataModel: ScrimsightDataModel.ScrimsightDataModel, parsedFiles: {matchId: string, logs: DataAndSpecName[], fileName: string, fileModified: number}[]) => {
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
