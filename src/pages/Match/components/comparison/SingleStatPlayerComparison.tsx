import { useState } from "react";
import { useAtomValue } from "jotai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PlayerStatsNumericalKeys,
  matchDataAtom,
  playerStatsNumericalKeys,
  useStats,
} from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";

interface SingleStatPlayerComparisonProps {
  matchId: string;
}

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

  if (!matchData) {
    return null;
  }

  const team1Data = playerStats.rows
    .filter((stats) => stats.playerTeam === matchData.team1Name)
    .sort((a, b) => b[stat] - a[stat])
    .map((player) => ({
      ...player,
      [stat]: player[stat], // Ensure the stat value is properly mapped
    }));

  const team2Data = playerStats.rows
    .filter((stats) => stats.playerTeam === matchData.team2Name)
    .sort((a, b) => b[stat] - a[stat])
    .map((player) => ({
      ...player,
      [stat]: player[stat], // Ensure the stat value is properly mapped
    }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Compare Metric
        </h3>

        <div className="w-full">
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={stat}
            onChange={(e) =>
              setStat(e.target.value as PlayerStatsNumericalKeys)
            }
          >
            {playerStatsNumericalKeys.map((key) => (
              <option key={key} value={key}>
                {camelCaseToWords(key)}
              </option>
            ))}
          </select>
        </div>

        <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {matchData.team1Name}
        </h4>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={team1Data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="playerName" width={120} />
              <Tooltip formatter={(value: number) => prettyFormat(value)} />
              <Bar
                dataKey={stat}
                fill="#4F46E5"
                radius={[0, 5, 5, 0]}
                label={{
                  position: "right",
                  formatter: (value: number) => prettyFormat(value),
                  fill: "white",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {matchData.team2Name}
        </h4>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={team2Data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="playerName" width={120} />
              <Tooltip formatter={(value: number) => prettyFormat(value)} />
              <Bar
                dataKey={stat}
                fill="#E11D48"
                radius={[0, 5, 5, 0]}
                label={{
                  position: "right",
                  formatter: (value: number) => prettyFormat(value),
                  fill: "white",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
