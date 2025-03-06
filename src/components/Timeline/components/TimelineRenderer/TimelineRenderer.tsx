import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { TimelineScene } from "./components";

interface TimelineRendererProps {
  matchId: string;
  currentTimeRange: { start: number; end: number };
}

/**
 * Timeline renderer component using THREE.js for efficient visualization
 */
export const TimelineRenderer: React.FC<TimelineRendererProps> = ({
  matchId,
  currentTimeRange,
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
      className="w-full h-full" // Added light gray background for better contrast
      aria-label="Timeline visualization"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Canvas orthographic camera={cameraConfig.current}>
          {/* Added ambient light for better visibility */}
          <ambientLight intensity={0.8} />
          <TimelineScene
            matchId={matchId}
            currentTimeRange={currentTimeRange}
            dimensions={dimensions}
          />
        </Canvas>
      )}
    </div>
  );
};
