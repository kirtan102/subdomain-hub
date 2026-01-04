import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import {
  Globe, 
  Shield, 
  Zap, 
  Server,
  ArrowRight,
} from "lucide-react";

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
          <h1 className="animate-slide-up opacity-0 stagger-1 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gradient-fade">
            Get your subdomain
            <br />
            in seconds.
          </h1>

          <p className="animate-slide-up opacity-0 stagger-2 text-lg text-muted-foreground max-w-lg mx-auto mb-10">
            Request custom subdomains for your projects. Fast, secure, and powered by Cloudflare.
          </p>

          <div className="animate-slide-up opacity-0 stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="rounded-full h-12 px-8">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="rounded-full h-12 px-8">
                    Get Subdomain
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="#pricing">
                  <Button variant="outline" size="lg" className="rounded-full h-12 px-8">
                    View Pricing
                  </Button>
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

      <Footer />
    </div>
  );
}
