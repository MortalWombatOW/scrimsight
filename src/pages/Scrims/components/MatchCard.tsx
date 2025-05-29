import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { matchDataAtom } from "@atoms/matchDataAtom";
import { useStats } from "@library/playerMetricsAtoms";
import { getHeroImage, formatTime } from "@library";
import { useMemo } from "react";
import { mapNameToFileName } from "@library/string";
import { CiMap } from "react-icons/ci";

const PlayerCard = ({
  playerName,
  matchId,
}: {
  playerName: string;
  matchId: string;
}) => {
  const playerStats = useStats(
    ["playerHero"],
    { playerName: [playerName], matchId: [matchId] },
    "playtime"
  );
  const tooltipContent = useMemo(
    () =>
      `${playerStats.rows[0].playerHero} - ${formatTime(
        playerStats.rows[0].playtime
      )}`,
    [playerStats]
  );

  return (
    <div className="card bg-base-300 p-2 mb-1">
      <div className="flex items-center">
        <div className="relative group">
          <img
            src={getHeroImage(playerStats.rows[0].playerHero, true)}
            alt={playerStats.rows[0].playerHero}
            className="h-6 w-6 rounded-lg mr-2"
          />
          <div className="tooltip tooltip-top" data-tip={tooltipContent}>
            <span className="text-sm text-base-content">{playerName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MatchCard = ({ matchId }: { matchId: string }) => {
  const matchData = useAtomValue(matchDataAtom);
  const match = matchData.find((match) => match.matchId === matchId);
  const playerStats = useStats(["playerName", "playerRole", "playerTeam"], {
    matchId: [matchId],
  });
  const navigate = useNavigate();

  if (!match) {
    throw new Error(`Match ${matchId} not found in matchData`);
  }

  return (
    <div className="card bg-base-200 border border-gray-700 border-gray-700 p-4 rounded-lg mb-4 shadow-md">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="flex justify-center">
            <div className="flex flex-col space-y-1">
              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "tank" &&
                    stats.playerTeam === match.team1Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "damage" &&
                    stats.playerTeam === match.team1Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "support" &&
                    stats.playerTeam === match.team1Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex flex-col space-y-3 items-center">
            <div className="flex justify-center">
              <img
                src={mapNameToFileName(match.map, false)}
                alt={match.map}
                className="h-[100px] w-[100px] rounded-md shadow-sm"
              />
            </div>
            <div className="badge badge-lg badge-outline gap-2">
              <CiMap className="h-4 w-4" />
              <span>{match.map}</span>
            </div>
            <div className="stats shadow-md bg-base-300">
              <div className="stat place-items-center">
                <div className="stat-title text-xs">Team 1</div>
                <div className="stat-value text-xl">{match.team1Score}</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title text-xs">Team 2</div>
                <div className="stat-value text-xl">{match.team2Score}</div>
              </div>
            </div>
            <button
              className="btn btn-outline mt-2"
              onClick={() => navigate(`/matches/${matchId}`)}
            >
              View Match
            </button>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex justify-center">
            <div className="flex flex-col space-y-1">
              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "tank" &&
                    stats.playerTeam === match.team2Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "damage" &&
                    stats.playerTeam === match.team2Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "support" &&
                    stats.playerTeam === match.team2Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
