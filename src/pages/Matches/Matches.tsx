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
    <div className="card bg-base-300 p-2 mb-1">
      <div className="flex items-center">
        <div className="relative group">
          <img
            src={getHeroImage(playerStats.rows[0].playerHero, true)}
            alt={playerStats.rows[0].playerHero}
            className="h-6 w-6 rounded-lg mr-2"
          />
          <div className="tooltip tooltip-top" data-tip={tooltipContent}>
            <span className="text-sm text-base-content">{playerName}</span>
          </div>
        </div>
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
    <div className="card bg-base-200 border border-base-300 p-4 rounded-lg mb-4 shadow-md">
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
          <div className="flex flex-col space-y-3 items-center">
            <div className="flex justify-center">
              <img
                src={mapNameToFileName(match.map, false)}
                alt={match.map}
                className="h-[100px] w-[100px] rounded-md shadow-sm"
              />
            </div>
            <div className="badge badge-lg badge-outline gap-2">
              <CiMap className="h-4 w-4" />
              <span>{match.map}</span>
            </div>
            <div className="stats shadow-md bg-base-300">
              <div className="stat place-items-center">
                <div className="stat-title text-xs">Team 1</div>
                <div className="stat-value text-xl">{match.team1Score}</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title text-xs">Team 2</div>
                <div className="stat-value text-xl">{match.team2Score}</div>
              </div>
            </div>
            <button
              className="btn btn-outline mt-2"
              onClick={() => navigate(`/matches/${matchId}`)}
            >
              View Match
            </button>
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
          className="bg-base-300 px-3 py-2 rounded-md flex justify-center items-center"
          style={{ minWidth: "120px" }}
        >
          <span className="font-medium">{teamName}</span>
        </div>
      </div>
      <div
        className="flex"
        style={{ width: `${matchScoreWidth * opponentScores.length}px` }}
      >
        {opponentScores.map((scoreObj, i) => (
          <div
            key={i}
            className={`flex justify-center items-center px-2 border-l border-base-300 ${
              scoreObj.won ? "bg-base-200" : "bg-base-100"
            }`}
            style={{ width: `${matchScoreWidth}px` }}
          >
            <span>{scoreObj.score}</span>
          </div>
        ))}
      </div>
      <div
        className="flex justify-center items-center border-l border-base-300 bg-base-300"
        style={{ width: `${finalScoreWidth}px` }}
      >
        <span className="font-semibold">{wins}</span>
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
    <div className="bg-base-100 rounded-t-lg overflow-hidden shadow-sm">
      <div className="flex">
        <div
          className="flex justify-end"
          style={{ width: `${teamNameWidth}px` }}
        >
          <div className="px-3 py-2">
            <span className="text-base-content/70 text-sm font-medium">
              Team
            </span>
          </div>
        </div>
        <div
          className="flex"
          style={{ width: `${matchScoreWidth * scrim.matchIds.length}px` }}
        >
          {scrim.matchIds.map((_, i) => (
            <div
              key={i}
              className="flex justify-center items-center px-2 border-l border-base-300"
              style={{ width: `${matchScoreWidth}px` }}
            >
              <span className="text-base-content/70 text-sm">
                Match {i + 1}
              </span>
            </div>
          ))}
        </div>
        <div
          className="flex justify-center items-center border-l border-base-300"
          style={{ width: `${finalScoreWidth}px` }}
        >
          <span className="text-base-content/70 text-sm font-medium">
            Final
          </span>
        </div>
      </div>
      <TeamScoreRow
        teamName={scrim.team1Name}
        matchIds={scrim.matchIds}
        matchData={matchData}
        wins={scrim.team1Wins}
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
      <h2 className="text-xl font-semibold mb-4">{dateString}</h2>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        }
      >
        <div className="space-y-6">
          {scrims.map((scrim) => (
            <div
              key={`${scrim.team1Name}-${scrim.team2Name}-${scrim.dateString}`}
              className="card bg-base-100 shadow-lg overflow-hidden"
            >
              <div className="card-body p-0">
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
                          <div className="flex justify-center py-4">
                            <span className="loading loading-spinner loading-md"></span>
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
        </div>
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
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Matches</h1>

      <div className="divide-y divide-base-300">
        {uniqueDates.map((dateString) => (
          <MatchDateGroup key={dateString} dateString={dateString} />
        ))}
      </div>
    </div>
  );
};
