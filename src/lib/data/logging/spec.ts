

export type LogSpec = Record<string, DataSpec>;
// defines the structure of the data
export interface DataSpec {
  // human readable name of the event. This is used to display the event in the UI, it should use capitalization and spaces
  name: string;
  // the name of the event. This is used to identify the event in the code, it should be all lowercase and use underscores
  key: string;
  // the fields that are present in the event
  fields: FieldSpec[];
}

// describes an individual field in data spec
export interface FieldSpec {
  // human readable name of the field
  name: string;
  // the data type of the field
  dataType: "string" | "number" | "boolean";
}

export type DataRow = (string | number | boolean)[];

//need both data and spec name to be able to use the data

export type DataRowBySpecName = Record<string, DataRow[]>;

export type DataAndSpecName = {
  data: DataRow[];
  specName: string;
};

export const logSpec: LogSpec = {
  match_start: {
    name: "Match Start",
    key: "match_start",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Map Name", dataType: "string" },
      { name: "Map Type", dataType: "string" },
      { name: "Team 1 Name", dataType: "string" },
      { name: "Team 2 Name", dataType: "string" },
    ],
  },
  match_end: {
    name: "Match End",
    key: "match_end",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Team 1 Score", dataType: "number" },
      { name: "Team 2 Score", dataType: "number" },
    ],
  },
  round_start: {
    name: "Round Start",
    key: "round_start",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Capturing Team", dataType: "string" },
      { name: "Team 1 Score", dataType: "number" },
      { name: "Team 2 Score", dataType: "number" },
      { name: "Objective Index", dataType: "number" },
    ],
  },
  round_end: {
    name: "Round End",
    key: "round_end",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Capturing Team", dataType: "string" },
      { name: "Team 1 Score", dataType: "number" },
      { name: "Team 2 Score", dataType: "number" },
      { name: "Objective Index", dataType: "number" },
      { name: "Control Team 1 Progress", dataType: "number" },
      { name: "Control Team 2 Progress", dataType: "number" },
      { name: "Match Time Remaining", dataType: "number" },
    ],
  },
  setup_complete: {
    name: "Setup Complete",
    key: "setup_complete",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Match Time Remaining", dataType: "number" },
    ],
  },
  objective_captured: {
    name: "Objective Captured",
    key: "objective_captured",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Capturing Team", dataType: "string" },
      { name: "Objective Index", dataType: "number" },
      { name: "Control Team 1 Progress", dataType: "number" },
      { name: "Control Team 2 Progress", dataType: "number" },
      { name: "Match Time Remaining", dataType: "number" },
    ],
  },
  point_progress: {
    name: "Point Progress",
    key: "point_progress",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Capturing Team", dataType: "string" },
      { name: "Objective Index", dataType: "number" },
      { name: "Point Capture Progress", dataType: "number" },
    ],
  },
  payload_progress: {
    name: "Payload Progress",
    key: "payload_progress",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Capturing Team", dataType: "string" },
      { name: "Objective Index", dataType: "number" },
      { name: "Payload Capture Progress", dataType: "number" },
    ],
  },
  hero_spawn: {
    name: "Hero Spawn",
    key: "hero_spawn",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Previous Hero", dataType: "string" },
      { name: "Hero Time Played", dataType: "number" },
    ],
  },
  hero_swap: {
    name: "Hero Swap",
    key: "hero_swap",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Previous Hero", dataType: "string" },
      { name: "Hero Time Played", dataType: "number" },
    ],
  },
  ability_1_used: {
    name: "Ability 1 Used",
    key: "ability_1_used",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
    ],
  },
  ability_2_used: {
    name: "Ability 2 Used",
    key: "ability_2_used",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
    ],
  },
  offensive_assist: {
    name: "Offensive Assist",
    key: "offensive_assist",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
    ],
  },
  defensive_assist: {
    name: "Defensive Assist",
    key: "defensive_assist",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
    ],
  },
  ultimate_charged: {
    name: "Ultimate Charged",
    key: "ultimate_charged",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
      { name: "Ultimate ID", dataType: "number" },
    ],
  },
  ultimate_start: {
    name: "Ultimate Start",
    key: "ultimate_start",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
      { name: "Ultimate ID", dataType: "number" },
    ],
  },
  ultimate_end: {
    name: "Ultimate End",
    key: "ultimate_end",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
      { name: "Ultimate ID", dataType: "number" },
    ],
  },
  kill: {
    name: "Kill",
    key: "kill",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Attacker Team", dataType: "string" },
      { name: "Attacker Name", dataType: "string" },
      { name: "Attacker Hero", dataType: "string" },
      { name: "Victim Team", dataType: "string" },
      { name: "Victim Name", dataType: "string" },
      { name: "Victim Hero", dataType: "string" },
      { name: "Event Ability", dataType: "string" },
      { name: "Event Damage", dataType: "number" },
      { name: "Is Critical Hit", dataType: "boolean" },
      { name: "Is Environmental", dataType: "boolean" },
    ],
  },
  damage: {
    name: "Damage",
    key: "damage",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Attacker Team", dataType: "string" },
      { name: "Attacker Name", dataType: "string" },
      { name: "Attacker Hero", dataType: "string" },
      { name: "Victim Team", dataType: "string" },
      { name: "Victim Name", dataType: "string" },
      { name: "Victim Hero", dataType: "string" },
      { name: "Event Ability", dataType: "string" },
      { name: "Event Damage", dataType: "number" },
      { name: "Is Critical Hit", dataType: "boolean" },
      { name: "Is Environmental", dataType: "boolean" },
    ],
  },
  healing: {
    name: "Healing",
    key: "healing",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Healer Team", dataType: "string" },
      { name: "Healer Name", dataType: "string" },
      { name: "Healer Hero", dataType: "string" },
      { name: "Healee Team", dataType: "string" },
      { name: "Healee Name", dataType: "string" },
      { name: "Healee Hero", dataType: "string" },
      { name: "Event Ability", dataType: "string" },
      { name: "Event Healing", dataType: "number" },
      { name: "Is Health Pack", dataType: "boolean" },
    ],
  },
  mercy_rez: {
    name: "Mercy Rez",
    key: "mercy_rez",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Mercy Team", dataType: "string" },
      { name: "Mercy Name", dataType: "string" },
      { name: "Revived Team", dataType: "string" },
      { name: "Revived Name", dataType: "string" },
      { name: "Revived Hero", dataType: "string" },
      { name: "Event Ability", dataType: "string" },
    ],
  },
  echo_duplicate_start: {
    name: "Echo Duplicate Start",
    key: "echo_duplicate_start",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
      { name: "Ultimate ID", dataType: "number" },
    ],
  },
  echo_duplicate_end: {
    name: "Echo Duplicate End",
    key: "echo_duplicate_end",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Ultimate ID", dataType: "number" },
    ],
  },
  dva_demech: {
    name: "D.Va Demech",
    key: "dva_demech",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Attacker Team", dataType: "string" },
      { name: "Attacker Name", dataType: "string" },
      { name: "Attacker Hero", dataType: "string" },
      { name: "Victim Team", dataType: "string" },
      { name: "Victim Name", dataType: "string" },
      { name: "Victim Hero", dataType: "string" },
      { name: "Event Ability", dataType: "string" },
      { name: "Event Damage", dataType: "number" },
      { name: "Is Critical Hit", dataType: "boolean" },
      { name: "Is Environmental", dataType: "boolean" },
    ],
  },
  dva_remech: {
    name: "D.Va Remech",
    key: "dva_remech",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Ultimate ID", dataType: "number" },
    ],
  },
  remech_charged: {
    name: "Remech Charged",
    key: "remech_charged",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Hero Duplicated", dataType: "string" },
    ],
  },
  player_stat: {
    name: "Player Stat",
    key: "player_stat",
    fields: [
      { name: "Map ID", dataType: "number"},
      { name: "Match Time", dataType: "number" },
      { name: "Round Number", dataType: "number" },
      { name: "Player Team", dataType: "string" },
      { name: "Player Name", dataType: "string" },
      { name: "Player Hero", dataType: "string" },
      { name: "Eliminations", dataType: "number" },
      { name: "Final Blows", dataType: "number" },
      { name: "Deaths", dataType: "number" },
      { name: "All Damage Dealt", dataType: "number" },
      { name: "Barrier Damage Dealt", dataType: "number" },
      { name: "Hero Damage Dealt", dataType: "number" },
      { name: "Healing Dealt", dataType: "number" },
      { name: "Healing Received", dataType: "number" },
      { name: "Self Healing", dataType: "number" },
      { name: "Damage Taken", dataType: "number" },
      { name: "Damage Blocked", dataType: "number" },
      { name: "Defensive Assists", dataType: "number" },
      { name: "Offensive Assists", dataType: "number" },
      { name: "Ultimates Earned", dataType: "number" },
      { name: "Ultimates Used", dataType: "number" },
      { name: "Multikill Best", dataType: "number" },
      { name: "Multikills", dataType: "number" },
      { name: "Solo Kills", dataType: "number" },
      { name: "Objective Kills", dataType: "number" },
      { name: "Environmental Kills", dataType: "number" },
      { name: "Environmental Deaths", dataType: "number" },
      { name: "Critical Hits", dataType: "number" },
      { name: "Critical Hit Accuracy", dataType: "number" },
      { name: "Scoped Accuracy", dataType: "number" },
      { name: "Scoped Critical Hit Accuracy", dataType: "number" },
      { name: "Scoped Critical Hit Kills", dataType: "number" },
      { name: "Shots Fired", dataType: "number" },
      { name: "Shots Hit", dataType: "number" },
      { name: "Shots Missed", dataType: "number" },
      { name: "Scoped Shots Fired", dataType: "number" },
      { name: "Scoped Shots Hit", dataType: "number" },
      { name: "Weapon Accuracy", dataType: "number" },
      { name: "Hero Time Played", dataType: "number" },
    ],
  },
};

export const getField = (fieldName: string, specName: string, data: DataRow) => {
  const spec = logSpec[specName];
  if (!spec) {
    throw new Error(`Spec not found for spec name: ${specName}`);
  }
  const fieldIndex = spec.fields.findIndex((field) => field.name === fieldName);
  if (fieldIndex === -1) {
    throw new Error(`Field not found for field name: ${fieldName}`);
  }
  return data[fieldIndex];
};

export const objectify = (data: DataRow, specName: string) => {
  const spec = logSpec[specName];
  if (!spec) {
    throw new Error(`Spec not found for spec name: ${specName}`);
  }
  const obj: Record<string, string | number | boolean> = {};
  spec.fields.forEach((field, index) => {
    const value = getField(field.name, specName, data);
    obj[field.name] = value;
  });
  return obj;
};
