import React from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export function PlayerConnection({
  source,
  target,
  amount,
  type,
}: {
  amount: number;
  type: string;
  source: {
    x: number;
    y: number;
    z: number;
  };
  target: {
    x: number;
    y: number;
    z: number;
  };
}) {
  const MAX_POINTS = 10;
  let drawCount = 2;
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const midZ = (source.z + target.z) / 2;
  const length = Math.sqrt(
    Math.pow(source.x - target.x, 2) +
      Math.pow(source.y - target.y, 2) +
      Math.pow(source.z - target.z, 2),
  );
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(source.x, source.y, source.z),
    new THREE.Vector3(midX, midY + length / 4, midZ),
    new THREE.Vector3(target.x, target.y, target.z),
  );
  const positions = new Float32Array(MAX_POINTS * 3);
  const colors = new Float32Array(MAX_POINTS * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, drawCount);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const color = type === 'damage' ? '#b65153' : '#d7ae0b';
  const threeColor = new THREE.Color(color);
  threeColor.offsetHSL(0, 0, 0);
  console.log('color', color, 'modified', threeColor.getHexString());
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
  });
  const line = new THREE.Line(geometry, material);
  const DURATION = 0.5;
  useFrame((_, delta) => {
    const deltaPercent = delta / DURATION;
    const deltaPoints = deltaPercent * MAX_POINTS;
    drawCount = drawCount + deltaPoints;
    if (drawCount > MAX_POINTS) {
      drawCount = 0;
    }
    if (drawCount > 2) {
      line.geometry.setDrawRange(0, Math.floor(drawCount));
    }
    for (let i = 0; i < drawCount; i++) {
      const point = curve.getPoint(i / (MAX_POINTS - 1));
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      colors[i * 3] = threeColor.r;
      colors[i * 3 + 1] = threeColor.g;
      colors[i * 3 + 2] = threeColor.b;
    }
    line.geometry.attributes.position.needsUpdate = true;
    line.geometry.attributes.color.needsUpdate = true;
  });

  return <primitive object={line} />;
}
