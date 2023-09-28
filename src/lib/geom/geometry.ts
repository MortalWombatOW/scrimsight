import * as THREE from 'three';
import {getColorFor} from '../color';
import {MapEntity, RenderState} from '../data/types';

function positionsForBucket(
  positions: THREE.Vector3[],
  x: number,
  z: number,
  radius: number = 0.5,
): THREE.Vector3[] {
  // return positions that are within .5 units of the given x/z
  return positions.filter(
    (position) =>
      Math.abs(position.x - x) < radius && Math.abs(position.z - z) < radius,
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
): THREE.PlaneGeometry {
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

export function colorPlaneFlat(geometry: THREE.BufferGeometry) {
  // color the plane a flat color
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(
      new Float32Array(geometry.attributes.position.count * 3),
      3,
    ),
  );
  const colorAttribute = geometry.getAttribute('color');
  const colorArray = colorAttribute.array as number[];
  const color = new THREE.Color(0xf3f3f3);
  for (let i = 0; i < colorArray.length; i += 3) {
    colorArray[i] = color.r;
    colorArray[i + 1] = color.g;
    colorArray[i + 2] = color.b;
  }
  geometry.getAttribute('color').needsUpdate = true;
}

export function colorPlaneForMapControl(
  geometry: THREE.BufferGeometry,
  team1Positions: THREE.Vector3[],
  team2Positions: THREE.Vector3[],
  smooth: boolean = true,
) {
  console.log('colorPlaneForMapControl', team1Positions, team2Positions);
  // color the area around each player based on their team
  // for each vertex, color it blue if the closest player is on team 1, red if the closest player is on team 2
  const positionAttribute = geometry.getAttribute('position');
  const positionArray = positionAttribute.array as number[];
  if (!geometry.getAttribute('color')) {
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(
        new Float32Array(positionAttribute.count * 3),
        3,
      ),
    );
  }

  const team1Color = new THREE.Color(getColorFor('team1'));
  const team2Color = new THREE.Color(getColorFor('team2'));

  const colorAttribute = geometry.getAttribute('color');
  const colorArray = colorAttribute.array as number[];
  for (let i = 0; i < positionArray.length; i += 3) {
    const x = positionArray[i];
    const y = positionArray[i + 1];
    const z = positionArray[i + 2];
    let team1Distance = Infinity;
    let team2Distance = Infinity;
    team1Positions.forEach((position) => {
      const distance = Math.sqrt((x - position.x) ** 2 + (z - position.z) ** 2);
      if (distance < team1Distance) {
        team1Distance = distance;
      }
    });
    team2Positions.forEach((position) => {
      const distance = Math.sqrt((x - position.x) ** 2 + (z - position.z) ** 2);
      if (distance < team2Distance) {
        team2Distance = distance;
      }
    });

    const color = new THREE.Color(
      team1Distance < team2Distance ? team1Color : team2Color,
    );
    const origHSL = {h: 0, s: 0, l: 0};
    color.getHSL(origHSL);
    // if smooth is set, darken the vertex the farther it is from the closest player
    if (smooth) {
      const distance = Math.min(team1Distance, team2Distance);

      const minLightness = 0.05;
      const lightnessOffset = distance / 100;
      const newLightness = Math.max(minLightness, origHSL.l - lightnessOffset);
      const minSaturation = 0;
      const saturationOffset = distance / 100;
      const newSaturation = Math.max(
        minSaturation,
        origHSL.s - saturationOffset,
      );
      color.setHSL(origHSL.h, newSaturation, origHSL.l);
    }

    colorArray[i] = color.r;
    colorArray[i + 1] = color.g;
    colorArray[i + 2] = color.b;
  }
  geometry.getAttribute('color').needsUpdate = true;
}

export type PlayerCurve = {
  startTime: number;
  endTime: number;
  curve: THREE.BufferGeometry;
};

type PlayerCurveRawPoints = {
  startTime: number;
  endTime: number;
  rawPoints: THREE.Vector3[];
};

export function buildCurvesForPlayers(
  entities: MapEntity[],
  ticksPerGameSecond: number,
): Record<string, PlayerCurve[]> {
  const curves: Record<string, PlayerCurve[]> = {};
  entities.forEach((entity) => {
    const curvesForPlayer = buildCurvesForPlayer(entity, ticksPerGameSecond);
    curves[entity.id] = curvesForPlayer;
  });
  return curves;
}

function buildCurvesForPlayer(
  entity: MapEntity,
  ticksPerGameSecond: number,
): PlayerCurve[] {
  const rawPoints: PlayerCurveRawPoints[] = [];
  let currentPoints: THREE.Vector3[] = [];
  let startTime = 0;
  let endTime = 0;
  Object.entries(entity.states).forEach(([key, state]) => {
    if (
      state.x === undefined ||
      state.y === undefined ||
      state.z === undefined
    ) {
      // console.log('bad state', state);
      return;
    }
    if (state.health === 0) {
      if (currentPoints.length > 0) {
        rawPoints.push({
          startTime,
          endTime,
          rawPoints: currentPoints,
        });
        currentPoints = [];
      }
    } else {
      if (currentPoints.length === 0) {
        startTime = parseInt(key, 10);
      }
      endTime = parseInt(key, 10);
      currentPoints.push(
        new THREE.Vector3(
          state.x as number,
          state.y as number,
          state.z as number,
        ),
      );
    }
  });

  if (currentPoints.length > 0) {
    rawPoints.push({
      startTime,
      endTime,
      rawPoints: currentPoints,
    });
  }

  return rawPoints.flatMap((rawPoints) => {
    if (rawPoints.rawPoints.length < 2) {
      // console.log('not enough points', rawPoints);
      return [];
    }
    return [
      {
        startTime: rawPoints.startTime,
        endTime: rawPoints.endTime,
        curve: buildCurve(rawPoints.rawPoints, ticksPerGameSecond),
      },
    ];
  });
}

function buildCurve(
  rawPoints: THREE.Vector3[],
  ticksPerGameSecond: number,
): THREE.BufferGeometry {
  const numPoints = rawPoints.length * ticksPerGameSecond;
  // console.log('building curve', rawPoints.length, numPoints);
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
      // console.log('undefined point', i, points[i]);
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
  let startRenderIndex = 0;
  let endRenderIndex = 0;
  const colorDist = (a: THREE.Color, b: THREE.Color) => {
    return Math.sqrt(
      Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2),
    );
  };
  const endColor = new THREE.Color('#ebebeb');
  for (let i = start; i < end; i++) {
    const dist = percentIndex - i;
    const lerpAmount = dampFn(dist);
    const color = new THREE.Color(
      colorArray[i * 3],
      colorArray[i * 3 + 1],
      colorArray[i * 3 + 2],
    );

    // const minLightness = 0.05;
    // const newLightness = Math.max(minLightness, hsl.l - lightnessOffset);
    color.lerp(endColor, lerpAmount);
    const distanceToEndColor = colorDist(color, endColor);
    if (distanceToEndColor <= 0.01) {
      if (i < percentIndex) {
        startRenderIndex = i;
      } else if (endRenderIndex === 0) {
        endRenderIndex = i;
      }
    }
    colorArray[i * 3] = color.r;
    colorArray[i * 3 + 1] = color.g;
    colorArray[i * 3 + 2] = color.b;
  }

  // console.log(
  //   `rendering ${
  //     endRenderIndex - startRenderIndex
  //   } points from ${startRenderIndex} to ${endRenderIndex} out of ${numPoints}`,
  // );
  curve.setDrawRange(startRenderIndex, endRenderIndex - startRenderIndex);

  colorAttribute.needsUpdate = true;
}
