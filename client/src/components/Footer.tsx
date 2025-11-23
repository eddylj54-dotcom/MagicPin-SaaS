// /src/components/Footer.tsx
import { Sparkles } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { SiInstagram, SiFacebook, SiX, SiLinkedin } from 'react-icons/si';

export const Footer = () => {
  const socialLinks = [
    { icon: SiX, href: '#' },
    { icon: SiInstagram, href: '#' },
    { icon: SiFacebook, href: '#' },
    { icon: SiLinkedin, href: '#' },
  ];

  return (
    <footer className="bg-dark-navy border-t border-neon-green/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center md:items-start">
            <a href="#" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-neon-green" />
              <span className="text-2xl font-bold text-white font-sans">MagicPin</span>
            </a>
            <p className="text-gray-400 text-sm max-w-xs">
              Automate your social media presence and activate Finish Mode.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-white mb-4">Menu</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-neon-green transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-bold text-white mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-green transition-colors"
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neon-green/20 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MagicPin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
