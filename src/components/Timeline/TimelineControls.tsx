import { useTimelineContext } from "./TimelineContext";
import { formatTime } from "../../lib";

type TimeSegment = {
  title: string;
  subtitle: string;
  type: "map" | "round" | "teamfight";
  startTime: number;
  endTime: number;
};

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

  const timeScale = 100 / (mapTime.endTime - mapTime.startTime);

  const renderTimeSegment = (segment: TimeSegment) => {
    const duration = segment.endTime - segment.startTime;
    const isSelected =
      segment.startTime === startTime && segment.endTime === endTime;
    return (
      <tr
        key={`${segment.startTime}-${segment.endTime}`}
        className={`hover:bg-base-100 ${isSelected ? "bg-base-100" : ""}`}
      >
        <td
          className={`w-1/6 ${
            segment.type === "map"
              ? "font-bold"
              : segment.type === "round"
              ? "font-bold"
              : "font-normal"
          }`}
        >
          {segment.title}
        </td>
        <td className="w-1/6">{formatTime(segment.startTime)}</td>
        <td className="w-1/6">{formatTime(segment.endTime)}</td>
        <td className="w-1/2">
          <div className="flex flex-row">
            <div
              className="h-2 bg-base-300 rounded-l-full"
              style={{ width: `${segment.startTime * timeScale}%` }}
            ></div>
            <div
              className={`h-2 bg-base-content ${
                segment.startTime === mapTime.startTime &&
                segment.endTime === mapTime.endTime
                  ? "rounded-full"
                  : segment.startTime === mapTime.startTime
                  ? "rounded-l-full"
                  : segment.endTime === mapTime.endTime
                  ? "rounded-r-full"
                  : ""
              }`}
              style={{ width: `${Math.max(duration * timeScale, 1)}%` }}
            ></div>
            <div
              className="h-2 bg-base-300 rounded-r-full"
              style={{
                width: `${(mapTime.endTime - segment.endTime) * timeScale}%`,
              }}
            ></div>
          </div>
        </td>
        <td>
          <button
            className="btn btn-xs btn-outline"
            onClick={() =>
              setCurrentTimeRange({
                start: segment.startTime,
                end: segment.endTime,
              })
            }
          >
            View
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col gap-2 ml-4 mt-3">
      <div className="text-lg text-base-500 font-semibold">
        Select segment to view
      </div>
      <table className="table table-xs ">
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {renderTimeSegment({
            title: "Full Map",
            subtitle: "",
            type: "map",
            startTime: mapTime.startTime,
            endTime: mapTime.endTime,
          })}
          {roundTimes.flatMap((roundTime) => {
            const teamfightsInRound = teamfights.filter(
              (teamfight) =>
                teamfight.startTime >= roundTime.roundStartTime &&
                teamfight.endTime <= roundTime.roundEndTime
            );

            return [
              renderTimeSegment({
                title: `Round ${roundTime.roundNumber}`,
                subtitle: "",
                type: "round",
                startTime: roundTime.roundStartTime,
                endTime: roundTime.roundEndTime,
              }),
              ...teamfightsInRound.map((teamfight) =>
                renderTimeSegment({
                  title: `Teamfight`,
                  subtitle: "",
                  type: "teamfight",
                  startTime: teamfight.startTime,
                  endTime: teamfight.endTime,
                })
              ),
            ];
          })}
        </tbody>
      </table>
      {/* <ul className="menu menu-vertical bg-base-200 rounded-box">
          <li>
            <button
              className={`${
                startTime === 0 && endTime === mapTime.endTime
                  ? "bg-base-200 font-semibold"
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
                        ? "bg-base-200 font-semibold"
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
                                ? "bg-base-200 font-semibold"
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
        </ul> */}
    </div>
  );
};
