import { type ReactNode } from "react";
import { useStatsWithDerived } from "../../hooks/useStats";
import {
  usePlayerSummary,
  usePlayerPerformanceTrends,
  usePlayerHeroStats,
} from "../../hooks/usePlayerMetrics";
import { PlayerCard, StatCard } from "@components";
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
import { getRoleFromHero, formatStat } from "@library";
import { useParams } from "react-router-dom";

export const PlayerOverview = (): ReactNode => {
  const { playerName } = useParams<{ playerName: string }>();

  // Use custom hooks for data aggregation
  const playerSummary = usePlayerSummary(playerName);
  const performanceTrends = usePlayerPerformanceTrends(playerName);

  // Hero stats for the hero usage chart
  const heroStats = usePlayerHeroStats(playerName);

  // Detailed stats for the performance breakdown
  const detailedOverallStats = useStatsWithDerived({ playerName: playerName || undefined });

  if (!playerName) {
    return <div>Player name not found in URL.</div>;
  }
  if (!playerSummary) {
    return <div>Player summary data not found for {playerName}.</div>;
  }

  // Prepare hero usage data for chart (keep as is)
  const heroUsageData = heroStats
    .sort((a, b) => b.playtime - a.playtime)
    .slice(0, 10)
    .map((row) => ({
      hero: row.playerHero,
      playtime: Math.round(row.playtime / 60),
      role: getRoleFromHero(row.playerHero),
    }));

  // --- Detailed Stats Calculation (Keep for StatCards below) ---
  // Use the stats we already fetched at the top to avoid conditional hook call
  const detailedStats = detailedOverallStats[0];

  const avgDamage = detailedStats?.heroDamageDealtPer10Minutes?.toFixed(0) ?? 'N/A';
  const avgHealing = detailedStats?.healingDealtPer10Minutes?.toFixed(0) ?? 'N/A';
  // Removed unused avgDeaths const avgDeaths = detailedStats?.deathsPer10Minutes?.toFixed(1) ?? 'N/A';
  // Removed unused avgElims const avgElims = detailedStats?.eliminationsPer10Minutes?.toFixed(1) ?? 'N/A';
  const weaponAccuracy = detailedStats?.weaponAccuracy ?? 0;
  const criticalHitRate = detailedStats?.criticalHitRate ?? 0;
  const totalPlaytime = detailedStats?.playtime ?? 0;


  // Custom tooltip styles (keep as is)
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: unknown }) => {
    const payloadArray = payload as Array<{ value: number | string }> | undefined;
    if (active && payloadArray && payloadArray.length) {
      return (
        <div className="custom-tooltip bg-base-200 p-3 rounded-lg">
          <div className="space-y-1">
            <p>
              KDA:{" "}
              {typeof payloadArray[0]?.value === "number"
                ? payloadArray[0].value.toFixed(2)
                : payloadArray[0]?.value}
            </p>
            <p>
              Win Rate:{" "}
              {typeof payloadArray[1]?.value === "number"
                ? payloadArray[1].value.toFixed(1)
                : payloadArray[1]?.value}
              %
            </p>
            <p>
              Avg Elims:{" "}
              {typeof payloadArray[2]?.value === "number"
                ? payloadArray[2].value.toFixed(1)
                : payloadArray[2]?.value}
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
          { value: playerSummary.kda, label: "KDA" },
          { value: formatStat('eliminations', playerSummary.eliminations), label: "Elims" },
        ]}
        secondaryStats={[
          { value: playerSummary.role, label: "Role" },
          { value: formatStat('deaths', playerSummary.deaths), label: "Deaths" },
          { value: formatStat('offensiveAssists', playerSummary.assists), label: "Assists" },
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
                data={performanceTrends}
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
            title="Days Played"
            value={performanceTrends.length.toString()}
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
