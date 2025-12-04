import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../table/DataTable";
import { OverwatchRole, PlayerStatKey, formatStat } from "@library";
import { RoleIcon } from "@icons";
import { useStatsWithDerived } from "../../hooks/useStats";

type StatCategory = "damage" | "healing" | "utility";

export const PlayersPerformance = () => {
  const [selectedRole, setSelectedRole] = useState<OverwatchRole | "all">(
    "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<StatCategory>(
    "damage"
  );

  const allStats = useStatsWithDerived(
    selectedRole !== "all" ? { role: selectedRole } : undefined
  );

  // Aggregate stats by player
  const playerStats = useMemo(() => {
    const playerMap = new Map();

    for (const stat of allStats) {
      const existing = playerMap.get(stat.playerName);
      if (!existing) {
        playerMap.set(stat.playerName, { ...stat });
      } else {
        // Sum numerical values
        existing.playtime += stat.playtime;
        existing.eliminations += stat.eliminations;
        existing.finalBlows += stat.finalBlows;
        existing.deaths += stat.deaths;
        existing.heroDamageDealt += stat.heroDamageDealt;
        existing.healingDealt += stat.healingDealt;
        existing.healingReceived += stat.healingReceived;
        existing.defensiveAssists += stat.defensiveAssists;
        existing.offensiveAssists += stat.offensiveAssists;
        existing.damageBlocked += stat.damageBlocked;
        existing.ultimatesEarned += stat.ultimatesEarned;
        existing.ultimatesUsed += stat.ultimatesUsed;
      }
    }

    // Recalculate per-10-minute stats
    return Array.from(playerMap.values()).map(player => ({
      ...player,
      eliminationsPer10Minutes: player.playtime > 0 ? (player.eliminations / player.playtime) * 600 : 0,
      finalBlowsPer10Minutes: player.playtime > 0 ? (player.finalBlows / player.playtime) * 600 : 0,
      deathsPer10Minutes: player.playtime > 0 ? (player.deaths / player.playtime) * 600 : 0,
      heroDamageDealtPer10Minutes: player.playtime > 0 ? (player.heroDamageDealt / player.playtime) * 600 : 0,
      healingDealtPer10Minutes: player.playtime > 0 ? (player.healingDealt / player.playtime) * 600 : 0,
      healingReceivedPer10Minutes: player.playtime > 0 ? (player.healingReceived / player.playtime) * 600 : 0,
      defensiveAssistsPer10Minutes: player.playtime > 0 ? (player.defensiveAssists / player.playtime) * 600 : 0,
      offensiveAssistsPer10Minutes: player.playtime > 0 ? (player.offensiveAssists / player.playtime) * 600 : 0,
      damageBlockedPer10Minutes: player.playtime > 0 ? (player.damageBlocked / player.playtime) * 600 : 0,
      ultimatesEarnedPer10Minutes: player.playtime > 0 ? (player.ultimatesEarned / player.playtime) * 600 : 0,
      ultimatesUsedPer10Minutes: player.playtime > 0 ? (player.ultimatesUsed / player.playtime) * 600 : 0,
    }));
  }, [allStats]);

  const getMetricsByCategory = (category: StatCategory): { key: PlayerStatKey; label: string }[] => {
    switch (category) {
      case "damage":
        return [
          { key: "heroDamageDealtPer10Minutes", label: "Hero Damage/10min" },
          { key: "eliminationsPer10Minutes", label: "Eliminations/10min" },
          { key: "finalBlowsPer10Minutes", label: "Final Blows/10min" },
          { key: "deathsPer10Minutes", label: "Deaths/10min" },
        ];
      case "healing":
        return [
          { key: "healingDealtPer10Minutes", label: "Healing/10min" },
          {
            key: "healingReceivedPer10Minutes",
            label: "Healing Received/10min",
          },
          {
            key: "defensiveAssistsPer10Minutes",
            label: "Defensive Assists/10min",
          },
        ];
      case "utility":
        return [
          { key: "damageBlockedPer10Minutes", label: "Damage Blocked/10min" },
          {
            key: "ultimatesEarnedPer10Minutes",
            label: "Ultimates Earned/10min",
          },
          { key: "ultimatesUsedPer10Minutes", label: "Ultimates Used/10min" },
        ];
    }
  };

  const currentMetrics = getMetricsByCategory(selectedCategory);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "playerName",
        header: "Player",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.playerName}</div>
        ),
      },
      {
        accessorKey: "playerRole",
        header: "Role",
        cell: ({ row }) => <RoleIcon role={row.original.playerRole} />,
      },
    ];

    const metricColumns: ColumnDef<any>[] = currentMetrics.map((metric) => ({
      accessorKey: metric.key,
      header: metric.label,
      cell: ({ getValue }) => formatStat(metric.key, getValue() as number),
    }));

    return [...baseColumns, ...metricColumns];
  }, [currentMetrics]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 bg-base-200 p-4 rounded-box">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Role:</span>
          <div className="join">
            <button
              className={`join-item btn btn-sm ${
                selectedRole === "all" ? "btn-active" : ""
              }`}
              onClick={() => setSelectedRole("all")}
            >
              All
            </button>
            {["tank", "damage", "support"].map((role) => (
              <button
                key={role}
                className={`join-item btn btn-sm ${
                  selectedRole === role ? "btn-active" : ""
                }`}
                onClick={() => setSelectedRole(role as OverwatchRole)}
              >
                <RoleIcon role={role} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Category:</span>
          <div className="join">
            {["damage", "healing", "utility"].map((category) => (
              <button
                key={category}
                className={`join-item btn btn-sm ${
                  selectedCategory === category ? "btn-active" : ""
                }`}
                onClick={() => setSelectedCategory(category as StatCategory)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div className="overflow-x-auto">
        <DataTable
          data={playerStats}
          columns={columns}
          initialState={{
            sorting: [{ id: "playerName", desc: false }],
          }}
        />
      </div>
    </div>
  );
};
