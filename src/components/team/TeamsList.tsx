import { TeamCard } from "@components";
import { TeamListSummary, formatPercentage } from "@library";

interface TeamsListProps {
  teams: TeamListSummary[]; // Use the new type
}

export const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team.teamName}
          teamName={team.teamName}
          // Display player count instead of list
          playerNames={[`${team.playerCount} Players`]} // Pass count as a single-item array for CardBaseFact
          primaryStats={[
            // Display Win Rate as primary stat
            { value: formatPercentage(team.winRate), label: "Win Rate" },
          ]}
          secondaryStats={[
            // Display Games Played and Player Count as secondary stats
            { value: team.gamesPlayed.toString(), label: "Games Played" },
            { value: team.playerCount.toString(), label: "Players" },
          ]}
          linkUrl={`/teams/${team.teamName}`}
          // linkText uses default "View Details"
        />
      ))}
    </div>
  );
};
