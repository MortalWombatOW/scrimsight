import { useState } from "react";
import { useStats } from "~/atoms";
import { OverwatchRole, getHeroImage } from "~/lib/hero";
import RoleIcon from "~/components/Common/RoleIcon";
import { prettyFormat } from "~/lib/format";

export const PlayersHeroes = () => {
  const [selectedRole, setSelectedRole] = useState<OverwatchRole | "all">(
    "all"
  );

  const heroStats = useStats(
    ["playerHero", "playerRole"],
    selectedRole !== "all" ? { playerRole: [selectedRole] } : undefined
  );

  // Group heroes by role and calculate aggregate stats
  const heroData = heroStats.rows
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
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Hero</th>
                      <th>Playtime</th>
                      <th>Elims/Life</th>
                      <th>Damage/min</th>
                      <th>Healing/min</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleGroups[role as OverwatchRole].map((hero) => (
                      <tr key={hero.hero}>
                        <td className="flex items-center gap-2">
                          <img
                            src={getHeroImage(hero.hero)}
                            alt={hero.hero}
                            className="w-8 h-8 rounded-full"
                          />
                          {hero.hero}
                        </td>
                        <td>{hero.playtime} min</td>
                        <td>{prettyFormat(hero.elimsPerLife)}</td>
                        <td>{prettyFormat(hero.damagePerMin)}</td>
                        <td>{prettyFormat(hero.healingPerMin)}</td>
                        <td>{prettyFormat(hero.accuracy)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
      )}
    </div>
  );
};
