import React from "react";
import { useAtomValue } from "jotai";
import { matchData } from "@atoms";
import { useStats } from "@library";
import { PlayerStatKey, getStatLabel, formatStat } from "@library";
import { ProgressBar } from "@components";

interface TeamStatsComparisonProps {
  matchId: string;
}

export const TeamStatsComparison = ({ matchId }: TeamStatsComparisonProps) => {
  const matchDataValue = useAtomValue(matchData.atom);
  const matchDataItem = matchDataValue.find(
    (match) => match.matchId === matchId
  );
  if (!matchDataItem) {
    throw new Error("No match data");
  }

  const teamStats = useStats(["playerTeam"]);

  const statsToShow: PlayerStatKey[] = [
    "finalBlows",
    "allDamageDealt",
    "healingDealt",
    "ultimatesUsed",
  ];

  // Get the team data in a structured format
  const getTeamData = () => {
    const result = {
      [matchDataItem.team1Name]: {} as Record<string, number>,
      [matchDataItem.team2Name]: {} as Record<string, number>,
    };

    for (const stat of statsToShow) {
      for (const teamStat of teamStats.rows) {
        const teamName = teamStat.playerTeam;
        if (result[teamName]) {
          result[teamName][stat] = (teamStat as any)[stat] || 0;
        }
      }
    }

    return result;
  };

  const teamData = getTeamData();

  // Calculate which team has the higher value for each stat
  const getWinnerTeam = (stat: PlayerStatKey) => {
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
      {statsToShow.map((stat) => {
        const team1Value = teamData[matchDataItem.team1Name][stat] || 0;
        const team2Value = teamData[matchDataItem.team2Name][stat] || 0;
        const winner = getWinnerTeam(stat);
        return (
          <React.Fragment key={stat}>
            {/* Team 1 side */}
            <div className="col-span-3 flex flex-col items-end">
              <div className="flex items-center justify-end w-full mb-1">
                <span className="text-sm font-medium text-base-800 dark:text-base-200 mr-2">
                  {formatStat(stat, team1Value)}
                </span>
                {winner === matchDataItem.team1Name && (
                  <span className="text-xs px-1 py-0.5 bg-base-600 text-white dark:bg-base-200 dark:text-base-800 rounded">
                    +{formatStat(stat, team1Value - team2Value)}
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
                {getStatLabel(stat)}
              </span>
            </div>

            {/* Team 2 side */}
            <div className="col-span-3 flex flex-col">
              <div className="flex items-center w-full mb-1">
                <span className="text-sm font-medium text-base-800 dark:text-base-200 ml-2">
                  {formatStat(stat, team2Value)}
                </span>
                {winner === matchDataItem.team2Name && (
                  <span className="text-xs px-1 py-0.5 bg-base-600 text-white dark:bg-base-200 dark:text-base-800 rounded ml-2">
                    +{formatStat(stat, team2Value - team1Value)}
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
