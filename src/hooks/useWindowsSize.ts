import { useLayoutEffect, useState } from 'react';

export default function useWindowSize(): number[] {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize(): void {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return (): void => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
