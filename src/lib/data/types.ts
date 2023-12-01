type FileUpload = {
  fileName: string;
  file?: File;
  data?: string;
  mapId?: number;
  events?: DataAndSpecName[];
  error?: string;
  done?: boolean;
};

interface TeamInfo {
  name: string;
  tanks: string[];
  dps: string[];
  supports: string[];
}

interface Statistic {
  [key: string]: number;
}

interface ColorInternal {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ColorInternalHSL {
  h: number;
  s: number;
  l: number;
  a: number;
}

interface MapEntity {
  id: string;
  // label?: string;
  clazz?: string;
  image?: string;
  states: RenderState;
  entityType:
    | 'player'
    | 'damage'
    | 'healing'
    | 'final blow'
    | 'elimination'
    | 'ability';
}

type RenderState = {
  [timestamp: string]: {
    [key: string]: string | number;
  };
};

enum ReportComponentType {
  default,
  debug,
  table,
  map,
  timeChart,
  barChart,
  embed,
  matrix,
}

enum ReportComponentStyle {
  default,
  emphasized,
  topLine,
}

type ReportComponent = {
  type: ReportComponentType;
  // metric: Metric; TODO change to query?
  style: ReportComponentStyle;
};

type ReportControl = {
  type: ReportControlType;
};

enum ReportControlType {
  metric,
  map,
  player,
}

type Report = {
  title: string;
  controls: ReportControl[];
  // metricGroups: ReportMetricGroup[]; TODO
};

type GameStateTimeSlice = {
  mapId: number;
  timestamp: number;
  players: {
    name: string;
    x: number;
    y: number;
    z: number;
    hero: string;
    health: number;
    ultCharge: number;
    abilityies: string[];
  }[];
  interactions: {
    player: string;
    target: string;
    healing: number;
    damage: number;
    finalBlow: boolean;
    elimination: boolean;
  }[];
};

type GameStateExtractor = (
  slice: GameStateTimeSlice,
) => {
  [key: string]: number;
};

type Team = {
  name: string;
  players: string[];
  notes?: string;
  id?: number;
};

type DataAndSpecName = {
  data: object[];
  specName: string;
};

type DataRowBySpecName = {
  [key: string]: object[];
};

type LogSpec = Record<string, DataSpec>;
// defines the structure of the data
interface DataSpec {
  // human readable name of the event. This is used to display the event in the UI, it should use capitalization and spaces
  displayName: string;
  // the name of the event. This is used to identify the event in the code, it should be all lowercase and use underscores
  key: string;
  // the fields that are present in the event
  fields: FieldSpec[];
}

// describes an individual field in data spec
interface FieldSpec {
  // human readable name of the field
  displayName: string;
  // the key used on the object. machine readable.
  key: string;
  // the data type of the field
  dataType: 'string' | 'number' | 'boolean';
}

const commmonFields: FieldSpec[] = [
  {displayName: 'Map ID', key: 'mapId', dataType: 'number'},
  {displayName: 'Type', key: 'type', dataType: 'string'},
  {displayName: 'Match Time', key: 'matchTime', dataType: 'number'},
];

const playerFields: FieldSpec[] = [
  {displayName: 'Player Team', key: 'playerTeam', dataType: 'string'},
  {displayName: 'Player Name', key: 'playerName', dataType: 'string'},
  {displayName: 'Player Hero', key: 'playerHero', dataType: 'string'},
];

const attackFields: FieldSpec[] = [
  {displayName: 'Attacker Team', key: 'attackerTeam', dataType: 'string'},
  {displayName: 'Attacker Name', key: 'attackerName', dataType: 'string'},
  {displayName: 'Attacker Hero', key: 'attackerHero', dataType: 'string'},
  {displayName: 'Victim Team', key: 'victimTeam', dataType: 'string'},
  {displayName: 'Victim Name', key: 'victimName', dataType: 'string'},
  {displayName: 'Victim Hero', key: 'victimHero', dataType: 'string'},
];

const LOG_SPEC: LogSpec = {
  match_start: {
    displayName: 'Match Start',
    key: 'match_start',
    fields: [
      ...commmonFields,
      {displayName: 'Map Name', key: 'mapName', dataType: 'string'},
      {displayName: 'Map Type', key: 'mapType', dataType: 'string'},
      {displayName: 'Team 1 Name', key: 'team1Name', dataType: 'string'},
      {displayName: 'Team 2 Name', key: 'team2Name', dataType: 'string'},
    ],
  },
  match_end: {
    displayName: 'Match End',
    key: 'match_end',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {displayName: 'Team 1 Score', key: 'team1Score', dataType: 'number'},
      {displayName: 'Team 2 Score', key: 'team2Score', dataType: 'number'},
    ],
  },
  round_start: {
    displayName: 'Round Start',
    key: 'round_start',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {displayName: 'Capturing Team', key: 'capturingTeam', dataType: 'string'},
      {displayName: 'Team 1 Score', key: 'team1Score', dataType: 'number'},
      {displayName: 'Team 2 Score', key: 'team2Score', dataType: 'number'},
      {
        displayName: 'Objective Index',
        key: 'objectiveIndex',
        dataType: 'number',
      },
    ],
  },
  round_end: {
    displayName: 'Round End',
    key: 'round_end',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {displayName: 'Capturing Team', key: 'capturingTeam', dataType: 'string'},
      {displayName: 'Team 1 Score', key: 'team1Score', dataType: 'number'},
      {displayName: 'Team 2 Score', key: 'team2Score', dataType: 'number'},
      {
        displayName: 'Objective Index',
        key: 'objectiveIndex',
        dataType: 'number',
      },
      {
        displayName: 'Control Team 1 Progress',
        key: 'controlTeam1Progress',
        dataType: 'number',
      },
      {
        displayName: 'Control Team 2 Progress',
        key: 'controlTeam2Progress',
        dataType: 'number',
      },
      {
        displayName: 'Match Time Remaining',
        key: 'matchTimeRemaining',
        dataType: 'number',
      },
    ],
  },
  setup_complete: {
    displayName: 'Setup Complete',
    key: 'setup_complete',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {
        displayName: 'Match Time Remaining',
        key: 'matchTimeRemaining',
        dataType: 'number',
      },
    ],
  },

  objective_captured: {
    displayName: 'Objective Captured',
    key: 'objective_captured',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {displayName: 'Capturing Team', key: 'capturingTeam', dataType: 'string'},
      {
        displayName: 'Objective Index',
        key: 'objectiveIndex',
        dataType: 'number',
      },
      {
        displayName: 'Control Team 1 Progress',
        key: 'controlTeam1Progress',
        dataType: 'number',
      },
      {
        displayName: 'Control Team 2 Progress',
        key: 'controlTeam2Progress',
        dataType: 'number',
      },
      {
        displayName: 'Match Time Remaining',
        key: 'matchTimeRemaining',
        dataType: 'number',
      },
    ],
  },
  point_progress: {
    displayName: 'Point Progress',
    key: 'point_progress',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {displayName: 'Capturing Team', key: 'capturingTeam', dataType: 'string'},
      {
        displayName: 'Objective Index',
        key: 'objectiveIndex',
        dataType: 'number',
      },
      {
        displayName: 'Point Capture Progress',
        key: 'pointCaptureProgress',
        dataType: 'number',
      },
    ],
  },
  payload_progress: {
    displayName: 'Payload Progress',
    key: 'payload_progress',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      {displayName: 'Capturing Team', key: 'capturingTeam', dataType: 'string'},
      {
        displayName: 'Objective Index',
        key: 'objectiveIndex',
        dataType: 'number',
      },
      {
        displayName: 'Payload Capture Progress',
        key: 'payloadCaptureProgress',
        dataType: 'number',
      },
    ],
  },
  hero_spawn: {
    displayName: 'Hero Spawn',
    key: 'hero_spawn',
    fields: [
      ...commmonFields,
      ...playerFields,
      {displayName: 'Previous Hero', key: 'previousHero', dataType: 'string'},
      {
        displayName: 'Hero Time Played',
        key: 'heroTimePlayed',
        dataType: 'number',
      },
    ],
  },
  hero_swap: {
    displayName: 'Hero Swap',
    key: 'hero_swap',
    fields: [
      ...commmonFields,
      ...playerFields,
      {displayName: 'Previous Hero', key: 'previousHero', dataType: 'string'},
      {
        displayName: 'Hero Time Played',
        key: 'heroTimePlayed',
        dataType: 'number',
      },
    ],
  },
  ability_1_used: {
    displayName: 'Ability 1 Used',
    key: 'ability_1_used',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
    ],
  },
  ability_2_used: {
    displayName: 'Ability 2 Used',
    key: 'ability_2_used',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
    ],
  },
  offensive_assist: {
    displayName: 'Offensive Assist',
    key: 'offensive_assist',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
    ],
  },
  defensive_assist: {
    displayName: 'Defensive Assist',
    key: 'defensive_assist',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
    ],
  },
  ultimate_charged: {
    displayName: 'Ultimate Charged',
    key: 'ultimate_charged',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
      {displayName: 'Ultimate ID', key: 'ultimateId', dataType: 'number'},
    ],
  },
  ultimate_start: {
    displayName: 'Ultimate Start',
    key: 'ultimate_start',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
      {displayName: 'Ultimate ID', key: 'ultimateId', dataType: 'number'},
    ],
  },
  ultimate_end: {
    displayName: 'Ultimate End',
    key: 'ultimate_end',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
      {displayName: 'Ultimate ID', key: 'ultimateId', dataType: 'number'},
    ],
  },
  kill: {
    displayName: 'Kill',
    key: 'kill',
    fields: [
      ...commmonFields,
      ...attackFields,
      {displayName: 'Event Ability', key: 'eventAbility', dataType: 'string'},
      {displayName: 'Event Damage', key: 'eventDamage', dataType: 'number'},
      {
        displayName: 'Is Critical Hit',
        key: 'isCriticalHit',
        dataType: 'boolean',
      },
      {
        displayName: 'Is Environmental',
        key: 'isEnvironmental',
        dataType: 'boolean',
      },
    ],
  },
  damage: {
    displayName: 'Damage',
    key: 'damage',
    fields: [
      ...commmonFields,
      ...attackFields,
      {displayName: 'Event Ability', key: 'eventAbility', dataType: 'string'},
      {displayName: 'Event Damage', key: 'eventDamage', dataType: 'number'},
      {
        displayName: 'Is Critical Hit',
        key: 'isCriticalHit',
        dataType: 'boolean',
      },
      {
        displayName: 'Is Environmental',
        key: 'isEnvironmental',
        dataType: 'boolean',
      },
    ],
  },

  healing: {
    displayName: 'Healing',
    key: 'healing',
    fields: [
      ...commmonFields,
      {displayName: 'Healer Team', key: 'healerTeam', dataType: 'string'},
      {displayName: 'Healer Name', key: 'healerName', dataType: 'string'},
      {displayName: 'Healer Hero', key: 'healerHero', dataType: 'string'},
      {displayName: 'Healee Team', key: 'healeeTeam', dataType: 'string'},
      {displayName: 'Healee Name', key: 'healeeName', dataType: 'string'},
      {displayName: 'Healee Hero', key: 'healeeHero', dataType: 'string'},
      {displayName: 'Event Ability', key: 'eventAbility', dataType: 'string'},
      {displayName: 'Event Healing', key: 'eventHealing', dataType: 'number'},
      {
        displayName: 'Is Health Pack',
        key: 'isHealthPack',
        dataType: 'boolean',
      },
    ],
  },
  mercy_rez: {
    displayName: 'Mercy Rez',
    key: 'mercy_rez',
    fields: [
      ...commmonFields,
      {displayName: 'Mercy Team', key: 'mercyTeam', dataType: 'string'},
      {displayName: 'Mercy Name', key: 'mercyName', dataType: 'string'},
      {displayName: 'Revived Team', key: 'revivedTeam', dataType: 'string'},
      {displayName: 'Revived Name', key: 'revivedName', dataType: 'string'},
      {displayName: 'Revived Hero', key: 'revivedHero', dataType: 'string'},
      {displayName: 'Event Ability', key: 'eventAbility', dataType: 'string'},
    ],
  },
  echo_duplicate_start: {
    displayName: 'Echo Duplicate Start',
    key: 'echo_duplicate_start',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
      {displayName: 'Ultimate ID', key: 'ultimateId', dataType: 'number'},
    ],
  },
  echo_duplicate_end: {
    displayName: 'Echo Duplicate End',
    key: 'echo_duplicate_end',
    fields: [
      ...commmonFields,
      ...playerFields,
      {displayName: 'Ultimate ID', key: 'ultimateId', dataType: 'number'},
    ],
  },
  dva_demech: {
    displayName: 'D.Va Demech',
    key: 'dva_demech',
    fields: [
      ...commmonFields,
      ...attackFields,
      {displayName: 'Event Ability', key: 'eventAbility', dataType: 'string'},
      {displayName: 'Event Damage', key: 'eventDamage', dataType: 'number'},
      {
        displayName: 'Is Critical Hit',
        key: 'isCriticalHit',
        dataType: 'boolean',
      },
      {
        displayName: 'Is Environmental',
        key: 'isEnvironmental',
        dataType: 'boolean',
      },
    ],
  },
  dva_remech: {
    displayName: 'D.Va Remech',
    key: 'dva_remech',
    fields: [
      ...commmonFields,
      ...playerFields,
      {displayName: 'Ultimate ID', key: 'ultimateId', dataType: 'number'},
    ],
  },
  remech_charged: {
    displayName: 'Remech Charged',
    key: 'remech_charged',
    fields: [
      ...commmonFields,
      ...playerFields,
      {
        displayName: 'Hero Duplicated',
        key: 'heroDuplicated',
        dataType: 'string',
      },
      {displayName: 'Ultimate ID', key: 'ultimateId', dataType: 'number'},
    ],
  },
  player_stat: {
    displayName: 'Player Stat',
    key: 'player_stat',
    fields: [
      ...commmonFields,
      {displayName: 'Round Number', key: 'roundNumber', dataType: 'number'},
      ...playerFields,
      {displayName: 'Eliminations', key: 'eliminations', dataType: 'number'},
      {displayName: 'Final Blows', key: 'finalBlows', dataType: 'number'},
      {displayName: 'Deaths', key: 'deaths', dataType: 'number'},
      {
        displayName: 'All Damage Dealt',
        key: 'allDamageDealt',
        dataType: 'number',
      },
      {
        displayName: 'Barrier Damage Dealt',
        key: 'barrierDamageDealt',
        dataType: 'number',
      },
      {
        displayName: 'Hero Damage Dealt',
        key: 'heroDamageDealt',
        dataType: 'number',
      },
      {displayName: 'Healing Dealt', key: 'healingDealt', dataType: 'number'},
      {
        displayName: 'Healing Received',
        key: 'healingReceived',
        dataType: 'number',
      },
      {displayName: 'Self Healing', key: 'selfHealing', dataType: 'number'},
      {displayName: 'Damage Taken', key: 'damageTaken', dataType: 'number'},
      {displayName: 'Damage Blocked', key: 'damageBlocked', dataType: 'number'},
      {
        displayName: 'Defensive Assists',
        key: 'defensiveAssists',
        dataType: 'number',
      },
      {
        displayName: 'Offensive Assists',
        key: 'offensiveAssists',
        dataType: 'number',
      },
      {
        displayName: 'Ultimates Earned',
        key: 'ultimatesEarned',
        dataType: 'number',
      },
      {displayName: 'Ultimates Used', key: 'ultimatesUsed', dataType: 'number'},
      {displayName: 'Multikill Best', key: 'multikillBest', dataType: 'number'},
      {displayName: 'Multikills', key: 'multikills', dataType: 'number'},
      {displayName: 'Solo Kills', key: 'soloKills', dataType: 'number'},
      {
        displayName: 'Objective Kills',
        key: 'objectiveKills',
        dataType: 'number',
      },
      {
        displayName: 'Environmental Kills',
        key: 'environmentalKills',
        dataType: 'number',
      },
      {
        displayName: 'Environmental Deaths',
        key: 'environmentalDeaths',
        dataType: 'number',
      },
      {displayName: 'Critical Hits', key: 'criticalHits', dataType: 'number'},
      {
        displayName: 'Critical Hit Accuracy',
        key: 'criticalHitAccuracy',
        dataType: 'number',
      },
      {
        displayName: 'Scoped Accuracy',
        key: 'scopedAccuracy',
        dataType: 'number',
      },
      {
        displayName: 'Scoped Critical Hit Accuracy',
        key: 'scopedCriticalHitAccuracy',
        dataType: 'number',
      },
      {
        displayName: 'Scoped Critical Hit Kills',
        key: 'scopedCriticalHitKills',
        dataType: 'number',
      },
      {displayName: 'Shots Fired', key: 'shotsFired', dataType: 'number'},
      {displayName: 'Shots Hit', key: 'shotsHit', dataType: 'number'},
      {displayName: 'Shots Missed', key: 'shotsMissed', dataType: 'number'},
      {
        displayName: 'Scoped Shots Fired',
        key: 'scopedShotsFired',
        dataType: 'number',
      },
      {
        displayName: 'Scoped Shots Hit',
        key: 'scopedShotsHit',
        dataType: 'number',
      },
      {
        displayName: 'Weapon Accuracy',
        key: 'weaponAccuracy',
        dataType: 'number',
      },
      {
        displayName: 'Hero Time Played',
        key: 'heroTimePlayed',
        dataType: 'number',
      },
    ],
  },
};

export {
  FileUpload,
  TeamInfo,
  Statistic,
  ColorInternal,
  ColorInternalHSL,
  MapEntity,
  RenderState,
  Report,
  ReportComponent,
  ReportControl,
  ReportComponentType,
  ReportControlType,
  ReportComponentStyle,
  GameStateTimeSlice,
  GameStateExtractor,
  Team,
  DataAndSpecName,
  DataRowBySpecName,
  LogSpec,
  DataSpec,
  FieldSpec,
  LOG_SPEC,
};
