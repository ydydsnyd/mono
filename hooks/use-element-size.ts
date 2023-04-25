import {type Rect, getAbsoluteRect} from '@/demo/alive/util';
import {useRef, useState, useLayoutEffect} from 'react';

export function useElementSize<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Rect | null>(null);
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    setSize(getAbsoluteRect(ref.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [ref, size] as const;
}
