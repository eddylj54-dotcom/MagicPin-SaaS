import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { SiInstagram, SiFacebook, SiX, SiPinterest, SiLinkedin, SiYoutube, SiTiktok } from "react-icons/si";
import { ShoppingBag } from "lucide-react";

export default function Landing() {
  const platforms = [
    { icon: SiInstagram, name: "Instagram" },
    { icon: SiFacebook, name: "Facebook" },
    { icon: SiX, name: "X (Twitter)" },
    { icon: SiPinterest, name: "Pinterest" },
    { icon: SiLinkedin, name: "LinkedIn" },
    { icon: SiYoutube, name: "YouTube" },
    { icon: SiTiktok, name: "TikTok" },
    { icon: ShoppingBag, name: "Etsy" },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Content",
      description: "Generate platform-optimized posts with captions and hashtags using Gemini AI",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Plan and schedule posts across all platforms from a unified calendar",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track performance metrics and engagement across all your social accounts",
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Set up recurring posts and automatic publishing to save time",
    },
    {
      icon: Shield,
      title: "Secure OAuth",
      description: "Connect accounts securely with industry-standard authentication",
    },
    {
      icon: Globe,
      title: "Multi-Platform",
      description: "Manage 8+ social networks from one powerful dashboard",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["2 Connected Accounts", "10 Posts/Month", "Basic Analytics", "AI Content (Limited)"],
    },
    {
      name: "Starter",
      price: "$19",
      features: ["5 Connected Accounts", "50 Posts/Month", "Full Analytics", "Unlimited AI Content", "Priority Support"],
      popular: true,
    },
    {
      name: "Pro",
      price: "$49",
      features: ["15 Connected Accounts", "Unlimited Posts", "Advanced Analytics", "Team Collaboration", "API Access"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited Accounts", "White Label", "Dedicated Support", "Custom Integration", "SLA"],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MagicPin Automation</span>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-Powered Social Media Automation</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 max-w-4xl">
            Automate Your Social Media{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Across All Platforms
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 sm:text-xl">
            Schedule posts, generate content with AI, and manage Instagram, Facebook, X, Pinterest, LinkedIn, YouTube, TikTok, and Etsy from one powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" asChild data-testid="button-get-started">
              <a href="/api/login">Get Started Free</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>

          {/* Platform Icons */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            {platforms.map((platform, i) => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-card">
                  <platform.icon className="h-6 w-6" />
                </div>
                <span className="text-xs text-muted-foreground">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you manage your social media presence efficiently
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 hover-elevate">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, i) => (
              <Card key={i} className={`p-6 ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                  data-testid={`button-plan-${plan.name.toLowerCase()}`}
                >
                  <a href="/api/login">Get Started</a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Automate Your Social Media?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of creators and businesses saving time with AI-powered automation
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-cta-start">
            <a href="/api/login">Start Free Trial</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 MagicPin Automation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
