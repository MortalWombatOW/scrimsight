import { type ReactNode, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  getHeroImage,
  getRoleFromHero,
  getRankForRole,
} from "@library";
import { formatDuration } from "@library";
import { RoleIcon } from "@icons";
import { ErrorMessage } from "@components";
import { useMatches } from "../../hooks/useRepository";

interface TeamComposition {
  composition: string[];
  playtimeSeconds: number;
  winRate: number;
  frequency: number;
}

export const TeamCompositions = (): ReactNode => {
  const { teamId } = useParams<{ teamId: string }>();
  const matches = useMatches();

  const detailedCompositionsData = useMemo(() => {
    if (!teamId) return [];

    // Group stats by matchId + roundNumber to get compositions
    const compositionMap = new Map<string, {
      playtime: number;
      wins: number;
      total: number;
    }>();

    for (const match of matches) {
      // Find which team we're looking at
      const isTeam1 = match.metadata.team1Name === teamId;
      const isTeam2 = match.metadata.team2Name === teamId;
      if (!isTeam1 && !isTeam2) continue;

      // Get win status
      const didWin = match.metadata.winner === teamId;

      // Group by round to get compositions
      const roundCompositions = new Map<string, Set<string>>();
      for (const stat of match.playerStats.rows) {
        if (stat.playerTeam !== teamId) continue;

        const roundKey = String(stat.roundNumber);
        if (!roundCompositions.has(roundKey)) {
          roundCompositions.set(roundKey, new Set());
        }
        roundCompositions.get(roundKey)!.add(stat.playerHero);
      }

      // Process each round's composition
      for (const [roundNum, heroes] of roundCompositions) {
        const compKey = Array.from(heroes).sort().join(',');

        if (!compositionMap.has(compKey)) {
          compositionMap.set(compKey, { playtime: 0, wins: 0, total: 0 });
        }

        const compData = compositionMap.get(compKey)!;

        // Calculate playtime for this composition in this round
        const roundStats = match.playerStats.rows.filter(
          s => s.playerTeam === teamId && String(s.roundNumber) === roundNum
        );
        const roundPlaytime = roundStats.reduce((sum, s) => sum + s.playtime, 0) / roundStats.length;

        compData.playtime += roundPlaytime;
        compData.total += 1;
        if (didWin) compData.wins += 1;
      }
    }

    // Convert to array format
    const compositions: TeamComposition[] = [];
    for (const [compKey, data] of compositionMap) {
      compositions.push({
        composition: compKey.split(','),
        playtimeSeconds: data.playtime,
        winRate: (data.wins / data.total) * 100,
        frequency: data.total,
      });
    }

    return compositions;
  }, [teamId, matches]);

  if (!teamId) {
    return <ErrorMessage message="Team ID not found in URL." />;
  }

  const sortedCompositions = [...detailedCompositionsData].sort(
    (a, b) => b.playtimeSeconds - a.playtimeSeconds
  );

  // Calculate max playtime for progress bar (if needed, or remove bar)
  const maxTimePlayed = Math.max(
    ...sortedCompositions.map((c) => c.playtimeSeconds),
    0
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Team Compositions</h2>

      {/* TODO: Add Sorting Controls here */}

      <div className="grid gap-4">
        {sortedCompositions.length > 0 ? (
          sortedCompositions.map((comp, index) => (
            <div
              key={index} // Consider a more stable key if available (e.g., composition hash)
              className="border border-base-content/10 rounded-lg p-4"
            >
              <div className="flex flex-col gap-4">
                {/* Hero Icons */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Sort heroes within the composition by role rank */}
                  {[...comp.composition]
                    .sort((heroA, heroB) => {
                      const roleA = getRoleFromHero(heroA);
                      const roleB = getRoleFromHero(heroB);
                      const rankA = getRankForRole(roleA);
                      const rankB = getRankForRole(roleB);
                      return rankA - rankB; // Sort Tank -> Damage -> Support
                    })
                    .map((hero) => (
                      <div key={hero} className="relative">
                        <img
                          src={getHeroImage(hero)}
                          alt={hero}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1">
                          <RoleIcon
                            role={getRoleFromHero(hero)}
                            className="w-6 h-6"
                          />
                        </div>
                      </div>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between gap-4 text-sm text-base-content/80">
                  <span>
                    Playtime:{" "}
                    <span className="font-medium">
                      {formatDuration(comp.playtimeSeconds)}
                    </span>
                  </span>
                  <span>
                    Win Rate:{" "}
                    <span className="font-medium">
                      {/* Display calculated winRate */}
                      {comp.winRate.toFixed(1)}%
                    </span>
                  </span>
                  <span>
                    Frequency:{" "}
                    <span className="font-medium">
                      {/* Display calculated frequency */}
                      {comp.frequency}{" "}
                      {comp.frequency === 1 ? "match" : "matches"}
                    </span>
                  </span>
                </div>

                {/* Optional: Playtime Bar (can be removed if stats row is sufficient) */}
                {maxTimePlayed > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-grow h-2 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            (comp.playtimeSeconds / maxTimePlayed) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 text-base-content/70">
            Composition data not available yet.
          </div>
        )}
      </div>

      {/* Removed "Show All" button for now */}
    </div>
  );
};
