import { listToNaturalLanguage } from "@library";
import { CardBase, CardBaseFact } from "@components";

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
  linkText,
}: PlayerCardProps) => (
  <CardBase
    title={playerName}
    primaryStats={primaryStats}
    secondaryStats={secondaryStats}
    linkUrl={linkUrl}
    linkText={linkText}
    info={[
      <CardBaseFact
        key="teams"
        value={listToNaturalLanguage(teamNames)}
        label={teamNames.length === 1 ? "Team" : "Teams"}
      />,
      <CardBaseFact
        key="heroes"
        value={listToNaturalLanguage(heroes)}
        label={heroes.length === 1 ? "Hero" : "Heroes"}
      />,
    ]}
  />
);
