import { listToNaturalLanguage } from "../../lib";
import { CardBase, CardBaseFact } from "./CardBase";

interface MatchCardProps {
  title: string;
  teamNames: string[];
  date: string; // Assuming date is pre-formatted string for simplicity
  mapsPlayed: string[];
  primaryStats: { value: string; label: string }[];
  secondaryStats?: { value: string; label: string }[];
  link?: string;
}

export const MatchCard = ({
  title,
  teamNames,
  date,
  mapsPlayed,
  primaryStats,
  secondaryStats,
  link,
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
      <CardBaseFact
        key="maps"
        value={listToNaturalLanguage(mapsPlayed)}
        label={mapsPlayed.length === 1 ? "Map" : "Maps"}
      />,
    ]}
    link={link}
  />
);
