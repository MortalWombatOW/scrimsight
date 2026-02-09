import { DataCard } from "@components";
import { GoTrophy } from "react-icons/go";

interface MatchCardProps {
  title: string;
  teamNames: string[];
  date: string;
  mapName: string;
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  linkUrl?: string;
  linkText?: string;
}

export const MatchCard = ({
  title,
  teamNames,
  date,
  mapName,
  primaryStats,
  secondaryStats,
  linkUrl,
  linkText = "View Details",
}: MatchCardProps) => {
  // Get map background image (using bg.png as fallback)
  const mapImage = `/assets/bg.png`;

  return (
    <DataCard
      title={title}
      subtitle={date}
      backgroundImage={mapImage}
      linkUrl={linkUrl}
      linkText={linkText}
      className="min-w-[320px]"
      icon={<GoTrophy size={20} />}
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

        {/* Map */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-base-content/60 uppercase tracking-wider">
            Map:
          </span>
          <span className="text-sm font-medium text-base-content">{mapName}</span>
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
            {secondaryStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-xs text-base-content/60">{stat.label}:</span>
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
