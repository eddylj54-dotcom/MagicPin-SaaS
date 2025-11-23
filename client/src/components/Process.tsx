// /src/components/Process.tsx
import { PROCESS_STEPS } from '../constants';

export const Process = () => {
  return (
    <section id="process" className="py-24 bg-dark-navy relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-screen-2xl">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-green/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-green/5 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white font-sans">
            Three Steps to Autopilot
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto font-body">
            Go from overwhelmed to automated in minutes.
          </p>
        </div>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neon-green/20 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-dark-navy/50 backdrop-blur-sm border border-neon-green/10">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-neon-green">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-sans">{step.title}</h3>
                <p className="text-gray-400 font-body">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
