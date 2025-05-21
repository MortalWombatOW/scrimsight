import { useParams } from "react-router-dom";
import { SingleStatPlayerComparison } from "~/pages/Match/components/comparison/SingleStatPlayerComparison";
import { AllPlayerComparison } from "~/pages/Match/components/comparison/AllPlayerComparison";

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
