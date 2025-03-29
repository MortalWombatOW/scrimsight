import { useAtomValue } from "jotai";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { TeamStats } from "../../../atoms/teamStatsAtom";
import { useStats } from "../../../atoms/metrics/playerMetricsAtoms";
import { StatCard } from "../../../components/StatCard"; // Import StatCard
import { teamMapTypeStatsAtom } from "../../../atoms/derived_stats/teamMapTypeStatsAtom"; // Corrected import path
import { prettyFormat } from "../../../lib/format";

interface TeamOverviewProps {
  teamStats: TeamStats; // Keep teamStats for teamName primarily
}

export const TeamOverview = ({ teamStats }: TeamOverviewProps) => {
  // Get aggregated stats for the team using useStats
  const aggregatedStats = useStats(["playerTeam"], {
    playerTeam: [teamStats.teamName],
  });
  // Get map type stats by passing teamName to the atomFamily
  const mapTypeStats = useAtomValue(teamMapTypeStatsAtom(teamStats.teamName));

  const teamTotals = aggregatedStats.rows[0];
  const totalPlaytimeSeconds = teamTotals?.playtime || 0; // Keep for conditional rendering check

  // Use derived stats directly from teamTotals
  const statCardData = [
    { name: "Damage/10", value: teamTotals?.allDamageDealtPer10Minutes ?? 0 },
    { name: "Healing/10", value: teamTotals?.healingDealtPer10Minutes ?? 0 },
    { name: "Elims/10", value: teamTotals?.eliminationsPer10Minutes ?? 0 },
    { name: "Ults Used/10", value: teamTotals?.ultimatesUsedPer10Minutes ?? 0 },
  ];

  const mapWinRateData = Object.entries(mapTypeStats || {})
    .map(([mapType, stats], index) => ({
      name: mapType,
      value: stats.winRate,
      gamesPlayed: stats.gamesPlayed,
      fill: "#8884d8",
    }))
    .filter((entry) => entry.gamesPlayed > 0); // Only show map types played

  // Custom label for Bar chart to show percentage
  const renderCustomBarLabel = ({ x, y, width, value }: any) => {
    return (
      <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>
        {`${value.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Team Performance Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">
            Average Stats per 10 Minutes
          </h3>
          {totalPlaytimeSeconds > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCardData.map((
                stat // Use statCardData here
              ) => (
                <StatCard
                  key={stat.name}
                  title={stat.name}
                  value={prettyFormat(stat.value)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-10">No playtime data available.</div>
          )}
        </div>

        <div className="bg-base-200 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Win Rate by Map Type</h3>
          {mapWinRateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mapWinRateData}
                margin={{ top: 20, right: 5, left: 5, bottom: 5 }} // Increased top margin for labels
              >
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  label={renderCustomBarLabel}
                />
              </BarChart>
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
