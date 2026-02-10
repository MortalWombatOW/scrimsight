import React, { useMemo } from "react";
import { PlayerStatKey, getStatLabel, formatStat } from "@library";
import { ProgressBar } from "../ui/ProgressBar";
import { useMatch } from "../../hooks/useMatch";
import { PlayerStatsBase } from "../../types";

interface TeamStatsComparisonProps {
  matchId: string;
}

// Stats to display in the comparison
const STATS_TO_SHOW: PlayerStatKey[] = [
  "finalBlows",
  "allDamageDealt",
  "healingDealt",
  "ultimatesUsed",
];

export const TeamStatsComparison = ({ matchId }: TeamStatsComparisonProps) => {
  const match = useMatch(matchId);

  // Compute team data from match player stats - MUST be before early return
  const teamData = useMemo(() => {
    if (!match) {
      return null;
    }
    const matchDataItem = match.metadata;
    const result: Record<string, Record<string, number>> = {
      [matchDataItem.team1Name]: {},
      [matchDataItem.team2Name]: {},
    };

    // Initialize all stats to 0
    for (const stat of STATS_TO_SHOW) {
      result[matchDataItem.team1Name][stat] = 0;
      result[matchDataItem.team2Name][stat] = 0;
    }

    // Aggregate stats from player stats
    for (const playerStat of match.playerStats.rows) {
      const teamName = playerStat.playerTeam;
      if (result[teamName]) {
        for (const stat of STATS_TO_SHOW) {
          result[teamName][stat] += (playerStat[stat as keyof PlayerStatsBase] as number) || 0;
        }
      }
    }

    return result;
  }, [match]);

  // Early return after all hooks
  if (!match || !teamData) {
    return <div className="text-center p-4">Match not found.</div>;
  }

  const matchDataItem = match.metadata;

  // Calculate which team has the higher value for each stat
  const getWinnerTeam = (stat: PlayerStatKey) => {
    const team1Value = teamData[matchDataItem.team1Name][stat] || 0;
    const team2Value = teamData[matchDataItem.team2Name][stat] || 0;

    if (team1Value > team2Value) return matchDataItem.team1Name;
    if (team2Value > team1Value) return matchDataItem.team2Name;
    return null; // Tie
  };

  return (
    <div className="grid grid-cols-7 gap-4 rounded-lg border border-base-content/10 w-full max-w-[800px] p-2 shadow-sm">
      {/* Header row */}
      <div className="col-span-3 text-right">
        <span className="text-md font-semibold text-base-content">
          {matchDataItem.team1Name}
        </span>
      </div>
      <div className="col-span-1"></div> {/* Center spacer */}
      <div className="col-span-3">
        <span className="text-md font-semibold text-base-content">
          {matchDataItem.team2Name}
        </span>
      </div>
      {/* Stat rows */}
      {STATS_TO_SHOW.map((stat) => {
        const team1Value = teamData[matchDataItem.team1Name][stat] || 0;
        const team2Value = teamData[matchDataItem.team2Name][stat] || 0;
        const winner = getWinnerTeam(stat);
        return (
          <React.Fragment key={stat}>
            {/* Team 1 side */}
            <div className="col-span-3 flex flex-col items-end">
              <div className="flex items-center justify-end w-full mb-1">
                <span className="text-sm font-medium text-base-content mr-2">
                  {formatStat(stat, team1Value)}
                </span>
                {winner === matchDataItem.team1Name && (
                  <span className="text-xs px-1 py-0.5 bg-primary/20 text-primary rounded">
                    +{formatStat(stat, team1Value - team2Value)}
                  </span>
                )}
              </div>
              <ProgressBar
                value={team1Value}
                maxValue={team1Value + team2Value}
                className="rounded-l-sm border border-base-content/10"
                reverse
              />
            </div>

            {/* Center label */}
            <div className="col-span-1 flex items-center justify-center">
              <span className="text-xs text-base-content/50 text-center capitalize">
                {getStatLabel(stat)}
              </span>
            </div>

            {/* Team 2 side */}
            <div className="col-span-3 flex flex-col">
              <div className="flex items-center w-full mb-1">
                <span className="text-sm font-medium text-base-content ml-2">
                  {formatStat(stat, team2Value)}
                </span>
                {winner === matchDataItem.team2Name && (
                  <span className="text-xs px-1 py-0.5 bg-primary/20 text-primary rounded ml-2">
                    +{formatStat(stat, team2Value - team1Value)}
                  </span>
                )}
              </div>
              <ProgressBar
                value={team2Value}
                maxValue={team1Value + team2Value}
                className="rounded-r-sm border border-base-content/10"
                reverse={false}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
