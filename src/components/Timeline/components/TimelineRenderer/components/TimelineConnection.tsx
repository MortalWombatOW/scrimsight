import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { PlayerInteractionEvent } from "../../../../../atoms";
// Grayscale color palette for better UI
const COLORS = {
  // Connection colors
  defaultConnection: 0x999999,
  highlightedConnection: 0x444444,
};

interface TimelineConnectionProps {
  sourcePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  interaction: PlayerInteractionEvent;
}

/**
 * Component for rendering animated connections between timeline events
 */
export const TimelineConnection: React.FC<TimelineConnectionProps> = ({
  sourcePosition,
  targetPosition,
  interaction,
}) => {
  // Calculate direction and rotation for the arrow head
  const arrowData = useMemo(() => {
    const direction = new THREE.Vector3().subVectors(
      targetPosition,
      sourcePosition
    );
    const length = direction.length();
    direction.normalize();

    // Calculate rotation to point the arrow head in the right direction
    const rotation =
      Math.atan2(direction.y, direction.x) +
      (interaction.direction === "outgoing" ? Math.PI : 0);

    // Position the arrow head slightly before the target to not overlap with the target marker
    const arrowHeadPosition = new THREE.Vector3()
      .copy(targetPosition)
      .sub(direction.multiplyScalar(7));

    return { rotation, position: arrowHeadPosition };
  }, [sourcePosition, targetPosition]);

  return (
    <>
      <Line
        points={[sourcePosition, targetPosition]}
        color={COLORS.defaultConnection}
        lineWidth={1}
        dashed={false}
        transparent
        opacity={1}
      />
      {/* Arrow head */}
      <group
        position={arrowData.position}
        rotation={[0, 0, arrowData.rotation + Math.PI / 2]}
      >
        <mesh>
          <coneGeometry args={[3, 6, 3]} />
          <meshBasicMaterial color={COLORS.defaultConnection} />
        </mesh>
      </group>
      <mesh position={sourcePosition}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial color={COLORS.defaultConnection} />
      </mesh>
    </>
  );
};

export default TimelineConnection;
