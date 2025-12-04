import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table/DataTable";
import { OverwatchRole, getHeroImage } from "@library";
import { useStatsWithDerived } from "../hooks/useStats";
import { RoleIcon } from "@icons";
import { prettyFormat } from "@library";

export const PlayersHeroes = () => {
  const [selectedRole, setSelectedRole] = useState<OverwatchRole | "all">(
    "all"
  );

  const heroStats = useStatsWithDerived(
    selectedRole !== "all" ? { role: selectedRole } : undefined
  );

  // Group heroes by role and calculate aggregate stats
  const heroData = heroStats
    .map((row) => ({
      hero: row.playerHero,
      role: row.playerRole as OverwatchRole,
      playtime: Math.round(row.playtime / 60),
      elimsPerLife:
        row.deaths > 0 ? row.eliminations / row.deaths : row.eliminations,
      damagePerMin: row.heroDamageDealtPer10Minutes / 10,
      healingPerMin: row.healingDealtPer10Minutes / 10,
      accuracy: row.weaponAccuracy * 100,
    }))
    .sort((a, b) => b.playtime - a.playtime);

  const roleGroups = heroData.reduce((acc, hero) => {
    if (!acc[hero.role]) {
      acc[hero.role] = [];
    }
    acc[hero.role].push(hero);
    return acc;
  }, {} as Record<OverwatchRole, typeof heroData>);

  const columns = useMemo<ColumnDef<typeof heroData[0]>[]>(
    () => [
      {
        accessorKey: "hero",
        header: "Hero",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <img
              src={getHeroImage(row.original.hero)}
              alt={row.original.hero}
              className="w-8 h-8 rounded-full"
            />
            {row.original.hero}
          </div>
        ),
      },
      {
        accessorKey: "playtime",
        header: "Playtime",
        cell: ({ getValue }) => `${getValue()} min`,
      },
      {
        accessorKey: "elimsPerLife",
        header: "Elims/Life",
        cell: ({ getValue }) => prettyFormat(getValue() as number),
      },
      {
        accessorKey: "damagePerMin",
        header: "Damage/min",
        cell: ({ getValue }) => prettyFormat(getValue() as number),
      },
      {
        accessorKey: "healingPerMin",
        header: "Healing/min",
        cell: ({ getValue }) => prettyFormat(getValue() as number),
      },
      {
        accessorKey: "accuracy",
        header: "Accuracy",
        cell: ({ getValue }) => `${prettyFormat(getValue() as number)}%`,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Role Filter */}
      <div className="bg-base-200 p-4 rounded-box">
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
      </div>

      {/* Hero Stats by Role */}
      {(selectedRole === "all"
        ? ["tank", "damage", "support"]
        : [selectedRole]
      ).map(
        (role) =>
          roleGroups[role as OverwatchRole] && (
            <div key={role} className="bg-base-200 p-6 rounded-box">
              <div className="flex items-center gap-2 mb-4">
                <RoleIcon role={role} />
                <h2 className="text-xl font-bold capitalize">{role}</h2>
              </div>

              <div className="overflow-x-auto">
                <DataTable
                  data={roleGroups[role as OverwatchRole]}
                  columns={columns}
                  initialState={{
                    sorting: [{ id: "playtime", desc: true }],
                  }}
                />
              </div>
            </div>
          )
      )}
    </div>
  );
};
