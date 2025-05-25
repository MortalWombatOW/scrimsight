import { useState } from "react";
import { useAtom } from "jotai";
import { teamCompositionsAtom } from "@atoms/teamCompositionsAtom";
import { getRoleFromHero, getHeroImage, formatDuration } from "@lib";
import RoleIcon from "@components/Common/RoleIcon";

interface TeamCompositionsProps {
  teamName: string;
}

export const TeamCompositions = ({ teamName }: TeamCompositionsProps) => {
  const [showAllCompositions, setShowAllCompositions] = useState(false);
  const [compositions] = useAtom(teamCompositionsAtom);

  const teamCompositions = compositions
    .filter((c) => c.teamName === teamName)
    .filter((c) => showAllCompositions || c.timePlayed > 60)
    .sort((a, b) => b.timePlayed - a.timePlayed);

  const maxTimePlayed = Math.max(
    ...teamCompositions.map((c) => c.timePlayed),
    0
  );
  const hasHiddenCompositions = compositions.some(
    (c) => c.teamName === teamName && c.timePlayed <= 60
  );

  return (
    <div className="bg-base rounded-lg shadow-md p-4 mb-6 dark:bg-base-800">
      <h2 className="text-xl font-semibold mb-4 text-base-900 dark:text-white">
        Team Compositions
      </h2>
      {teamCompositions.length > 0 ? (
        <div>
          {hasHiddenCompositions && (
            <p
              className="text-sm cursor-pointer text-primary-600 mb-4 hover:underline dark:text-primary-400"
              onClick={() => setShowAllCompositions(!showAllCompositions)}
            >
              {showAllCompositions
                ? "Show only significant compositions"
                : "Show all compositions"}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-700 dark:border-gray-700">
            {["tank", "damage", "support"].map((role) => (
              <div className="md:col-span-3" key={role}>
                <div className="flex items-center gap-2">
                  <RoleIcon role={role} color="primary" />
                  <p className="text-sm font-medium text-base-700 dark:text-base-300">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </p>
                </div>
              </div>
            ))}
            <div className="md:col-span-3">
              <p className="text-sm font-medium text-base-700 dark:text-base-300">
                Time Played
              </p>
            </div>
          </div>

          {teamCompositions.map((composition, index) => {
            const groupedHeroes = composition.heroes.reduce((acc, hero) => {
              const role = getRoleFromHero(hero);
              acc[role] = [...(acc[role] || []), hero].sort();
              return acc;
            }, {} as Record<string, string[]>);

            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-2"
              >
                {["tank", "damage", "support"].map((role) => (
                  <div className="md:col-span-3" key={role}>
                    <div className="flex gap-2">
                      {groupedHeroes[role]?.map((hero) => (
                        <img
                          key={hero}
                          src={getHeroImage(hero)}
                          className="w-8 h-8 rounded-full"
                          alt={hero}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{
                        width:
                          Math.max(
                            (composition.timePlayed / maxTimePlayed) * 200,
                            1
                          ) + "px",
                      }}
                    />
                    <p className="text-sm text-base-600 whitespace-nowrap dark:text-base-400">
                      {formatDuration(composition.timePlayed)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-base-500 dark:text-base-400">
          No composition data available
        </p>
      )}
    </div>
  );
};
