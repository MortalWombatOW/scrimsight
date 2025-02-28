import React from "react";
import { Link } from "react-router-dom";
import { matchDataAtom } from "../../atoms";
import { useAtomValue } from "jotai";
import ZeroState from "./ZeroState";

export const HomePage = (): React.ReactNode => {
  const modules = [
    {
      title: "Files",
      description: "Upload and manage scrim files for analysis.",
      route: "/files",
    },
    {
      title: "Matches",
      description: "View and analyze all the scrim matches.",
      route: "/matches",
    },
    {
      title: "Teams",
      description: "Review team statistics and player compositions.",
      route: "/teams",
    },
    {
      title: "Players",
      description: "Explore individual player stats and history.",
      route: "/players",
    },
  ];

  const matchData = useAtomValue(matchDataAtom);
  const hasData = matchData.length > 0;

  if (!hasData) {
    return <ZeroState />;
  }

  return (
    <div>
      <img
        src="/assets/fullpage/eqo.png"
        alt="Scrimsight"
        className="h-auto w-full max-h-[80vh] object-cover"
      />
      <div className="container mx-auto flex flex-wrap justify-between gap-4 -mt-24 px-4">
        {modules.map((module) => (
          <div
            key={module.title}
            className="w-64 bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
          >
            <div className="p-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {module.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {module.description}
              </p>
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
              <Link
                to={module.route}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Explore {module.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
