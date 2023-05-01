import {type Rect, getAbsoluteRect} from '@/demo/alive/util';
import {useRef, useState, useEffect} from 'react';

export function useElementSize<T extends Element>(deps: unknown[]) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Rect | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setSize(getAbsoluteRect(ref.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [ref, size] as const;
}
