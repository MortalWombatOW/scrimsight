import React, { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

// Grayscale color palette for better UI
const COLORS = {
  // Connection colors
  defaultConnection: 0x999999,
  highlightedConnection: 0x444444,
};

interface TimelineConnectionProps {
  sourcePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  isHighlighted: boolean;
}

/**
 * Component for rendering animated connections between timeline events
 */
export const TimelineConnection: React.FC<TimelineConnectionProps> = ({
  sourcePosition,
  targetPosition,
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

  // Adjust line width based on highlighting - increased for better visibility
  const lineWidth = isHighlighted ? 4 : 1.5;
  const color = isHighlighted
    ? COLORS.highlightedConnection
    : COLORS.defaultConnection;
  const opacity = isHighlighted ? 0.9 : 0.5;

  // If we're animating or animation is complete and highlighted
  if (animationRef.current.active || (animationComplete && isHighlighted)) {
    // Animated or completed highlighted connection
    if (animationComplete || progress === 1) {
      return (
        <QuadraticBezierLine
          start={sourcePosition}
          end={targetPosition}
          mid={midPoint}
          color={color}
          lineWidth={lineWidth}
          dashed={false}
          transparent
          opacity={opacity}
        />
      );
    }

    // Animating connection
    return (
      <QuadraticBezierLine
        start={sourcePosition}
        end={new THREE.Vector3().lerpVectors(
          sourcePosition,
          targetPosition,
          progress
        )}
        mid={new THREE.Vector3().lerpVectors(
          sourcePosition,
          midPoint,
          progress * 1.5 > 1 ? 1 : progress * 1.5
        )}
        color={color}
        lineWidth={lineWidth}
        dashed={false}
        transparent
        opacity={opacity}
      />
    );
  }

  // Default state: always render a static connection with lower opacity
  return (
    <QuadraticBezierLine
      start={sourcePosition}
      end={targetPosition}
      mid={midPoint}
      color={color}
      lineWidth={lineWidth}
      dashed={false}
      transparent
      opacity={opacity}
    />
  );
};

export default TimelineConnection;
