import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Line,
  QuadraticBezierLine,
} from "@react-three/drei";
import * as THREE from "three";
import { TimelineData } from "./hooks/useTimelineData";
import { formatTime } from "../../lib";

// Grayscale color palette for better UI
const COLORS = {
  // Primary UI elements
  background: 0xffffff,
  alternatingLane1: 0xf5f5f5,
  alternatingLane2: 0xebebeb,

  // Text elements
  labelText: 0x111111,
  tickText: 0x333333,

  // Interactive elements
  defaultEvent: 0x777777,
  selectedEvent: 0x222222,

  // Connection colors
  defaultConnection: 0x999999,
  highlightedConnection: 0x444444,

  // Feedback/state colors
  hoverState: 0x666666,
  activeAnimation: 0x333333,

  // Event type colors (grayscale variants for different event types)
  eventDefault: 0x777777,
  eventAbility: 0x666666,
  eventKill: 0x444444,
  eventDamage: 0x555555,
  eventHealing: 0x888888,
};

// Configuration for timeline layout
interface TimelineLayoutConfig {
  topPadding: number;
  bottomPadding: number;
}

// Default layout configuration
const DEFAULT_LAYOUT_CONFIG: TimelineLayoutConfig = {
  topPadding: 30, // Slightly increased for better spacing
  bottomPadding: 60, // Increased for better readability of time ticks
};

interface TimelineRendererProps {
  data: TimelineData;
  selectedEvents: string[];
  onEventSelect: (eventIds: string[]) => void;
  timeRangeFilter?: { start: number; end: number };
  layoutConfig?: Partial<TimelineLayoutConfig>;
}

/**
 * Timeline renderer component using THREE.js for efficient visualization
 */
export const TimelineRenderer: React.FC<TimelineRendererProps> = ({
  data,
  selectedEvents,
  onEventSelect,
  timeRangeFilter,
  layoutConfig = {},
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

  // Merge custom layout config with defaults
  const mergedLayoutConfig = useMemo(
    () => ({
      ...DEFAULT_LAYOUT_CONFIG,
      ...layoutConfig,
    }),
    [layoutConfig]
  );

  // Add state to track animation timestamps for connections
  const [animatingConnections, setAnimatingConnections] = useState<{
    [key: string]: boolean;
  }>({});

  // Add a cleanup timer to remove completed animations after a delay
  useEffect(() => {
    if (Object.keys(animatingConnections).length === 0) return;

    // We don't need a cleanup timer anymore since animations naturally complete
    // and won't repeat due to the animationComplete state in AnimatedConnection

    // Just maintain the animation state according to selections
    return () => {}; // No cleanup needed
  }, [animatingConnections, selectedEvents]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-50" // Added light gray background for better contrast
      aria-label="Timeline visualization"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Canvas orthographic camera={cameraConfig.current}>
          {/* Added ambient light for better visibility */}
          <ambientLight intensity={0.8} />
          <TimelineScene
            data={data}
            dimensions={dimensions}
            selectedEvents={selectedEvents}
            onEventSelect={onEventSelect}
            timeRangeFilter={timeRangeFilter}
            layoutConfig={mergedLayoutConfig}
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
  layoutConfig: TimelineLayoutConfig;
}

// New AnimatedConnection component
interface AnimatedConnectionProps {
  sourcePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  color: number;
  isHighlighted: boolean;
}

const AnimatedConnection: React.FC<AnimatedConnectionProps> = ({
  sourcePosition,
  targetPosition,
  color,
  isHighlighted,
}) => {
  const [progress, setProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const animationRef = useRef({ active: false, startTime: 0 });

  // Calculate midpoint with an arc
  const midPoint = useMemo(() => {
    const mid = new THREE.Vector3()
      .addVectors(sourcePosition, targetPosition)
      .multiplyScalar(0.5);
    // Add height to create an arc - higher if the points are far apart
    const distance = sourcePosition.distanceTo(targetPosition);
    const arcHeight = Math.min(distance * 0.3, 30); // Cap the height for very long connections
    mid.y += arcHeight;
    return mid;
  }, [sourcePosition, targetPosition]);

  // Animation using useFrame - only animate once
  useFrame((_, delta) => {
    // Only start animation if highlighted, not active, and not already completed
    if (isHighlighted && !animationRef.current.active && !animationComplete) {
      // Start animation when highlighted for the first time
      animationRef.current = { active: true, startTime: Date.now() };
      setProgress(0);
    }

    // If animation is active, update it
    if (animationRef.current.active) {
      // Calculate progress with easing function for smoother animation
      const elapsed = (Date.now() - animationRef.current.startTime) / 1000;
      const duration = 0.8; // Animation duration in seconds
      const rawProgress = Math.min(elapsed / duration, 1);

      // Use easeInOutCubic for smooth acceleration and deceleration
      const easedProgress =
        rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      setProgress(easedProgress);

      // When animation completes
      if (easedProgress >= 1) {
        // Mark as complete and inactive
        animationRef.current.active = false;
        setAnimationComplete(true);
      }
    }
  });

  // Don't render anything if not highlighted and no progress
  if (!isHighlighted && progress === 0) return null;

  // Adjust line width based on highlighting - increased for better visibility
  const lineWidth = isHighlighted ? 4 : 2;

  // Fixed completed connection display
  if (animationComplete || progress === 1) {
    return (
      <>
        <QuadraticBezierLine
          start={sourcePosition}
          end={targetPosition}
          mid={midPoint}
          color={color}
          lineWidth={lineWidth}
          dashed={false}
        />

        {/* Visual feedback at source and target for completed connection */}
        {isHighlighted && (
          <>
            <mesh position={sourcePosition}>
              <ringGeometry args={[4, 5.5, 32]} />{" "}
              {/* Improved geometry resolution */}
              <meshBasicMaterial color={color} transparent opacity={0.7} />{" "}
              {/* Increased opacity for better visibility */}
            </mesh>
            <mesh position={targetPosition}>
              <ringGeometry args={[4, 5.5, 32]} />{" "}
              {/* Improved geometry resolution */}
              <meshBasicMaterial color={color} transparent opacity={0.7} />{" "}
              {/* Increased opacity for better visibility */}
            </mesh>
          </>
        )}
      </>
    );
  }

  // Calculate intermediate position with bezier curve
  const currentPoint = new THREE.Vector3();
  if (progress < 1) {
    // Use quadratic bezier interpolation for smoother arcing
    const t = progress;
    const mt = 1 - t;

    currentPoint.x =
      mt * mt * sourcePosition.x +
      2 * mt * t * midPoint.x +
      t * t * targetPosition.x;
    currentPoint.y =
      mt * mt * sourcePosition.y +
      2 * mt * t * midPoint.y +
      t * t * targetPosition.y;
    currentPoint.z =
      mt * mt * sourcePosition.z +
      2 * mt * t * midPoint.z +
      t * t * targetPosition.z;
  } else {
    currentPoint.copy(targetPosition);
  }

  return (
    <>
      {/* Only show the path from source to current position */}
      <QuadraticBezierLine
        start={sourcePosition}
        end={currentPoint}
        mid={midPoint}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
      />

      {/* Animated particle - increased size for better visibility */}
      {progress > 0 && progress < 1 && (
        <mesh position={currentPoint}>
          <sphereGeometry args={[3.5, 24, 24]} />{" "}
          {/* Improved geometry resolution */}
          <meshBasicMaterial color={color} transparent opacity={0.85} />{" "}
          {/* Increased opacity for better visibility */}
        </mesh>
      )}

      {/* Visual feedback at source for animation in progress */}
      {isHighlighted && (
        <mesh position={sourcePosition}>
          <ringGeometry args={[4, 5.5, 32]} />{" "}
          {/* Improved geometry resolution */}
          <meshBasicMaterial color={color} transparent opacity={0.7} />{" "}
          {/* Increased opacity for better visibility */}
        </mesh>
      )}
    </>
  );
};

const TimelineScene: React.FC<TimelineSceneProps> = ({
  data,
  dimensions,
  selectedEvents,
  onEventSelect,
  timeRangeFilter,
  layoutConfig,
}) => {
  // Access three.js context
  const { scene, camera, gl } = useThree();

  // Ref for event markers to enable interactions
  const eventMarkers = useRef<Map<string, THREE.Object3D>>(new Map());

  // Raycaster for interactions
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Add state to track animation timestamps for connections
  const [animatingConnections, setAnimatingConnections] = useState<{
    [key: string]: boolean;
  }>({});

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
  const laneSpacing = laneHeight * 0.5;

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

  // Add a cleanup timer to remove completed animations after a delay
  useEffect(() => {
    if (Object.keys(animatingConnections).length === 0) return;

    // We don't need a cleanup timer anymore since animations naturally complete
    // and won't repeat due to the animationComplete state in AnimatedConnection

    // Just maintain the animation state according to selections
    return () => {}; // No cleanup needed
  }, [animatingConnections, selectedEvents]);

  // Add state for hover feedback
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

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
        const hoveredObject = intersects[0].object;
        domElement.style.cursor = "pointer"; // Show pointer cursor on hover

        // Find the event ID associated with the object
        let newHoveredEventId: string | null = null;

        for (const [id, object] of eventMarkers.current.entries()) {
          if (object === hoveredObject) {
            newHoveredEventId = id;
            break;
          }
        }

        // Update hover state
        setHoveredEventId(newHoveredEventId);
      } else {
        domElement.style.cursor = "default";
        setHoveredEventId(null);
      }
    };

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
          let newSelectedEvents: string[];

          if (event.shiftKey) {
            // Add to existing selection if not already included
            newSelectedEvents = selectedEvents.includes(selectedEventId)
              ? selectedEvents
              : [...selectedEvents, selectedEventId];
          } else {
            // Replace selection if it's a new event, toggle off if it's already selected
            newSelectedEvents =
              selectedEvents.length === 1 &&
              selectedEvents[0] === selectedEventId
                ? [] // Deselect if clicking the same event
                : [selectedEventId]; // Otherwise select just this event
          }

          // Check if this is actually a new selection
          const isNewSelection =
            newSelectedEvents.length !== selectedEvents.length ||
            newSelectedEvents.some((id) => !selectedEvents.includes(id));

          // Update the selected events
          onEventSelect(newSelectedEvents);

          // Only animate if this is a new selection
          if (isNewSelection) {
            // Clear previous animations from connections not related to current selection
            setAnimatingConnections({});

            // Find connections related to this event and mark them for animation
            const newAnimatingConnections: { [key: string]: boolean } = {};

            data.connections.forEach((conn) => {
              // Only animate connections where this event is the source/initiator
              if (conn.source === selectedEventId) {
                const connKey = `${conn.source}-${conn.target}`;
                newAnimatingConnections[connKey] = true;
              }
            });

            // Set the new animations, replacing any existing ones
            if (Object.keys(newAnimatingConnections).length > 0) {
              setAnimatingConnections(newAnimatingConnections);
            }
          }
        }
      } else {
        // Clear selection when clicking empty space
        onEventSelect([]);
        // Clear animations
        setAnimatingConnections({});
      }
    };

    domElement.addEventListener("click", handleClick);
    domElement.addEventListener("mousemove", handleMouseMove);

    return () => {
      domElement.removeEventListener("click", handleClick);
      domElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, data.connections, gl, onEventSelect, selectedEvents]);

  // Helper function to get a color for an event - updated for grayscale
  const getEventColor = (
    eventId: string,
    isHovered: boolean,
    isSelected: boolean
  ): number => {
    if (isSelected) {
      return COLORS.selectedEvent;
    }

    if (isHovered) {
      return COLORS.hoverState;
    }

    // Use grayscale colors based on event type, determined by the first character of the ID
    // This ensures consistent colors without using a complex hash function
    const firstChar = eventId.charAt(0).toLowerCase();

    if (firstChar >= "a" && firstChar <= "f") {
      return COLORS.eventDefault;
    } else if (firstChar >= "g" && firstChar <= "l") {
      return COLORS.eventAbility;
    } else if (firstChar >= "m" && firstChar <= "r") {
      return COLORS.eventDamage;
    } else if (firstChar >= "s" && firstChar <= "z") {
      return COLORS.eventHealing;
    } else {
      return COLORS.eventKill;
    }
  };

  // Create player lanes
  const playerLanes = useMemo(() => {
    return data.playerLanes.map((player, index) => {
      const yPosition = getYPosition("lane", index);

      // Use full width for lanes now that labels are above
      const laneWidth = dimensions.width;

      return (
        <mesh
          key={`lane-${player.playerName}`}
          position={[0, yPosition, 0]} // Centered horizontally
        >
          <planeGeometry args={[laneWidth, laneSpacing]} />
          <meshBasicMaterial
            color={
              index % 2 === 0
                ? COLORS.alternatingLane1
                : COLORS.alternatingLane2
            }
            transparent
            opacity={0.7} // Increased opacity for better visibility
          />
        </mesh>
      );
    });
  }, [data.playerLanes, dimensions.width, laneSpacing, getYPosition]);

  // Create player lane labels
  const playerLabels = useMemo(() => {
    return data.playerLanes.map((player, index) => {
      const labelYPosition = getYPosition("label", index);

      return (
        <Text
          key={`label-${player.playerName}`}
          position={[-dimensions.width / 2 + 10, labelYPosition, 0.2]} // Increased left margin
          fontSize={laneHeight * 0.45} // Slightly larger font for better readability
          color={COLORS.labelText} // Convert to hex
          anchorX="left"
          anchorY="middle"
          maxWidth={dimensions.width * 0.3}
          overflowWrap="break-word"
          fontWeight="bold" // Added bold for better readability
        >
          {player.playerName}
        </Text>
      );
    });
  }, [data.playerLanes, dimensions.width, laneHeight, getYPosition]);

  // Create event markers
  const eventElements = useMemo(() => {
    return data.events.map((event) => {
      const playerIndex = data.playerLanes.findIndex(
        (p) => p.playerName === event.playerName
      );
      if (playerIndex === -1) return null;

      // Calculate position
      const xPosition = timeScale(event.time);
      const yPosition = getYPosition("lane", playerIndex);

      // Determine geometry type and size based on event type
      let geometryType: "circle" | "ring" | "box" | "triangle" = "circle";
      let size = 5.5; // Slightly increased for better visibility

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
          size = 6; // Larger for important events
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

      // Determine color and scale based on selection and hover state
      const isSelected = selectedEvents.includes(event.id);
      const isHovered = hoveredEventId === event.id;
      const color = getEventColor(event.id, isHovered, isSelected);
      const scale = isSelected ? 1.6 : isHovered ? 1.3 : 1; // Different scales for selected/hovered

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

      // Add an outline for selected/hovered items
      const outlineOpacity = isSelected ? 0.9 : isHovered ? 0.6 : 0;

      return (
        <group key={event.id}>
          {/* Outer highlight/outline for better selection visibility */}
          {(isSelected || isHovered) && (
            <mesh
              position={[xPosition, yPosition, 0.05]}
              scale={[scale * 1.2, scale * 1.2, 1]}
            >
              {geometry}
              <meshBasicMaterial
                color={isSelected ? COLORS.selectedEvent : COLORS.hoverState}
                transparent
                opacity={outlineOpacity}
              />
            </mesh>
          )}

          {/* Main event marker */}
          <mesh
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
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isSelected || isHovered ? 0.9 : 0.8}
            />
          </mesh>
        </group>
      );
    });
  }, [
    data.events,
    data.playerLanes,
    selectedEvents,
    hoveredEventId,
    timeScale,
    getYPosition,
  ]);

  // Create connections between related events
  const connections = useMemo(() => {
    // Filter connections to only show those related to selected events when there are selections
    const relevantConnections =
      selectedEvents.length > 0
        ? data.connections.filter(
            (conn) =>
              selectedEvents.includes(conn.source) ||
              selectedEvents.includes(conn.target)
          )
        : data.connections;

    const renderedConnections = relevantConnections.map((connection, index) => {
      const sourceMarker = eventMarkers.current.get(connection.source);
      const targetMarker = eventMarkers.current.get(connection.target);

      if (!sourceMarker || !targetMarker) {
        return null;
      }

      const sourcePosition = sourceMarker.position;
      const targetPosition = targetMarker.position;

      // Determine if this connection involves selected events
      const isHighlighted =
        selectedEvents.includes(connection.source) ||
        selectedEvents.includes(connection.target);

      // Check if this connection should be animated
      const connectionKey = `${connection.source}-${connection.target}`;
      const shouldAnimate = !!animatingConnections[connectionKey];

      // Use animated connection when the connection should be animated
      if (shouldAnimate) {
        return (
          <AnimatedConnection
            key={`animated-connection-${connectionKey}`}
            sourcePosition={
              new THREE.Vector3(
                sourcePosition.x,
                sourcePosition.y,
                sourcePosition.z
              )
            }
            targetPosition={
              new THREE.Vector3(
                targetPosition.x,
                targetPosition.y,
                targetPosition.z
              )
            }
            color={
              isHighlighted
                ? COLORS.highlightedConnection
                : COLORS.defaultConnection
            }
            isHighlighted={isHighlighted}
          />
        );
      }

      // Use regular connection for non-animated connections
      // Create a directional line with an arrow pointing from source to target
      const points = [
        new THREE.Vector3(sourcePosition.x, sourcePosition.y, sourcePosition.z),
        new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
      ];

      return (
        <Line
          key={`connection-${connection.source}-${connection.target}`}
          points={points}
          color={
            isHighlighted
              ? COLORS.highlightedConnection
              : COLORS.defaultConnection
          }
          lineWidth={isHighlighted ? 3 : 1.5}
          transparent={true}
          opacity={isHighlighted ? 0.9 : 0.5}
        />
      );
    });

    return renderedConnections;
  }, [data.connections, selectedEvents, animatingConnections]);

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
    const ticksYPosition = getYPosition("tick", 0);

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
          fontSize={laneHeight * 0.38} // Increased size for better readability
          color={COLORS.tickText} // Convert to hex
          anchorX="center"
          anchorY="top"
          fontWeight="bold"
        >
          {formatTime(time)}
        </Text>
      );

      // Add tick marks for better visual alignment
      ticks.push(
        <Line
          key={`tick-line-${time}`}
          points={[
            new THREE.Vector3(xPosition, ticksYPosition + 2, 0),
            new THREE.Vector3(xPosition, ticksYPosition + 7, 0),
          ]}
          color={COLORS.tickText}
          lineWidth={1}
          transparent={true}
          opacity={0.7}
        />
      );
    }

    return ticks;
  }, [
    data.mapInfo,
    dimensions.width,
    laneHeight,
    timeRangeFilter,
    timeScale,
    getYPosition,
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
