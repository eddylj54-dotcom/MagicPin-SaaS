// /src/components/AppIntegration.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Loader, CheckCircle, Calendar as CalendarIcon, UserCircle } from 'lucide-react';
import { PLATFORMS } from '../lib/platforms';
import { Checkbox } from './ui/checkbox';

// A simplified hook for the container tilt effect
const useContainerTilt = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;
      const rotateX = (y / (height / 2)) * -5;
      const rotateY = (x / (width / 2)) * 5;
      element.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(2000px) rotateX(0) rotateY(0)';
    };

    const parent = element.parentElement;
    parent?.addEventListener('mousemove', handleMouseMove);
    parent?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent?.removeEventListener('mousemove', handleMouseMove);
      parent?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
};


export const AppIntegration = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [postContent, setPostContent] = useState("🚀 Just launched our new AI-powered analytics dashboard! Get real-time insights and dominate your social media game. #AI #SocialMedia #Analytics");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [scheduleDate, setScheduleDate] = useState(new Date(Date.now() + 3600 * 1000).toISOString().substring(0, 16));
  const [generationState, setGenerationState] = useState<'idle' | 'loading' | 'success'>('idle');

  const tiltRef = useContainerTilt();

  const handleSchedule = () => {
    setGenerationState('loading');
    setTimeout(() => {
      setGenerationState('success');
    }, 2000);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <section id="demo" className="py-24 bg-dark-navy relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-sans">
            See How It Works
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto font-body">
            Create and schedule a post in seconds. This is a live simulation of the MagicPin dashboard.
          </p>
        </div>

        <div className="relative" style={{ perspective: '2000px' }}>
          <div ref={tiltRef} className="w-full max-w-4xl mx-auto min-h-[700px] rounded-2xl border border-neon-green/20 bg-dark-navy/40 backdrop-blur-xl p-8 transition-transform duration-300 ease-out">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-white font-mono text-sm">Post Scheduler</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${!isPreview ? 'text-neon-green' : 'text-gray-400'}`}>Compose</span>
                <Switch checked={isPreview} onCheckedChange={setIsPreview} />
                <span className={`text-sm font-medium ${isPreview ? 'text-neon-green' : 'text-gray-400'}`}>Preview</span>
              </div>
            </div>

            {/* Content */}
            <div className="bg-dark-navy/50 rounded-lg min-h-[550px] p-6">
              {generationState === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <CheckCircle className="w-24 h-24 text-neon-green mb-6" />
                  <h3 className="text-3xl font-bold text-white mb-2">Post Scheduled!</h3>
                  <p className="text-gray-400 mb-6">Your post is ready to go live on {new Date(scheduleDate).toLocaleString()}.</p>
                   <Button onClick={() => setGenerationState('idle')} className="mt-8 font-bold">Schedule Another Post</Button>
                </div>
              ) : isPreview ? (
                // Preview Mode
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-4 font-sans">Post Preview</h3>
                  <div className="bg-background rounded-lg p-6 border border-primary/10">
                    <div className="flex items-start gap-4">
                      <UserCircle className="w-10 h-10 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-bold text-foreground">MagicPin User</p>
                        <p className="text-sm text-muted-foreground">Just now</p>
                      </div>
                    </div>
                    <p className="mt-4 text-foreground whitespace-pre-wrap">{postContent}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Posting to:</span>
                      <div className="flex gap-2">
                        {selectedPlatforms.map(pId => {
                          const platform = PLATFORMS.find(p => p.id === pId);
                          if (!platform) return null;
                          const Icon = platform.icon;
                          return <Icon key={pId} className="w-5 h-5 text-muted-foreground" />;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="p-4 space-y-6">
                  <div>
                    <label className="text-lg font-bold text-white font-sans mb-2 block">1. Write your post</label>
                    <Textarea 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="What do you want to talk about?"
                      className="min-h-36"
                    />
                  </div>
                  <div>
                    <label className="text-lg font-bold text-white font-sans mb-4 block">2. Select platforms</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {PLATFORMS.map(platform => {
                        const Icon = platform.icon;
                        const isSelected = selectedPlatforms.includes(platform.id);
                        return (
                          <div
                            key={platform.id}
                            onClick={() => togglePlatform(platform.id)}
                            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 border-primary' : 'bg-background/50 border-primary/10 hover:bg-primary/5'}`}
                          >
                            <Checkbox checked={isSelected} />
                            <Icon className="w-5 h-5 text-foreground" />
                            <span className="font-medium text-foreground">{platform.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                   <div>
                    <label htmlFor="schedule" className="text-lg font-bold text-white font-sans mb-2 block">3. Set schedule</label>
                    <Input 
                      id="schedule"
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSchedule} disabled={generationState === 'loading'} className="font-bold w-full md:w-auto">
                      {generationState === 'loading' ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <CalendarIcon className="w-4 h-4 mr-2" />}
                      Schedule Post
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
