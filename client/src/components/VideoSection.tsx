// /src/components/VideoSection.tsx
import { PlayCircle } from 'lucide-react';

export const VideoSection = () => {
  return (
    <section id="demo-video" className="py-24 bg-dark-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-sans">
            See MagicPin in Action
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto font-body">
            A 90-second overview of how our AI can transform your social media workflow.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-neon-green rounded-lg blur-2xl opacity-20"></div>
          <div 
            className="relative aspect-video bg-dark-navy/80 rounded-lg border-2 border-neon-green/50 flex items-center justify-center cursor-pointer group overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <PlayCircle className="w-24 h-24 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <p className="absolute bottom-4 right-4 text-xs text-white/50">Video placeholder</p>
          </div>
        </div>
      </div>
    </section>
  );
};
