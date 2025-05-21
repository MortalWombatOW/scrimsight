import { type ReactNode } from "react";
// Removed useStats import for overall stats, keep for hero stats for now
import { useStats } from "../../../atoms";
import { useAtomValue } from "jotai"; // Import useAtomValue
import { playerListSummaryAtom } from "../../../atoms/metrics/listSummaryAtoms"; // Import summary atom
import { PlayerCard } from "../../../components/Card/PlayerCard"; // Import PlayerCard
import { StatCard } from "../../../components/StatCard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Cell,
} from "recharts";
// Removed duplicate import: import { useAtomValue } from "jotai";
import { matchDataAtom } from "../../../atoms/matchDataAtom";
import { format } from "date-fns";
import { getRoleFromHero } from "../../../lib/hero";
import { useParams } from "react-router-dom";
import { prettyFormat } from "../../../lib/format"; // Import prettyFormat

// interface PlayerOverviewProps { // Remove prop interface
//   playerName: string;
// }

type PerformanceTrend = {
  date: string;
  kda: number;
  winRate: number;
  avgElims: number;
};

export const PlayerOverview = (): ReactNode => { // Remove props
  const { playerName } = useParams<{ playerName: string }>(); // Get playerName from URL params

  // Fetch player summaries and find the current player
  const playerSummaries = useAtomValue(playerListSummaryAtom);
  const playerSummary = playerSummaries.find(p => p.playerName === playerName);

   // Keep hero stats for hero chart for now
  const heroStats = useStats(["playerName", "playerHero"], {
    playerName: playerName ? [playerName] : [], // Pass playerName if available
  });
   // Keep matches for performance trend chart for now
  const matches = useAtomValue(matchDataAtom);


  if (!playerName) {
    return <div>Player name not found in URL.</div>;
  }
  if (!playerSummary) {
     return <div>Player summary data not found for {playerName}.</div>;
  }

   // Calculate KDA from summary
   const kda = playerSummary.deaths === 0
     ? prettyFormat(playerSummary.eliminations + playerSummary.assists)
     : prettyFormat((playerSummary.eliminations + playerSummary.assists) / playerSummary.deaths);

  // --- Keep existing calculations for charts/detailed stats ---
  // Calculate win rate from match data (still needed for trend chart)
   const playerMatches = matches.filter(
     (match) =>
       match.team1Players.includes(playerName) ||
       match.team2Players.includes(playerName)
   );
   // Calculate performance trends (keep function as is for now)
   const calculatePerformanceTrends = (matches: any[]): PerformanceTrend[] => {
    // Filter out any invalid matches first
    const validMatches = matches.filter(
      (match) =>
        match &&
        match.fileModified && // Ensure we have a valid timestamp
        typeof match.fileModified === "number"
    );

    // Group matches by date
    const matchesByDate = validMatches.reduce(
      (acc: Record<string, any[]>, match) => {
        try {
          const date = format(match.fileModified, "MMM d");
          if (!acc[date]) acc[date] = [];
          acc[date].push(match);
        } catch (error) {
          console.warn("Invalid date for match:", match);
        }
        return acc;
      },
      {}
    );

    // Calculate daily stats
    return Object.entries(matchesByDate)
      .map(([date, dailyMatches]) => {
        const stats = dailyMatches.reduce(
          (acc, match) => {
            const isTeam1 = match.team1Players.includes(playerName);
            const won =
              (isTeam1 && match.team1Score > match.team2Score) ||
              (!isTeam1 && match.team2Score > match.team1Score);

            return {
              wins: acc.wins + (won ? 1 : 0),
              total: acc.total + 1,
              elims:
                acc.elims +
                (match.playerStats?.[playerName]?.eliminations || 0),
              deaths:
                acc.deaths + (match.playerStats?.[playerName]?.deaths || 0),
            };
          },
          { wins: 0, total: 0, elims: 0, deaths: 0 }
        );

        return {
          date,
          kda: stats.deaths > 0 ? stats.elims / stats.deaths : stats.elims,
          winRate: (stats.wins / stats.total) * 100,
          avgElims: stats.elims / stats.total,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.date + " 2024").getTime();
        const dateB = new Date(b.date + " 2024").getTime();
        return dateA - dateB;
      });
  };

  // Prepare hero usage data for chart (keep as is)
  const heroUsageData = heroStats.rows
    .sort((a, b) => b.playtime - a.playtime)
    .slice(0, 10)
    .map((row) => ({
      hero: row.playerHero,
      playtime: Math.round(row.playtime / 60),
      role: getRoleFromHero(row.playerHero),
    }));

  // --- Detailed Stats Calculation (Keep for StatCards below) ---
  // Fetch detailed overall stats again using useStats for the lower sections
  // This isn't ideal, could be optimized later by passing data or using context
  const detailedOverallStats = useStats(["playerName"], { playerName: [playerName] });
  const detailedStats = detailedOverallStats.rows[0];

  const avgDamage = detailedStats?.heroDamageDealtPer10Minutes?.toFixed(0) ?? 'N/A';
  const avgHealing = detailedStats?.healingDealtPer10Minutes?.toFixed(0) ?? 'N/A';
  // Removed unused avgDeaths const avgDeaths = detailedStats?.deathsPer10Minutes?.toFixed(1) ?? 'N/A';
  // Removed unused avgElims const avgElims = detailedStats?.eliminationsPer10Minutes?.toFixed(1) ?? 'N/A';
  const weaponAccuracy = detailedStats?.weaponAccuracy ?? 0;
  const criticalHitRate = detailedStats?.criticalHitRate ?? 0;
  const totalPlaytime = detailedStats?.playtime ?? 0;


  // Custom tooltip styles (keep as is)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-base-200 p-3 rounded-lg">
          <div className="space-y-1">
            <p>
              KDA:{" "}
              {typeof payload[0]?.value === "number"
                ? payload[0].value.toFixed(2)
                : payload[0]?.value}
            </p>
            <p>
              Win Rate:{" "}
              {typeof payload[1]?.value === "number"
                ? payload[1].value.toFixed(1)
                : payload[1]?.value}
              %
            </p>
            <p>
              Avg Elims:{" "}
              {typeof payload[2]?.value === "number"
                ? payload[2].value.toFixed(1)
                : payload[2]?.value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
       {/* Player Card */}
       <PlayerCard
         playerName={playerSummary.playerName}
         teamNames={[playerSummary.teamName]}
         heroes={[playerSummary.topHero]}
         primaryStats={[
           { value: kda, label: "KDA" },
           { value: prettyFormat(playerSummary.eliminations), label: "Elims" },
         ]}
         secondaryStats={[
           { value: playerSummary.role, label: "Role" },
           { value: prettyFormat(playerSummary.deaths), label: "Deaths" },
           { value: prettyFormat(playerSummary.assists), label: "Assists" },
         ]}
         // Add linkUrl if needed
       />

      {/* Performance Metrics Grid (Keep Charts) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trends */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-base-content">
            Performance Trends
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={calculatePerformanceTrends(playerMatches)}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="date"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickLine={{ stroke: "currentColor" }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickLine={{ stroke: "currentColor" }}
                  label={{
                    value: "KDA & Eliminations",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "currentColor" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickLine={{ stroke: "currentColor" }}
                  label={{
                    value: "Win Rate %",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "currentColor" },
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const kdaValue = payload[0]?.value;
                      const winRateValue = payload[1]?.value;
                      const avgElimsValue = payload[2]?.value;

                      return (
                        <div className="bg-base-200 p-3 rounded-lg shadow-lg border border-gray-700 border-gray-700">
                          <p className="font-semibold">{label}</p>
                          <p className="text-sm">
                            KDA:{" "}
                            {typeof kdaValue === "number"
                              ? kdaValue.toFixed(2)
                              : kdaValue ?? "N/A"}
                          </p>
                          <p className="text-sm">
                            Win Rate:{" "}
                            {typeof winRateValue === "number"
                              ? winRateValue.toFixed(1) + "%"
                              : winRateValue ?? "N/A"}
                          </p>
                          <p className="text-sm">
                            Avg Elims:{" "}
                            {typeof avgElimsValue === "number"
                              ? avgElimsValue.toFixed(1)
                              : avgElimsValue ?? "N/A"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="kda"
                  stroke="hsl(var(--p))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="winRate"
                  stroke="hsl(var(--s))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgElims"
                  stroke="hsl(var(--a))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Played Heroes */}
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-base-content">
            Most Played Heroes
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={heroUsageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="hero"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickLine={{ stroke: "currentColor" }}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  tickLine={{ stroke: "currentColor" }}
                  label={{
                    value: "Minutes Played",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "currentColor" },
                  }}
                />
                <Tooltip content={CustomTooltip} />
                <Bar dataKey="playtime" className="fill-base-content">
                  {heroUsageData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--${index % 2 ? "s" : "p"}))`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Performance Stats */}
      <div className="bg-base-100 p-6 rounded-box">
        <h3 className="text-lg font-semibold mb-4 text-base-content">
          Performance Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Damage / 10min" value={avgDamage} />
          <StatCard title="Healing / 10min" value={avgHealing} />
          <StatCard
            title="Weapon Accuracy"
            value={`${(weaponAccuracy * 100).toFixed(1)}%`}
          />
          <StatCard
            title="Critical Hit Rate"
            value={`${(criticalHitRate * 100).toFixed(1)}%`}
          />
        </div>
      </div>

      {/* Match History Summary (Keep) */}
      <div className="bg-base-100 p-6 rounded-box">
        <h3 className="text-lg font-semibold mb-4 text-base-content">
          Match History Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Matches"
            value={playerMatches.length.toString()}
          />
          <StatCard
            title="Total Playtime"
            value={`${Math.round(totalPlaytime / 60)} min`}
          />
        </div>
      </div>
    </div>
  );
};
