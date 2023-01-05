import React, {useMemo} from 'react';
import * as THREE from 'three';
import {generateBackgroundPlaneGeometry} from '../../lib/data/geometry';
import {MapEntity} from '../../lib/data/types';

interface BackgroundPlaneProps {
  bounds: THREE.Box3;
  // the size of each cell in the grid
  cellSize: number;
  isWireframe: boolean;
}

export function BackgroundPlane(props: BackgroundPlaneProps) {
  const {bounds, cellSize, isWireframe} = props;
  const geometry = useMemo(
    () => generateBackgroundPlaneGeometry(bounds, cellSize),
    [],
  );
  const material = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        wireframe: isWireframe,
        // vertexColors: true,
        color: 0x555555,
      }),
    [],
  );
  return (
    <group>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}
