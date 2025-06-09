import { useParams } from "react-router-dom";
import { Timeline } from "@components";
export const TimelinePage = () => {
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    return <div>No match ID</div>;
  }

  return <Timeline matchId={matchId} />;
};

export default TimelinePage;
