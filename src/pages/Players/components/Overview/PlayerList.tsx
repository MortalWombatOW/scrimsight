import { useState } from "react";
import { useStats } from "../../../../atoms";
import RoleIcon from "../../../../components/Common/RoleIcon";
import { prettyFormat } from "../../../../lib/format";
import { Link } from "react-router-dom";
import { PlayerStatsNumericalKeys } from "../../../../atoms/metrics/playerMetricsAtoms";

const sortFields = {
  playtime: "playtime" as PlayerStatsNumericalKeys,
  eliminationsPer10Minutes: "eliminationsPer10Minutes" as PlayerStatsNumericalKeys,
  // Remove winRate if it's not a valid key
} as const;

export const PlayerList = () => {
  const [sortField, setSortField] = useState<keyof typeof sortFields>(
    "playtime"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const stats = useStats(
    ["playerName", "playerRole"],
    {},
    sortField,
    sortDirection
  );

  // Add handlers if you need the state, or remove if unused
  const handleSortFieldChange = (field: keyof typeof sortFields) => {
    setSortField(field);
  };

  const handleSortDirectionChange = (direction: "asc" | "desc") => {
    setSortDirection(direction);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Player</th>
            <th>Role</th>
            <th>Win Rate</th>
            <th>Elims/10min</th>
            <th>Playtime</th>
          </tr>
        </thead>
        <tbody>
          {stats.rows.map((player) => (
            <tr key={player.playerName}>
              <td>
                <Link
                  to={`/players/${player.playerName}`}
                  className="link link-hover"
                >
                  {player.playerName}
                </Link>
              </td>
              <td>
                <RoleIcon role={player.playerRole} />
              </td>
              <td>{prettyFormat(player.winRate * 100)}%</td>
              <td>{prettyFormat(player.eliminationsPer10Minutes)}</td>
              <td>{prettyFormat(player.playtime / 60)} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
