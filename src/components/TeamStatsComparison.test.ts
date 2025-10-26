import { describe, expect, it } from "vitest";

import type { MatchData } from "@atoms";

import { buildTeamComparisonData } from "./TeamStatsComparison";

type TeamStatsRow = {
  playerTeam?: string | null;
} & Record<string, unknown>;

const baseMatch: Pick<MatchData, "team1Name" | "team2Name"> = {
  team1Name: "Alpha Squad",
  team2Name: "Bravo Unit",
};

const STAT_KEYS = ["finalBlows", "allDamageDealt"] as const;

describe("buildTeamComparisonData", () => {
  it("initializes all tracked stats to zero when no rows are provided", () => {
    const result = buildTeamComparisonData(baseMatch, undefined, STAT_KEYS);

    expect(result).toEqual({
      "Alpha Squad": {
        finalBlows: 0,
        allDamageDealt: 0,
      },
      "Bravo Unit": {
        finalBlows: 0,
        allDamageDealt: 0,
      },
    });
  });

  it("ignores rows that do not belong to either match team", () => {
    const rows: TeamStatsRow[] = [
      { playerTeam: "Alpha Squad", finalBlows: 12, allDamageDealt: 4300 },
      { playerTeam: "Charlie", finalBlows: 99, allDamageDealt: 9999 },
      { playerTeam: undefined, finalBlows: 3, allDamageDealt: 200 },
    ];

    const result = buildTeamComparisonData(baseMatch, rows, STAT_KEYS);

    expect(result).toEqual({
      "Alpha Squad": {
        finalBlows: 12,
        allDamageDealt: 4300,
      },
      "Bravo Unit": {
        finalBlows: 0,
        allDamageDealt: 0,
      },
    });
  });

  it("skips invalid stat values while preserving the latest valid reading", () => {
    const rows: TeamStatsRow[] = [
      { playerTeam: "Alpha Squad", finalBlows: 15, allDamageDealt: 5200 },
      { playerTeam: "Alpha Squad", finalBlows: "NaN", allDamageDealt: "6100" },
      { playerTeam: "Bravo Unit", finalBlows: null, allDamageDealt: "7000" },
    ];

    const result = buildTeamComparisonData(baseMatch, rows, STAT_KEYS);

    expect(result).toEqual({
      "Alpha Squad": {
        finalBlows: 15,
        allDamageDealt: 6100,
      },
      "Bravo Unit": {
        finalBlows: 0,
        allDamageDealt: 7000,
      },
    });
  });
});

