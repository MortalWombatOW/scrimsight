import React from "react";
import { useAtomValue } from "jotai";
import { matchDataAtom, useStats } from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";
import { ProgressBar } from "../../../../components/ProgressBar";

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

  return (
    <div className="grid grid-cols-7 gap-4 bg-base-100 rounded-lg border border-gray-700 border-gray-700 w-full max-w-[800px] p-2 shadow-sm dark:bg-base-800 dark:border-gray-700">
      {/* Header row */}
      <div className="col-span-3 text-right">
        <span className="text-md font-semibold text-base-800 dark:text-base-200">
          {matchData.team1Name}
        </span>
      </div>
      <div className="col-span-1"></div> {/* Center spacer */}
      <div className="col-span-3">
        <span className="text-md font-semibold text-base-800 dark:text-base-200">
          {matchData.team2Name}
        </span>
      </div>
      {/* Stat rows */}
      {statsToShow.map((stat) => {
        const team1Value = teamData[matchData.team1Name][stat] || 0;
        const team2Value = teamData[matchData.team2Name][stat] || 0;
        const winner = getWinnerTeam(stat);

        return (
          <React.Fragment key={stat}>
            {/* Team 1 side */}
            <div className="col-span-3 flex flex-col items-end">
              <div className="flex items-center justify-end w-full mb-1">
                <span className="text-sm font-medium text-base-800 dark:text-base-200 mr-2">
                  {prettyFormat(team1Value)}
                </span>
                {winner === matchData.team1Name && (
                  <span className="text-xs px-1 py-0.5 bg-base-600 text-white dark:bg-base-200 dark:text-base-800 rounded">
                    +{prettyFormat(team1Value - team2Value)}
                  </span>
                )}
              </div>
              <ProgressBar
                value={team1Value}
                maxValue={team1Value + team2Value}
                className="rounded-l-sm"
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
                {winner === matchData.team2Name && (
                  <span className="text-xs px-1 py-0.5 bg-base-600 text-white dark:bg-base-200 dark:text-base-800 rounded ml-2">
                    +{prettyFormat(team2Value - team1Value)}
                  </span>
                )}
              </div>
              <ProgressBar
                value={team2Value}
                maxValue={team1Value + team2Value}
                className="rounded-r-sm"
                reverse={true}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
