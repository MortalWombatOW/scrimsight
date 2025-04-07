import type { ReactNode } from "react";
import { useTimelineContext } from "./TimelineContext";
import { formatTime } from "../../lib";

type TimeSegment = {
  title: string;
  subtitle: string;
  type: "map" | "round" | "teamfight";
  startTime: number;
  endTime: number;
  winner?: string | null; // Added winner for teamfights
};

export const TimelineControls = (): ReactNode => {
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

    // Determine background color based on winner
    let bgColorClass = "bg-base-200 hover:bg-base-300"; // Default grey
    if (segment.type === "teamfight" && segment.winner) {
      if (segment.winner === loadedData?.matchData?.team1Name) {
        bgColorClass = "bg-success/20 hover:bg-success/30 text-success-content"; // Green for team 1 win
      } else if (segment.winner === loadedData?.matchData?.team2Name) {
        bgColorClass = "bg-error/20 hover:bg-error/30 text-error-content"; // Red for team 2 win
      }
    }
    if (isSelected) {
      bgColorClass = "bg-primary text-primary-content"; // Highlight selected
    }

    return (
      <div
        key={`${segment.startTime}-${segment.endTime}`}
        className={`p-2 border border-base-300 rounded-md shadow-sm cursor-pointer ${bgColorClass} w-48 flex flex-col gap-1`} // Fixed width, flex col
        onClick={() =>
          setCurrentTimeRange({
            start: segment.startTime,
            end: segment.endTime,
          })
        }
      >
        {/* Title */}
        <div
          className={`text-sm truncate ${
            segment.type === "map" || segment.type === "round"
              ? "font-bold"
              : "font-normal"
          }`}
          title={segment.title}
        >
          {segment.title}
        </div>

        {/* Times */}
        <div className="text-xs opacity-80">
          {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
        </div>

        {/* Duration Bar */}
        <div className="flex flex-row w-full h-2 mt-auto">
          {" "}
          {/* Ensure bar is at bottom */}
          <div
            className="h-full bg-base-300/50 rounded-l-full"
            style={{ width: `${segment.startTime * timeScale}%` }}
          ></div>
          <div
            className={`h-full ${
              isSelected ? "bg-primary-content/80" : "bg-base-content/80"
            } ${
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
            className="h-full bg-base-300/50 rounded-r-full"
            style={{
              width: `${(mapTime.endTime - segment.endTime) * timeScale}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 ml-4 mt-3">
      <div className="text-lg text-base-500 font-semibold mb-2">
        {" "}
        {/* Added mb-2 */}
        Select segment to view
      </div>
      {/* Replace table with flex container */}
      <div className="flex flex-wrap gap-2">
        {/* Render Full Map segment */}
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
                winner: teamfight.winner, // Pass winner from teamfight data
              })
            ),
          ];
        })}
      </div>
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
