import { useTimelineContext } from "./TimelineContext";
import { formatTime } from "../../lib";

export const TimelineControls: React.FC = () => {
  const {
    currentTimeRange,
    setCurrentTimeRange,
    loadedData,
  } = useTimelineContext();

  const startTime = currentTimeRange.start;
  const endTime = currentTimeRange.end;

  if (!loadedData) {
    return <div>Loading...</div>;
  }

  const { mapTime, roundTimes, teamfights } = loadedData;

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-2 ml-4 mt-3">
        <div className="text-sm text-gray-500 font-semibold">Go to segment</div>
        <ul className="menu menu-vertical bg-base-200 rounded-box">
          <li>
            <button
              className={`${
                startTime === 0 && endTime === mapTime.endTime
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() =>
                setCurrentTimeRange({ start: 0, end: mapTime.endTime })
              }
            >
              Full Map
            </button>
            <ul className="menu menu-horizontal bg-base-200 rounded-box">
              {roundTimes.map((roundTime) => (
                <li key={roundTime.roundNumber}>
                  <button
                    className={`${
                      roundTime.roundStartTime === startTime &&
                      roundTime.roundEndTime === endTime
                        ? "bg-gray-200 font-semibold"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentTimeRange({
                        start: roundTime.roundStartTime,
                        end: roundTime.roundEndTime,
                      })
                    }
                  >
                    Round {roundTime.roundNumber}
                  </button>
                  <ul className="menu menu-horizontal bg-base-200 rounded-box">
                    {teamfights
                      .filter(
                        (teamfight) =>
                          teamfight.startTime >= roundTime.roundStartTime &&
                          teamfight.endTime <= roundTime.roundEndTime
                      )
                      .map((teamfight, index) => (
                        <li key={teamfight.startTime}>
                          <button
                            className={`${
                              teamfight.startTime === startTime &&
                              teamfight.endTime === endTime
                                ? "bg-gray-200 font-semibold"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrentTimeRange({
                                start: teamfight.startTime,
                                end: teamfight.endTime,
                              })
                            }
                          >
                            TF {index + 1}
                          </button>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      <div className=" flex flex-col gap-2 ml-4 mt-3">
        <div className="text-sm text-gray-500 font-semibold">
          Selected Time Range
        </div>
        <div className="ml-4">
          <div className="text-sm text-gray-500">Start</div>
          <div className="text-lg font-bold">
            {formatTime(currentTimeRange.start)}
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm text-gray-500">End</div>
          <div className="text-lg font-bold">
            {formatTime(currentTimeRange.end)}
          </div>
        </div>
      </div>
    </div>
  );
};
