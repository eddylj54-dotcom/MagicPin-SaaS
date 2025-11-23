// /src/components/Pricing.tsx
import { PRICING_TIERS } from '../constants';
import { use3DTilt } from '../hooks/use3DTilt';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

const PricingCard = ({ tier }: { tier: (typeof PRICING_TIERS)[0] }) => {
  const tiltRef = use3DTilt();

  return (
    <div
      ref={tiltRef}
      className={`relative rounded-lg p-8 border bg-dark-navy/30 backdrop-blur-sm transition-transform duration-300 ease-out preserve-3d ${
        tier.isPopular ? 'border-neon-green' : 'border-neon-green/20'
      }`}
      style={{ transform: 'perspective(1000px)' }}
    >
      {tier.isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full bg-neon-green px-4 py-1 text-sm font-bold text-dark-navy">
            Most Popular
          </div>
        </div>
      )}
      <div className="absolute inset-0 glare-container overflow-hidden rounded-lg preserve-3d">
        <div className="glare absolute w-96 h-96 bg-neon-green/20 rounded-full opacity-0 mix-blend-soft-light" />
      </div>
      
      <div className="relative z-10 text-center">
        <h3 className="mb-2 text-2xl font-bold text-white font-sans">{tier.name}</h3>
        <p className="text-4xl font-bold text-white mb-6 font-sans">{tier.price}</p>
        
        <ul className="space-y-4 text-left mb-8">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-neon-green flex-shrink-0" />
              <span className="text-gray-300 font-body">{feature}</span>
            </li>
          ))}
        </ul>

        <Button className="w-full font-bold" variant={tier.isPopular ? 'default' : 'outline'}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-dark-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-sans">
            Pricing That Scales With You
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto font-body">
            Choose a plan that fits your needs. No hidden fees, ever.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
};
