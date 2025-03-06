import { useParams } from "react-router-dom";
import { PlayerStatsComparison } from "./components/stats/PlayerStatsComparison";
import { TeamStatsComparison } from "./components/stats/TeamStatsComparison";
import KillsTable from "../../components/KillsTable/KillsTable";

export const MatchOverviewPage = () => {
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    return <div>No match ID</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <TeamStatsComparison matchId={matchId} />
        <KillsTable matchId={matchId} />
      </div>
      <PlayerStatsComparison matchId={matchId} />
    </div>
  );
};
