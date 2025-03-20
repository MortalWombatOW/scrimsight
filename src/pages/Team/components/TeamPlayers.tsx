import { useStats } from "../../../atoms/metrics/playerMetricsAtoms";
import { getRoleFromHero } from "../../../lib/hero";
import { Link } from "react-router-dom";

interface TeamPlayersProps {
  players: string[];
  teamName: string;
}

export const TeamPlayers = ({ players, teamName }: TeamPlayersProps) => {
  const playerStats = useStats(
    ["playerName", "playerHero"],
    { playerTeam: [teamName] }
  );

  const getPlayerRole = (playerName: string) => {
    const playerHeroes = playerStats.rows
      .filter((row) => row.playerName === playerName)
      .map((row) => row.playerHero);

    const roleCount = new Map<string, number>();
    playerHeroes.forEach((hero) => {
      const role = getRoleFromHero(hero);
      roleCount.set(role, (roleCount.get(role) || 0) + 1);
    });

    return Array.from(roleCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "unknown";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Team Roster</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Player</th>
              <th>Primary Role</th>
              <th>Games Played</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player}>
                <td>
                  <Link
                    to={`/players/${player}`}
                    className="text-primary hover:text-primary-focus"
                  >
                    {player}
                  </Link>
                </td>
                <td>{getPlayerRole(player)}</td>
                <td>{playerStats.rows.filter((row) => row.playerName === player).length}</td>
                <td>
                  {(
                    (playerStats.rows.filter(
                      (row) => row.playerName === player && row.result === "win"
                    ).length /
                      playerStats.rows.filter((row) => row.playerName === player).length) *
                    100
                  ).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};