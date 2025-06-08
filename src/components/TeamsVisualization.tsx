import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TeamStats } from "@atoms";

interface TeamsVisualizationProps {
  teams: TeamStats[];
}

export const TeamsVisualization = ({ teams }: TeamsVisualizationProps) => {
  // Create data for wins distribution
  const winCounts = teams.reduce((acc, team) => {
    const wins = team.wins;
    acc[wins] = (acc[wins] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const data = Object.entries(winCounts)
    .map(([wins, count]) => ({
      wins: Number(wins),
      teams: count,
    }))
    .sort((a, b) => a.wins - b.wins);

  return (
    <div className="rounded-lg bg-base p-4 shadow-md mb-6 dark:bg-base-800">
      <h2 className="text-xl font-semibold mb-3 text-base-900 dark:text-white">
        Team Wins Distribution
      </h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="wins"
              label={{
                value: "Number of Wins",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Number of Teams",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value: number, _name: string) => [value, "Teams"]}
              labelFormatter={(label: number) => `${label} Wins`}
            />
            <Bar dataKey="teams" fill="#8884d8" name="Teams" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
