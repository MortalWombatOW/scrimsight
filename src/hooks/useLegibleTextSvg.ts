import React, {useEffect, useState} from 'react';

const getBBox = (el: SVGGraphicsElement) => {
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

    const height = pElement.getBoundingClientRect().height;
    const width = pElement.getBoundingClientRect().width;
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
  if (el.tagName === 'text') {
    return {
      x: parseFloat(el.getAttribute('x') || '0'),
      y: parseFloat(el.getAttribute('y') || '0'),
    };
  }
  if (el.tagName === 'g') {
    const dataX = el.getAttribute('data-x');
    const dataY = el.getAttribute('data-y');
    if (!dataX || !dataY) {
      throw new Error('No data-x or data-y found');
    }
    return {
      x: parseFloat(dataX),
      y: parseFloat(dataY),
    };
  }
  throw new Error('Unknown tag');
};

const getCollisionData = (
  el1: SVGGraphicsElement,
  el2: SVGGraphicsElement,
): {
  normal: 'x' | 'y';
  depth: number;
} => {
  const aabb1 = getBBox(el1);
  const aabb2 = getBBox(el2);
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
  loaded: boolean,
): number => {
  // This hook is used to make sure that text elements in an SVG are not overlapping.

  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }
    const textElements = Array.from(
      ref.current?.getElementsByTagName('text') || [],
    );

    const gElements = Array.from(
      ref.current?.getElementsByTagName('g') || [],
    ).filter((el) => el.classList.contains('svg-wrap-text-group'));

    console.log('elements', textElements, gElements);

    const elements = [...textElements, ...gElements];

    elements.sort((a, b) => {
      const aY = getBBox(a).y;
      const bY = getBBox(b).y;
      return aY - bY;
    });

    //first, get the height of the g elements and adjust them upwards 1/2 of the height
    for (const el of elements) {
      const aabb = getBBox(el);
      const orig = getOriginalCoords(el);
      const newY = orig.y - aabb.height / 2;

      if (el.tagName === 'g') {
        const newTransform = `translate(${orig.x}, ${newY})`;
        el.setAttribute('transform', newTransform);
        // console.log('adjusted', newTransform, el.getAttribute('transform'));
      }
      // el.classList.add(`adjusted-${newY}`);
      // el.classList.add(`height-${aabb.height}`);
    }

    // then, check for collisions
    const maxIterations = 10;
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
          const aabb1 = getBBox(elements[i]);
          const aabb2 = getBBox(elements[j]);
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

      console.log('collisions', collisions);
      if (collisions.length === 0) {
        break;
      }

      // console.log('bboxes', bboxes);

      // go through each collision and resolve it by moving the later element vertically
      for (const [i, j] of collisions) {
        const el1 = elements[i];
        const el2 = elements[j];
        const aabb1 = getBBox(el1);
        const aabb2 = getBBox(el2);

        const {normal, depth} = getCollisionData(el1, el2);
        const dy = normal === 'y' ? depth / 2 : 0;

        if (el1.tagName === 'text') {
          el1.setAttribute('y', (aabb1.y - dy).toFixed(0));
        }
        if (el1.tagName === 'g') {
          el1.setAttribute(
            'transform',
            `translate(${aabb1.x.toFixed(0)}, ${(aabb1.y - dy).toFixed(0)})`,
          );
        }
        if (el2.tagName === 'text') {
          el2.setAttribute('y', (aabb2.y + dy).toFixed(0));
        }
        if (el2.tagName === 'g') {
          el2.setAttribute(
            'transform',
            `translate(${aabb2.x.toFixed(0)}, ${(aabb2.y + dy).toFixed(0)})`,
          );
        }

        // el2.classList.add(`collided-${dy.toFixed(0)}`);
        // console.log('resolved', el1, el2);
      }
    }
    setTick((tick) => tick + 1);
  }, [ref?.current, loaded]);

  return tick;
};

export default useLegibleTextSvg;
