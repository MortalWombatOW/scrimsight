import { atom } from "jotai";
import { getStatsAtom, PlayerStatsNumericalKeys } from "@library";

// Lazy evaluation to avoid circular dependency
// Create the atom inside the getter, not at module load time

export interface PlayerRanking {
  rank: number;
  max: number;
  percentage: number;
  value: number;
}

export const playerRankingsAtom = atom(async (get) => {
  // Create the atom here to avoid circular dependency at module load time
  const allPlayerStatsAtom = getStatsAtom(["playerName", "playerTeam", "playerRole", "playerHero"]);
  const stats = await get(allPlayerStatsAtom);
  const rows = stats.rows;

  const getRanking = (playerName: string, stat: PlayerStatsNumericalKeys): PlayerRanking => {
    const playerRow = rows.find((r) => r.playerName === playerName);
    const value = playerRow ? (playerRow[stat] as number) || 0 : 0;

    // Calculate max for this stat across all players
    const max = Math.max(...rows.map((r) => (r[stat] as number) || 0));

    // Calculate rank
    // Rank is 1 + number of players with strictly greater value
    const rank = rows.filter((r) => ((r[stat] as number) || 0) > value).length + 1;

    const percentage = max > 0 ? (value / max) * 100 : 0;

    return { rank, max, percentage, value };
  };

  const getPlayerStats = (playerName: string) => {
    return rows.find((r) => r.playerName === playerName);
  };

  return {
    getRanking,
    getPlayerStats,
    rows, // Expose rows if needed
  };
});
