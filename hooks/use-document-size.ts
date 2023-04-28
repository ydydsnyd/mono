import {useState, useLayoutEffect} from 'react';

export function useDocumentSize() {
  const [docSize, setDocSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  useLayoutEffect(() => {
    setDocSize(getDocSize());

    const handleWindowResize = () => {
      setDocSize(getDocSize());
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return docSize;
}

function getDocSize() {
  return {
    width: document.body.scrollWidth,
    height: document.body.scrollHeight,
  };
}
