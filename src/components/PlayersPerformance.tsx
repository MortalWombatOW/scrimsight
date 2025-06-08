import { useState } from "react";
import { useStats } from "@library";
import { OverwatchRole } from "@library";
import { RoleIcon } from "@icons";
import { prettyFormat } from "@library";

type StatCategory = "damage" | "healing" | "utility";

export const PlayersPerformance = () => {
  const [selectedRole, setSelectedRole] = useState<OverwatchRole | "all">(
    "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<StatCategory>(
    "damage"
  );

  const stats = useStats(
    ["playerName", "playerRole"],
    selectedRole !== "all" ? { playerRole: [selectedRole] } : undefined
  );

  const getMetricsByCategory = (category: StatCategory) => {
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
        <table className="table w-full">
          <thead>
            <tr>
              <th>Player</th>
              <th>Role</th>
              {currentMetrics.map((metric) => (
                <th key={metric.key}>{metric.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.rows.map((player) => (
              <tr key={player.playerName}>
                <td>{player.playerName}</td>
                <td>
                  <RoleIcon role={player.playerRole} />
                </td>
                {currentMetrics.map((metric) => (
                  <td key={metric.key}>
                    {prettyFormat(player[metric.key as keyof typeof player])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
