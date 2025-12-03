import { useAtomValue } from "jotai";
import { contextualStatAtoms, formatStat } from "@library";
import { TeamCard } from "@components";

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
  const teamStats = useAtomValue(
    contextualStatAtoms.teamStatsForScrimAtom({ scrimId, teamName })
  );

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
