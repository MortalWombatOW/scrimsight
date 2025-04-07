import React, { useMemo, type ReactNode } from "react";
import { useAtomValue } from "jotai";
import { useTimelineContext } from "./TimelineContext";
import { formatTime, getHeroImage } from "../../lib";
import { groupedKillOffensiveAssistExtractorAtom } from "../../atoms/groupedEventsAtom";

export const TimelineDisplay = (): ReactNode => {
  const {
    currentTimeRange,
    loadedData,
    selectedEventId,
    setSelectedEventId,
  } = useTimelineContext();

  // If "loadedData" is not ready, show a loading state
  if (!loadedData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg text-base-400"></div>
      </div>
    );
  }

  const { matchData } = loadedData;

  // Pull our grouped kill+assist events from the atom
  const killAssistGroups = useAtomValue(
    groupedKillOffensiveAssistExtractorAtom
  );

  // Create an x-scale mapping [start, end] => [0%, 100%]
  const xScale = useMemo(() => {
    return (time: number) => {
      return (
        ((time - currentTimeRange.start) /
          (currentTimeRange.end - currentTimeRange.start)) *
        100
      );
    };
  }, [currentTimeRange]);

  // Generate tick marks
  const tickMarks = useMemo(() => {
    const numberOfTicks = 10;
    const tickArray = [];
    for (let i = 0; i <= numberOfTicks; i++) {
      const position = i * (100 / numberOfTicks);
      const time =
        currentTimeRange.start +
        (i / numberOfTicks) * (currentTimeRange.end - currentTimeRange.start);
      tickArray.push({
        position,
        label: formatTime(time),
        time,
      });
    }
    return tickArray;
  }, [currentTimeRange]);

  // Filter kill+assist groups to just those within our [start, end] range
  const visibleKillAssistGroups = useMemo(() => {
    if (!matchData) return [];
    return killAssistGroups.filter(
      (g) =>
        g.matchId === matchData.matchId &&
        g.matchTime >= currentTimeRange.start &&
        g.matchTime <= currentTimeRange.end
    );
  }, [killAssistGroups, matchData, currentTimeRange]);

  // A small helper to render an icon + label for each kill or assist
  const EventBadge = ({
    label,
    eventType,
    victimInfo,
    onHover,
    active,
    teamColor,
  }: {
    label: string;
    eventType: string;
    victimInfo?: { name: string; hero: string } | null;
    onHover: () => void;
    active: boolean;
    teamColor: "team1" | "team2";
  }) => {
    const borderColor =
      teamColor === "team1"
        ? "border-red-600 bg-red-100"
        : "border-blue-600 bg-blue-100";

    const activeEffect = active
      ? "scale-105 z-10 shadow-sm ring-1 ring-base-300 ring-opacity-50"
      : "";

    return (
      <div
        className="flex items-center cursor-pointer group py-0.5"
        onMouseEnter={onHover}
        onMouseLeave={() => setSelectedEventId(null)}
      >
        <div
          className={`rounded-full border border-gray-700 ${activeEffect} ${borderColor} flex-shrink-0`}
          style={{ padding: "2px" }}
        >
          {/* <img
            src={getHeroImage(hero)}
            alt={hero}
            className="w-5 h-5 rounded-full"
          /> */}
        </div>
        <div className="flex flex-col ml-1.5">
          <div className="text-xs text-base-700 font-medium leading-none">
            {label}
          </div>
          <div className="flex items-center text-[10px] text-base-500 leading-none">
            {eventType}
            {victimInfo && (
              <div className="flex items-center ml-0.5">
                <span className="mx-0.5">→</span>
                <div
                  className="rounded-full border border-gray-700 border-gray-700 flex-shrink-0"
                  style={{ padding: "1px" }}
                >
                  <img
                    src={getHeroImage(victimInfo.hero)}
                    alt={victimInfo.hero}
                    className="w-3 h-3 rounded-full"
                  />
                </div>
                <span className="font-medium ml-0.5">{victimInfo.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render one "cluster" per grouped instant in time
  const renderKillAssistGroup = (
    group: typeof visibleKillAssistGroups[number],
    index: number
  ) => {
    // Split events by team
    const team1Kills = group.kills.filter(
      (k) => k.attackerTeam === matchData.team1Name
    );
    const team2Kills = group.kills.filter(
      (k) => k.attackerTeam === matchData.team2Name
    );
    const team1Assists = group.assists.filter(
      (a) => a.playerTeam === matchData.team1Name
    );
    const team2Assists = group.assists.filter(
      (a) => a.playerTeam === matchData.team2Name
    );

    // Only render if there are events to show
    if (
      team1Kills.length === 0 &&
      team2Kills.length === 0 &&
      team1Assists.length === 0 &&
      team2Assists.length === 0
    ) {
      return null;
    }

    // Render a cluster of events for each team
    const EventCluster = ({
      events,
      isTeam1,
    }: {
      events: Array<{ type: "kill" | "assist"; data: any }>;
      isTeam1: boolean;
    }) => {
      if (events.length === 0) return null;

      const yOffset = isTeam1 ? -45 : 45;
      const teamColor = isTeam1 ? "team1" : "team2";
      const lineColor = isTeam1 ? "bg-base-600" : "bg-base-500";

      return (
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${xScale(group.matchTime)}%`,
            transform: "translateX(-50%)",
            top: "50%",
          }}
        >
          {/* Line connecting to timeline */}
          <div
            className={`w-px absolute ${lineColor}`}
            style={{
              top: isTeam1 ? `${yOffset}px` : "0px",
              bottom: isTeam1 ? "0px" : `${-yOffset}px`,
            }}
          />

          {/* Event badges container */}
          <div
            className="flex flex-col py-1 px-1.5 rounded bg-base bg-opacity-70 backdrop-blur-sm shadow-sm"
            style={{
              marginTop: isTeam1 ? `${yOffset - 5}px` : "0px",
              marginBottom: isTeam1 ? "0px" : `${-yOffset + 5}px`,
              maxWidth: "220px",
              minWidth: "140px",
            }}
          >
            {events.map((event, i) => {
              if (event.type === "kill") {
                const kill = event.data;
                return (
                  <EventBadge
                    key={`kill-${kill.attackerName}-${kill.victimName}-${i}`}
                    label={kill.attackerName}
                    eventType="Kill"
                    victimInfo={{
                      name: kill.victimName,
                      hero: kill.victimHero,
                    }}
                    onHover={() => setSelectedEventId(kill.matchId)}
                    active={selectedEventId === kill.matchId}
                    teamColor={teamColor}
                  />
                );
              } else {
                const assist = event.data;
                return (
                  <EventBadge
                    key={`assist-${assist.playerName}-${i}`}
                    label={assist.playerName}
                    eventType="Assist"
                    victimInfo={null}
                    onHover={() => setSelectedEventId(assist.matchId)}
                    active={selectedEventId === assist.matchId}
                    teamColor={teamColor}
                  />
                );
              }
            })}
          </div>
        </div>
      );
    };

    // Combine kills and assists for each team
    const team1Events = [
      ...team1Kills.map((kill) => ({ type: "kill" as const, data: kill })),
      ...team1Assists.map((assist) => ({
        type: "assist" as const,
        data: assist,
      })),
    ];

    const team2Events = [
      ...team2Kills.map((kill) => ({ type: "kill" as const, data: kill })),
      ...team2Assists.map((assist) => ({
        type: "assist" as const,
        data: assist,
      })),
    ];

    return (
      <React.Fragment key={`killAssistGroup-${index}`}>
        {team1Events.length > 0 && (
          <EventCluster events={team1Events} isTeam1={true} />
        )}
        {team2Events.length > 0 && (
          <EventCluster events={team2Events} isTeam1={false} />
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="card bg-base-100 shadow-sm mb-8">
      <div className="card-body p-3 h-[600px]">
        <h2 className="card-title text-base-700 text-lg font-semibold mb-3">
          Events Timeline
        </h2>

        <div className="relative w-full">
          {/* Top time labels */}
          <div className="relative w-full h-4 mb-1">
            {tickMarks.map((tick, index) => (
              <div
                key={`label-${index}`}
                className="absolute text-xs text-base-500 w-16 text-center"
                style={{
                  left: `${tick.position}%`,
                  transform:
                    index === 0
                      ? "translateX(0%)"
                      : index === tickMarks.length - 1
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
                }}
              >
                {tick.label}
              </div>
            ))}
          </div>

          {/* Timeline bar with tick marks */}
          <div className="relative w-full h-6 mb-6">
            {/* Main timeline bar */}
            <div className="absolute top-3 h-1 bg-base-300 w-full rounded-full" />

            {/* Tick marks */}
            {tickMarks.map((tick, index) => (
              <div
                key={`tick-${index}`}
                className="absolute top-1 flex flex-col items-center"
                style={{
                  left: `${tick.position}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="h-4 w-px bg-base-300" />
              </div>
            ))}
          </div>

          {/* Event groups */}
          <div className="relative w-full min-h-[120px]">
            {visibleKillAssistGroups.length > 0 ? (
              visibleKillAssistGroups.map((group, index) =>
                renderKillAssistGroup(group, index)
              )
            ) : (
              <div className="text-center text-base-500 py-6 text-sm">
                No events in this time range
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-6 text-xs text-base-500 gap-4">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-base-600 mr-1"></div>
            <span>{matchData.team1Name}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-base-500 mr-1"></div>
            <span>{matchData.team2Name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
