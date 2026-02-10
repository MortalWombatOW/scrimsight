import { useMemo } from "react";
import { formatStat } from "@library";
import { TeamCard } from "../team/TeamCard";
import { useScrim } from "../../hooks/useScrims";
import { useStats } from "../../hooks/useStats";

interface ScrimTeamStatsProps {
  scrimId: string;
  teamName: string;
  players: string[];
}

export const ScrimTeamStats = ({
  scrimId,
  teamName,
  players,
}: ScrimTeamStatsProps) => {
  const scrim = useScrim(scrimId);
  const stats = useStats({ team: teamName });

  const teamStats = useMemo(() => {
    if (!scrim || stats.length === 0) return null;

    const relevantStats = stats.filter((s) => scrim.matchIds.includes(s.matchId));
    
    if (relevantStats.length === 0) return null;

    return relevantStats.reduce(
      (acc, curr) => ({
        eliminations: acc.eliminations + curr.eliminations,
        deaths: acc.deaths + curr.deaths,
      }),
      {
        eliminations: 0,
        deaths: 0,
      }
    );
  }, [scrim, stats]);

  if (!teamStats)
    return (
      <div className="card bg-base-200 shadow">
        <div className="card-body p-4">Loading {teamName} stats...</div>
      </div>
    );

  return (
    <TeamCard
      teamName={teamName}
      playerNames={players}
      primaryStats={[
        { value: formatStat('eliminations', teamStats.eliminations), label: "Total Elims" },
      ]}
      secondaryStats={[
        { value: formatStat('deaths', teamStats.deaths), label: "Total Deaths" },
      ]}
      linkUrl={`/teams/${teamName}`}
    />
  );
};
