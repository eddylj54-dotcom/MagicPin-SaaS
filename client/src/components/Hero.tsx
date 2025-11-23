// /src/components/Hero.tsx
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useParticleEffect } from '../hooks/useParticleEffect';
import { useParallax } from '../hooks/useParallax';
import { useMagicClickEffect } from '../hooks/useMagicClickEffect';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const HudWidget = ({ text, strength, className }: { text: string, strength: number, className?: string }) => {
  const parallaxRef = useParallax(strength);
  return (
    <div ref={parallaxRef} className={`absolute text-neon-green/60 text-xs font-mono p-2 border border-neon-green/20 rounded-md bg-dark-navy/50 backdrop-blur-sm ${className}`}>
      {text}
    </div>
  );
};

export const Hero = () => {
  const { t } = useTranslation();
  const canvasRef = useParticleEffect();
  const buttonRef = useRef<HTMLButtonElement>(null);
  useMagicClickEffect(buttonRef);

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-dark-navy overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      
      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh]">
          <HudWidget text="SYSTEM: ONLINE" strength={-10} className="top-10 left-10" />
          <HudWidget text="EFFICIENCY: +480%" strength={15} className="bottom-20 right-0" />
          <HudWidget text="AI CORE: ACTIVE" strength={-25} className="bottom-10 left-20" />
          <HudWidget text="API LATENCY: 12ms" strength={20} className="top-20 right-20" />
        </div>

        <div className="relative z-20 p-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-wider font-sans"
              style={{ textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14' }}>
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mt-4 max-w-2xl mx-auto font-body">
            {t('hero.subtitle1')}
            <br />
            {t('hero.subtitle2')}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button ref={buttonRef} size="lg" className="font-bold">
              {t('hero.button1')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="font-bold">
              {t('hero.button2')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
