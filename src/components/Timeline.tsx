import { type ReactNode } from "react";
import { TimelineProvider, TimelineTable, TimelineEvents, TimelineControls } from "@components";

export const Timeline = ({ matchId }: { matchId: string }): ReactNode => {
  return (
    <TimelineProvider matchId={matchId}>
      <TimelineContent />
    </TimelineProvider>
  );
};

const TimelineContent = (): ReactNode => {
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
