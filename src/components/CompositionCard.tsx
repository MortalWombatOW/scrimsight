import {
  getHeroImage,
  getRoleFromHero,
  getRankForRole,
  OverwatchRole,
} from "../lib/hero";
import { formatDuration } from "../lib/format";
import RoleIcon from "./Common/RoleIcon";

interface CompositionCardProps {
  heroes: string[];
  timePlayed: number;
}

export const CompositionCard = ({
  heroes,
  timePlayed,
}: CompositionCardProps) => (
  <div className="w-[300px] m-1 border rounded-md shadow-sm">
    <div className="p-4">
      <div className="space-y-3">
        <div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(
              heroes.reduce((acc, hero) => {
                const role = getRoleFromHero(hero);
                acc[role] = [...(acc[role] || []), hero].sort();
                return acc;
              }, {} as Record<OverwatchRole, string[]>)
            )
              .sort(
                ([a], [b]) =>
                  getRankForRole(a as OverwatchRole) -
                  getRankForRole(b as OverwatchRole)
              )
              .map(([role, roleHeroes]) => (
                <div key={role} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <div className="text-base">
                      <RoleIcon role={role} color="primary" />
                    </div>
                    <span className="text-xs text-base-500">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {roleHeroes.map((hero) => (
                      <img
                        key={hero}
                        src={getHeroImage(hero)}
                        className="w-8 h-8 rounded-full"
                        alt={hero}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-base-500">
            Play time: {formatDuration(timePlayed)}
          </p>
        </div>
      </div>
    </div>
  </div>
);
