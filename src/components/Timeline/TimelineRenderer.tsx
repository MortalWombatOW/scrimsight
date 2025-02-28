import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { TimelineData, TimelineEvent } from "./hooks/useTimelineData";
import { formatTime } from "../../lib";

interface TimelineRendererProps {
  data: TimelineData;
  selectedEvents: string[];
  onEventSelect: (eventIds: string[]) => void;
  timeRangeFilter?: { start: number; end: number };
}

/**
 * Timeline renderer component using THREE.js for efficient visualization
 */
export const TimelineRenderer: React.FC<TimelineRendererProps> = ({
  data,
  selectedEvents,
  onEventSelect,
  timeRangeFilter,
}) => {
  // Canvas container dimensions
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const cameraConfig = useRef({
    position: [0, 0, 100] as [number, number, number],
    zoom: 1,
    near: 0.1,
    far: 1000,
  });

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      aria-label="Timeline visualization"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Canvas orthographic camera={cameraConfig.current}>
          {/* <color attach="background" args={[0xf5f5f5]} /> */}
          {/* <OrbitControls
            enableRotate={false}
            enableDamping
            dampingFactor={0.1}
            screenSpacePanning
          /> */}
          <TimelineScene
            data={data}
            dimensions={dimensions}
            selectedEvents={selectedEvents}
            onEventSelect={onEventSelect}
            timeRangeFilter={timeRangeFilter}
          />
        </Canvas>
      )}
    </div>
  );
};

// Timeline scene component (within the Canvas)
interface TimelineSceneProps {
  data: TimelineData;
  dimensions: { width: number; height: number };
  selectedEvents: string[];
  onEventSelect: (eventIds: string[]) => void;
  timeRangeFilter?: { start: number; end: number };
}

const TimelineScene: React.FC<TimelineSceneProps> = ({
  data,
  dimensions,
  selectedEvents,
  onEventSelect,
  timeRangeFilter,
}) => {
  // Access three.js context
  const { scene, camera, gl } = useThree();

  // Ref for event markers to enable interactions
  const eventMarkers = useRef<Map<string, THREE.Object3D>>(new Map());

  // Raycaster for interactions
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

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

    // Adjust timeline to account for the space reserved for labels (40px offset)
    const timelineWidth = dimensions.width - 100;
    const xOffset = 100;

    return (time: number): number => {
      // Clamp the time value to the filtered range
      const clampedTime = Math.max(timeMin, Math.min(timeMax, time));
      // Map the time to x-coordinate within the viewport, accounting for the label space
      return (
        ((clampedTime - timeMin) / timeRange) * timelineWidth -
        dimensions.width / 2 +
        xOffset
      );
    };
  }, [data.mapInfo, dimensions.width, timeRangeFilter]);

  // Calculate lane height
  const tickHeight = 50;
  const laneHeight =
    (dimensions.height - tickHeight) / (data.playerLanes.length || 1);
  const laneSpacing = laneHeight * 0.7;

  // Create player lane labels
  const playerLabels = useMemo(() => {
    return data.playerLanes.map((player, index) => {
      const yPosition =
        dimensions.height / 2 - laneHeight * index - laneHeight / 2;

      // Position the label within the left side of the timeline instead of outside
      const xPosition = -dimensions.width / 2 + 95;

      return (
        <Text
          key={`label-${player.playerName}`}
          position={[xPosition, yPosition, 0.2]} // Slightly above the lane for better visibility
          fontSize={laneHeight * 0.4} // Proportional font size
          color="#333333"
          anchorX="right" // Right-align text so it sits close to the timeline
          anchorY="middle" // Vertically center text
          maxWidth={dimensions.width * 0.15} // Limit width to prevent long names from taking too much space
          overflowWrap="break-word" // Break text if needed
        >
          {player.playerName}
        </Text>
      );
    });
  }, [data.playerLanes, dimensions.height, dimensions.width, laneHeight]);

  // Setup mouse handlers for interaction
  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement) return;

    const handleClick = (event: MouseEvent) => {
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
        const selectedObject = intersects[0].object;

        // Find the event ID associated with the object
        let selectedEventId: string | null = null;

        for (const [id, object] of eventMarkers.current.entries()) {
          if (object === selectedObject) {
            selectedEventId = id;
            break;
          }
        }

        if (selectedEventId) {
          // If shift key is pressed, add to selection
          if (event.shiftKey) {
            onEventSelect([...selectedEvents, selectedEventId]);
          } else {
            onEventSelect([selectedEventId]);
          }
        }
      } else {
        // Clear selection when clicking empty space
        onEventSelect([]);
      }
    };

    domElement.addEventListener("click", handleClick);

    return () => {
      domElement.removeEventListener("click", handleClick);
    };
  }, [camera, gl, onEventSelect, selectedEvents]);

  // Helper function to get a color for an event
  const getEventColor = (eventId: string): number => {
    // In a real implementation, we would assign colors based on event type
    // For now, use a simple hash function to get a grayscale color
    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
      hash = eventId.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to grayscale (between 0x666666 and 0xcccccc)
    const grayscale = 0x666666 + (Math.abs(hash) % 0x666666);
    return grayscale;
  };

  // Create player lanes
  const playerLanes = useMemo(() => {
    return data.playerLanes.map((player, index) => {
      const yPosition =
        dimensions.height / 2 - laneHeight * index - laneHeight / 2;

      // Make the lane slightly narrower to accommodate for labels
      const laneWidth = dimensions.width - 100; // Reduced width to leave space for labels
      const xOffset = 100; // Shift lanes to the right to make space for labels

      return (
        <mesh
          key={`lane-${player.playerName}`}
          position={[xOffset / 2, yPosition, 0]}
        >
          <planeGeometry args={[laneWidth, laneSpacing]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? 0xf0f0f0 : 0xe8e8e8}
            transparent
            opacity={0.5}
          />
        </mesh>
      );
    });
  }, [
    data.playerLanes,
    dimensions.height,
    dimensions.width,
    laneHeight,
    laneSpacing,
  ]);

  // Create event markers
  const eventElements = useMemo(() => {
    return data.events.map((event) => {
      const playerIndex = data.playerLanes.findIndex(
        (p) => p.playerName === event.playerName
      );
      if (playerIndex === -1) return null;

      // Calculate position
      const xPosition = timeScale(event.time);
      const yPosition =
        dimensions.height / 2 - laneHeight * playerIndex - laneHeight / 2;

      // Determine geometry type and size based on event type
      let geometryType: "circle" | "ring" | "box" | "triangle" = "circle";
      let size = 1;

      switch (event.type) {
        case "heroSpawn":
        case "heroSwap":
          geometryType = "circle";
          break;
        case "ability1Used":
        case "ability2Used":
          geometryType = "ring";
          break;
        case "Killed player":
        case "Died":
          geometryType = "box";
          size = 1.2;
          break;
        case "Dealt Damage":
        case "Received Damage":
          geometryType = "box";
          break;
        case "Dealt Healing":
        case "Received Healing":
          geometryType = "triangle";
          break;
        default:
          geometryType = "circle";
      }

      // Determine color and scale based on selection state
      const isSelected = selectedEvents.includes(event.id);
      const color = isSelected ? 0x333333 : getEventColor(event.id);
      const scale = isSelected ? 1.5 : 1;

      // Create appropriate geometry based on type
      let geometry;
      switch (geometryType) {
        case "circle":
          geometry = <circleGeometry args={[size, 32]} />;
          break;
        case "ring":
          geometry = <ringGeometry args={[size * 0.5, size, 32]} />;
          break;
        case "box":
          geometry = <boxGeometry args={[size * 1.5, size * 1.5, size]} />;
          break;
        case "triangle":
          geometry = <circleGeometry args={[size, 3]} />;
          break;
      }

      return (
        <mesh
          key={event.id}
          position={[xPosition, yPosition, 0.1]}
          scale={[scale, scale, scale]}
          userData={{ event }}
          ref={(obj) => {
            if (obj) {
              eventMarkers.current.set(event.id, obj);
            } else {
              eventMarkers.current.delete(event.id);
            }
          }}
        >
          {geometry}
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      );
    });
  }, [
    data.events,
    data.playerLanes,
    dimensions.height,
    laneHeight,
    selectedEvents,
    timeScale,
  ]);

  // Create connections between related events
  const connections = useMemo(() => {
    return data.connections.map((connection, index) => {
      const sourceMarker = eventMarkers.current.get(connection.source);
      const targetMarker = eventMarkers.current.get(connection.target);

      if (!sourceMarker || !targetMarker) return null;

      const sourcePosition = sourceMarker.position;
      const targetPosition = targetMarker.position;

      // Create points for the line
      const points = [
        new THREE.Vector3(sourcePosition.x, sourcePosition.y, sourcePosition.z),
        new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
      ];

      // Convert points to Float32Array for buffer geometry
      const pointsArray = new Float32Array(
        points.flatMap((p) => [p.x, p.y, p.z])
      );

      return (
        <line key={`connection-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={pointsArray}
              itemSize={3}
              args={[pointsArray, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={0x999999} transparent opacity={0.5} />
        </line>
      );
    });
  }, [data.connections]);

  // Frame update for hover effects
  useFrame(() => {
    // This could be used for animations or hover effects
  });

  // Generate time ticks with appropriate intervals based on time range
  const timeTicks = useMemo(() => {
    // Use filter range if provided, otherwise use the full data range
    const timeMin = timeRangeFilter
      ? timeRangeFilter.start
      : data.mapInfo.startTime;
    const timeMax = timeRangeFilter
      ? timeRangeFilter.end
      : data.mapInfo.endTime;
    const timeRange = timeMax - timeMin;

    // Calculate an appropriate tick interval to aim for ~10 ticks
    // Choose from 5, 10, 15, 30, or 60 seconds based on the range
    let tickInterval = 5; // Default to 5 seconds

    if (timeRange > 600) {
      // > 10 minutes
      tickInterval = 60;
    } else if (timeRange > 300) {
      // > 5 minutes
      tickInterval = 30;
    } else if (timeRange > 150) {
      // > 2.5 minutes
      tickInterval = 15;
    } else if (timeRange > 60) {
      // > 1 minute
      tickInterval = 10;
    }

    // Calculate the position for the time ticks bar (below the last lane)
    const ticksYPosition =
      dimensions.height / 2 -
      laneHeight * data.playerLanes.length -
      laneHeight * 0.2; // Position below the last lane

    // Generate ticks at regular intervals
    const ticks = [];
    const start = Math.ceil(timeMin / tickInterval) * tickInterval;
    const end = Math.floor(timeMax / tickInterval) * tickInterval;

    // Create the tick labels
    for (let time = start; time <= end; time += tickInterval) {
      const xPosition = timeScale(time);

      // Tick label
      ticks.push(
        <Text
          key={`tick-label-${time}`}
          position={[xPosition, ticksYPosition, 0]}
          fontSize={laneHeight * 0.3}
          color="#333333"
          anchorX="center"
          anchorY="top"
        >
          {formatTime(time)}
        </Text>
      );
    }

    return ticks;
  }, [
    data.mapInfo,
    data.playerLanes.length,
    dimensions.height,
    dimensions.width,
    laneHeight,
    timeRangeFilter,
    timeScale,
  ]);

  return (
    <>
      {/* Player lanes */}
      {playerLanes}

      {/* Player labels */}
      {playerLabels}

      {/* Event markers */}
      {eventElements}

      {/* Connections */}
      {connections}

      {/* Time ticks */}
      {timeTicks}
    </>
  );
};
