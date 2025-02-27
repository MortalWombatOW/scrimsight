import { useParams } from "react-router-dom";
import { PlayerMetricsDashboard } from "../../components/Player/PlayerMetricsDashboard";
import { PlayerDetailedStats } from "../../components/Player/PlayerDetailedStats";
import { PlayerMatchHistory } from "../../components/Player/PlayerMatchHistory";

export const PlayerPage = () => {
  const { playerName } = useParams<{ playerName: string }>();

  if (!playerName) {
    return <div>No player selected</div>;
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mt-8">
        <div className="flex flex-col space-y-8">
          <div>
            <PlayerMetricsDashboard playerName={playerName} />
          </div>

          <div>
            <PlayerDetailedStats playerName={playerName} />
          </div>

          <div>
            <PlayerMatchHistory playerName={playerName} />
          </div>
        </div>
      </div>
    </div>
  );
};
