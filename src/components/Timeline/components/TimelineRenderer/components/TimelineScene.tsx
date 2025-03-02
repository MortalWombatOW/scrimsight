import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TimelineData } from "../../../hooks";
import TimelineMarker from "./TimelineMarker";
import TimelineConnection from "./TimelineConnection";
import TimelineLane from "./TimelineLane";
import TimelineAxis from "./TimelineAxis";

// Configuration for timeline layout
interface TimelineLayoutConfig {
  topPadding: number;
  bottomPadding: number;
}

interface TimelineSceneProps {
  data: TimelineData;
  dimensions: { width: number; height: number };
  selectedEvents: string[];
  onEventSelect: (eventIds: string[]) => void;
  timeRangeFilter?: { start: number; end: number };
  layoutConfig: TimelineLayoutConfig;
}

/**
 * Main scene component for the timeline visualization
 * Manages the 3D scene and coordinates all visual elements
 */
export const TimelineScene: React.FC<TimelineSceneProps> = ({
  data,
  dimensions,
  selectedEvents,
  onEventSelect,
  timeRangeFilter,
  layoutConfig,
}) => {
  // Access three.js context
  const { camera, gl } = useThree();

  // Ref for event markers to enable interactions
  const eventMarkers = useRef<Map<string, THREE.Object3D>>(new Map());

  // Raycaster for interactions
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Add state to track animation timestamps for connections
  const [animatingConnections, setAnimatingConnections] = useState<{
    [key: string]: boolean;
  }>({});

  // Add state for hover feedback
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Time scale function that respects the time range filter
  const timeScale = useMemo(() => {
    // Use filter range if provided, otherwise use the full data range
    const timeMin = timeRangeFilter
      ? timeRangeFilter.start
      : data.mapInfo.startTime;
    const timeMax = timeRangeFilter
      ? timeRangeFilter.end
      : data.mapInfo.endTime;
    const timeRange = timeMax - timeMin || 1; // Prevent division by zero

    // Using full width for the timeline now that labels are above
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
  }, [data.mapInfo, dimensions.width, timeRangeFilter]);

  // Calculate lane height
  const laneHeight =
    (dimensions.height - layoutConfig.topPadding - layoutConfig.bottomPadding) /
    (data.playerLanes.length || 1);
  const laneSpacing = laneHeight * 0.1;

  // Function to calculate Y position for different elements
  const getYPosition = useCallback(
    (type: "lane" | "label" | "tick", index: number) => {
      // Calculate based on the type of element
      switch (type) {
        case "lane":
          // Position lanes evenly from top to bottom with padding
          return (
            dimensions.height / 2 -
            layoutConfig.topPadding -
            (index + 0.5) * laneHeight
          );
        case "label":
          // Position labels above their respective lanes
          return (
            dimensions.height / 2 -
            layoutConfig.topPadding -
            (index + 0.5) * laneHeight +
            laneHeight * 0.5
          );
        case "tick":
          // Position time ticks at the bottom of the timeline
          return -dimensions.height / 2 + layoutConfig.bottomPadding / 2;
        default:
          return 0;
      }
    },
    [dimensions.height, laneHeight, layoutConfig]
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

    // Handle click events for selection
    const handleClick = (event: MouseEvent) => {
      // Update the raycaster
      raycaster.current.setFromCamera(mouse.current, camera);

      // Find intersections
      const intersects = raycaster.current.intersectObjects(
        Array.from(eventMarkers.current.values())
      );

      if (intersects.length > 0) {
        // Get all intersected events
        const intersectedEvents = intersects
          .map((intersection) => intersection.object.userData.event)
          .filter((event) => event !== undefined)
          .map((event) => event.id);

        // If no events were found (shouldn't happen), return
        if (intersectedEvents.length === 0) return;

        // If shift key is pressed, add to selection
        let newSelectedEvents: string[];

        if (event.shiftKey) {
          // Add all intersected events to existing selection if not already included
          newSelectedEvents = [...selectedEvents];

          // Add each intersected event if not already in selection
          intersectedEvents.forEach((eventId) => {
            if (!newSelectedEvents.includes(eventId)) {
              newSelectedEvents.push(eventId);
            }
          });
        } else {
          // If we're clicking on a single already-selected event with no shift key,
          // deselect it. Otherwise, select all intersected events.
          if (
            intersectedEvents.length === 1 &&
            selectedEvents.length === 1 &&
            selectedEvents[0] === intersectedEvents[0]
          ) {
            newSelectedEvents = []; // Deselect if clicking the same single event
          } else {
            newSelectedEvents = [...intersectedEvents]; // Select all intersected events
          }
        }

        // Check if this is actually a new selection
        const isNewSelection =
          newSelectedEvents.length !== selectedEvents.length ||
          newSelectedEvents.some((id) => !selectedEvents.includes(id)) ||
          selectedEvents.some((id) => !newSelectedEvents.includes(id));

        // Update the selected events
        onEventSelect(newSelectedEvents);

        // Only animate if this is a new selection
        if (isNewSelection) {
          // Clear previous animations from connections not related to current selection
          setAnimatingConnections({});

          // Find connections related to these events and mark them for animation
          const newAnimatingConnections: { [key: string]: boolean } = {};

          data.connections.forEach((conn) => {
            // Animate connections where any of the selected events is the source
            if (newSelectedEvents.includes(conn.source)) {
              const connKey = `${conn.source}-${conn.target}`;
              newAnimatingConnections[connKey] = true;
            }
          });

          // Set the new animations, replacing any existing ones
          if (Object.keys(newAnimatingConnections).length > 0) {
            setAnimatingConnections(newAnimatingConnections);
          }
        }
      } else {
        // Clear selection when clicking empty space
        onEventSelect([]);
        // Clear animations
        setAnimatingConnections({});
      }
    };

    // Add event listeners
    domElement.addEventListener("mousemove", handleMouseMove);
    domElement.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      domElement.removeEventListener("mousemove", handleMouseMove);
      domElement.removeEventListener("click", handleClick);
      domElement.style.cursor = "default";
    };
  }, [
    camera,
    gl,
    hoveredEventId,
    onEventSelect,
    selectedEvents,
    data.connections,
  ]);

  // Render player lanes
  const playerLanes = useMemo(() => {
    return data.playerLanes.map((player, index) => {
      const yPosition = getYPosition("lane", index);
      const labelYPosition = getYPosition("label", index);

      return (
        <TimelineLane
          key={`lane-${player.playerName}`}
          playerName={player.playerName}
          index={index}
          yPosition={yPosition}
          labelYPosition={labelYPosition}
          laneWidth={dimensions.width}
          laneSpacing={laneSpacing}
          fontSize={laneHeight * 0.45}
          leftMargin={-dimensions.width / 2 + 10}
        />
      );
    });
  }, [
    data.playerLanes,
    dimensions.width,
    laneHeight,
    laneSpacing,
    getYPosition,
  ]);

  // Render event markers
  const eventElements = useMemo(() => {
    return data.events.map((event) => {
      const playerIndex = data.playerLanes.findIndex(
        (p) => p.playerName === event.playerName
      );

      if (playerIndex === -1) return null;

      const xPosition = timeScale(event.time);
      const yPosition = getYPosition("lane", playerIndex);
      const isSelected = selectedEvents.includes(event.id);
      const isHovered = hoveredEventId === event.id;

      return (
        <TimelineMarker
          key={`event-${event.id}`}
          event={event}
          xPosition={xPosition}
          yPosition={yPosition}
          isSelected={isSelected}
          isHovered={isHovered}
          onRegisterMarker={registerMarker}
        />
      );
    });
  }, [
    data.events,
    data.playerLanes,
    timeScale,
    getYPosition,
    selectedEvents,
    hoveredEventId,
    registerMarker,
  ]);

  // Render connections between events
  const connections = useMemo(() => {
    return data.connections.map((connection) => {
      const sourceEvent = data.events.find((e) => e.id === connection.source);
      const targetEvent = data.events.find((e) => e.id === connection.target);

      if (!sourceEvent || !targetEvent) return null;

      const sourcePlayerIndex = data.playerLanes.findIndex(
        (p) => p.playerName === sourceEvent.playerName
      );
      const targetPlayerIndex = data.playerLanes.findIndex(
        (p) => p.playerName === targetEvent.playerName
      );

      if (sourcePlayerIndex === -1 || targetPlayerIndex === -1) return null;

      const sourceX = timeScale(sourceEvent.time);
      const sourceY = getYPosition("lane", sourcePlayerIndex);
      const targetX = timeScale(targetEvent.time);
      const targetY = getYPosition("lane", targetPlayerIndex);

      const sourcePosition = new THREE.Vector3(sourceX, sourceY, 0.05);
      const targetPosition = new THREE.Vector3(targetX, targetY, 0.05);

      const connectionKey = `${connection.source}-${connection.target}`;
      const isHighlighted =
        selectedEvents.includes(connection.source) ||
        selectedEvents.includes(connection.target) ||
        animatingConnections[connectionKey];

      return (
        <TimelineConnection
          key={connectionKey}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          isHighlighted={isHighlighted}
        />
      );
    });
  }, [
    data.connections,
    data.events,
    data.playerLanes,
    timeScale,
    getYPosition,
    selectedEvents,
    animatingConnections,
  ]);

  // Calculate time ticks
  const timeTicks = useMemo(() => {
    const ticksYPosition = getYPosition("tick", 0);

    // Calculate appropriate tick interval based on time range
    const timeMin = timeRangeFilter
      ? timeRangeFilter.start
      : data.mapInfo.startTime;
    const timeMax = timeRangeFilter
      ? timeRangeFilter.end
      : data.mapInfo.endTime;
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
        timeScale={timeScale}
        startTime={timeMin}
        endTime={timeMax}
        ticksYPosition={ticksYPosition}
        tickInterval={tickInterval}
      />
    );
  }, [data.mapInfo, timeScale, timeRangeFilter, getYPosition]);

  return (
    <>
      {/* Player lanes */}
      {playerLanes}

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
