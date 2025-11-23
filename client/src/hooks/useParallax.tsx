// /src/hooks/useParallax.tsx
import { useRef, useEffect } from 'react';

export const useParallax = (strength: number = 1) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      const translateX = x * strength;
      const translateY = y * strength;

      element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);

  return ref;
};
