import { type ReactNode } from "react";
import { TimelineProvider } from "./TimelineContext";
import { TimelineTable } from "./TimelineTable";
import { TimelineEvents } from "./TimelineEvents";
// Removed unused TimelineDisplay import
import { TimelineControls } from "./TimelineControls";

/**
 * Timeline component for visualizing match flow
 * This component acts as the container for the entire timeline visualization,
 * integrating THREE.js rendering with React UI controls
 */
export const Timeline = ({ matchId }: { matchId: string }): ReactNode => {
  return (
    <TimelineProvider matchId={matchId}>
      <TimelineContent />
    </TimelineProvider>
  );
};

const TimelineContent = (): ReactNode => {
  // These context values will be used in child components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 row-span-1 border border-gray-700 border-gray-700 rounded-md">
        <TimelineControls />
      </div>
      <div className="col-span-2 sm:col-span-1 border border-gray-700 border-gray-700 rounded-md">
        <TimelineTable />
      </div>

      <div className="col-span-2 sm:col-span-1 border border-gray-700 border-gray-700 rounded-md">
        <TimelineEvents />
      </div>
    </div>
  );
};

export default Timeline;
