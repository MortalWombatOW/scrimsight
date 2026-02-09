import { DataCard } from "@components";
import { GoPeople } from "react-icons/go";

interface TeamCardProps {
  teamName: string;
  playerNames: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  linkUrl?: string;
  linkText?: string;
}

export const TeamCard = ({
  teamName,
  playerNames,
  primaryStats,
  secondaryStats,
  linkUrl,
  linkText = "View Details",
}: TeamCardProps) => (
  <DataCard
    title={teamName}
    subtitle={`${playerNames.length} Players`}
    linkUrl={linkUrl}
    linkText={linkText}
    className="min-w-[320px]"
    icon={<GoPeople size={20} />}
  >
    <div className="space-y-4">
      {/* Players */}
      <div className="flex flex-wrap gap-1">
        {playerNames.slice(0, 5).map((player, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 bg-base-300 rounded-full text-base-content/70"
          >
            {player}
          </span>
        ))}
        {playerNames.length > 5 && (
          <span className="text-xs px-2 py-1 bg-base-300 rounded-full text-base-content/70">
            +{playerNames.length - 5}
          </span>
        )}
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

