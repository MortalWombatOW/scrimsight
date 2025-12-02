import { useAtomValue } from "jotai";
import { contextualStatAtoms, prettyFormat } from "@library";
import { PlayerCard } from "@components";

interface ScrimPlayerStatsProps {
  scrimId: string;
  playerId: string;
  teamName: string;
}

export const ScrimPlayerStats = ({
  scrimId,
  playerId,
  teamName,
}: ScrimPlayerStatsProps) => {
  const playerStats = useAtomValue(
    contextualStatAtoms.playerStatsForScrimAtom({ scrimId, playerId })
  );

  if (!playerStats) return null;

  const kda =
    playerStats.deaths === 0
      ? prettyFormat(
          playerStats.eliminations +
            (playerStats.offensiveAssists + playerStats.defensiveAssists)
        )
      : prettyFormat(
          (playerStats.eliminations +
            (playerStats.offensiveAssists + playerStats.defensiveAssists)) /
            playerStats.deaths
        );

  return (
    <PlayerCard
      playerName={playerId}
      teamNames={[teamName]}
      heroes={["Overall"]}
      primaryStats={[{ value: kda, label: "Scrim KDA" }]}
      secondaryStats={[
        {
          value: prettyFormat(playerStats.heroDamageDealt),
          label: "Total Hero Dmg",
        },
      ]}
    />
  );
};
