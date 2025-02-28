import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { TimelineData } from "../../hooks";
import { TimelineScene } from "./components";

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
