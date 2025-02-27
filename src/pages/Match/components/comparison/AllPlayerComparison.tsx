import { useState } from "react";
import { useAtomValue } from "jotai";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ZAxis,
  TooltipProps,
} from "recharts";
import {
  PlayerStatsNumericalKeys,
  matchDataAtom,
  playerStatsNumericalKeys,
  useStats,
} from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";
import { ScatterPointItem } from "recharts/types/cartesian/Scatter";

interface AllPlayerComparisonProps {
  matchId: string;
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

  const team1Data = playerStats.rows
    .filter((stats) => stats.playerTeam === matchData.team1Name)
    .map((player) => ({
      ...player,
      x: player[xStat],
      y: player[yStat],
      z: 10,
      team: matchData.team1Name,
    }));

  const team2Data = playerStats.rows
    .filter((stats) => stats.playerTeam === matchData.team2Name)
    .map((player) => ({
      ...player,
      x: player[xStat],
      y: player[yStat],
      z: 10,
      team: matchData.team2Name,
    }));

  const customTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">
            {data.playerName}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {camelCaseToWords(xStat)}: {prettyFormat(data.x)}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {camelCaseToWords(yStat)}: {prettyFormat(data.y)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Compare Players
        </h3>

        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 70, left: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={camelCaseToWords(xStat)}
                domain={["auto", "auto"]}
              >
                <Label
                  value={camelCaseToWords(xStat)}
                  position="bottom"
                  offset={20}
                  style={{ textAnchor: "middle", fill: "#666" }}
                />
              </XAxis>
              <YAxis type="number" dataKey="y" name={camelCaseToWords(yStat)}>
                <Label
                  value={camelCaseToWords(yStat)}
                  angle={-90}
                  position="left"
                  offset={-40}
                  style={{ textAnchor: "middle", fill: "#666" }}
                />
              </YAxis>
              <ZAxis range={[100, 100]} />
              <Tooltip content={customTooltip} />

              <Scatter
                name={matchData.team1Name}
                data={team1Data}
                fill="#1971c2"
                shape={(props: ScatterPointItem) => {
                  const { cx, cy, payload } = props;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={8} fill="#1971c2" />
                      <text
                        x={cx}
                        y={cy + 20}
                        textAnchor="middle"
                        fill="#666"
                        fontSize={12}
                      >
                        {payload.playerName}
                      </text>
                    </g>
                  );
                }}
              />

              <Scatter
                name={matchData.team2Name}
                data={team2Data}
                fill="#e03131"
                shape={(props: ScatterPointItem) => {
                  const { cx, cy, payload } = props;
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={8} fill="#e03131" />
                      <text
                        x={cx}
                        y={cy + 20}
                        textAnchor="middle"
                        fill="#666"
                        fontSize={12}
                      >
                        {payload.playerName}
                      </text>
                    </g>
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-4 mt-2">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              X Metric
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Y Metric
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
      </div>
    </div>
  );
};
