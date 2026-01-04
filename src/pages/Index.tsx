import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { TextReveal } from "@/components/ui/text-reveal";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  Globe, 
  Shield, 
  Zap, 
  Server,
  ArrowRight,
  Check,
} from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects",
    features: [
      "1 subdomain",
      "A & CNAME records",
      "Community support",
      "72h approval time",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For developers and small teams",
    features: [
      "10 subdomains",
      "All record types",
      "Priority support",
      "24h approval time",
      "Custom TTL",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations at scale",
    features: [
      "Unlimited subdomains",
      "All record types",
      "Dedicated support",
      "Instant approval",
      "Custom TTL",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const features = [
  {
    icon: Globe,
    title: "Custom Subdomains",
    description: "Request personalized subdomains for your projects.",
  },
  {
    icon: Server,
    title: "Multiple Record Types",
    description: "Support for A, CNAME, TXT, and SRV records.",
  },
  {
    icon: Shield,
    title: "Admin Approval",
    description: "All requests are reviewed for security.",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "DNS records propagate within minutes.",
  },
];

const steps = [
  "Sign up with Google",
  "Request your subdomain",
  "Wait for approval",
  "Go live automatically",
];

export default function Index() {
  const { user } = useAuth();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Grid background with radial fade */}
        <div className="absolute inset-0 grid-background" />
        
        <div className="container relative mx-auto px-4 flex flex-col items-center justify-center text-center">
          <TextShimmer className="text-sm font-medium mb-4 block" duration={1.5} repeatDelay={0.5}>
            Give your project a professional URL
          </TextShimmer>

          <h1 className="animate-slide-up opacity-0 stagger-1 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gradient-fade">
            Get your subdomain
            <br />
            in seconds.
          </h1>

          <TextReveal 
            text="Request custom subdomains for your projects. Fast, secure, and powered by Cloudflare."
            staggerDelay={0.05}
            className="text-lg text-muted-foreground max-w-lg mx-auto mb-10"
          />

          <div className="animate-slide-up opacity-0 stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <button className="w-40 h-10 rounded-xl bg-foreground text-background border border-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=signup">
                  <button className="w-40 h-10 rounded-xl bg-foreground text-background border border-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors">
                    Get Subdomain
                  </button>
                </Link>
                <Link to="#pricing">
                  <button className="w-40 h-10 rounded-xl bg-background text-foreground border border-foreground text-sm font-medium transition-colors">
                    View Pricing
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section 
        ref={(el) => { sectionsRef.current[0] = el; }}
        className="py-24 border-t border-border scroll-reveal"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground">
              Simple subdomain management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass glass-hover rounded-lg p-6"
              >
                <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section 
        ref={(el) => { sectionsRef.current[1] = el; }}
        className="py-24 border-t border-border scroll-reveal"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Four simple steps.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 glass rounded-lg p-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
                  <span className="text-sm font-bold text-background">{index + 1}</span>
                </div>
                <p className="text-foreground text-sm">{step}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {!user && (
              <Link to="/auth?mode=signup">
                <Button size="lg">
                  Start Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section 
        id="about"
        ref={(el) => { sectionsRef.current[2] = el; }}
        className="py-24 border-t border-border scroll-reveal"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Us
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We're a team of developers who understand the hassle of managing DNS records. 
              That's why we built a simple, secure platform to help you get custom subdomains 
              for your projects without the complexity.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <p className="text-sm text-muted-foreground">Subdomains Created</p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime Guaranteed</p>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Cloudflare Protection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section 
        id="pricing"
        ref={(el) => { sectionsRef.current[3] = el; }}
        className="py-24 border-t border-border scroll-reveal"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-muted-foreground">
              Choose the plan that fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`glass glass-hover rounded-lg p-6 relative ${
                  plan.popular ? 'ring-2 ring-foreground' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full h-10 rounded-xl text-sm font-medium transition-colors ${
                    plan.popular
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'bg-background text-foreground border border-foreground'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
