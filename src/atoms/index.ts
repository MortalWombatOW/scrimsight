import { Atom } from 'jotai';
import teamPlayersAtom from './teamPlayers';
import sampleDataEnabledAtom from './sampleDataEnabled';
import sampleDataAtom from './sampleData';
import logFileInputAtom from './logFileInputAtom';
import logFileLoaderAtom from './logFileLoaderAtom';
import logFileParserAtom from './logFileParserAtom';

// All atoms are of this type
export type ScrimsightAtom<T> = {
  name: string;
  description: string;
  atom: Atom<T>;
};

export type TeamPlayersType = {
  teamName: string;
  players: string[];
};
export const teamPlayers: ScrimsightAtom<Promise<TeamPlayersType[]>> = {
  name: 'teamPlayers',
  description: 'All players for each team',
  atom: teamPlayersAtom,
};

export type SampleDataEnabledType = boolean;
export const sampleDataEnabled: ScrimsightAtom<SampleDataEnabledType> = {
  name: 'sampleDataEnabled',
  description: 'Whether sample data is enabled',
  atom: sampleDataEnabledAtom,
};


export type LogFileInputType = {
  files: File[];
};
export const logFileInput: ScrimsightAtom<LogFileInputType> = {
  name: 'logFileInput',
  description: 'Atom that stores the uploaded log files and provides a setter',
  atom: logFileInputAtom,
};

export type LogFileLoaderType = {
  fileName: string;
  fileModified: number;
  fileContent: string;
}[];
export const sampleData: ScrimsightAtom<LogFileLoaderType> = {
  name: 'sampleData',
  description: 'Sample log file data',
  atom: sampleDataAtom,
};

export const logFileLoader: ScrimsightAtom<Promise<LogFileLoaderType>> = {
  name: 'logFileLoader',
  description: 'Loads the content of uploaded log files',
  atom: logFileLoaderAtom,
};

export interface LogFileParserOutput {
  fileName: string;
  matchId: string;
  logs: {
    specName: string;
    data: object;
  }[];
  fileModified: number;
}

export type LogFileParserAtomType = LogFileParserOutput[];

export const logFileParser: ScrimsightAtom<Promise<LogFileParserAtomType>> = {
  name: 'logFileParser',
  description: 'Parses loaded log files and sample data into structured LogFileParserOutput objects.',
  atom: logFileParserAtom,
};

// TODO:
//   "averageMetricPerHeroAtom",
//   "averageMetricPerRoleAtom",
//   "playerComparisonAtomFamily",
//   "createEventExtractorAtom",
//   "matchExtractorAtom",
//   "ability1UsedExtractorAtom",
//   "ability2UsedExtractorAtom",
//   "damageExtractorAtom",
//   "defensiveAssistExtractorAtom",
//   "dvaDemechExtractorAtom",
//   "dvaRemechExtractorAtom",
//   "healingExtractorAtom",
//   "heroSpawnExtractorAtom",
//   "heroSwapExtractorAtom",
//   "killExtractorAtom",
//   "matchEndExtractorAtom",
//   "matchStartExtractorAtom",
//   "mercyRezExtractorAtom",
//   "offensiveAssistExtractorAtom",
//   "playerStatExtractorAtom",
//   "roundEndExtractorAtom",
//   "roundStartExtractorAtom",
//   "setupCompleteExtractorAtom",
//   "ultimateChargedExtractorAtom",
//   "ultimateEndExtractorAtom",
//   "ultimateStartExtractorAtom",
//   "teamNamesAtom",
//   "uniqueGameModesAtom",
//   "uniqueMapNamesAtom",
//   "playerInteractionEventsAtom",
//   "groupedEventsAtom",
//   "playerEventsAtom",
//   "playerMatchHistoryAtom",
//   "playerStatExpandedAtom",
//   "uniquePlayerNamesAtom",
//   "roundTimesAtom",
//   "ultimateEventsAtom",
//   "heroPlaytimeAtom",
//   "mapTimesAtom",
//   "playerLivesAtom",
//   "matchDataAtom",
//   "teamCompositionsAtom",
//   "averageMetricPerMapAtom",
//   "detailedTeamCompositionsAtom",
//   "killMatrixAtom",
//   "playerStatusTimelineAtom",
//   "scrimAtom",
//   "teamMapTypeStatsAtom",
//   "teamfightsAtom",
//   "contextualStatAtoms",
//   "teamStatsAtom",
//   "firstKillImpactAtom",
//   "segmentStatsAtomFamily",
//   "teamfightParticipationAtom",
//   "ultimateImpactAtom",
//   "playerFirstKillDeathRateAtom",
//   "listSummaryAtoms"