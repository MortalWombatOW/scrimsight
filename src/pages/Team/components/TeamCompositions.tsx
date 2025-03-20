import React, { useState } from "react";
import { TeamComposition } from "../../../atoms/teamCompositionsAtom";
import { getHeroImage, getRoleFromHero } from "../../../lib/hero";
import { formatDuration } from "../../../lib/time";
import RoleIcon from "../../../components/Common/RoleIcon";

interface TeamCompositionsProps {
  compositions: TeamComposition[];
  teamName: string;
}

export const TeamCompositions: React.FC<TeamCompositionsProps> = ({
  compositions,
  teamName,
}) => {
  const [showAllCompositions, setShowAllCompositions] = useState(false);

  const filteredCompositions = compositions
    .filter((c) => showAllCompositions || c.timePlayed > 60)
    .sort((a, b) => b.timePlayed - a.timePlayed);

  const maxTimePlayed = Math.max(...compositions.map((c) => c.timePlayed), 0);
  const hasHiddenCompositions = compositions.some((c) => c.timePlayed <= 60);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Team Compositions</h2>
      
      <div className="grid gap-4">
        {filteredCompositions.map((comp, index) => (
          <div
            key={index}
            className="border border-base-300 rounded-lg p-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {comp.heroes.map((hero) => (
                  <div key={hero} className="relative">
                    <img
                      src={getHeroImage(hero)}
                      alt={hero}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <RoleIcon role={getRoleFromHero(hero)} className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-grow h-2 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(comp.timePlayed / maxTimePlayed) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-base-content/70 whitespace-nowrap">
                  {formatDuration(comp.timePlayed)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasHiddenCompositions && (
        <button
          onClick={() => setShowAllCompositions(!showAllCompositions)}
          className="text-primary hover:text-primary-focus underline"
        >
          {showAllCompositions ? "Show fewer compositions" : "Show all compositions"}
        </button>
      )}
    </div>
  );
};