import { useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PlayerStatsNumericalKeys,
  matchDataAtom,
  playerStatsNumericalKeys,
  useStats,
} from "@atoms";
import { camelCaseToWords, prettyFormat } from "@lib";

interface SingleStatPlayerComparisonProps {
  matchId: string;
}

const chartStyle = {
  bar: {
    fill: "var(--color-base-content)",
  },
  background: {
    fill: "var(--color-base-200)",
  },
};

export const SingleStatPlayerComparison = ({
  matchId,
}: SingleStatPlayerComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  const playerStats = useStats(["playerName", "playerTeam"], {
    matchId: [matchId],
  });
  const [stat, setStat] = useState<PlayerStatsNumericalKeys>("finalBlows");
  const [sortBy, setSortBy] = useState<string>(stat);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  if (!matchData) {
    return null;
  }

  // Process team data with useMemo for performance
  const { team1Data, team2Data, allPlayerData } = useMemo(() => {
    const team1 = playerStats.rows
      .filter((stats) => stats.playerTeam === matchData.team1Name)
      .map((player) => ({
        ...player,
        [stat]: player[stat] || 0, // Ensure the stat value is properly mapped
        value: player[stat] || 0, // Unified key for charts
      }));

    const team2 = playerStats.rows
      .filter((stats) => stats.playerTeam === matchData.team2Name)
      .map((player) => ({
        ...player,
        [stat]: player[stat] || 0, // Ensure the stat value is properly mapped
        value: player[stat] || 0, // Unified key for charts
      }));

    // Combine data for the table
    const all = [...team1, ...team2];

    return {
      team1Data: team1,
      team2Data: team2,
      allPlayerData: all,
    };
  }, [playerStats.rows, matchData, stat]);

  // Sort data for the table
  const sortedData = useMemo(() => {
    return [...allPlayerData].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle numeric vs string sorting
      const comparison =
        typeof aValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [allPlayerData, sortBy, sortDirection]);

  // Function to handle column sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc"); // Default to descending for metrics
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-base p-3 border border-gray-700 border-gray-700 rounded shadow-md dark:bg-base-800 dark:border-gray-700">
          <p className="font-semibold text-base-800 dark:text-base-200 mb-1">
            {data.playerName}
          </p>
          <p className="text-sm text-base-600 dark:text-base-400">
            Team: {data.playerTeam}
          </p>
          <p className="text-sm text-base-600 dark:text-base-400">
            {camelCaseToWords(stat)}: {prettyFormat(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-base rounded-lg border border-gray-700 border-gray-700 w-full p-6 shadow-sm dark:bg-base-800 dark:border-gray-700">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-gray-700 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-base-900 dark:text-white">
            Player Metric Comparison
          </h3>

          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-base-700 dark:text-base-300 mb-1">
              Select Metric
            </label>
            <select
              className="w-full rounded-md border border-gray-700 border-gray-700 px-3 py-2 text-base-700 focus:outline-none focus:ring-1 focus:ring-base-500 dark:border-gray-700 dark:bg-base-700 dark:text-white"
              value={stat}
              onChange={(e) => {
                const newStat = e.target.value as PlayerStatsNumericalKeys;
                setStat(newStat);
                setSortBy(newStat);
              }}
            >
              {playerStatsNumericalKeys.map((key) => (
                <option key={key} value={key}>
                  {camelCaseToWords(key)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart visualization - cleaner, with more space and better margins */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Team 1 */}
          <div className="flex-1">
            <h4 className="text-lg font-medium text-base-800 dark:text-base-200 mb-4 flex items-center">
              {matchData.team1Name}
            </h4>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...team1Data].sort((a, b) => b.value - a.value)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 25, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: "#666" }}
                    tickLine={{ stroke: "#666" }}
                    axisLine={{ stroke: "#666" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="playerName"
                    width={100}
                    tick={{ fill: "#666" }}
                    tickLine={{ stroke: "#666" }}
                    axisLine={{ stroke: "#666" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Bar
                    dataKey="value"
                    style={chartStyle.bar}
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: "right",
                      formatter: (value: number) => prettyFormat(value),
                      fill: "var(--color-base-content)",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex-1">
            <h4 className="text-lg font-medium text-base-800 dark:text-base-200 mb-4 flex items-center">
              {matchData.team2Name}
            </h4>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...team2Data].sort((a, b) => b.value - a.value)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 25, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: "#666" }}
                    tickLine={{ stroke: "#666" }}
                    axisLine={{ stroke: "#666" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="playerName"
                    width={100}
                    tick={{ fill: "#666" }}
                    tickLine={{ stroke: "#666" }}
                    axisLine={{ stroke: "#666" }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Bar
                    dataKey="value"
                    style={chartStyle.bar}
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: "right",
                      formatter: (value: number) => prettyFormat(value),
                      fill: "var(--color-base-content)",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="overflow-x-auto border border-gray-700 rounded-lg border-gray-700 dark:border-gray-700">
            <table className="min-w-full divide-y divide-base-200 dark:divide-base-700">
              <thead className="bg-base-50 dark:bg-base-700">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-base-500 uppercase tracking-wider dark:text-base-300 cursor-pointer"
                    onClick={() => handleSort("playerName")}
                  >
                    <div className="flex items-center">
                      Player
                      {sortBy === "playerName" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-base-500 uppercase tracking-wider dark:text-base-300 cursor-pointer"
                    onClick={() => handleSort("playerTeam")}
                  >
                    <div className="flex items-center">
                      Team
                      {sortBy === "playerTeam" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-base-500 uppercase tracking-wider dark:text-base-300 cursor-pointer"
                    onClick={() => handleSort(stat)}
                  >
                    <div className="flex items-center justify-end">
                      {camelCaseToWords(stat)}
                      {sortBy === stat && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base divide-y divide-base-200 dark:bg-base-800 dark:divide-base-700">
                {sortedData.map((player, index) => (
                  <tr
                    key={player.playerName}
                    className={
                      index % 2 === 0
                        ? "bg-base dark:bg-base-800"
                        : "bg-base-50 dark:bg-base-750"
                    }
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 ${
                              player.playerTeam === matchData.team1Name
                                ? "border-gray-700 dark:border-gray-700"
                                : "border-gray-700 dark:border-base-500"
                            } flex items-center justify-center`}
                          >
                            <span className="text-xs font-medium">
                              {player.playerName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-base-800 dark:text-base-200">
                            {player.playerName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm text-base-700 dark:text-base-300">
                        {player.playerTeam}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-base-700 dark:text-base-300 text-right">
                      <span className="font-medium">
                        {prettyFormat(player[stat])}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
