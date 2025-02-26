import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useInterval } from "@mantine/hooks";

interface InteractionArrowProps {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  color: string;
  visible: boolean;
}

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
  }, [visible]);

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
