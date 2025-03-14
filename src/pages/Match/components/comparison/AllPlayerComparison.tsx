import { useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  PlayerStatsNumericalKeys,
  matchDataAtom,
  playerStatsNumericalKeys,
  useStats,
} from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";

interface AllPlayerComparisonProps {
  matchId: string;
}

interface PlayerDataPoint {
  playerName: string;
  x: number;
  y: number;
  z: number;
  team: string;
  [key: string]: any;
}

export const AllPlayerComparison = ({ matchId }: AllPlayerComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  if (!matchData) {
    return null;
  }
  const playerStats = useStats(["playerName", "playerTeam"], {
    matchId: [matchId],
  });

  const [xStat, setXStat] = useState<PlayerStatsNumericalKeys>("finalBlows");
  const [yStat, setYStat] = useState<PlayerStatsNumericalKeys>("deaths");
  const [sortBy, setSortBy] = useState<string>("playerName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Prepare data for both teams
  const allPlayerData = useMemo(() => {
    const team1Data: PlayerDataPoint[] = playerStats.rows
      .filter((stats) => stats.playerTeam === matchData.team1Name)
      .map((player) => ({
        ...player,
        x: player[xStat] || 0,
        y: player[yStat] || 0,
        z: 10,
        team: matchData.team1Name,
      }));

    const team2Data: PlayerDataPoint[] = playerStats.rows
      .filter((stats) => stats.playerTeam === matchData.team2Name)
      .map((player) => ({
        ...player,
        x: player[xStat] || 0,
        y: player[yStat] || 0,
        z: 10,
        team: matchData.team2Name,
      }));

    return [...team1Data, ...team2Data];
  }, [playerStats.rows, matchData, xStat, yStat]);

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

  // Custom renderShape function for the scatter plot - now all circles with same style
  const renderShape = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="none"
          stroke="#666"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fill="#666"
          fontSize={8}
          fontWeight="bold"
        >
          {payload.playerName.charAt(0)}
        </text>
      </g>
    );
  };

  // Custom tooltip component that works with ReCharts typing
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-base-200 rounded shadow-md dark:bg-base-800 dark:border-base-700">
          <p className="font-semibold text-base-800 dark:text-base-200 mb-1">
            {data.playerName}
          </p>
          <p className="text-sm text-base-600 dark:text-base-400">
            Team: {data.team}
          </p>
          <p className="text-sm text-base-600 dark:text-base-400">
            {camelCaseToWords(xStat)}: {prettyFormat(data.x)}
          </p>
          <p className="text-sm text-base-600 dark:text-base-400">
            {camelCaseToWords(yStat)}: {prettyFormat(data.y)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Function to handle column sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-base-200 w-full p-6 shadow-sm dark:bg-base-800 dark:border-base-700">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-base-800 dark:text-base-200 pb-2 border-b border-base-200 dark:border-base-700">
          Player Comparison
        </h2>

        {/* Controls moved to the top - UI Principle: User control and freedom */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-base-700 dark:text-base-300 mb-1">
              X Metric
            </label>
            <select
              className="w-full rounded-md border border-base-300 px-3 py-2 text-base-700 focus:outline-none focus:ring-1 focus:ring-base-500 dark:border-base-600 dark:bg-base-700 dark:text-white"
              value={xStat}
              onChange={(e) =>
                setXStat(e.target.value as PlayerStatsNumericalKeys)
              }
            >
              {playerStatsNumericalKeys.map((key) => (
                <option key={key} value={key}>
                  {camelCaseToWords(key)}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-base-700 dark:text-base-300 mb-1">
              Y Metric
            </label>
            <select
              className="w-full rounded-md border border-base-300 px-3 py-2 text-base-700 focus:outline-none focus:ring-1 focus:ring-base-500 dark:border-base-600 dark:bg-base-700 dark:text-white"
              value={yStat}
              onChange={(e) =>
                setYStat(e.target.value as PlayerStatsNumericalKeys)
              }
            >
              {playerStatsNumericalKeys.map((key) => (
                <option key={key} value={key}>
                  {camelCaseToWords(key)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scatter Plot - UI Principle: Visual consistency by using same shape for all points */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 70, left: 40 }}>
              <XAxis
                type="number"
                dataKey="x"
                name={camelCaseToWords(xStat)}
                domain={["auto", "auto"]}
                tick={{ fill: "#666" }}
              >
                <Label
                  value={camelCaseToWords(xStat)}
                  position="bottom"
                  offset={20}
                  style={{ textAnchor: "middle", fill: "#666", fontSize: 12 }}
                />
              </XAxis>
              <YAxis
                type="number"
                dataKey="y"
                name={camelCaseToWords(yStat)}
                tick={{ fill: "#666" }}
                width={45}
                tickFormatter={(value) => value.toString()}
              >
                <Label
                  value={camelCaseToWords(yStat)}
                  angle={-90}
                  position="insideLeft"
                  offset={-15}
                  style={{ textAnchor: "middle", fill: "#666", fontSize: 12 }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} cursor={false} />

              <Scatter
                name={matchData.team1Name}
                data={allPlayerData}
                shape={renderShape}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table - UI Principle: Complementary data representation */}
        <div className="overflow-x-auto border rounded-lg border-base-200 dark:border-base-700">
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
                  onClick={() => handleSort("team")}
                >
                  <div className="flex items-center">
                    Team
                    {sortBy === "team" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-base-500 uppercase tracking-wider dark:text-base-300 cursor-pointer"
                  onClick={() => handleSort("x")}
                >
                  <div className="flex items-center">
                    {camelCaseToWords(xStat)}
                    {sortBy === "x" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-base-500 uppercase tracking-wider dark:text-base-300 cursor-pointer"
                  onClick={() => handleSort("y")}
                >
                  <div className="flex items-center">
                    {camelCaseToWords(yStat)}
                    {sortBy === "y" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-base-200 dark:bg-base-800 dark:divide-base-700">
              {sortedData.map((player, index) => (
                <tr
                  key={player.playerName}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-base-800"
                      : "bg-base-50 dark:bg-base-750"
                  }
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full border-2 border-base-600 flex items-center justify-center">
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-base-700 dark:text-base-300">
                      {player.team}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-base-700 dark:text-base-300">
                    {prettyFormat(player.x)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-base-700 dark:text-base-300">
                    {prettyFormat(player.y)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
