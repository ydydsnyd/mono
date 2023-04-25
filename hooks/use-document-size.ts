import {useState, useEffect} from 'react';

export function useDocumentSize() {
  const [docSize, setDocSize] = useState(getDocSize());
  useEffect(() => {
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
