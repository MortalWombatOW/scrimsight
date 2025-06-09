import { useStats } from "@library";
import { RoleIcon } from "@icons";
import { prettyFormat } from "@library";
import { Link } from "react-router-dom";

export const TopPlayersList = () => {
  const stats = useStats(
    ["playerName", "playerRole"],
    {},
    "eliminationsPer10Minutes",
    "desc"
  );

  const topPlayers = stats.rows.slice(0, 5);

  return (
    <div className="bg-base-200 p-6 rounded-box">
      <h2 className="text-xl font-bold mb-4">Top Performers</h2>
      <div className="grid gap-4">
        {topPlayers.map((player) => (
          <div
            key={player.playerName}
            className="flex items-center justify-between bg-base-100 p-4 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <RoleIcon role={player.playerRole} />
              <Link
                to={`/players/${player.playerName}`}
                className="link link-hover font-medium"
              >
                {player.playerName}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">
                  {prettyFormat(player.eliminationsPer10Minutes)}
                </span>
                <span className="text-base-content/70 ml-1">elims/10min</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">
                  {prettyFormat(((player as any).winRate || 0) * 100)}%
                </span>
                <span className="text-base-content/70 ml-1">win rate</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
