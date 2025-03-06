import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { getHeroImage } from "../../../../../lib/hero";
import { PlayerEvent } from "../../../../../atoms";

interface TimelineMarkerProps {
  event: PlayerEvent;
  xPosition: number;
  yPosition: number;
  onRegisterMarker: (id: string, obj: THREE.Object3D) => void;
}

/**
 * Component for rendering individual event markers on the timeline
 */
export const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  event,
  xPosition,
  yPosition,
  onRegisterMarker,
}) => {
  // Determine marker appearance based on event type
  const size = 6;

  // Check if this is a hero spawn or swap event
  const isHeroEvent =
    event.playerEventType === "heroSpawn" ||
    event.playerEventType === "heroSwap";

  // Determine color based on event type
  let color = "#838383";

  // Determine shape based on event type
  let geometry = <circleGeometry args={[size, size]} />;

  return (
    <group>
      {/* Main event marker */}
      <mesh
        position={[xPosition, yPosition, 0.1]}
        scale={[1, 1, 1]}
        userData={{ event }}
        ref={(obj) => {
          if (obj) {
            onRegisterMarker(JSON.stringify(event), obj);
          }
        }}
      >
        {geometry}
        <meshBasicMaterial color={color} transparent opacity={1} />
      </mesh>

      {/* Hero image for hero spawn and swap events */}
      {isHeroEvent && event.playerHero && (
        <Html
          position={[xPosition, yPosition, 0.2]}
          center
          sprite
          transform
          distanceFactor={100}
          style={{
            width: `${size * 16}px`,
            height: `${size * 16}px`,
            borderRadius: "50%",
            backgroundImage: `url(${getHeroImage(event.playerHero)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "none",
          }}
        />
      )}
    </group>
  );
};

export default TimelineMarker;
