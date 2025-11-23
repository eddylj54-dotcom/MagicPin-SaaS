// /src/constants.ts

import {
  LayoutGrid,
  Bot,
  BarChart,
  Zap,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { NavItem, Feature, ProcessStep, Testimonial, PricingTier } from './types';

export const NAV_ITEMS: NavItem[] = [
  { href: '#features', label: 'Features' },
  { href: '#demo', label: 'Demo' },
];

export const FEATURES: Feature[] = [
  {
    icon: Bot,
    title: 'AI-Powered Automation',
    description: 'Leverage Gemini AI to generate, schedule, and optimize social media content across all your platforms, saving you hours every week.',
  },
  {
    icon: LayoutGrid,
    title: 'Multi-Platform Dashboard',
    description: 'Manage everything from a single, intuitive dashboard. No more switching between tabs to manage your online presence.',
  },
  {
    icon: BarChart,
    title: 'Advanced Analytics',
    description: 'Get a bird\'s-eye view of your performance. Track engagement, growth, and ROI with our easy-to-understand analytics.',
  },
  {
    icon: Zap,
    title: 'Smart Scheduling',
    description: 'Our AI finds the optimal time to post for maximum engagement, ensuring your content reaches the right audience at the right time.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    description: 'We use industry-standard OAuth for secure account connections, so your data is always safe and protected.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite your team members to collaborate, manage workflows, and approve content before it goes live.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Connect Your Accounts',
    description: 'Securely connect all your social media profiles in under 60 seconds using our guided OAuth process.',
  },
  {
    step: '02',
    title: 'Define Your Strategy',
    description: 'Tell our AI your goals. Whether it\'s growth, engagement, or sales, our system adapts to your needs.',
  },
  {
    step: '03',
    title: 'Activate Finish Mode',
    description: 'Watch as MagicPin generates content, schedules posts, and grows your brand on autopilot. It\'s that simple.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah L.',
    role: 'E-commerce Owner',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    comment:
      '"MagicPin changed the game for us. We went from spending 10 hours a week on social media to just 2, and our engagement has doubled. It truly feels like magic."',
  },
  {
    name: 'Mike R.',
    role: 'Digital Agency CEO',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    comment:
      '"The AI content generator is scarily good. It captures our clients\' brand voices perfectly. This tool is a must-have for any agency looking to scale."',
  },
  {
    name: 'Jasmine K.',
    role: 'Content Creator',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    comment:
      '"As a creator, burnout is real. MagicPin handles all the tedious scheduling and analytics, letting me focus on what I love: creating great content."',
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$49/mo',
    features: [
      '5 Social Accounts',
      '50 AI-Generated Posts',
      'Advanced Analytics',
      'Email Support',
    ],
  },
  {
    name: 'Pro',
    price: '$99/mo',
    features: [
      '15 Social Accounts',
      'Unlimited AI Posts',
      'Team Collaboration (3 Users)',
      'Priority Support',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited Accounts',
      'Dedicated Account Manager',
      'API Access & Custom Integrations',
      '24/7 Support',
    ],
  },
];
