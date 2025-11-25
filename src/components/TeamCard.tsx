import { VisualCard } from "@components";

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
  <VisualCard
    title={teamName}
    linkUrl={linkUrl}
    className="min-w-[320px]"
  >
    <div className="space-y-4">
      {/* Players */}
      <div>
        <div className="text-xs text-base-content/60 mb-2">Players</div>
        <div className="flex flex-wrap gap-2">
          {playerNames.map((player) => (
            <span
              key={player}
              className="badge badge-outline badge-sm text-white"
            >
              {player}
            </span>
          ))}
        </div>
      </div>

      {/* Primary Stats */}
      <div className="flex gap-4 pt-3 border-t border-white/10">
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
