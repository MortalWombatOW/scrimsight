import { useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { TeamCard } from "@components";
import { formatPercentage } from "@library";
import { ErrorMessage } from "@components";
import { useMatches } from "../../hooks/useRepository";

export const TeamOverview = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const matches = useMatches();

  // Compute team summary from matches
  const teamSummary = useMemo(() => {
    if (!teamId) return null;

    const teamMap = new Map<string, { wins: number; losses: number; draws: number; playerCount: number }>();

    for (const match of matches) {
      const { team1Name, team2Name, winner, team1Players, team2Players } = match.metadata;

      if (!teamMap.has(team1Name)) {
        teamMap.set(team1Name, { wins: 0, losses: 0, draws: 0, playerCount: team1Players.length });
      }
      if (!teamMap.has(team2Name)) {
        teamMap.set(team2Name, { wins: 0, losses: 0, draws: 0, playerCount: team2Players.length });
      }

      const team1Data = teamMap.get(team1Name)!;
      const team2Data = teamMap.get(team2Name)!;

      if (winner === team1Name) {
        team1Data.wins++;
        team2Data.losses++;
      } else if (winner === team2Name) {
        team2Data.wins++;
        team1Data.losses++;
      } else {
        team1Data.draws++;
        team2Data.draws++;
      }
    }

    const data = teamMap.get(teamId);
    if (!data) return null;

    return {
      teamName: teamId,
      playerCount: data.playerCount,
      winRate: data.wins / (data.wins + data.losses + data.draws),
      gamesPlayed: data.wins + data.losses + data.draws,
    };
  }, [teamId, matches]);

  // Compute map type stats
  const mapTypeStats = useMemo(() => {
    if (!teamId) return {};

    const mapStats: Record<string, { wins: number; total: number }> = {};

    for (const match of matches) {
      const { team1Name, team2Name, winner, mode } = match.metadata;

      if (team1Name === teamId || team2Name === teamId) {
        if (!mapStats[mode]) {
          mapStats[mode] = { wins: 0, total: 0 };
        }
        mapStats[mode].total++;
        if (winner === teamId) {
          mapStats[mode].wins++;
        }
      }
    }

    return Object.fromEntries(
      Object.entries(mapStats).map(([mode, stats]) => [
        mode,
        { winRate: stats.wins / stats.total, gamesPlayed: stats.total },
      ])
    );
  }, [teamId, matches]);

  if (!teamId) {
    return <ErrorMessage message="Team ID not found in URL." />;
  }

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
  const renderCustomBarLabel = ({ x, y, width, value }: { x: number; y: number; width: number; value: number }) => {
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
