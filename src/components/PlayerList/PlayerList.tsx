import React from "react";
import { useAtom } from "jotai";
import { playerStatExpandedAtom } from "~/atoms";
import "./PlayerList.scss";

interface PlayerStats {
  playerName: string;
  matchCount: number;
  playerRole: string;
}

const PlayerRow = ({ playerName, matchCount, playerRole }: PlayerStats) => {
  return (
    <div className="w-[200px] h-[200px] flex flex-col relative overflow-visible border border-secondary-500 dashboard-item secondary rounded-md">
      <div className="flex-grow p-4 flex flex-col gap-2 items-center justify-center">
        <h2 className="text-xl font-medium text-center">{playerName}</h2>
        <p className="text-gray-500 text-center">{playerRole}</p>
        <h3 className="text-2xl font-bold text-center">{matchCount} matches</h3>
      </div>
    </div>
  );
};

const PlayerList = () => {
  const [playerStats] = useAtom(playerStatExpandedAtom);

  // Process the data to count unique matches per player
  const processedStats = React.useMemo(() => {
    if (!playerStats) return [];

    const playerMatches = new Map<string, Set<string>>();
    const playerRoles = new Map<string, string>();

    playerStats.forEach((stat) => {
      if (!playerMatches.has(stat.playerName)) {
        playerMatches.set(stat.playerName, new Set());
        playerRoles.set(stat.playerName, stat.playerRole);
      }
      playerMatches.get(stat.playerName)?.add(stat.matchId);
    });

    const stats: PlayerStats[] = Array.from(playerMatches.entries()).map(
      ([playerName, matches]) => ({
        playerName,
        matchCount: matches.size,
        playerRole: playerRoles.get(playerName) || "unknown",
      })
    );

    // Sort by match count descending
    return stats.sort((a, b) => b.matchCount - a.matchCount);
  }, [playerStats]);

  return (
    <>
      {processedStats.map((stats) => (
        <PlayerRow key={stats.playerName} {...stats} />
      ))}
    </>
  );
};

export default PlayerList;
