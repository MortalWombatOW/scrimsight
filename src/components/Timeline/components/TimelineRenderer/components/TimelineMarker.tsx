import React, { useRef } from "react";
import * as THREE from "three";
import { TimelineEvent } from "../../../hooks";

// Grayscale color palette for better UI
const COLORS = {
  // Interactive elements
  defaultEvent: 0x777777,
  selectedEvent: 0x222222,

  // Feedback/state colors
  hoverState: 0x666666,

  // Event type colors (grayscale variants for different event types)
  eventDefault: 0x777777,
  eventAbility: 0x666666,
  eventKill: 0x444444,
  eventDamage: 0x555555,
  eventHealing: 0x888888,
};

interface TimelineMarkerProps {
  event: TimelineEvent;
  xPosition: number;
  yPosition: number;
  isSelected: boolean;
  isHovered: boolean;
  onRegisterMarker: (id: string, obj: THREE.Object3D) => void;
}

/**
 * Component for rendering individual event markers on the timeline
 */
export const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  event,
  xPosition,
  yPosition,
  isSelected,
  isHovered,
  onRegisterMarker,
}) => {
  // Determine marker appearance based on event type
  const size = 2.5;
  const scale = isSelected || isHovered ? 1.2 : 1;

  // Determine color based on event type
  let color = COLORS.eventDefault;
  switch (event.type) {
    case "ability":
      color = COLORS.eventAbility;
      break;
    case "kill":
      color = COLORS.eventKill;
      break;
    case "damage":
      color = COLORS.eventDamage;
      break;
    case "healing":
      color = COLORS.eventHealing;
      break;
  }

  // Determine shape based on event type
  let geometry;
  switch (event.type) {
    case "ability":
      geometry = <circleGeometry args={[size, 32]} />;
      break;
    case "kill":
      geometry = <ringGeometry args={[size * 0.5, size, 32]} />;
      break;
    case "damage":
      geometry = <boxGeometry args={[size * 1.5, size * 1.5, size]} />;
      break;
    default:
      geometry = <circleGeometry args={[size, 3]} />;
      break;
  }

  // Add an outline for selected/hovered items
  const outlineOpacity = isSelected ? 0.9 : isHovered ? 0.6 : 0;

  return (
    <group>
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
            onRegisterMarker(event.id, obj);
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
};

export default TimelineMarker;
