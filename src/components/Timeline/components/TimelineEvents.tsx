import {
  playerEventsAtom,
  playerInteractionEventsAtom,
  teamfightsAtom,
  ultimateEventsAtom,
  roundTimesAtom,
  matchDataAtom,
} from "../../../atoms";
import { useAtomValue } from "jotai";

export const TimelineEvents: React.FC<{
  matchId: string;
  currentTimeRange: { start: number; end: number };
}> = ({ matchId, currentTimeRange }) => {
  // can get the winner of a round from matchData.roundWinners
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  const roundTimes = useAtomValue(roundTimesAtom).filter(
    (round) => round.matchId === matchId
  );
  const teamfights = useAtomValue(teamfightsAtom).filter(
    (teamfight) =>
      teamfight.matchId === matchId &&
      teamfight.startTime >= currentTimeRange.start
  );

  const playerEvents = useAtomValue(playerEventsAtom).filter(
    (event) =>
      event.matchId === matchId &&
      event.playerEventTime >= currentTimeRange.start &&
      event.playerEventTime <= currentTimeRange.end
  );

  const playerInteractionEvents = useAtomValue(
    playerInteractionEventsAtom
  ).filter(
    (event) =>
      event.matchId === matchId &&
      event.playerInteractionEventTime >= currentTimeRange.start &&
      event.playerInteractionEventTime <= currentTimeRange.end
  );

  const ultimateEvents = useAtomValue(ultimateEventsAtom).filter(
    (event) =>
      event.matchId === matchId &&
      event.ultimateStartTime >= currentTimeRange.start &&
      event.ultimateStartTime <= currentTimeRange.end
  );

  return (
    <div>
      <h1>Timeline Events</h1>
    </div>
  );
};
