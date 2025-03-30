import { TeamCard } from "../../../components/Card/TeamCard";
import { TeamStats } from "../../../atoms/teamStatsAtom";

interface TeamsListProps {
  teams: TeamStats[];
}

export const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team.teamName}
          teamName={team.teamName}
          playerNames={team.players}
          primaryStats={[
            { value: team.wins.toString(), label: "Wins" },
            { value: team.losses.toString(), label: "Losses" },
            { value: team.draws.toString(), label: "Draws" },
          ]}
          secondaryStats={[
            { value: team.gamesPlayed.toString(), label: "Games Played" },
            {
              value: team.mostRecentGameDate?.toLocaleDateString() || "N/A",
              label: "Most Recent Game",
            },
          ]}
          link={`/teams/${team.teamName}`}
        />
      ))}
    </div>
  );
};
