import * as THREE from 'three';
import {getColorFor} from '../color';
import {MapEntity, RenderState} from './types';

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

function positionsForBucket(
  positions: THREE.Vector3[],
  x: number,
  z: number,
): THREE.Vector3[] {
  // return positions that are within .5 units of the given x/z
  return positions.filter(
    (position) =>
      Math.abs(position.x - x) < 0.5 && Math.abs(position.z - z) < 0.5,
  );
}

function applyDataToVertices(
  geometry: THREE.BufferGeometry,
  positions: THREE.Vector3[],
) {
  const positionAttribute = geometry.getAttribute('position');
  geometry.setAttribute(
    'isFixed',
    new THREE.BufferAttribute(new Float32Array(positionAttribute.count), 1),
  );

  const positionArray = positionAttribute.array as number[];
  const isFixedArray = geometry.getAttribute('isFixed').array as number[];
  for (let i = 0; i < positionArray.length; i += 3) {
    const x = positionArray[i];
    const y = positionArray[i + 1];
    const z = positionArray[i + 2];
    const bucketPositions = positionsForBucket(positions, x, z);
    if (bucketPositions.length === 0) {
      continue;
    }
    const minY = Math.min(...bucketPositions.map((p) => p.y));
    positionArray[i + 1] = minY;
    isFixedArray[i / 3] = 1;
  }
  // update the geometry to reflect the new vertex positions
  geometry.getAttribute('position').needsUpdate = true;
}

function addColorForFixedPoints(geometry: THREE.BufferGeometry) {
  const isFixedAttribute = geometry.getAttribute('isFixed');

  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(isFixedAttribute.count * 3), 3),
  );
  const colorAttribute = geometry.getAttribute('color');
  const isFixedArray = isFixedAttribute.array as number[];
  const colorArray = colorAttribute.array as number[];
  for (let i = 0; i < isFixedArray.length; i++) {
    if (isFixedArray[i] === 1) {
      colorArray[i * 3] = 0.2;
      colorArray[i * 3 + 1] = 0.2;
      colorArray[i * 3 + 2] = 0.2;
    }
  }
  geometry.getAttribute('color').needsUpdate = true;
}

// function newGeometryFromFixed(geometry: THREE.BufferGeometry): THREE.Buffer {
//   const isFixedAttribute = geometry.getAttribute('isFixed');
//   const isFixedArray = isFixedAttribute.array as number[];
//   const numFixedPoints = isFixedArray.reduce((sum, isFixed) => {
//     if (isFixed === 1) {
//       return sum + 1;
//     }
//     return sum;
//   }, 0);

//   const newGeometry = new THREE.BufferGeometry();
//   newGeometry.setAttribute(
//     'position',
//     new THREE.BufferAttribute(new Float32Array(numFixedPoints * 3), 3),
//   );
//   newGeometry.setAttribute(
//     'color',
//     new THREE.BufferAttribute(new Float32Array(numFixedPoints * 3), 3),
//   );
//   const newPositionArray = newGeometry.getAttribute('position')
//     .array as number[];
//   const newColorArray = newGeometry.getAttribute('color').array as number[];

//   const positionArray = geometry.getAttribute('position').array as number[];
//   const colorArray = geometry.getAttribute('color').array as number[];
//   let index = 0;
//   for (let i = 0; i < isFixedArray.length; i++) {
//     if (isFixedArray[i] === 1) {
//       newPositionArray[index * 3] = positionArray[i * 3];
//       newPositionArray[index * 3 + 1] = positionArray[i * 3 + 1];
//       newPositionArray[index * 3 + 2] = positionArray[i * 3 + 2];
//       newColorArray[index * 3] = colorArray[i * 3];
//       newColorArray[index * 3 + 1] = colorArray[i * 3 + 1];
//       newColorArray[index * 3 + 2] = colorArray[i * 3 + 2];
//       index++;
//     }
//   }

//   newGeometry.getAttribute('position').needsUpdate = true;
//   newGeometry.getAttribute('color').needsUpdate = true;
//   newGeometry.computeVertexNormals();

//   return newGeometry;
// }

export function generateMapGeometry(entities: MapEntity[]): THREE.Geometry {
  // render a wireframe box around the world bounds
  const positions = extractPositions(entities);
  const bounds = getBounds(positions);

  const vertsPerUnitLength = 1;
  // build a plane geometry for the floor along the x/z plane
  const floorGeometry = new THREE.PlaneGeometry(
    bounds.max.x - bounds.min.x,
    bounds.max.z - bounds.min.z,
    Math.floor((bounds.max.x - bounds.min.x) * vertsPerUnitLength),
    Math.floor((bounds.max.z - bounds.min.z) * vertsPerUnitLength),
  );
  floorGeometry.rotateX(-Math.PI / 2);

  // translate the floor geometry to the correct position
  floorGeometry.translate(
    bounds.min.x + (bounds.max.x - bounds.min.x) / 2,
    bounds.min.y,
    bounds.min.z + (bounds.max.z - bounds.min.z) / 2,
  );

  applyDataToVertices(floorGeometry, positions);
  addColorForFixedPoints(floorGeometry);

  // const simplified = newGeometryFromFixed(floorGeometry);

  // offsetVerticesToLowestPoint(floorGeometry, positions, bounds);
  // for (let i = 0; i < 1; i++) {
  //   smoothGeometryMainainingLocalMaxima(floorGeometry);
  // }

  return floorGeometry;
}

export function buildCurvesForPlayers(entities: MapEntity[], time: number) {
  return entities.map((entity) => buildCurvesForPlayer(entity, time));
}

function buildCurvesForPlayer(
  entity: MapEntity,
  time: number,
): THREE.BufferGeometry {
  const rawPoints: THREE.Vector3[] = [];
  const times: number[] = [];
  const heroes: string[] = [];
  Object.entries(entity.states).forEach(([key, state]) => {
    rawPoints.push(
      new THREE.Vector3(state.x, (state.y as number) - 0.7, state.z),
    );
    times.push(Number(key));
    heroes.push(state.hero as string);
  });

  const startTime = times[0];
  const endTime = times[times.length - 1];
  const timeRange = endTime - startTime;
  const timeOffset = time - startTime;

  const scaleFactor = 10;
  const numPoints = rawPoints.length * scaleFactor;
  const curve = new THREE.CatmullRomCurve3(rawPoints);
  const points: THREE.Vector3[] = curve.getPoints(numPoints);
  const geometry = new THREE.BufferGeometry();

  const vertices: number[] = [];
  const colors: number[] = [];
  for (let i = 0; i < points.length; i++) {
    vertices.push(points[i].x, points[i].y, points[i].z);
    const pointTime = (i / points.length) * timeRange + startTime;
    const distToCurrentTime = Math.abs(pointTime - time);
    const hero = heroes[Math.floor(i / scaleFactor)];
    const color = new THREE.Color(getColorFor(hero));
    const hsl = {h: 0, s: 0, l: 0};
    color.getHSL(hsl);
    const lightnessOffset = distToCurrentTime / 10;
    const newLightness = Math.max(0, hsl.l - lightnessOffset);
    color.setHSL(hsl.h, hsl.s, newLightness);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  // draw the line starting from 3 seconds ago and ending 5 seconds from now
  const startOffset = 4;
  const seconds = 8;
  const numPointsToDraw = seconds * scaleFactor;
  const startDrawTime = time - startOffset;
  const startDrawIndex = Math.floor(
    ((startDrawTime - startTime) / timeRange) * numPoints,
  );
  // geometry.setDrawRange(startDrawIndex, numPointsToDraw);
  geometry.computeVertexNormals();

  return geometry;
}
