import {useEffect} from 'react';

export function useTimeout(
  callback: () => void,
  interval: number,
  deps: unknown[],
  enable = false,
) {
  useEffect(() => {
    if (!enable) {
      return undefined;
    }
    const timer = setTimeout(callback, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
