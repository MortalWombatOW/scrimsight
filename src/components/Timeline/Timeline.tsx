import React, { useState } from "react";
import { TimelineRenderer, TimelineSegments } from "./components";
import { TimelineEvents } from "./components/TimelineEvents";
/**
 * Timeline component for visualizing match flow
 * This component acts as the container for the entire timeline visualization,
 * integrating THREE.js rendering with React UI controls
 */
export const Timeline: React.FC<{ matchId: string }> = ({ matchId }) => {
  const [currentTimeRange, setCurrentTimeRange] = useState({
    start: 0,
    end: 100,
  });

  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
    null
  );

  return (
    <div className="flex flex-row flex-wrap">
      <div className="flex flex-col w-full">
        {/* Main visualization container */}
        <div className="flex-grow relative h-[600px]">
          <TimelineRenderer
            matchId={matchId}
            currentTimeRange={currentTimeRange}
          />
        </div>

        {/* Time segments navigation panel with integrated controls */}
        <TimelineSegments
          matchId={matchId}
          selectedSegmentId={selectedSegmentId}
          setSelectedSegmentId={setSelectedSegmentId}
          currentTimeRange={currentTimeRange}
          setCurrentTimeRange={setCurrentTimeRange}
        />
      </div>
      <TimelineEvents matchId={matchId} currentTimeRange={currentTimeRange} />
    </div>
  );
};

export default Timeline;
