import React, {useEffect, useState} from 'react';

type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ElementLifted = {
  el: SVGGraphicsElement;
  originalCoords: {x: number; y: number};
  bbox: BBox;
};

const getBBox = (el: SVGGraphicsElement): BBox => {
  if (el.tagName === 'text') {
    return el.getBBox();
  }
  if (el.tagName === 'g') {
    const foreignObject = el.getElementsByTagName('foreignObject')[0];
    if (!foreignObject) {
      throw new Error('No foreignObject found');
    }
    const pElement = foreignObject.getElementsByTagName('p')[0];
    if (!pElement) {
      throw new Error('No p element found');
    }

    const {width, height} = pElement.getBoundingClientRect();
    const transform = el.getAttribute('transform');
    if (!transform) {
      const orig = getOriginalCoords(el);
      return {
        x: orig.x,
        y: orig.y,
        width,
        height,
      };
    }
    const x = parseFloat(transform?.split(',')[0].split('(')[1]);
    const y = parseFloat(transform?.split(',')[1].split(')')[0]);
    return {
      x,
      y,
      width,
      height,
    };
  }
  throw new Error('Unknown tag');
};

const getOriginalCoords = (el: SVGGraphicsElement) => {
  const dataX = el.getAttribute('data-x');
  const dataY = el.getAttribute('data-y');
  if (!dataX || !dataY) {
    throw new Error('No data-x or data-y');
  }

  return {
    x: parseFloat(dataX),
    y: parseFloat(dataY),
  };
};

const doCollisionResolution = (
  elements: ElementLifted[],
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
): void => {
  // then, check for collisions
  const maxIterations = 100;
  let iterations = 0;
  while (true) {
    iterations++;
    if (iterations > maxIterations) {
      console.error('Too many iterations');
      break;
    }
    const collisions: [number, number][] = [];
    for (let i = 0; i < elements.length; i++) {
      for (let j = 0; j < elements.length; j++) {
        const aabb1 = elements[i].bbox;
        const aabb2 = elements[j].bbox;
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

    // console.log('collisions', collisions);
    if (collisions.length === 0) {
      break;
    }

    // console.log('bboxes', bboxes);

    // go through each collision and resolve it by moving the later element vertically
    for (const [i, j] of collisions) {
      const el1 = elements[i];
      const el2 = elements[j];
      const aabb1 = el1.bbox;
      const aabb2 = el2.bbox;

      const {normal, depth} = getCollisionData(el1.bbox, el2.bbox);
      const dy = normal === 'y' ? depth / 2 : 0;
      el1.bbox.y = aabb1.y - dy;
      el2.bbox.y = aabb2.y + dy;

      // el2.classList.add(`collided-${dy.toFixed(0)}`);
      // console.log('resolved', el1, el2);
    }

    for (const el of elements) {
      const aabb = el.bbox;
      aabb.x = Math.min(Math.max(aabb.x, xMin), xMax - aabb.width);
      aabb.y = Math.min(Math.max(aabb.y, yMin), yMax - aabb.height);
    }
  }
};

const getCollisionData = (
  aabb1: BBox,
  aabb2: BBox,
): {
  normal: 'x' | 'y';
  depth: number;
} => {
  // const xOverlap =
  //   Math.min(aabb1.x + aabb1.width, aabb2.x + aabb2.width) -
  //   Math.max(aabb1.x, aabb2.x);
  const yOverlap =
    Math.min(aabb1.y + aabb1.height, aabb2.y + aabb2.height) -
    Math.max(aabb1.y, aabb2.y);
  // if (xOverlap > yOverlap) {
  //   return {
  //     normal: 'x',
  //     depth: xOverlap,
  //   };
  // }
  return {
    normal: 'y',
    depth: yOverlap,
  };
};

const useLegibleTextSvg = (
  ref: React.RefObject<SVGSVGElement> | null,
  dependencies: any[] = [],
): number => {
  // This hook is used to make sure that text elements in an SVG are not overlapping.

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    const xmin = ref.current.viewBox.baseVal.x;
    const ymin = ref.current.viewBox.baseVal.y;
    const width = ref.current.viewBox.baseVal.width;
    const height = ref.current.viewBox.baseVal.height;

    const textElements = Array.from(
      ref.current?.getElementsByTagName('text') || [],
    );

    const gElements = Array.from(
      ref.current?.getElementsByTagName('g') || [],
    ).filter((el) => el.classList.contains('svg-wrap-text-group'));

    const svgElement = ref.current;
    // set display none
    // svgElement.style.display = 'none';

    // console.log('elements', textElements, gElements);

    const elements: ElementLifted[] = [...textElements, ...gElements].map(
      (el) => {
        return {
          el,
          originalCoords: getOriginalCoords(el),
          bbox: getBBox(el),
        };
      },
    );

    //first, get the height of the g elements and adjust them upwards 1/2 of the height
    for (const el of elements) {
      const aabb = el.bbox;
      const orig = el.originalCoords;
      const newY = orig.y - aabb.height / 2;

      el.bbox.y = newY;

      // console.log('adjusted', newTransform, el.getAttribute('transform'));

      // el.classList.add(`adjusted-${newY}`);
      // el.classList.add(`height-${aabb.height}`);
    }

    // optimization: partition elements by x position
    const partitionedElements: ElementLifted[][] = [];
    let currentPartition: ElementLifted[] = [];
    let lastX = -1;
    for (const el of elements) {
      const x = el.bbox.x;
      if (x !== lastX) {
        if (currentPartition.length > 0) {
          partitionedElements.push(currentPartition);
        }
        currentPartition = [el];
      } else {
        currentPartition.push(el);
      }
      lastX = x;
    }
    if (currentPartition.length > 0) {
      partitionedElements.push(currentPartition);
    }

    // sort each partition by y position
    for (const partition of partitionedElements) {
      partition.sort((a, b) => {
        const aY = a.bbox.y;
        const bY = b.bbox.y;
        return aY - bY;
      });
    }

    for (const partition of partitionedElements) {
      // console.log('partition', partition);
      doCollisionResolution(partition, xmin, ymin, xmin + width, ymin + height);
    }

    for (const partition of partitionedElements) {
      // transfer adjusted positions back to the elements
      for (const el of partition) {
        const {x, y} = el.bbox;
        if (el.el.tagName === 'text') {
          el.el.setAttribute('x', x.toFixed(0));
          el.el.setAttribute('y', y.toFixed(0));
        }
        if (el.el.tagName === 'g') {
          el.el.setAttribute(
            'transform',
            `translate(${x.toFixed(0)}, ${y.toFixed(0)})`,
          );
        }
      }
    }

    // svgElement.style.display = 'block';

    setTick((tick) => tick + 1);
  }, [ref?.current, ...dependencies]);

  return tick;
};

export default useLegibleTextSvg;
