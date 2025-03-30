import { listToNaturalLanguage } from "../../lib";
import { CardBase, CardBaseFact } from "./CardBase";

interface TeamCardProps {
  teamName: string;
  playerNames: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  link?: string;
}

export const TeamCard = ({
  teamName,
  playerNames,
  primaryStats,
  secondaryStats,
  link,
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
    link={link}
  />
);
