// /src/components/Features.tsx
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../constants';
import { use3DTilt } from '../hooks/use3DTilt';
import { Feature } from '../types';

const FeatureCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) => {
  const tiltRef = use3DTilt();

  return (
    <div
      ref={tiltRef}
      className="relative rounded-lg p-8 border border-neon-green/20 bg-dark-navy/30 backdrop-blur-sm transition-transform duration-300 ease-out preserve-3d"
      style={{ transform: 'perspective(1000px)' }}
    >
      <div className="absolute inset-0 glare-container overflow-hidden rounded-lg preserve-3d">
        <div className="glare absolute w-96 h-96 bg-neon-green/20 rounded-full opacity-0 mix-blend-soft-light" />
      </div>
      <div className="relative z-10">
        <div className="mb-4 inline-block rounded-lg bg-neon-green/10 p-3">
          <Icon className="h-8 w-8 text-neon-green" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white font-sans">{title}</h3>
        <p className="text-gray-400 font-body">{description}</p>
      </div>
    </div>
  );
};

export const Features = () => {
  const { t } = useTranslation();
  const featureKeys = ['automation', 'dashboard', 'analytics', 'scheduling', 'security', 'collaboration'];

  return (
    <section id="features" className="py-24 bg-dark-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-sans">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto font-body">
            {t('features.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureKeys.map((key, index) => (
            <FeatureCard 
              key={key} 
              title={t(`features.items.${key}.title`)}
              description={t(`features.items.${key}.description`)}
              icon={FEATURES[index].icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
