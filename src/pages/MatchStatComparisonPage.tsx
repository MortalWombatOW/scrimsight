import { useParams } from "react-router-dom";
import { SingleStatPlayerComparison, AllPlayerComparison } from "@components";

export const MatchStatComparisonPage = () => {
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    return <div>No match ID</div>;
  }

  return (
    <>
      {/* All Player Comparison */}
      <AllPlayerComparison matchId={matchId} />

      {/* Single Stat Comparison */}
      <SingleStatPlayerComparison matchId={matchId} />
    </>
  );
};

export default MatchStatComparisonPage;
