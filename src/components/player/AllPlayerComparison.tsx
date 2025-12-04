import { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Label,
} from "recharts";
import { ColumnDef } from "@tanstack/react-table";
import { PlayerStatKey, STAT_CONFIG, getStatLabel, formatStat } from "@library";
import { useMatch } from "../../hooks/useMatch";
import { useStats } from "../../hooks/useStats";
import { DataTable } from "../table/DataTable";

interface AllPlayerComparisonProps {
  matchId: string;
}

interface PlayerDataPoint {
  playerName: string;
  x: number;
  y: number;
  z: number;
  team: string;
  [key: string]: string | number;
}

const chartStyle = {
  scatter: {
    fill: "var(--color-base-content)",
  },
};

export const AllPlayerComparison = ({ matchId }: AllPlayerComparisonProps) => {
  // All hooks must be called before any conditional returns
  const match = useMatch(matchId);
  const playerStats = useStats({ matchId });
  const [xStat, setXStat] = useState<PlayerStatKey>("finalBlows");
  const [yStat, setYStat] = useState<PlayerStatKey>("deaths");

  // Prepare data for both teams (conditional logic moved inside useMemo)
  const allPlayerData = useMemo(() => {
    if (!match) return [];
    
    const team1Data: PlayerDataPoint[] = playerStats
      .filter((stats) => stats.playerTeam === match.metadata.team1Name)
      .map((player) => {
        const playerRecord = player as Record<string, string | number>;
        return {
          ...player,
          x: (playerRecord[xStat] as number) || 0,
          y: (playerRecord[yStat] as number) || 0,
          z: 10,
          team: match.metadata.team1Name,
        };
      });

    const team2Data: PlayerDataPoint[] = playerStats
      .filter((stats) => stats.playerTeam === match.metadata.team2Name)
      .map((player) => {
        const playerRecord = player as Record<string, string | number>;
        return {
          ...player,
          x: (playerRecord[xStat] as number) || 0,
          y: (playerRecord[yStat] as number) || 0,
          z: 10,
          team: match.metadata.team2Name,
        };
      });

    return [...team1Data, ...team2Data];
  }, [playerStats, match, xStat, yStat]);

  const columns = useMemo<ColumnDef<PlayerDataPoint>[]>(
    () => [
      {
        accessorKey: "playerName",
        header: "Player",
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center">
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
        accessorKey: "team",
        header: "Team",
        cell: ({ row }) => (
          <div className="text-sm text-base-700 dark:text-base-300">
            {row.original.team}
          </div>
        ),
      },
      {
        accessorKey: "x",
        header: getStatLabel(xStat),
        cell: ({ getValue }) => (
          <div className="text-sm text-base-700 dark:text-base-300">
            {formatStat(xStat, getValue() as number)}
          </div>
        ),
      },
      {
        accessorKey: "y",
        header: getStatLabel(yStat),
        cell: ({ getValue }) => (
          <div className="text-sm text-base-700 dark:text-base-300">
            {formatStat(yStat, getValue() as number)}
          </div>
        ),
      },
    ],
    [xStat, yStat]
  );
  
  if (!match) {
    return null;
  }

  // Custom renderShape function for the scatter plot with annotations
  const renderShape = (props: unknown) => {
    const { cx, cy, payload } = props as { cx: number; cy: number; payload: PlayerDataPoint & { team1Name: string; team2Name: string } };

    // Format the x and y values nicely
    const xValue = formatStat(xStat, payload.x);
    const yValue = formatStat(yStat, payload.y);

    // Team colors based on the project's color scheme
    const team1Color = "#566fdd"; // From constants.scss 'team-1'
    const team2Color = "#c76756"; // From constants.scss 'team-2'
    const pointColor =
      payload.team === payload.team1Name ? team1Color : team2Color;

    // Calculate a unique position for each player's label based on their name
    // This creates a more deterministic layout that avoids random overlaps
    const nameHash = payload.playerName
      .split("")
      .reduce((acc: number, char: string) => {
        return acc + char.charCodeAt(0);
      }, 0);

    // Use the hash to determine a consistent angle for the label
    // This distributes labels in a radial pattern around the point
    // We use the player name hash to get a consistent angle, but we add some spacing
    // by dividing the circle into segments based on the total number of players
    const playerIndex = nameHash % 8; // Divide into 8 segments for better distribution
    const angle = playerIndex * 45 * (Math.PI / 180); // 45 degrees per segment (360/8)
    const distance = 50; // Distance from point to label

    // Calculate label position using the angle
    const labelX = cx + Math.cos(angle) * distance;
    const labelY = cy + Math.sin(angle) * distance;

    // No need for rectangle positioning since we removed the background

    return (
      <g>
        {/* Connect line from point to label - made more visible */}
        <line
          x1={cx}
          y1={cy}
          x2={labelX}
          y2={labelY}
          stroke={pointColor}
          strokeWidth={1.5}
          strokeDasharray="3,2"
          strokeOpacity={0.9}
        />

        {/* Player name annotation with text shadow for readability */}
        <text
          x={labelX}
          y={labelY - 10}
          textAnchor="middle"
          fill="white"
          fontSize={10}
          fontWeight="bold"
          style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.9)" }}
        >
          {payload.playerName}
        </text>

        {/* X and Y values in a single line with text shadow */}
        <text
          x={labelX}
          y={labelY + 8}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize={9}
          style={{ textShadow: "0px 0px 3px rgba(0,0,0,0.9)" }}
        >
          {getStatLabel(xStat)}: {xValue} | {getStatLabel(yStat)}:{" "}
          {yValue}
        </text>

        {/* Data point circle */}
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={pointColor}
          fillOpacity={0.2}
          stroke={pointColor}
          strokeWidth={2}
        />

        {/* Initial letter in the circle */}
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fill="white"
          fontSize={8}
          fontWeight="bold"
        >
          {payload.playerName.charAt(0)}
        </text>
      </g>
    );
  };

  // Tooltip removed as we now have permanent annotations for each data point

  return (
    <div className="bg-base rounded-lg border border-gray-700 border-gray-700 w-full p-6 shadow-sm dark:bg-base-800 dark:border-gray-700">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-base-800 dark:text-base-200 pb-2 border-b border-gray-700 dark:border-gray-700">
          Player Comparison
        </h2>

        {/* Controls moved to the top - UI Principle: User control and freedom */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-base-700 dark:text-base-300 mb-1">
              X Metric
            </label>
            <select
              className="w-full rounded-md border border-gray-700 border-gray-700 px-3 py-2 text-base-700 focus:outline-none focus:ring-1 focus:ring-base-500 dark:border-gray-700 dark:bg-base-700 dark:text-white"
              value={xStat}
              onChange={(e) =>
                setXStat(e.target.value as PlayerStatKey)
              }
            >
              {(Object.keys(STAT_CONFIG) as PlayerStatKey[]).map((key) => (
                <option key={key} value={key}>
                  {getStatLabel(key)}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-base-700 dark:text-base-300 mb-1">
              Y Metric
            </label>
            <select
              className="w-full rounded-md border border-gray-700 border-gray-700 px-3 py-2 text-base-700 focus:outline-none focus:ring-1 focus:ring-base-500 dark:border-gray-700 dark:bg-base-700 dark:text-white"
              value={yStat}
              onChange={(e) =>
                setYStat(e.target.value as PlayerStatKey)
              }
            >
              {(Object.keys(STAT_CONFIG) as PlayerStatKey[]).map((key) => (
                <option key={key} value={key}>
                  {getStatLabel(key)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scatter Plot - UI Principle: Visual consistency by using same shape for all points */}
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 60, right: 60, bottom: 60, left: 60 }}>
              <XAxis
                type="number"
                dataKey="x"
                name={getStatLabel(xStat)}
                domain={["auto", "auto"]}
                tick={{ fill: "#666" }}
              >
                <Label
                  value={getStatLabel(xStat)}
                  position="bottom"
                  offset={20}
                  style={{ textAnchor: "middle", fill: "#666", fontSize: 12 }}
                />
              </XAxis>
              <YAxis
                type="number"
                dataKey="y"
                name={getStatLabel(yStat)}
                tick={{ fill: "#666" }}
                width={45}
                tickFormatter={(value) => value.toString()}
              >
                <Label
                  value={getStatLabel(yStat)}
                  angle={-90}
                  position="insideLeft"
                  offset={-15}
                  style={{ textAnchor: "middle", fill: "#666", fontSize: 12 }}
                />
              </YAxis>
              {/* Tooltip removed as we now have permanent annotations */}

              <Scatter
                name={match.metadata.team1Name}
                data={allPlayerData.map((item) => ({
                  ...item,
                  team1Name: match.metadata.team1Name,
                  team2Name: match.metadata.team2Name,
                }))}
                style={chartStyle.scatter}
                shape={renderShape}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table - UI Principle: Complementary data representation */}
        <div className="overflow-x-auto border border-gray-700 rounded-lg border-gray-700 dark:border-gray-700">
          <DataTable
            data={allPlayerData}
            columns={columns}
            initialState={{
              sorting: [{ id: "playerName", desc: false }],
            }}
          />
        </div>
      </div>
    </div>
  );
};
