import { listToNaturalLanguage } from "../../lib";
import { CardBase, CardBaseFact } from "./CardBase";

interface MatchCardProps {
  title: string;
  teamNames: string[];
  date: string;
  mapName: string;
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  linkUrl?: string;
  linkText?: string; // Optional text, defaults if only URL provided
}

export const MatchCard = ({
  title,
  teamNames,
  date,
  mapName,
  primaryStats,
  secondaryStats,
  linkUrl,
  linkText = "View Details", // Default link text
}: MatchCardProps) => (
  <CardBase
    title={title}
    primaryStats={primaryStats}
    secondaryStats={secondaryStats}
    info={[
      <CardBaseFact
        key="teams"
        value={listToNaturalLanguage(teamNames)}
        label={teamNames.length === 1 ? "Team" : "Teams"}
      />,
      <CardBaseFact key="date" value={date} label="Date" />,
      <CardBaseFact key="maps" value={mapName} label="Map" />,
    ]}
    linkUrl={linkUrl}
    linkText={linkUrl ? linkText : undefined} // Only pass text if URL exists
  />
);
