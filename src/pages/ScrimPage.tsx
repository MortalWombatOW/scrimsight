import { formatTime } from "@library";
import { IoTimeOutline } from "react-icons/io5";
import { TbTournament } from "react-icons/tb";
import { useParams } from "react-router-dom";
import {
  Container,
  ScrimTeamStats,
  ScrimPlayerStats,
  ScrimMatchList,
} from "@components";
import { useScrims } from "../hooks/useScrims";

export const ScrimPage = () => {
  const { scrimId } = useParams<{ scrimId: string }>();
  const scrimData = useScrims();

  if (!scrimId)
    return <div className="text-center p-4">No Scrim ID provided.</div>;

  // Find the scrim using the constructed scrimId format
  const scrim = scrimData.find(
    (s) => `${s.dateString}-${s.team1Name}-vs-${s.team2Name}` === scrimId
  );

  if (!scrim) return <div className="text-center p-4">Scrim not found.</div>;

  const {
    team1Name,
    team2Name,
    dateString,
    duration,
    team1Players,
    team2Players,
  } = scrim;
  const allPlayerIds = [...team1Players, ...team2Players];

  return (
    <Container>
      <div className="bg-base-200 border border-gray-700 border-gray-700 shadow-md rounded-lg mb-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TbTournament className="text-2xl" />
              Scrim: {team1Name} vs {team2Name}
            </h1>
            <p className="text-base-content/70 mt-1">{dateString}</p>
          </div>
          <div className="stats shadow bg-base-100 text-base-content rounded-lg">
            <div className="stat place-items-center">
              <div className="stat-title text-base-content/70">
                Total Duration
              </div>
              <div className="stat-value text-xl flex items-center gap-2">
                <IoTimeOutline />
                {formatTime(duration)}
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title text-base-content/70">
                Overall Score
              </div>
              <div className="stat-value text-xl">
                {scrim.team1Wins} - {scrim.team2Wins}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Team Cards with Scrim Stats */}
      <h2 className="text-2xl font-semibold mb-4">Team Performance</h2>
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
        <ScrimTeamStats
          scrimId={scrimId}
          teamName={team1Name}
          players={team1Players}
        />
        <ScrimTeamStats
          scrimId={scrimId}
          teamName={team2Name}
          players={team2Players}
        />
      </div>
      {/* Player Cards with Scrim Stats */}
      <h2 className="text-2xl font-semibold mb-4">Player Performance</h2>
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
        {allPlayerIds.map((playerId) => (
          <ScrimPlayerStats
            key={playerId}
            scrimId={scrimId}
            playerId={playerId}
            teamName={
              team1Players.includes(playerId) ? team1Name : team2Name
            }
          />
        ))}
      </div>
      {/* Match Cards */}
      <h2 className="text-2xl font-semibold mb-4">Matches</h2>
      <ScrimMatchList scrimId={scrimId} />
    </Container>
  );
};

export default ScrimPage;
