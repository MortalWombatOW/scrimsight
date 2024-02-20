import React, {useEffect, useState} from 'react';

export type AABB = {
  elementTag: string;
  matchText: string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AABBs = AABB[];

const getCollisions = (aabbs: AABBs): [number, number][] => {
  const collisions: [number, number][] = [];
  for (const [i, aabb1] of aabbs.entries()) {
    for (const [j, aabb2] of aabbs.entries()) {
      if (aabb1 === aabb2) {
        continue;
      }
      if (i >= j) {
        continue;
      }
      if (
        aabb1.x + aabb1.width > aabb2.x &&
        aabb1.x < aabb2.x + aabb2.width &&
        aabb1.y + aabb1.height > aabb2.y &&
        aabb1.y < aabb2.y + aabb2.height
      ) {
        collisions.push([i, j]);
      }
    }
  }
  return collisions;
};

const resolveCollision = (aabb1: AABB, aabb2: AABB): [AABB, AABB] => {
  const xOverlap =
    Math.min(aabb1.x + aabb1.width, aabb2.x + aabb2.width) -
    Math.max(aabb1.x, aabb2.x);
  const yOverlap =
    Math.min(aabb1.y + aabb1.height, aabb2.y + aabb2.height) -
    Math.max(aabb1.y, aabb2.y);

  if (xOverlap > yOverlap) {
    if (aabb1.x < aabb2.x) {
      aabb1.x -= xOverlap / 2;
      aabb2.x += xOverlap / 2;
    } else {
      aabb1.x += xOverlap / 2;
      aabb2.x -= xOverlap / 2;
    }
  } else {
    if (aabb1.y < aabb2.y) {
      aabb1.y -= yOverlap / 2;
      aabb2.y += yOverlap / 2;
    } else {
      aabb1.y += yOverlap / 2;
      aabb2.y -= yOverlap / 2;
    }
  }

  return [aabb1, aabb2];
};

const useAdjustedText = (aabbs: AABBs): AABBs => {
  const [adjustedAABBs, setAdjustedAABBs] = useState<AABBs>([]);
  console.log(
    'useAdjustedText',
    aabbs,
    adjustedAABBs,
    'running useAdjustedText',
  );

  useEffect(() => {
    // This hook is used to adjust the AABBs of the text elements so that they don't overlap.
    // It takes in a map of AABBs and returns a new map of AABBs with adjusted positions.
    // The adjustment is done as follows:
    // While there are collisions, adjust the position of the AABBs so that they don't overlap by moving them each along the axis of the collision an amount equal to the overlap.
    // The amount of overlap is calculated by taking the difference between the position of the AABBs along the axis of the collision.

    const adjustedAABBs_: AABBs = [...aabbs];
    const maxIters = 100;
    let iters = 0;

    console.log('running useAdjustedText', aabbs);

    do {
      iters++;
      if (iters > maxIters) {
        console.error('Max iterations reached');
        break;
      }

      const collisions = getCollisions(adjustedAABBs_);
      if (collisions.length === 0) {
        console.log('No collisions');
        break;
      }

      for (const [i, j] of collisions) {
        const [aabb1, aabb2] = resolveCollision(
          adjustedAABBs_[i],
          adjustedAABBs_[j],
        );
        adjustedAABBs_[i] = aabb1;
        adjustedAABBs_[j] = aabb2;
        console.log(
          'resolved collision',
          i,
          j,
          JSON.stringify(aabb1),
          JSON.stringify(aabb2),
        );
      }
    } while (true);

    setAdjustedAABBs(adjustedAABBs_);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(aabbs)]);

  return adjustedAABBs.length == aabbs.length ? adjustedAABBs : aabbs;
};

export default useAdjustedText;
