import React, { useMemo } from "react";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { formatTime } from "../../../../../lib";

// Grayscale color palette for better UI
const COLORS = {
  // Text elements
  tickText: 0x333333,
};

interface TimelineAxisProps {
  timeScale: (time: number) => number;
  startTime: number;
  endTime: number;
  ticksYPosition: number;
  tickInterval: number;
}

/**
 * Component for rendering time axis with ticks and labels
 */
export const TimelineAxis: React.FC<TimelineAxisProps> = ({
  timeScale,
  startTime,
  endTime,
  ticksYPosition,
  tickInterval,
}) => {
  // Generate time ticks based on the time range
  const ticks = useMemo(() => {
    const result = [];

    // Calculate the first tick that falls on an even interval
    // Round up to the nearest tickInterval
    const firstTick = Math.ceil(startTime / tickInterval) * tickInterval;

    // Generate ticks at regular intervals
    for (let time = firstTick; time <= endTime; time += tickInterval) {
      // Skip ticks that are too close to the start or end
      if (time < startTime || time > endTime) continue;

      const xPosition = timeScale(time);

      // Add text label for the time
      result.push(
        <Text
          key={`tick-${time}`}
          position={[xPosition, ticksYPosition - 5, 0.1]}
          fontSize={8}
          color={COLORS.tickText}
          anchorX="center"
          anchorY="top"
          fontWeight="bold"
        >
          {formatTime(time)}
        </Text>
      );

      // Add tick marks for better visual alignment
      result.push(
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

    // If we don't have enough ticks, add the start and end times
    if (result.length < 2) {
      // Add start time tick if it's not already included
      if (Math.abs(firstTick - startTime) > tickInterval * 0.1) {
        const startXPosition = timeScale(startTime);
        result.push(
          <Text
            key={`tick-start-${startTime}`}
            position={[startXPosition, ticksYPosition - 5, 0.1]}
            fontSize={8}
            color={COLORS.tickText}
            anchorX="center"
            anchorY="top"
            fontWeight="bold"
          >
            {formatTime(startTime)}
          </Text>
        );

        result.push(
          <Line
            key={`tick-line-start-${startTime}`}
            points={[
              new THREE.Vector3(startXPosition, ticksYPosition + 2, 0),
              new THREE.Vector3(startXPosition, ticksYPosition + 7, 0),
            ]}
            color={COLORS.tickText}
            lineWidth={1}
            transparent={true}
            opacity={0.7}
          />
        );
      }

      // Add end time tick if it's not already included
      const lastTick = Math.floor(endTime / tickInterval) * tickInterval;
      if (Math.abs(lastTick - endTime) > tickInterval * 0.1) {
        const endXPosition = timeScale(endTime);
        result.push(
          <Text
            key={`tick-end-${endTime}`}
            position={[endXPosition, ticksYPosition - 5, 0.1]}
            fontSize={8}
            color={COLORS.tickText}
            anchorX="center"
            anchorY="top"
            fontWeight="bold"
          >
            {formatTime(endTime)}
          </Text>
        );

        result.push(
          <Line
            key={`tick-line-end-${endTime}`}
            points={[
              new THREE.Vector3(endXPosition, ticksYPosition + 2, 0),
              new THREE.Vector3(endXPosition, ticksYPosition + 7, 0),
            ]}
            color={COLORS.tickText}
            lineWidth={1}
            transparent={true}
            opacity={0.7}
          />
        );
      }
    }

    return result;
  }, [startTime, endTime, tickInterval, timeScale, ticksYPosition]);

  return <>{ticks}</>;
};

export default TimelineAxis;
