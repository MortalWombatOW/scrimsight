import { useMemo } from "react";
import { formatStat } from "@library";
import { PlayerCard } from "../player/PlayerCard";
import { useScrim } from "../../hooks/useScrims";
import { useStats } from "../../hooks/useStats";

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
  const scrim = useScrim(scrimId);
  const stats = useStats({ playerName: playerId });

  const playerStats = useMemo(() => {
    if (!scrim || stats.length === 0) return null;

    const relevantStats = stats.filter((s) => scrim.matchIds.includes(s.matchId));
    
    if (relevantStats.length === 0) return null;

    return relevantStats.reduce(
      (acc, curr) => ({
        eliminations: acc.eliminations + curr.eliminations,
        deaths: acc.deaths + curr.deaths,
        offensiveAssists: acc.offensiveAssists + curr.offensiveAssists,
        defensiveAssists: acc.defensiveAssists + curr.defensiveAssists,
        heroDamageDealt: acc.heroDamageDealt + curr.heroDamageDealt,
      }),
      {
        eliminations: 0,
        deaths: 0,
        offensiveAssists: 0,
        defensiveAssists: 0,
        heroDamageDealt: 0,
      }
    );
  }, [scrim, stats]);

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
