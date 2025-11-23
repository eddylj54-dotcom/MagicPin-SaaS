// /src/components/Testimonials.tsx
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-dark-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-sans">
            Loved by Agencies & Creators
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto font-body">
            Don't just take our word for it. Here's what our users are saying.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div key={index} className="p-8 rounded-lg border border-neon-green/20 bg-dark-navy/30 backdrop-blur-sm flex flex-col">
              <Quote className="w-8 h-8 text-neon-green/50 mb-4" />
              <p className="text-gray-300 font-body flex-grow mb-6">"{testimonial.comment}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-neon-green/50"
                />
                <div className="ml-4">
                  <p className="font-bold text-white font-sans">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
