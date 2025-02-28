import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

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

  useFrame(() => {
    if (geometryRef.current && materialRef.current) {
      const curve = new THREE.CatmullRomCurve3([
        startPos,
        new THREE.Vector3(
          (startPos.x + endPos.x) / 2 + 10,
          (startPos.y + endPos.y) / 2,
          5
        ),
        endPos,
      ]);

      const points = curve.getPoints(30);

      geometryRef.current.setFromPoints(points);
    }
  });

  return (
    <line>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial
        ref={materialRef}
        color={color}
        opacity={1}
        linewidth={2}
      />
    </line>
  );
};
