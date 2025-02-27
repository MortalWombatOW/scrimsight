import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

interface InteractionArrowProps {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  color: string;
  visible: boolean;
}

// Custom hook to replace useInterval from Mantine
const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  const start = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);
  };

  // Clear interval on unmount
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { start, stop };
};

export const InteractionArrow = ({
  startPos,
  endPos,
  color,
  visible,
}: InteractionArrowProps) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const [opacity, setOpacity] = useState(1);
  const [progress, setProgress] = useState(0);

  const interval = useInterval(
    () => setProgress((p) => Math.min(p + 2, 100)),
    16
  );

  useEffect(() => {
    if (visible) {
      setProgress(0);
      interval.start();
      setOpacity(1);
    } else {
      interval.stop();
    }
  }, [visible, interval]);

  useFrame(() => {
    if (geometryRef.current && materialRef.current) {
      const curve = new THREE.CatmullRomCurve3([
        startPos,
        new THREE.Vector3(
          (startPos.x + endPos.x) / 2 + 50,
          (startPos.y + endPos.y) / 2,
          0
        ),
        endPos,
      ]);

      const points = curve.getPoints(30);
      const visiblePoints = points.slice(
        0,
        Math.floor((points.length * progress) / 100)
      );

      geometryRef.current.setFromPoints(visiblePoints);
    }
  });

  return (
    <line>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial
        ref={materialRef}
        color={color}
        opacity={opacity}
        linewidth={2}
      />
    </line>
  );
};
