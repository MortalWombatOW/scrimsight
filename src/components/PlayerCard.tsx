import { listToNaturalLanguage } from "@library";
import { CardBase, CardBaseFact } from "@components";

interface PlayerCardProps {
  playerName: string;
  teamNames: string[];
  heroes: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
}

export const PlayerCard = ({
  playerName,
  primaryStats,
  secondaryStats,
  teamNames,
  heroes,
}: PlayerCardProps) => (
  <CardBase
    title={playerName}
    primaryStats={primaryStats}
    secondaryStats={secondaryStats}
    info={[
      <CardBaseFact
        value={listToNaturalLanguage(teamNames)}
        label={teamNames.length === 1 ? "Team" : "Teams"}
      />,
      <CardBaseFact
        value={listToNaturalLanguage(heroes)}
        label={heroes.length === 1 ? "Hero" : "Heroes"}
      />,
    ]}
  />
);
