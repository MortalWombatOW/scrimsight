import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import TimelineMarker from "./TimelineMarker";
import TimelineConnection from "./TimelineConnection";
import TimelineLane from "./TimelineLane";
import TimelineAxis from "./TimelineAxis";
import { useAtomValue } from "jotai";
import {
  PlayerEvent,
  playerEventsAtom,
} from "../../../../../atoms/derived_events/playerEventsAtom";
import { playerInteractionEventsAtom } from "../../../../../atoms/derived_events/playerInteractionEventsAtom";
import { ultimateEventsAtom } from "../../../../../atoms";
import { matchDataAtom } from "../../../../../atoms/matchDataAtom";
import {
  getRankForRole,
  getRoleFromHero,
  OverwatchRole,
} from "../../../../../lib";
import { playerLivesAtom } from "../../../../../atoms/playerLivesAtom";
import { Line } from "@react-three/drei";
export interface TimelineLane {
  title: string;
  description: string;
}

interface TimelineSceneProps {
  matchId: string;
  currentTimeRange: { start: number; end: number };
  dimensions: { width: number; height: number };
}

/**
 * Main scene component for the timeline visualization
 * Manages the 3D scene and coordinates all visual elements
 */
export const TimelineScene: React.FC<TimelineSceneProps> = ({
  matchId,
  currentTimeRange,
  dimensions,
}) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );

  const allPlayerEvents = useAtomValue(playerEventsAtom).filter(
    (event) => event.matchId === matchId
  );
  const playerEvents = useMemo(() => {
    return allPlayerEvents.filter(
      (event) =>
        event.playerEventTime >= currentTimeRange.start &&
        event.playerEventTime <= currentTimeRange.end
    );
  }, [allPlayerEvents, matchId, currentTimeRange]);

  const playerInteractions = useAtomValue(playerInteractionEventsAtom).filter(
    (event) =>
      event.matchId === matchId &&
      event.playerInteractionEventTime >= currentTimeRange.start &&
      event.playerInteractionEventTime <= currentTimeRange.end
  );

  const playerLives = useAtomValue(playerLivesAtom).filter(
    (event) =>
      event.matchId === matchId &&
      event.endTime >= currentTimeRange.start &&
      event.startTime <= currentTimeRange.end
  );

  const ultimateEvents = useAtomValue(ultimateEventsAtom).filter(
    (event) =>
      event.matchId === matchId &&
      (event.ultimateEndTime >= currentTimeRange.start ||
        event.ultimateStartTime <= currentTimeRange.end)
  );

  const lanes = useMemo(() => {
    if (!matchData) return [];
    const playerInfo = new Map<
      string,
      { name: string; role: string; teamName: string }
    >();
    allPlayerEvents.forEach((event) => {
      if (!playerInfo.has(event.playerName)) {
        playerInfo.set(event.playerName, {
          name: event.playerName,
          role: getRoleFromHero(event.playerHero),
          teamName: event.playerTeam,
        });
      }
    });

    const team1Name = matchData.team1Name;

    const playerList = Array.from(playerInfo.values());
    playerList.sort((a, b) => {
      if (a.teamName === b.teamName) {
        return (
          getRankForRole(a.role as OverwatchRole) -
          getRankForRole(b.role as OverwatchRole)
        );
      }
      return a.teamName === team1Name ? -1 : 1;
    });

    return playerList.map((player) => ({
      title: player.name,
      description: `${player.role} - ${player.teamName}`,
    }));
  }, [playerEvents, matchData]);
  // Access three.js context
  const { camera, gl } = useThree();

  // Ref for event markers to enable interactions
  const eventMarkers = useRef<Map<string, THREE.Object3D>>(new Map());

  // Raycaster for interactions
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Add state for hover feedback
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Time scale function that respects the time range filter
  const timeScale = useMemo(() => {
    // Use filter range if provided, otherwise use the full data range
    const timeMin = currentTimeRange.start;
    const timeMax = currentTimeRange.end;
    const timeRange = timeMax - timeMin || 1; // Prevent division by zero

    const timelineWidth = dimensions.width;

    return (time: number): number => {
      // Clamp the time value to the filtered range
      const clampedTime = Math.max(timeMin, Math.min(timeMax, time));
      // Map the time to x-coordinate within the viewport, using full width
      return (
        ((clampedTime - timeMin) / timeRange) * timelineWidth -
        dimensions.width / 2
      );
    };
  }, [matchId, currentTimeRange, dimensions.width]);

  // Calculate lane height
  const laneHeight = (dimensions.height - 40) / (lanes.length || 1);
  const laneSpacing = laneHeight * 0.1;

  // Function to calculate Y position for different elements
  const getYPosition = useCallback(
    (type: "lane" | "label" | "tick", index: number) => {
      // Calculate based on the type of element
      switch (type) {
        case "lane":
          // Position lanes evenly from top to bottom with padding
          return dimensions.height / 2 - (index + 0.5) * laneHeight;
        case "label":
          // Position labels above their respective lanes
          return (
            dimensions.height / 2 -
            (index + 0.5) * laneHeight +
            laneHeight * 0.3
          );
        case "tick":
          // Position time ticks at the bottom of the timeline
          return -dimensions.height / 2 + 20;
        default:
          return 0;
      }
    },
    [dimensions.height, laneHeight]
  );

  // Register an event marker with the ref map
  const registerMarker = useCallback((id: string, obj: THREE.Object3D) => {
    eventMarkers.current.set(id, obj);
  }, []);

  // Setup mouse handlers for interaction
  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement) return;

    // Track mouse position for hover effects
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates
      const rect = domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the raycaster
      raycaster.current.setFromCamera(mouse.current, camera);

      // Find intersections
      const intersects = raycaster.current.intersectObjects(
        Array.from(eventMarkers.current.values())
      );

      if (intersects.length > 0) {
        // Get the first intersected object
        const intersectedObject = intersects[0].object;
        const event = intersectedObject.userData.event;

        if (event && event.id !== hoveredEventId) {
          setHoveredEventId(event.id);
          // Change cursor to pointer
          domElement.style.cursor = "pointer";
        }
      } else if (hoveredEventId !== null) {
        setHoveredEventId(null);
        // Reset cursor
        domElement.style.cursor = "default";
      }
    };

    // Add event listeners
    domElement.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      domElement.removeEventListener("mousemove", handleMouseMove);
      domElement.style.cursor = "default";
    };
  }, [camera, gl, hoveredEventId]);

  // Render player lanes
  const playerLanes = useMemo(() => {
    return lanes.map((lane, index) => {
      const yPosition = getYPosition("lane", index);
      const labelYPosition = getYPosition("label", index);

      return (
        <TimelineLane
          key={`lane-${lane.title}`}
          title={lane.title}
          description={lane.description}
          index={index}
          yPosition={yPosition}
          labelYPosition={labelYPosition}
          laneWidth={dimensions.width}
          laneSpacing={laneSpacing}
          fontSize={laneHeight * 0.2}
          leftMargin={-dimensions.width / 2 + 10}
        />
      );
    });
  }, [lanes, dimensions.width, laneHeight, laneSpacing, getYPosition]);

  // Render event markers
  const eventElements = useMemo(() => {
    return playerEvents.map((event) => {
      const playerIndex = lanes.findIndex((p) => p.title === event.playerName);

      if (playerIndex === -1) return null;

      const xPosition = timeScale(event.playerEventTime);
      const yPosition = getYPosition("lane", playerIndex);

      return (
        <TimelineMarker
          key={event.id}
          event={event}
          xPosition={xPosition}
          yPosition={yPosition}
          onRegisterMarker={registerMarker}
        />
      );
    });
  }, [
    playerEvents,
    lanes,
    timeScale,
    getYPosition,
    hoveredEventId,
    registerMarker,
  ]);

  // Render connections between events
  const connections = useMemo(() => {
    return playerInteractions.map((interaction) => {
      const sourcePlayerIndex = lanes.findIndex(
        (p) => p.title === interaction.playerName
      );
      const targetPlayerIndex = lanes.findIndex(
        (p) => p.title === interaction.otherPlayerName
      );

      if (sourcePlayerIndex === -1 || targetPlayerIndex === -1) return null;

      const x = timeScale(interaction.playerInteractionEventTime);
      const sourceY = getYPosition("lane", sourcePlayerIndex);
      const targetY = getYPosition("lane", targetPlayerIndex);

      const sourcePosition = new THREE.Vector3(x, sourceY, 0.05);
      const targetPosition = new THREE.Vector3(x, targetY, 0.05);

      const connectionKey = JSON.stringify(interaction);

      return (
        <TimelineConnection
          key={connectionKey}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          interaction={interaction}
        />
      );
    });
  }, [playerInteractions, lanes, timeScale, getYPosition]);

  // Calculate time ticks
  const timeTicks = useMemo(() => {
    const ticksYPosition = getYPosition("tick", 0);

    // Calculate appropriate tick interval based on time range
    const timeMin = currentTimeRange.start;
    const timeMax = currentTimeRange.end;
    const timeRange = timeMax - timeMin;

    // Determine tick interval based on time range
    // Aim for approximately 6-10 ticks across the timeline
    let tickInterval = 30; // Default: 30 seconds

    if (timeRange > 1800) tickInterval = 300;
    // > 30 min: 5 min intervals
    else if (timeRange > 900) tickInterval = 180;
    // > 15 min: 3 min intervals
    else if (timeRange > 600) tickInterval = 120;
    // > 10 min: 2 min intervals
    else if (timeRange > 300) tickInterval = 60;
    // > 5 min: 1 min intervals
    else if (timeRange > 120) tickInterval = 30;
    // > 2 min: 30 sec intervals
    else if (timeRange > 60) tickInterval = 15;
    // > 1 min: 15 sec intervals
    else tickInterval = 10; // <= 1 min: 10 sec intervals

    return (
      <TimelineAxis
        matchId={matchId}
        timeScale={timeScale}
        startTime={timeMin}
        endTime={timeMax}
        ticksYPosition={ticksYPosition}
        tickInterval={tickInterval}
      />
    );
  }, [currentTimeRange, timeScale, getYPosition]);

  return (
    <>
      {/* Player lanes */}
      {playerLanes}

      {playerLives.map((life) => (
        <Line
          points={[
            new THREE.Vector3(
              timeScale(life.startTime),
              getYPosition(
                "lane",
                lanes.findIndex((p) => p.title === life.playerName)
              ),
              0.05
            ),
            new THREE.Vector3(
              timeScale(life.endTime),
              getYPosition(
                "lane",
                lanes.findIndex((p) => p.title === life.playerName)
              ),
              0.05
            ),
          ]}
          color={0x000000}
        />
      ))}

      {/* Event markers */}
      {eventElements}

      {/* Connections */}
      {connections}

      {/* Time ticks */}
      {timeTicks}
    </>
  );
};

export default TimelineScene;
