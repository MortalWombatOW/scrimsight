import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
// Removed useStats import
import { teamListSummaryAtom } from "~/atoms/metrics/listSummaryAtoms"; // Import summary atom
import { TeamCard } from "~/components/Card/TeamCard";
// Removed unused: import { StatCard } from "../../../components/StatCard";
import { teamMapTypeStatsAtom } from "~/atoms/derived_stats/teamMapTypeStatsAtom";
import { formatPercentage } from "~/lib/format"; // Removed unused prettyFormat
import { ErrorMessage } from "~/components/Common/ErrorMessage";

export const TeamOverview = () => {
  const { teamId } = useParams<{ teamId: string }>();

  // Fetch all team summaries
  const teamSummaries = useAtomValue(teamListSummaryAtom);
  // Get map type stats by passing teamId to the atomFamily
  const mapTypeStats = useAtomValue(teamMapTypeStatsAtom(teamId || "")); // Pass empty string if teamId is undefined

  if (!teamId) {
    return <ErrorMessage message="Team ID not found in URL." />;
  }

  // Find the specific team's summary
  const teamSummary = teamSummaries.find((t) => t.teamName === teamId);

  if (!teamSummary) {
    return <ErrorMessage message={`Team data not found for ${teamId}.`} />;
  }

  // TODO: Re-evaluate if these stats are still needed or can be derived differently
  // For now, keep the chart data calculation
  const mapWinRateData = Object.entries(mapTypeStats || {})
    .map(([mapType, stats]) => ({
      name: mapType,
      // Multiply win rate by 100 for chart display
      value: stats.winRate * 100,
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
      {/* Display Team Card at the top */}
      <TeamCard
        teamName={teamSummary.teamName}
        playerNames={[`${teamSummary.playerCount} Players`]} // Show count
        primaryStats={[
          { value: formatPercentage(teamSummary.winRate), label: "Win Rate" },
        ]}
        secondaryStats={[
          { value: teamSummary.gamesPlayed.toString(), label: "Games Played" },
          { value: teamSummary.playerCount.toString(), label: "Players" },
        ]}
        // No link needed if already on the page
      />

      {/* Keep existing charts/stats below */}
      <h2 className="text-2xl font-semibold">Detailed Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {" "}
        {/* Changed to 1 column for now */}
        {/* Removed Average Stats per 10 min card as data isn't readily available in summary */}
        {/* <div className="bg-base-200 p-4 rounded-lg shadow"> ... </div> */}
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
