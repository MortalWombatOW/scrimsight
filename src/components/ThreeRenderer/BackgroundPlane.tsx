import React, {useMemo} from 'react';
import * as THREE from 'three';
import {generateMapGeometry} from '../../lib/data/geometry';
import {MapEntity} from '../../lib/data/types';

export function BackgroundPlane({entities}: {entities: MapEntity[]}) {
  const geometry = useMemo(() => generateMapGeometry(entities), []);
  const material = useMemo(
    () => new THREE.MeshLambertMaterial({color: 0x333333, wireframe: true}),
    [],
  );
  return (
    <group>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}
