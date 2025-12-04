import { type ReactNode, useState } from "react";
import { TimelineProvider, useTimelineContext } from "./TimelineContext";
import { TimelineStrip } from "./TimelineStrip";
import { TimelineFightDetails } from "./TimelineFightDetails";
import { Teamfight } from "../../types/domain";

export const Timeline = ({ matchId }: { matchId: string }): ReactNode => {
  return (
    <TimelineProvider matchId={matchId}>
      <TimelineContent />
    </TimelineProvider>
  );
};

const TimelineContent = (): ReactNode => {
  const { loadedData } = useTimelineContext();
  const [selectedFightId, setSelectedFightId] = useState<string | undefined>(undefined);

  if (!loadedData) {
    return <div className="p-8 text-center text-gray-500">Loading match data...</div>;
  }

  const { teamfights, matchData } = loadedData;
  const userTeamName = matchData.team1Name; // Default to Team 1 for now

  const handleFightSelect = (fight: Teamfight) => {
    setSelectedFightId(fight.fightId === selectedFightId ? undefined : fight.fightId);
  };

  const selectedFight = teamfights.find(f => f.fightId === selectedFightId);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Timeline Strip */}
      <div>
        <h2 className="text-xl font-bold mb-4">Match Timeline</h2>
        <TimelineStrip 
          fights={teamfights} 
          duration={matchData.duration} 
          onFightSelect={handleFightSelect}
          selectedFightId={selectedFightId}
          userTeamName={userTeamName}
        />
      </div>

      {/* Fight Details */}
      {selectedFight ? (
        <TimelineFightDetails 
          fight={selectedFight} 
          userTeamName={userTeamName}
        />
      ) : (
        <div className="text-center p-12 border border-gray-800 rounded-lg bg-gray-900/20 text-gray-500">
          Select a fight from the timeline above to view details.
        </div>
      )}
    </div>
  );
};

export default Timeline;
