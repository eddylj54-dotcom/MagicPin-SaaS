// /src/hooks/useMagicClickEffect.tsx
import { useEffect, RefObject } from 'react';

const PARTICLE_COLORS = [
  '#39ff14', // Neon Green
  '#8A2BE2', // Blue Violet
  '#00BFFF', // Deep Sky Blue
  '#FFFFFF', // White
];
const NUM_PARTICLES = 15;
const BURST_RADIUS = 75;

export const useMagicClickEffect = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        createParticle(x, y);
      }
    };

    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('span');
      particle.classList.add('magic-dust-particle');
      
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * BURST_RADIUS;
      
      const tx = `${Math.cos(angle) * radius}px`;
      const ty = `${Math.sin(angle) * radius}px`;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

      particle.style.setProperty('--tx', tx);
      particle.style.setProperty('--ty', ty);
      particle.style.backgroundColor = color;
      particle.style.boxShadow = `0 0 8px ${color}`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(particle);

      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    };

    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [ref]);
};
