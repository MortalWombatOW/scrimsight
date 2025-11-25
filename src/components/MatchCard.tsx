import { VisualCard } from "@components";

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
    <VisualCard
      title={title}
      backgroundImage={mapImage}
      linkUrl={linkUrl}
      className="min-w-[320px]"
    >
      <div className="space-y-4">
        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-base-content/70">Teams</div>
          <div className="text-sm font-semibold text-white">
            {teamNames.join(" vs ")}
          </div>
        </div>

        {/* Date & Map */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-base-content/60 mb-1">Date</div>
            <div className="text-sm text-white">{date}</div>
          </div>
          <div>
            <div className="text-xs text-base-content/60 mb-1">Map</div>
            <div className="text-sm text-white">{mapName}</div>
          </div>
        </div>

        {/* Primary Stats */}
        <div className="flex gap-6 pt-3 border-t border-white/10">
          {primaryStats.map((stat) => (
            <div key={stat.label} className="flex-1">
              <div className="text-2xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="text-xs text-base-content/60 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        {secondaryStats && secondaryStats.length > 0 && (
          <div className="flex flex-wrap gap-3 text-xs">
            {secondaryStats.map((stat) => (
              <div key={stat.label} className="text-base-content/70">
                <span className="font-semibold text-white">{stat.value}</span>{" "}
                {stat.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {linkUrl && (
        <div className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors">
          {linkText} →
        </div>
      )}
    </VisualCard>
  );
};
