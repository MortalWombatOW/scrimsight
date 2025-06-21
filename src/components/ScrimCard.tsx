import { useAtomValue } from "jotai";
import { dataModelAtom } from "../atoms/scrimsight";
import TeamColorDot from "./TeamColorDot";
import PrimaryButton from "./PrimaryButton";
import { useNavigate } from "react-router-dom";

interface ScrimCardProps {
  scrimId: string;
}

const ScrimCard = ({ scrimId }: ScrimCardProps) => {
  const dataModel = useAtomValue(dataModelAtom);
  const navigate = useNavigate();

  const scrim = dataModel?.scrims.find((s) => s.scrim === scrimId);

  if (!scrim) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-error">Scrim not found</p>
        </div>
      </div>
    );
  }

  const [team1, team2] = scrim.teams;
  const team1Won = scrim.team1MatchesWon;
  const team2Won = scrim.team2MatchesWon;
  const outcome: "team1" | "team2" | "draw" =
    team1Won > team2Won ? "team1" : team2Won > team1Won ? "team2" : "draw";
  const outcomeColors = {
    win: "text-success",
    loss: "text-error",
    draw: "text-base-content/70",
  };
  const team1Color =
    outcome === "team1"
      ? outcomeColors.win
      : outcome === "team2"
      ? outcomeColors.loss
      : outcomeColors.draw;
  const team2Color =
    outcome === "team2"
      ? outcomeColors.win
      : outcome === "team1"
      ? outcomeColors.loss
      : outcomeColors.draw;
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleViewScrim = () => {
    navigate(`scrim/${scrimId}`);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="space-y-2 mb-4">
          <div className={`flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team1} size={16} />
              <span className={`font-medium`}>{team1}</span>
            </div>
            <span className={`text-lg ${team1Color}`}>{team1Won}</span>
          </div>

          <div className={`flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team2} size={16} />
              <span className={`font-medium`}>{team2}</span>
            </div>
            <span className={`text-lg ${team2Color}`}>{team2Won}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-base-content/70">
            <div>{formatDate(scrim.date)}</div>
            <div>{formatTime(scrim.date)}</div>
          </div>
          <PrimaryButton onClick={handleViewScrim}>View</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ScrimCard;
