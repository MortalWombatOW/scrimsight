import { useAtomValue } from "jotai";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TeamStats } from "../../../atoms/teamStatsAtom";
import { useStats } from "../../../atoms/metrics/playerMetricsAtoms";
import { teamMapTypeStatsAtom } from "../../../atoms/derived_stats/teamMapTypeStatsAtom"; // Corrected import path
import { prettyFormat } from "../../../lib/format";

interface TeamOverviewProps {
  teamStats: TeamStats; // Keep teamStats for teamName primarily
}

// Define colors for the Pie Chart
const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export const TeamOverview = ({ teamStats }: TeamOverviewProps) => {
  // Get aggregated stats for the team using useStats
  const aggregatedStats = useStats(["playerTeam"], {
    playerTeam: [teamStats.teamName],
  });
  // Get map type stats by passing teamName to the atomFamily
  const mapTypeStats = useAtomValue(teamMapTypeStatsAtom(teamStats.teamName));

  // Calculate stats per 10 minutes
  const teamTotals = aggregatedStats.rows[0];
  const totalPlaytimeSeconds = teamTotals?.playtime || 0;
  const playtimeFactor =
    totalPlaytimeSeconds > 0 ? totalPlaytimeSeconds / 600 : 1; // Avoid division by zero

  const statsPer10Min = {
    damage: (teamTotals?.allDamageDealt || 0) / playtimeFactor,
    healing: (teamTotals?.healingDealt || 0) / playtimeFactor,
    eliminations: (teamTotals?.eliminations || 0) / playtimeFactor,
    ultimates: (teamTotals?.ultimatesUsed || 0) / playtimeFactor,
  };

  // Prepare data for Bar Chart
  const barChartData = [
    { name: "Damage/10", value: statsPer10Min.damage, fill: "#ef4444" }, // error color
    { name: "Healing/10", value: statsPer10Min.healing, fill: "#22c55e" }, // success color
    { name: "Elims/10", value: statsPer10Min.eliminations, fill: "#f59e0b" }, // warning color
    { name: "Ults Used/10", value: statsPer10Min.ultimates, fill: "#3b82f6" }, // info color
  ];

  // Prepare data for Pie Chart (handling potential empty/unimplemented atom)
  const pieChartData = Object.entries(mapTypeStats || {})
    .map(([mapType, stats], index) => ({
      name: mapType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: (stats as any)?.winRate || 0, // Use winRate, default to 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gamesPlayed: (stats as any)?.gamesPlayed || 0,
      fill: PIE_COLORS[index % PIE_COLORS.length],
    }))
    .filter((entry) => entry.gamesPlayed > 0); // Only show map types played

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Team Performance Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart Section */}
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-center">
            Average Stats per 10 Minutes
          </h3>
          {totalPlaytimeSeconds > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => prettyFormat(value)} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center p-10">No playtime data available.</div>
          )}
        </div>

        {/* Pie Chart Section */}
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-center">
            Win Rate by Map Type
          </h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center p-10">
              Map type win rate data not available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
