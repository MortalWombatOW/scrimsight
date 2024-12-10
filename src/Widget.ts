import { OverwatchHero, OverwatchRole } from "./lib/data/hero";

type OverwatchMap = string; // TODO: enum
type OverwatchMode = string; // TODO: enum

export interface Intent {
  playerName?: string[]; // A list of players. Unset means not caring about players.
  playerRole?: OverwatchRole[]; // A list of player roles. Unset means not caring about roles.
  mapId?: string[]; // A list of map IDs. Unset means not caring about maps.
  roundNumber?: (1 | 2 | 3)[]; // A list of round numbers. Unset means not caring about rounds. Only applies to modes that have rounds. Only used if mapId is set.
  mapName?: OverwatchMap[]; // A list of map names. Unset means not caring about maps.
  mode?: OverwatchMode[]; // A list of modes. Unset means not caring about modes.
  team?: string[]; // A list of teams, or "*" for any team. Unset means not caring about teams.
  hero?: OverwatchHero[]; // A list of heroes. Unset means not caring about heroes.
  metric?: string[]; // A list of metrics. Unset means not caring about metrics.
  time?: [number, number]; // A time range in seconds. Unset means not caring about times.
  date?: [string, string]; // A date range in YYYY-MM-DD format. Unset means not caring about dates.
}

export type WidgetBidder = (intent: Intent) => React.ReactNode[];