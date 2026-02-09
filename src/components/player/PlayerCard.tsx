import { DataCard } from "@components";
import { getHeroImage } from "@library";
import { RoleIcon } from "@icons";
import { MdOutlinePersonOutline } from "react-icons/md";

interface PlayerCardProps {
  playerName: string;
  teamNames: string[];
  heroes: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  linkUrl?: string;
  linkText?: string;
}

export const PlayerCard = ({
  playerName,
  primaryStats,
  secondaryStats,
  teamNames,
  heroes,
  linkUrl,
  linkText = "View Details",
}: PlayerCardProps) => {
  // Get hero background image
  const heroImage = heroes.length > 0 ? getHeroImage(heroes[0]) : undefined;

  // Determine role icon
  const roleStat = secondaryStats?.find((stat) => stat.label === "Role");
  const role = roleStat?.value.toLowerCase();
  
  const icon = role ? (
    <RoleIcon role={role} className="text-primary" />
  ) : (
    <MdOutlinePersonOutline size={20} />
  );

  return (
    <DataCard
      title={playerName}
      backgroundImage={heroImage}
      linkUrl={linkUrl}
      linkText={linkText}
      icon={icon}
      className="min-w-[300px]"
    >
      <div className="space-y-4">
        {/* Teams */}
        <div className="flex flex-wrap gap-2">
          {teamNames.map((team, idx) => (
            <span
              key={idx}
              className="badge badge-lg badge-primary badge-outline bg-base-100/50 backdrop-blur-sm border-primary/50 text-base-content font-semibold"
            >
              {team}
            </span>
          ))}
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-2 gap-3">
          {primaryStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-base-300/60 backdrop-blur-md rounded-lg p-3 border border-base-content/8"
            >
              <div className="text-xs text-base-content/70 uppercase tracking-wider font-medium mb-1">
                {stat.label}
              </div>
              <div className="text-xl font-bold text-base-content">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        {secondaryStats && secondaryStats.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-base-content/10">
            {secondaryStats
              .filter((stat) => stat.label !== "Role") // Don't show role in stats list as it's in the icon
              .map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-xs text-base-content/60">
                    {stat.label}:
                  </span>
                  <span className="text-sm font-medium text-base-content/90">
                    {stat.value}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </DataCard>
  );
};
