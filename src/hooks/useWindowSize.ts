import {useState, useLayoutEffect} from 'react';

const useWindowSize = () => {
  const [width, setWidth] = useState(document.body.clientWidth);
  const [height, setHeight] = useState(document.body.clientHeight);

  useLayoutEffect(() => {
    const widthDetector = document.createElement('iframe');
    Object.assign(widthDetector.style, {
      height: 0,
      border: 0,
      width: '100%',
      display: 'block',
    });
    const heightDetector = document.createElement('iframe');
    Object.assign(heightDetector.style, {
      height: '100%',
      border: 0,
      width: 0,
      display: 'block',
    });
    document.body.appendChild(widthDetector);
    document.body.appendChild(heightDetector);
    if (widthDetector.contentWindow === null || heightDetector.contentWindow === null) {
      throw new Error('Could not get content window');
    }
    widthDetector.contentWindow.addEventListener('resize', () => {
      setWidth(document.body.clientWidth);
    });
    heightDetector.contentWindow.addEventListener('resize', () => {
      setHeight(document.body.clientHeight);
    });
    // function updateSize() {
    //   setWidth(document.body.clientWidth);
    //   setHeight(document.body.clientHeight);
    // }
    // window.addEventListener('resize', updateSize);
    // updateSize();
    return () => {
      document.body.removeChild(widthDetector);
      document.body.removeChild(heightDetector);
      // window.removeEventListener('resize', updateSize);
    };
  }, []);

  return {width, height};
};

export default useWindowSize;
