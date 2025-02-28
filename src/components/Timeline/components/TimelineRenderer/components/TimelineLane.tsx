import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Grayscale color palette for better UI
const COLORS = {
  // Primary UI elements
  alternatingLane1: 0xf5f5f5,
  alternatingLane2: 0xebebeb,

  // Text elements
  labelText: 0x111111,
};

interface TimelineLaneProps {
  playerName: string;
  index: number;
  yPosition: number;
  labelYPosition: number;
  laneWidth: number;
  laneSpacing: number;
  fontSize: number;
  leftMargin: number;
}

/**
 * Component for rendering player lanes and labels in the timeline
 */
export const TimelineLane: React.FC<TimelineLaneProps> = ({
  playerName,
  index,
  yPosition,
  labelYPosition,
  laneWidth,
  laneSpacing,
  fontSize,
  leftMargin,
}) => {
  return (
    <>
      {/* Lane background */}
      <mesh position={[0, yPosition, 0]}>
        <planeGeometry args={[laneWidth, laneSpacing]} />
        <meshBasicMaterial
          color={
            index % 2 === 0 ? COLORS.alternatingLane1 : COLORS.alternatingLane2
          }
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Player name label */}
      <Text
        position={[leftMargin, labelYPosition, 0.2]}
        fontSize={fontSize}
        color={COLORS.labelText}
        anchorX="left"
        anchorY="middle"
        maxWidth={laneWidth * 0.3}
        overflowWrap="break-word"
        fontWeight="bold"
      >
        {playerName}
      </Text>
    </>
  );
};

export default TimelineLane;
