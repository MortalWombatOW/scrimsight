import { OverwatchHero, OverwatchRole } from "./lib/data/hero";

type OverwatchMap = string; // TODO: enum
type OverwatchMode = string; // TODO: enum

export interface Intent {
  playerName?: string[]; // A list of players. Unset means not caring about players.
  playerRole?: OverwatchRole[]; // A list of player roles. Unset means not caring about roles.
  matchId?: string[]; // A list of map IDs. Unset means not caring about maps.
  roundNumber?: (1 | 2 | 3)[]; // A list of round numbers. Unset means not caring about rounds. Only applies to modes that have rounds. Only used if matchId is set.
  mapName?: OverwatchMap[]; // A list of map names. Unset means not caring about maps.
  mode?: OverwatchMode[]; // A list of modes. Unset means not caring about modes.
  team?: string[]; // A list of teams, or "*" for any team. Unset means not caring about teams.
  hero?: OverwatchHero[]; // A list of heroes. Unset means not caring about heroes.
  metric?: string[]; // A list of metrics. Unset means not caring about metrics.
  time?: [number, number]; // A time range in seconds. Unset means not caring about times.
  date?: [string, string]; // A date range in YYYY-MM-DD format. Unset means not caring about dates.
}

function compareLists(list1: unknown[] | undefined, list2: unknown[] | undefined): {numComparisons: number, numMatches: number} {
  if (list1 === undefined) {
    return {numComparisons: 0, numMatches: 0};
  }
  if (list2 === undefined) {
    return {numComparisons: 1, numMatches: 0};
  }
  let numComparisons = 0;
  let numMatches = 0;
  for (const item of list1) {
    numComparisons++;
    if (list2.includes(item)) {
      numMatches++;
    }
  }
  return {numComparisons, numMatches};
}


export function intentSimilarity(intent1: Intent, intent2: Intent): number {
  let numComparisons = 1;
  let numMatches = 0;
  const playerNameComparison = compareLists(intent1.playerName, intent2.playerName);
  numComparisons += playerNameComparison.numComparisons;
  numMatches += playerNameComparison.numMatches;
  const playerRoleComparison = compareLists(intent1.playerRole, intent2.playerRole);
  numComparisons += playerRoleComparison.numComparisons;
  numMatches += playerRoleComparison.numMatches;
  const matchIdComparison = compareLists(intent1.matchId, intent2.matchId);
  numComparisons += matchIdComparison.numComparisons;
  numMatches += matchIdComparison.numMatches;
  const roundNumberComparison = compareLists(intent1.roundNumber, intent2.roundNumber);
  numComparisons += roundNumberComparison.numComparisons;
  numMatches += roundNumberComparison.numMatches;
  const mapNameComparison = compareLists(intent1.mapName, intent2.mapName);
  numComparisons += mapNameComparison.numComparisons;
  numMatches += mapNameComparison.numMatches;
  const modeComparison = compareLists(intent1.mode, intent2.mode);
  numComparisons += modeComparison.numComparisons;
  numMatches += modeComparison.numMatches;
  const teamComparison = compareLists(intent1.team, intent2.team);
  numComparisons += teamComparison.numComparisons;
  numMatches += teamComparison.numMatches;
  const heroComparison = compareLists(intent1.hero, intent2.hero);
  numComparisons += heroComparison.numComparisons;
  numMatches += heroComparison.numMatches;
  const metricComparison = compareLists(intent1.metric, intent2.metric);
  numComparisons += metricComparison.numComparisons;
  numMatches += metricComparison.numMatches;

  if (intent1.time && intent2.time) {
    numComparisons += 1;
    if (intent1.time[0] <= intent2.time[0] && intent1.time[1] >= intent2.time[1]) {
      numMatches += (intent2.time[1] - intent2.time[0]) / (intent1.time[1] - intent1.time[0]);
    }
  }

  if (intent1.date && intent2.date) {
    numComparisons += 1;
    const intent1DateStart = new Date(intent1.date[0]);
    const intent1DateEnd = new Date(intent1.date[1]);
    const intent2DateStart = new Date(intent2.date[0]);
    const intent2DateEnd = new Date(intent2.date[1]);
    if (intent1DateStart <= intent2DateStart && intent1DateEnd >= intent2DateEnd) {
      numMatches += (intent2DateEnd.getTime() - intent2DateStart.getTime()) / (intent1DateEnd.getTime() - intent1DateStart.getTime());
    }
  }

  console.log(`Comparing ${JSON.stringify(intent1)} and ${JSON.stringify(intent2)}`, numComparisons, numMatches);

  return numMatches / numComparisons;
}


export interface WidgetBid {
  id: string;
  displayName: string;
  description: string;
  gridColumnSpan: number | "last-line";
  gridRowSpan: number | "last-line";
  widget: React.ReactNode;
  scorePrior?: number;
  intent: Intent;
}

export type WidgetBidder = (intent: Intent) => WidgetBid[];
