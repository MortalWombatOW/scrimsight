import TeamCard from "../../../components/TeamCard";
import { TeamStats } from "../../../atoms/teamStatsAtom";

interface TeamsListProps {
  teams: TeamStats[];
}

export const TeamsList = ({ teams }: TeamsListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <div key={team.teamName}>
          <TeamCard teamName={team.teamName} />
        </div>
      ))}
    </div>
  );
};
