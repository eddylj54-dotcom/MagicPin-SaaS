// /src/hooks/use3DTilt.tsx
import { useRef, useEffect } from 'react';

export const use3DTilt = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = ((y / height) - 0.5) * -20; // Max rotation 10deg
      const rotateY = ((x / width) - 0.5) * 20;  // Max rotation 10deg

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

      const glare = element.querySelector('.glare') as HTMLElement;
      if (glare) {
        glare.style.transform = `translate(${x - (width / 2)}px, ${y - (height / 2)}px)`;
        glare.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      const glare = element.querySelector('.glare') as HTMLElement;
      if (glare) {
        glare.style.opacity = '0';
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
};
