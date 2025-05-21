import { listToNaturalLanguage } from "~/lib";
import { CardBase, CardBaseFact } from "~/components/Card/CardBase";

interface ScrimCardProps {
  title: string;
  teamNames: string[];
  date: string; // Assuming date is pre-formatted string for simplicity
  mapsPlayed: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  linkUrl?: string;
  linkText?: string; // Optional text, defaults if only URL provided
}

export const ScrimCard = ({
  title,
  teamNames,
  date,
  mapsPlayed,
  primaryStats,
  secondaryStats,
  linkUrl,
  linkText = "View Details", // Default link text
}: ScrimCardProps) => (
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
      <CardBaseFact
        key="maps"
        value={listToNaturalLanguage(mapsPlayed)}
        label={mapsPlayed.length === 1 ? "Map" : "Maps"}
      />,
    ]}
    linkUrl={linkUrl}
    linkText={linkUrl ? linkText : undefined} // Only pass text if URL exists
  />
);
