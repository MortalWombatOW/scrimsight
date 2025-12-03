import { useAtomValue } from "jotai";
import { contextualStatAtoms, formatStat } from "@library";
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
      ? formatStat('eliminations',
          playerStats.eliminations +
            (playerStats.offensiveAssists + playerStats.defensiveAssists)
        )
      : formatStat('eliminations',
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
          value: formatStat('heroDamageDealt', playerStats.heroDamageDealt),
          label: "Total Hero Dmg",
        },
      ]}
    />
  );
};
