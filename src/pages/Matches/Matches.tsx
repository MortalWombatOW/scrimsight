import { useAtomValue } from "jotai";
import { MatchData, matchDataAtom } from "../../atoms/matchDataAtom";
import { useNavigate } from "react-router-dom";
import { Suspense, useMemo } from "react";
import { mapNameToFileName } from "../../lib";
import { scrimAtom } from "../../atoms/scrimAtom";
import { useStats } from "../../atoms/metrics/playerMetricsAtoms";
import { getHeroImage, formatTime } from "../../lib";
import { CiMap } from "react-icons/ci";

const PlayerCard = ({
  playerName,
  matchId,
}: {
  playerName: string;
  matchId: string;
}) => {
  const playerStats = useStats(
    ["playerHero"],
    { playerName: [playerName], matchId: [matchId] },
    "playtime"
  );
  const tooltipContent = useMemo(
    () =>
      `${playerStats.rows[0].playerHero} - ${formatTime(
        playerStats.rows[0].playtime
      )}`,
    [playerStats]
  );

  return (
    <div className={`rounded-md p-2 bg-gray-800 dark:bg-gray-900`}>
      <div className="flex items-center">
        <div className="relative group">
          <img
            src={getHeroImage(playerStats.rows[0].playerHero, true)}
            alt={playerStats.rows[0].playerHero}
            className="h-6 w-6 rounded-lg mr-2"
          />
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 
                           hidden group-hover:block bg-gray-800 text-white text-xs rounded p-1 z-10 whitespace-nowrap"
          >
            {tooltipContent}
          </div>
        </div>
        <span className="text-sm text-white">{playerName}</span>
      </div>
    </div>
  );
};

const MatchCard = ({ matchId }: { matchId: string }) => {
  const matchData = useAtomValue(matchDataAtom);
  const match = matchData.find((match) => match.matchId === matchId);
  const playerStats = useStats(["playerName", "playerRole", "playerTeam"], {
    matchId: [matchId],
  });
  const navigate = useNavigate();

  if (!match) {
    throw new Error(`Match ${matchId} not found in matchData`);
  }

  return (
    <div className="bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 p-4 rounded-lg mb-2">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="flex justify-center">
            <div className="flex flex-col space-y-1">
              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "tank" &&
                    stats.playerTeam === match.team1Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "damage" &&
                    stats.playerTeam === match.team1Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "support" &&
                    stats.playerTeam === match.team1Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-center">
              <img
                src={mapNameToFileName(match.map, false)}
                alt={match.map}
                className="h-[100px] w-[100px] rounded-md"
              />
            </div>
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <CiMap />
                <span className="text-white">{match.map}</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <div className="bg-blue-900 p-2 text-center">
                  <span className="text-white">{match.team1Score}</span>
                </div>
                <div className="bg-red-900 p-2 text-center">
                  <span className="text-white">{match.team2Score}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => navigate(`/matches/${matchId}`)}
              >
                View Match
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex justify-center">
            <div className="flex flex-col space-y-1">
              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "tank" &&
                    stats.playerTeam === match.team2Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "damage" &&
                    stats.playerTeam === match.team2Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}

              {playerStats.rows
                .filter(
                  (stats) =>
                    stats.playerRole === "support" &&
                    stats.playerTeam === match.team2Name
                )
                .map((stats) => (
                  <PlayerCard
                    key={stats.playerName}
                    playerName={stats.playerName}
                    matchId={matchId}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeamScoreRowProps {
  teamName: string;
  matchIds: string[];
  matchData: MatchData[];
  wins: number;
  teamColor: string;
  teamNameWidth: number;
  matchScoreWidth: number;
  finalScoreWidth: number;
  isTeam1: boolean;
}

const TeamScoreRow = ({
  teamName,
  matchIds,
  matchData,
  wins,
  teamColor,
  teamNameWidth,
  matchScoreWidth,
  finalScoreWidth,
  isTeam1,
}: TeamScoreRowProps) => {
  const opponentScores = matchIds.map((matchId) => {
    const match = matchData.find((match) => match.matchId === matchId);
    if (!match) throw new Error(`Match ${matchId} not found in matchData`);
    const score = isTeam1 ? match.team1Score : match.team2Score;
    return {
      score,
      won: score > (isTeam1 ? match.team2Score : match.team1Score),
    };
  });

  return (
    <div className="flex items-center">
      <div className="flex justify-end" style={{ width: `${teamNameWidth}px` }}>
        <div
          className={`${teamColor} px-2 py-1 rounded flex justify-center items-center`}
          style={{ minWidth: "120px" }}
        >
          <span className="text-white">{teamName}</span>
        </div>
      </div>
      <div
        className="flex"
        style={{ width: `${matchScoreWidth * opponentScores.length}px` }}
      >
        {opponentScores.map((scoreObj, i) => (
          <div
            key={i}
            className={`flex justify-center items-center px-2 border-l border-gray-700 ${
              scoreObj.won ? "bg-green-900/30" : "bg-red-900/30"
            }`}
            style={{ width: `${matchScoreWidth}px` }}
          >
            <span className="text-white">{scoreObj.score}</span>
          </div>
        ))}
      </div>
      <div
        className={`flex justify-center items-center border-l border-gray-700 ${teamColor}`}
        style={{ width: `${finalScoreWidth}px` }}
      >
        <span className="text-white font-semibold">{wins}</span>
      </div>
    </div>
  );
};

interface ScrimHeaderProps {
  scrim: {
    team1Name: string;
    team2Name: string;
    team1Wins: number;
    team2Wins: number;
    matchIds: string[];
  };
  matchData: MatchData[];
}

const ScrimHeader = ({ scrim, matchData }: ScrimHeaderProps) => {
  const teamNameWidth = 135;
  const matchScoreWidth = 50;
  const finalScoreWidth = 80;

  return (
    <div className="bg-gray-800 dark:bg-gray-900 rounded-t-lg overflow-hidden">
      <div className="flex">
        <div
          className="flex justify-end"
          style={{ width: `${teamNameWidth}px` }}
        >
          <div className="px-2 py-1">
            <span className="text-gray-400 text-sm">Team</span>
          </div>
        </div>
        <div
          className="flex"
          style={{ width: `${matchScoreWidth * scrim.matchIds.length}px` }}
        >
          {scrim.matchIds.map((_, i) => (
            <div
              key={i}
              className="flex justify-center items-center px-2 border-l border-gray-700"
              style={{ width: `${matchScoreWidth}px` }}
            >
              <span className="text-gray-400 text-sm">Match {i + 1}</span>
            </div>
          ))}
        </div>
        <div
          className="flex justify-center items-center border-l border-gray-700"
          style={{ width: `${finalScoreWidth}px` }}
        >
          <span className="text-gray-400 text-sm">Final</span>
        </div>
      </div>
      <TeamScoreRow
        teamName={scrim.team1Name}
        matchIds={scrim.matchIds}
        matchData={matchData}
        wins={scrim.team1Wins}
        teamColor="bg-blue-700"
        teamNameWidth={teamNameWidth}
        matchScoreWidth={matchScoreWidth}
        finalScoreWidth={finalScoreWidth}
        isTeam1={true}
      />
      <TeamScoreRow
        teamName={scrim.team2Name}
        matchIds={scrim.matchIds}
        matchData={matchData}
        wins={scrim.team2Wins}
        teamColor="bg-red-700"
        teamNameWidth={teamNameWidth}
        matchScoreWidth={matchScoreWidth}
        finalScoreWidth={finalScoreWidth}
        isTeam1={false}
      />
    </div>
  );
};

const MatchDateGroup = ({ dateString }: { dateString: string }) => {
  const matchData = useAtomValue(matchDataAtom);
  const scrims = useAtomValue(scrimAtom);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {dateString}
      </h2>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        }
      >
        {scrims.map((scrim) => (
          <div
            key={`${scrim.team1Name}-${scrim.team2Name}-${scrim.dateString}`}
            className="mb-4"
          >
            <div className="bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden">
              <ScrimHeader scrim={scrim} matchData={matchData} />
              <div className="p-4">
                {scrim.matchIds
                  .filter((matchId) =>
                    matchData.some((match) => match.matchId === matchId)
                  )
                  .map((matchId) => (
                    <Suspense
                      key={matchId}
                      fallback={
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                      }
                    >
                      <MatchCard matchId={matchId} />
                    </Suspense>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </Suspense>
    </div>
  );
};

export const MatchesPage = () => {
  const navigate = useNavigate();

  const matchData = useAtomValue(matchDataAtom);

  if (matchData.length === 0) {
    console.log("No match data found, redirecting to home");
    navigate("/");
  }

  const uniqueDates = Array.from(
    new Set(matchData.map((match) => match.dateString))
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Matches
      </h1>

      {uniqueDates.map((dateString) => (
        <MatchDateGroup key={dateString} dateString={dateString} />
      ))}
    </div>
  );
};
