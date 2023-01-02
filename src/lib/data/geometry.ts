import * as THREE from 'three';
import {MapEntity} from './types';

function extractPositions(entities: MapEntity[]): THREE.Vector3[] {
  return entities.flatMap((entity) =>
    Object.values(entity.states).flatMap((state) => {
      const {
        x,
        y,
        z,
      }: {
        x?: number;
        y?: number;
        z?: number;
      } = state;
      if (
        Number.isNaN(x) ||
        Number.isNaN(y) ||
        Number.isNaN(z) ||
        x === undefined ||
        y === undefined ||
        z === undefined
      ) {
        return [];
      }

      return [new THREE.Vector3(x, y, z)];
    }),
  );
}

function getBounds(positions: THREE.Vector3[]): THREE.Box3 {
  const bounds = new THREE.Box3();
  positions.forEach((position) => bounds.expandByPoint(position));
  return bounds;
}

export function generateMapGeometry(entities: MapEntity[]): THREE.Geometry {
  // render a wireframe box around the world bounds
  const positions = extractPositions(entities);
  const bounds = getBounds(positions);
  // build a plane geometry for the floor along the x/z plane
  const floorGeometry = new THREE.PlaneGeometry(
    bounds.max.x - bounds.min.x,
    bounds.max.z - bounds.min.z,
    20,
    20,
  );
  floorGeometry.rotateX(-Math.PI / 2);
  return floorGeometry;
}
