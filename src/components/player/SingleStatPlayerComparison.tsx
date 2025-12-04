import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../table/DataTable";
import {
  PlayerStatKey,
  STAT_CONFIG,
  getStatLabel,
  formatStat,
} from "@library";
import { useMatch } from "../../hooks/useMatch";
import { useStatsWithDerived } from "../../hooks/useStats";

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
  const match = useMatch(matchId);
  const matchDataItem = match?.metadata;
  const playerStats = useStatsWithDerived({ matchId });
  const [stat, setStat] = useState<PlayerStatKey>("finalBlows");

  // Process team data with useMemo for performance - moved before conditional return
  const { team1Data, team2Data, allPlayerData } = useMemo(() => {
    if (!matchDataItem) {
      return { team1Data: [], team2Data: [], allPlayerData: [] };
    }
    const team1 = playerStats
      .filter((stats) => stats.playerTeam === matchDataItem.team1Name)
      .map((player) => ({
        ...player,
        [stat]: player[stat] || 0, // Ensure the stat value is properly mapped
        value: player[stat] || 0, // Unified key for charts
      }));

    const team2 = playerStats
      .filter((stats) => stats.playerTeam === matchDataItem.team2Name)
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
  }, [playerStats, matchDataItem, stat]);

  const columns = useMemo<ColumnDef<typeof allPlayerData[0]>[]>(
    () => [
      {
        accessorKey: "playerName",
        header: "Player",
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  row.original.playerTeam === matchDataItem?.team1Name
                    ? "border-gray-700 dark:border-gray-700"
                    : "border-gray-700 dark:border-base-500"
                } flex items-center justify-center`}
              >
                <span className="text-xs font-medium">
                  {row.original.playerName.charAt(0)}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-base-800 dark:text-base-200">
                {row.original.playerName}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "playerTeam",
        header: "Team",
        cell: ({ row }) => (
          <div className="text-sm text-base-700 dark:text-base-300">
            {row.original.playerTeam}
          </div>
        ),
      },
      {
        accessorKey: stat,
        header: () => <div className="text-right">{getStatLabel(stat)}</div>,
        cell: ({ getValue }) => (
          <div className="text-sm text-base-700 dark:text-base-300 text-right font-medium">
            {formatStat(stat, getValue() as number)}
          </div>
        ),
      },
    ],
    [stat, matchDataItem]
  );

  if (!matchDataItem) {
    return null;
  }



  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { playerName: string; playerTeam: string; value: number } }> }) => {
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
            {getStatLabel(stat)}: {formatStat(stat, data.value)}
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
                const newStat = e.target.value as PlayerStatKey;
                setStat(newStat);
                setStat(newStat);
              }}
            >
              {(Object.keys(STAT_CONFIG) as PlayerStatKey[]).map((key) => (
                <option key={key} value={key}>
                  {getStatLabel(key)}
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
              {matchDataItem.team1Name}
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
                      formatter: (value: number) => formatStat(stat, value),
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
              {matchDataItem.team2Name}
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
                      formatter: (value: number) => formatStat(stat, value),
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
            <DataTable
              data={allPlayerData}
              columns={columns}
              initialState={{
                sorting: [{ id: stat, desc: true }],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
