import { StatCard } from "../../../components/StatCard";
import {
  Groups as TeamsIcon,
  EmojiEvents as WinsIcon,
  People as PlayersIcon,
  SportsEsports as GamesIcon,
} from "@mui/icons-material";

interface TeamsSummaryStatsProps {
  totalTeams: number;
  totalGames: number;
  totalWins: number;
  totalPlayers: number;
}

export const TeamsSummaryStats = ({
  totalTeams,
  totalGames,
  totalWins,
  totalPlayers,
}: TeamsSummaryStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div>
        <StatCard
          title="Total Teams"
          value={totalTeams.toString()}
          icon={<TeamsIcon />}
          color="primary.main"
        />
      </div>
      <div>
        <StatCard
          title="Total Games"
          value={totalGames.toString()}
          icon={<GamesIcon />}
          color="secondary.main"
        />
      </div>
      <div>
        <StatCard
          title="Total Wins"
          value={totalWins.toString()}
          icon={<WinsIcon />}
          color="success.main"
        />
      </div>
      <div>
        <StatCard
          title="Total Players"
          value={totalPlayers.toString()}
          icon={<PlayersIcon />}
          color="info.main"
        />
      </div>
    </div>
  );
};
