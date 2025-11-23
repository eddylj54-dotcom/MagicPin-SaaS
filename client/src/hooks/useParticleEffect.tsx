// /src/hooks/useParticleEffect.tsx
import { useRef, useEffect } from 'react';

const LERP_FACTOR = 0.05;
const PARTICLE_COLORS = [
  'rgba(57, 255, 20, 0.8)',   // Neon Green
  'rgba(120, 120, 255, 0.8)', // Light Blue
  'rgba(220, 120, 255, 0.8)', // Purple
  'rgba(255, 255, 255, 0.8)',  // White
];

export const useParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      lifespan: number;
      maxLifespan: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.1; // Smaller particles
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        this.maxLifespan = Math.random() * 300 + 100;
        this.lifespan = this.maxLifespan;
        this.opacity = 0;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.lifespan = this.maxLifespan;
        this.opacity = 0;
      }

      update() {
        // Fade in/out logic
        if (this.lifespan > this.maxLifespan * 0.9) {
          this.opacity += 0.05;
        } else if (this.lifespan < this.maxLifespan * 0.2) {
          this.opacity -= 0.05;
        }
        this.opacity = Math.max(0, Math.min(1, this.opacity));
        this.lifespan--;

        if (this.lifespan <= 0) {
          this.reset();
        }

        // Gentle mouse interaction
        const dx = this.x - mouse.current.x;
        const dy = this.y - mouse.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
          this.x += dx / distance * 0.5;
          this.y += dy / distance * 0.5;
        }

        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx!.globalAlpha = this.opacity;
        ctx!.fillStyle = this.color;
        ctx!.shadowBlur = 8;
        ctx!.shadowColor = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 6000; // More particles
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      mouse.current.x += (targetMouse.current.x - mouse.current.x) * LERP_FACTOR;
      mouse.current.y += (targetMouse.current.y - mouse.current.y) * LERP_FACTOR;

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      ctx!.globalAlpha = 1.0; // Reset global alpha
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = e.clientX;
      targetMouse.current.y = e.clientY;
    };

    const handleResize = () => {
      init();
    };

    init();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return canvasRef;
};
