import React from "react";
import { useAtomValue } from "jotai";
import { matchDataAtom, useStats } from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";

interface TeamStatsComparisonProps {
  matchId: string;
}

export const TeamStatsComparison = ({ matchId }: TeamStatsComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  if (!matchData) {
    throw new Error("No match data");
  }

  const teamStats = useStats(["playerTeam"], { matchId: [matchId] });

  const statsToShow = [
    "finalBlows",
    "allDamageDealt",
    "healingDealt",
    "ultimatesUsed",
  ];

  // Get the team data in a structured format
  const getTeamData = () => {
    const result = {
      [matchData.team1Name]: {} as Record<string, number>,
      [matchData.team2Name]: {} as Record<string, number>,
    };

    for (const stat of statsToShow) {
      for (const teamStat of teamStats.rows) {
        const teamName = teamStat.playerTeam;
        result[teamName][stat] = teamStat[stat] || 0;
      }
    }

    return result;
  };

  const teamData = getTeamData();

  // Calculate which team has the higher value for each stat
  const getWinnerTeam = (stat: string) => {
    const team1Value = teamData[matchData.team1Name][stat] || 0;
    const team2Value = teamData[matchData.team2Name][stat] || 0;

    if (team1Value > team2Value) return matchData.team1Name;
    if (team2Value > team1Value) return matchData.team2Name;
    return null; // Tie
  };

  // Calculate percentage for visualization
  const getPercentage = (team: string, stat: string) => {
    const team1Value = teamData[matchData.team1Name][stat] || 0;
    const team2Value = teamData[matchData.team2Name][stat] || 0;
    const total = team1Value + team2Value;

    if (total === 0) return 50; // Equal if both are 0

    const value = teamData[team][stat] || 0;
    return Math.max(10, Math.min(90, (value / total) * 100)); // Constraining between 10% and 90% for visibility
  };

  return (
    <div className="grid grid-cols-7 gap-4 bg-white rounded-lg border border-gray-200 w-full max-w-[800px] p-2 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {/* Header row */}
      <div className="col-span-3 text-right">
        <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
          {matchData.team1Name}
        </span>
      </div>
      <div className="col-span-1"></div> {/* Center spacer */}
      <div className="col-span-3">
        <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
          {matchData.team2Name}
        </span>
      </div>
      {/* Stat rows */}
      {statsToShow.map((stat) => {
        const team1Value = teamData[matchData.team1Name][stat] || 0;
        const team2Value = teamData[matchData.team2Name][stat] || 0;
        const winner = getWinnerTeam(stat);
        const team1Percentage = getPercentage(matchData.team1Name, stat);
        const team2Percentage = getPercentage(matchData.team2Name, stat);

        return (
          <React.Fragment key={stat}>
            {/* Team 1 side */}
            <div className="col-span-3 flex flex-col items-end">
              <div className="flex items-center justify-end w-full mb-1">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mr-2">
                  {prettyFormat(team1Value)}
                </span>
                {winner === matchData.team1Name && (
                  <span className="text-xs px-1 py-0.5 bg-gray-600 text-white dark:bg-gray-200 dark:text-gray-800 rounded">
                    +{prettyFormat(team1Value - team2Value)}
                  </span>
                )}
              </div>
              <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-l-sm overflow-hidden relative">
                <div
                  className={`h-full ${
                    winner === matchData.team1Name
                      ? "bg-gray-600 dark:bg-gray-300"
                      : "bg-gray-400 dark:bg-gray-600"
                  } absolute right-0 top-0`}
                  style={{ width: `${team1Percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Center label */}
            <div className="col-span-1 flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center capitalize">
                {camelCaseToWords(stat)}
              </span>
            </div>

            {/* Team 2 side */}
            <div className="col-span-3 flex flex-col">
              <div className="flex items-center w-full mb-1">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 ml-2">
                  {prettyFormat(team2Value)}
                </span>
                {winner === matchData.team2Name && (
                  <span className="text-xs px-1 py-0.5 bg-gray-600 text-white dark:bg-gray-200 dark:text-gray-800 rounded ml-2">
                    +{prettyFormat(team2Value - team1Value)}
                  </span>
                )}
              </div>
              <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-r-sm overflow-hidden relative">
                <div
                  className={`h-full ${
                    winner === matchData.team2Name
                      ? "bg-gray-600 dark:bg-gray-300"
                      : "bg-gray-400 dark:bg-gray-600"
                  } absolute left-0 top-0`}
                  style={{ width: `${team2Percentage}%` }}
                ></div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
