import { type ReactNode } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { useAtomValue } from "jotai";
import { detailedTeamCompositionsAtom } from "~/atoms/derived_stats/detailedTeamCompositionsAtom";
import {
  getHeroImage,
  getRoleFromHero,
  getRankForRole,
} from "~/lib/hero";
import { formatDuration } from "~/lib/time";
import RoleIcon from "~/components/Common/RoleIcon";
import { ErrorMessage } from "~/components/Common/ErrorMessage"; // Import ErrorMessage

export const TeamCompositions = (): ReactNode => {
  const { teamId } = useParams<{ teamId: string }>(); // Get teamId from URL

  if (!teamId) {
    // Handle case where teamId is not available
    return <ErrorMessage message="Team ID not found in URL." />;
  }

  // Fetch data from the new atom, passing teamId to the atomFamily
  const detailedCompositionsData = useAtomValue(
    detailedTeamCompositionsAtom(teamId)
  ); // Removed type coercion

  // Sort compositions by playtime descending
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
              className="border border-gray-700 rounded-lg p-4"
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
