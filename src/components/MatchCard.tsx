import { useAtomValue } from "jotai";
import { useScrimsightNavigation } from "../hooks/useScrimsightNavigation";
import { dataModelAtom } from "../atoms/scrimsight";
import PrimaryButton from "./PrimaryButton";
import TeamColorDot from "./TeamColorDot";
import { mapNameToFileName } from "../lib/string";

interface MatchCardProps {
  matchId: string;
}

export const MatchCard = ({ matchId }: MatchCardProps) => {
  const dataModel = useAtomValue(dataModelAtom);
  const { navigate } = useScrimsightNavigation();

  const match = dataModel?.matches.find((m) => m.match === matchId);

  if (!match) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-base-content/70">Match not found</p>
        </div>
      </div>
    );
  }

  const team1 = match.teams[0];
  const team2 = match.teams[1];
  const isTeam1Winner = match.winningTeam === team1;
  const isTeam2Winner = match.winningTeam === team2;
  const isDraw = !isTeam1Winner && !isTeam2Winner;

  const getOutcomeText = (isWinner: boolean, isDraw: boolean) => {
    if (isDraw) return "DRAW";
    return isWinner ? "WIN" : "LOSS";
  };

  const getOutcomeColor = (isWinner: boolean, isDraw: boolean) => {
    if (isDraw) return "text-base-content/70";
    return isWinner ? "text-success" : "text-error";
  };

  const handleViewMatch = () => {
    navigate('/match/:matchId', { matchId });
  };

  const mapImagePath = mapNameToFileName(match.map, false);

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="px-4 pt-4">
        <img
          src={mapImagePath}
          alt={match.map}
          className="rounded-xl w-full h-32 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute top-6 left-6 bg-base-100 bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
          {match.map}
        </div>
        <div className="absolute top-6 right-6 bg-base-100 bg-opacity-90 px-2 py-1 rounded text-xs">
          {match.gameMode}
        </div>
      </figure>
      <div className="card-body">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team1} size={16} />
              <span className="font-medium">{team1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{match.team1Score}</span>
              <span
                className={`text-xs font-bold ${getOutcomeColor(
                  isTeam1Winner,
                  isDraw
                )}`}
              >
                {getOutcomeText(isTeam1Winner, isDraw)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TeamColorDot teamName={team2} size={16} />
              <span className="font-medium">{team2}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{match.team2Score}</span>
              <span
                className={`text-xs font-bold ${getOutcomeColor(
                  isTeam2Winner,
                  isDraw
                )}`}
              >
                {getOutcomeText(isTeam2Winner, isDraw)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-sm text-base-content/70 mt-4 flex items-center justify-between">
          <div>{match.date.toLocaleDateString()}</div>
          <div>{match.date.toLocaleTimeString()}</div>
          <div>
            {Math.floor(match.duration / 60)}m {match.duration % 60}s
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <PrimaryButton onClick={handleViewMatch}>View Match</PrimaryButton>
        </div>
      </div>
    </div>
  );
};
