import {useState, useEffect} from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  useEffect(() => {
    setWindowSize(getWindowSize());

    const handleWindowResize = () => {
      setWindowSize(getWindowSize());
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return windowSize;
}

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
