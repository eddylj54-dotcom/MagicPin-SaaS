// /src/types.ts

import { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  avatarUrl: string;
  comment: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface LineItem {
  id: string;
  service: string;
  quantity: number;
  price: number;
}
