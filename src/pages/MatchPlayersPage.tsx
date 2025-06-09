import { useParams } from "react-router-dom";
import { PlayerStatsComparison } from "@components";

export const MatchPlayersPage = () => {
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    return <div className="text-center p-4">No match ID provided.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <PlayerStatsComparison matchId={matchId} />
    </div>
  );
};

export default MatchPlayersPage;
