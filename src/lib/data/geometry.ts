import * as THREE from 'three';
import {getColorFor} from '../color';
import {MapEntity, RenderState} from './types';

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

export function generateBackgroundPlaneGeometry(
  bounds: THREE.Box3,
  cellSize: number,
): THREE.Geometry {
  // render a wireframe box around the world bounds

  const vertsPerUnitLength = 1 / cellSize;
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

  // applyDataToVertices(floorGeometry, positions);
  // addColorForFixedPoints(floorGeometry);

  return floorGeometry;
}

export function buildCurvesForPlayers(
  entities: MapEntity[],
  ticksPerGameSecond: number,
  playerTeam: (player: string) => number,
): Record<string, THREE.BufferGeometry> {
  const curves: Record<string, THREE.BufferGeometry> = {};
  entities.forEach((entity) => {
    const player = entity.id;
    const curve = buildCurveForPlayer(entity, ticksPerGameSecond);
    setCurveBaseColor(
      curve,
      new THREE.Color(
        getColorFor(playerTeam(player) === 1 ? 'team1' : 'team2'),
      ),
    );
    curves[entity.id] = curve;
  });
  return curves;
}

function buildCurveForPlayer(
  entity: MapEntity,
  ticksPerGameSecond: number,
): THREE.BufferGeometry {
  const rawPoints: THREE.Vector3[] = [];

  Object.entries(entity.states).forEach(([key, state]) => {
    if (
      state.x === undefined ||
      state.y === undefined ||
      state.z === undefined
    ) {
      console.log('bad state', state);
      return;
    }
    rawPoints.push(new THREE.Vector3(state.x, state.y as number, state.z));
  });

  const numPoints = rawPoints.length * ticksPerGameSecond;
  const curve = new THREE.CatmullRomCurve3(rawPoints);
  const points: THREE.Vector3[] = curve.getPoints(numPoints);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(numPoints * 3), 3),
  );
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(numPoints * 3), 3),
  );
  const positionAttribute = geometry.getAttribute('position');
  const positionArray = positionAttribute.array as number[];

  for (let i = 0; i < points.length; i++) {
    if (
      Number.isNaN(points[i].x) ||
      Number.isNaN(points[i].y) ||
      Number.isNaN(points[i].z)
    ) {
      console.log('undefined point', i, points[i]);
      // TODO figure out why this is happening
      positionArray[i * 3] = 0;
      positionArray[i * 3 + 1] = 0;
      positionArray[i * 3 + 2] = 0;
    } else {
      positionArray[i * 3] = points[i].x;
      positionArray[i * 3 + 1] = points[i].y;
      positionArray[i * 3 + 2] = points[i].z;
    }
  }

  positionAttribute.needsUpdate = true;

  return geometry;
}

// TODO how to make this work for multiple colors?
export function setCurveBaseColor(
  curve: THREE.BufferGeometry,
  color: THREE.Color,
) {
  const colorAttribute = curve.getAttribute('color');
  const colorArray = colorAttribute.array as number[];
  for (let i = 0; i < colorArray.length; i += 3) {
    colorArray[i] = color.r;
    colorArray[i + 1] = color.g;
    colorArray[i + 2] = color.b;
  }
  colorAttribute.needsUpdate = true;
}

export function highlightCurveAroundPercent(
  // the curve we're highlighting. It should already have a color attribute.
  curve: THREE.BufferGeometry,
  // the percent along the curve we want to highlight
  percent: number,
  // maps a distance from the percent to a lightness offset
  dampFn: (dist: number) => number,
) {
  const colorAttribute = curve.getAttribute('color');
  const colorArray = colorAttribute.array as number[];
  const numPoints = colorArray.length / 3;
  const percentIndex = Math.floor(numPoints * percent);
  // TODO optimize this by only updating the points that changed
  const start = 0;
  const end = numPoints;
  const diff = end - start;
  let startRenderIndex = 0;
  let endRenderIndex = 0;
  for (let i = start; i < end; i++) {
    const dist = Math.abs(i - percentIndex);
    const lightnessOffset = dampFn(dist);
    const color = new THREE.Color(
      colorArray[i * 3],
      colorArray[i * 3 + 1],
      colorArray[i * 3 + 2],
    );
    const hsl = {h: 0, s: 0, l: 0};
    color.getHSL(hsl);
    const newLightness = Math.max(0, hsl.l - lightnessOffset);
    if (newLightness === 0) {
      if (i < percentIndex) {
        startRenderIndex = i;
      } else if (endRenderIndex === 0) {
        endRenderIndex = i;
      }
    }
    color.setHSL(hsl.h, hsl.s, newLightness);
    colorArray[i * 3] = color.r;
    colorArray[i * 3 + 1] = color.g;
    colorArray[i * 3 + 2] = color.b;
  }

  console.log(`rendering ${endRenderIndex - startRenderIndex} points`);
  curve.setDrawRange(startRenderIndex, endRenderIndex - startRenderIndex);

  colorAttribute.needsUpdate = true;
}
