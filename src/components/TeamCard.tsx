import React from "react";
import { useAtomValue } from "jotai";
import { teamStatsAtom } from "../atoms/teamStatsAtom";
import { Link } from "react-router-dom";

interface TeamCardProps {
  teamName: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
};

const TeamCard: React.FC<TeamCardProps> = ({ teamName }) => {
  const teamStats = useAtomValue(teamStatsAtom);

  const team = teamStats.find((team) => team.teamName === teamName);

  return (
    <Link to={`/teams/${teamName}`} className="no-underline">
      <div className="w-[400px] p-4 border-2 border-transparent hover:border-primary-500 transition-colors duration-300 rounded-md shadow-sm">
        <div className="p-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1">
              {getInitials(teamName)}
            </div>
            <h2 className="text-xl font-bold ml-2 mb-1">{teamName}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Record</p>
              <div className="flex items-center gap-1">
                <span className="text-green-500">{team?.wins} W</span>
                <span className="text-gray-500">/</span>
                <span className="text-yellow-500">{team?.draws} D</span>
                <span className="text-gray-500">/</span>
                <span className="text-red-400">{team?.losses} L</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Most Recent Game
              </p>
              <p>
                {team?.mostRecentGameDate
                  ? team.mostRecentGameDate.toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 font-medium">Players</p>
              <p>{team?.players.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
