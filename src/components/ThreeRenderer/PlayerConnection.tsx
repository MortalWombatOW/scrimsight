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
  const MAX_POINTS = 1;
  const RADIAL_SEGMENTS = 8;

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

  const positions = new Float32Array(MAX_POINTS * RADIAL_SEGMENTS * 3);
  const colors = new Float32Array(MAX_POINTS * 3 * RADIAL_SEGMENTS);
  const tubeGeometry = new THREE.TubeGeometry(
    curve,
    MAX_POINTS,
    amount / 20 + 0.5,
    RADIAL_SEGMENTS,
    false,
  );
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, RADIAL_SEGMENTS * 3),
  );
  geometry.setDrawRange(0, drawCount * RADIAL_SEGMENTS);
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, RADIAL_SEGMENTS * 3),
  );

  const color = type === 'damage' ? '#b65153' : '#d7ae0b';
  const threeColor = new THREE.Color(color);
  threeColor.offsetHSL(0, 0, 0);
  console.log('color', color, 'modified', threeColor.getHexString());
  const material = new THREE.MeshPhongMaterial({
    // vertexColors: true,
    color: threeColor,
  });
  // tubeGeometry.setDrawRange(1, 3);
  const mesh = new THREE.Mesh(tubeGeometry, material);

  // mesh.geometry.setDrawRange(0, 50);
  const DURATION = 2;
  // useFrame((_, delta) => {
  //   const deltaPercent = delta / DURATION;
  //   const deltaPoints = deltaPercent * MAX_POINTS;
  //   drawCount = drawCount + deltaPoints;
  //   if (drawCount > MAX_POINTS) {
  //     drawCount = 0;
  //   }
  //   if (drawCount > 2) {
  //     mesh.geometry.setDrawRange(0, Math.floor(drawCount * RADIAL_SEGMENTS));
  //   }
  //   for (let i = 0; i < drawCount; i++) {
  //     const point = tubeGeometry.parameters.path.getPoint(i / (MAX_POINTS - 1));
  //     const normal = tubeGeometry.parameters.path.getTangent(
  //       i / (MAX_POINTS - 1),
  //     );
  //     const binormal = new THREE.Vector3();
  //     binormal.crossVectors(normal, new THREE.Vector3(0, 1, 0));
  //     const matrix = new THREE.Matrix4();
  //     matrix.lookAt(point, new THREE.Vector3(), normal);
  //     matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2));
  //     matrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
  //     for (let j = 0; j < RADIAL_SEGMENTS; j++) {
  //       const angle = (j / RADIAL_SEGMENTS) * Math.PI * 2;
  //       const x = Math.cos(angle);
  //       const y = Math.sin(angle);
  //       const pos = new THREE.Vector3(x, y, 0);
  //       pos.applyMatrix4(matrix);
  //       pos.add(point);
  //       positions[i * RADIAL_SEGMENTS * 3 + j * 3] = pos.x;
  //       positions[i * RADIAL_SEGMENTS * 3 + j * 3 + 1] = pos.y;
  //       positions[i * RADIAL_SEGMENTS * 3 + j * 3 + 2] = pos.z;
  //       colors[i * RADIAL_SEGMENTS * 3 + j * 3] = threeColor.r;
  //       colors[i * RADIAL_SEGMENTS * 3 + j * 3 + 1] = threeColor.g;
  //       colors[i * RADIAL_SEGMENTS * 3 + j * 3 + 2] = threeColor.b;
  //     }
  //   }
  //   mesh.geometry.attributes.position.needsUpdate = true;
  //   mesh.geometry.attributes.color.needsUpdate = true;
  // });

  return <primitive object={mesh} />;
}
