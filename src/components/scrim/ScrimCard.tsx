import {
  mapNameToFileName,
  formatDurationDetailed,
} from "@library";
import { DataCard } from "@components";
import { GoCalendar, GoClock } from "react-icons/go";

interface ScrimCardProps {
  title: string;
  teamNames: string[];
  date: string;
  mapsPlayed: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  linkUrl?: string;
  linkText?: string;
  duration?: number;
}

export const ScrimCard = ({
  title,
  teamNames,
  date,
  mapsPlayed,
  primaryStats,
  secondaryStats,
  linkUrl,
  linkText = "View Details",
  duration,
}: ScrimCardProps) => {
  const mapImage =
    mapsPlayed.length > 0
      ? mapNameToFileName(mapsPlayed[0], false)
      : `/assets/bg.png`;

  return (
    <DataCard
      title={title}
      subtitle={date}
      backgroundImage={mapImage}
      linkUrl={linkUrl}
      linkText={linkText}
      className="min-w-[320px]"
      icon={<GoCalendar size={20} />}
    >
      <div className="space-y-4">
        {/* Teams */}
        <div className="flex flex-wrap gap-2">
          {teamNames.map((team, idx) => (
            <span
              key={idx}
              className="badge badge-lg badge-primary badge-outline bg-base-100/50 backdrop-blur-sm border-primary/50 text-white font-semibold"
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
              className="bg-base-300/60 backdrop-blur-md rounded-lg p-3 border border-white/5"
            >
              <div className="text-xs text-base-content/70 uppercase tracking-wider font-medium mb-1">
                {stat.label}
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        {secondaryStats && secondaryStats.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-white/10">
            {secondaryStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-xs text-base-content/60">{stat.label}:</span>
                <span className="text-sm font-medium text-base-content/90">
                  {stat.value}
                </span>
              </div>
            ))}
            {duration && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/60 flex items-center gap-1">
                  <GoClock size={12} /> Duration:
                </span>
                <span className="text-sm font-medium text-base-content/90">
                  {formatDurationDetailed(duration)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Maps */}
        {mapsPlayed.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {mapsPlayed.slice(0, 3).map((map) => (
              <span
                key={map}
                className="text-[10px] uppercase tracking-wider px-2 py-1 bg-black/40 rounded text-base-content/70"
              >
                {map}
              </span>
            ))}
            {mapsPlayed.length > 3 && (
              <span className="text-[10px] px-2 py-1 bg-black/40 rounded text-base-content/70">
                +{mapsPlayed.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </DataCard>
  );
};
