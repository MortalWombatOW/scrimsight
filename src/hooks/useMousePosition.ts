import {useState} from 'react';
import {useDeepEffect} from './useDeepEffect';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({x: null, y: null});
  useDeepEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({x: ev.clientX, y: ev.clientY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
};
export default useMousePosition;
