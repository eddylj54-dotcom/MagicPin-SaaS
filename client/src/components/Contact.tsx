// /src/components/Contact.tsx
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-dark-navy border-t border-neon-green/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-sans">
            Let's Build Your Future
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto font-body">
            Ready to put your growth on autopilot? Get in touch or book a demo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="p-8 rounded-lg border border-neon-green/20 bg-dark-navy/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
                <Input id="name" type="text" placeholder="Your Name" className="mt-2" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <Input id="email" type="email" placeholder="you@example.com" className="mt-2" />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                <Textarea id="message" placeholder="How can we help you?" className="mt-2" rows={5} />
              </div>
              <Button type="submit" className="w-full font-bold">Send Message</Button>
            </form>
          </div>

          {/* Calendly Embed Placeholder */}
          <div className="p-8 rounded-lg border border-neon-green/20 bg-dark-navy/30 backdrop-blur-sm flex flex-col items-center justify-center text-center">
             <h3 className="text-2xl font-bold text-white mb-4">Book a Live Demo</h3>
             <p className="text-gray-400 mb-6">
               Find a time that works for you and let's explore how MagicPin can revolutionize your workflow.
             </p>
            <div className="w-full h-64 bg-dark-navy/50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">[Calendly Embed Placeholder]</p>
            </div>
             <Button className="mt-6 font-bold" variant="outline">Book Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
