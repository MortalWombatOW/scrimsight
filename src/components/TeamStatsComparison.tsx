import React from "react";
import { useAtomValue } from "jotai";
import { matchData, type MatchData } from "@atoms";
import { useStats } from "@library";
import { camelCaseToWords, prettyFormat } from "@library";
import { ProgressBar } from "@components";

interface TeamStatsComparisonProps {
  matchId: string;
}

type TeamStatsRow = {
  playerTeam?: string | null;
} & Record<string, unknown>;

const STAT_KEYS = [
  "finalBlows",
  "allDamageDealt",
  "healingDealt",
  "ultimatesUsed",
] as const;

type StatKey = (typeof STAT_KEYS)[number];

const parseStatValue = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const buildTeamComparisonData = (
  match: Pick<MatchData, "team1Name" | "team2Name">,
  rows: TeamStatsRow[] | undefined,
  stats: readonly string[]
) => {
  const teams = [match.team1Name, match.team2Name];
  const result: Record<string, Record<string, number>> = {};

  for (const team of teams) {
    result[team] = {};
    for (const stat of stats) {
      result[team][stat] = 0;
    }
  }

  if (!rows?.length) {
    return result;
  }

  for (const row of rows) {
    if (!row) {
      continue;
    }

    const teamName = row.playerTeam ?? undefined;

    if (!teamName || !(teamName in result)) {
      continue;
    }

    const target = result[teamName];

    for (const stat of stats) {
      const statValue = parseStatValue((row as Record<string, unknown>)[stat]);

      if (statValue !== null) {
        target[stat] = statValue;
      }
    }
  }

  return result;
};

export const TeamStatsComparison = ({ matchId }: TeamStatsComparisonProps) => {
  const matchDataValue = useAtomValue(matchData.atom);
  const matchDataItem = matchDataValue.find(
    (match) => match.matchId === matchId
  );
  if (!matchDataItem) {
    throw new Error("No match data");
  }

  const teamStats = useStats(["playerTeam"]);

  const teamData = buildTeamComparisonData(
    matchDataItem,
    (teamStats?.rows as TeamStatsRow[] | undefined) ?? [],
    STAT_KEYS
  );

  // Calculate which team has the higher value for each stat
  const getWinnerTeam = (stat: StatKey) => {
    const team1Value = teamData[matchDataItem.team1Name][stat] || 0;
    const team2Value = teamData[matchDataItem.team2Name][stat] || 0;

    if (team1Value > team2Value) return matchDataItem.team1Name;
    if (team2Value > team1Value) return matchDataItem.team2Name;
    return null; // Tie
  };

  return (
    <div className="grid grid-cols-7 gap-4 rounded-lg border border-gray-700 border-gray-700 w-full max-w-[800px] p-2 shadow-sm">
      {/* Header row */}
      <div className="col-span-3 text-right">
        <span className="text-md font-semibold text-base-800 dark:text-base-200">
          {matchDataItem.team1Name}
        </span>
      </div>
      <div className="col-span-1"></div> {/* Center spacer */}
      <div className="col-span-3">
        <span className="text-md font-semibold text-base-800 dark:text-base-200">
          {matchDataItem.team2Name}
        </span>
      </div>
      {/* Stat rows */}
      {STAT_KEYS.map((stat) => {
        const team1Value = teamData[matchDataItem.team1Name][stat] || 0;
        const team2Value = teamData[matchDataItem.team2Name][stat] || 0;
        const winner = getWinnerTeam(stat);
        return (
          <React.Fragment key={stat}>
            {/* Team 1 side */}
            <div className="col-span-3 flex flex-col items-end">
              <div className="flex items-center justify-end w-full mb-1">
                <span className="text-sm font-medium text-base-800 dark:text-base-200 mr-2">
                  {prettyFormat(team1Value)}
                </span>
                {winner === matchDataItem.team1Name && (
                  <span className="text-xs px-1 py-0.5 bg-base-600 text-white dark:bg-base-200 dark:text-base-800 rounded">
                    +{prettyFormat(team1Value - team2Value)}
                  </span>
                )}
              </div>
              <ProgressBar
                value={team1Value}
                maxValue={team1Value + team2Value}
                className="rounded-l-sm border border-gray-700"
                reverse
              />
            </div>

            {/* Center label */}
            <div className="col-span-1 flex items-center justify-center">
              <span className="text-xs text-base-500 dark:text-base-400 text-center capitalize">
                {camelCaseToWords(stat)}
              </span>
            </div>

            {/* Team 2 side */}
            <div className="col-span-3 flex flex-col">
              <div className="flex items-center w-full mb-1">
                <span className="text-sm font-medium text-base-800 dark:text-base-200 ml-2">
                  {prettyFormat(team2Value)}
                </span>
                {winner === matchDataItem.team2Name && (
                  <span className="text-xs px-1 py-0.5 bg-base-600 text-white dark:bg-base-200 dark:text-base-800 rounded ml-2">
                    +{prettyFormat(team2Value - team1Value)}
                  </span>
                )}
              </div>
              <ProgressBar
                value={team2Value}
                maxValue={team1Value + team2Value}
                className="rounded-r-sm border border-gray-700"
                reverse={false}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
