import { listToNaturalLanguage } from "../../lib";
import { CardBase, CardBaseFact } from "./CardBase";

interface TeamCardProps {
  teamName: string;
  playerNames: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  linkUrl?: string;
  linkText?: string; // Optional text, defaults if only URL provided
}

export const TeamCard = ({
  teamName,
  playerNames,
  primaryStats,
  secondaryStats,
  linkUrl,
  linkText = "View Details", // Default link text
}: TeamCardProps) => (
  <CardBase
    title={teamName}
    primaryStats={primaryStats}
    secondaryStats={secondaryStats}
    info={
      <CardBaseFact
        value={listToNaturalLanguage(playerNames)}
        label="Players"
      />
    }
    linkUrl={linkUrl}
    linkText={linkUrl ? linkText : undefined} // Only pass text if URL exists
  />
);
