import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Globe, 
  Shield, 
  Zap, 
  Server,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Custom Subdomains",
    description: "Request personalized subdomains for your projects, game servers, or websites.",
  },
  {
    icon: Server,
    title: "Multiple Record Types",
    description: "Support for A, CNAME, TXT, and SRV records for any use case.",
  },
  {
    icon: Shield,
    title: "Admin Approval",
    description: "All requests are reviewed to ensure security and prevent abuse.",
  },
  {
    icon: Zap,
    title: "Instant DNS Updates",
    description: "Once approved, your DNS records propagate within minutes via Cloudflare.",
  },
];

const steps = [
  "Sign up with your email or Google account",
  "Request your desired subdomain and configure DNS",
  "Wait for admin approval",
  "Your subdomain goes live automatically",
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-glow opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-slide-up opacity-0 stagger-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">Free subdomain hosting</span>
            </div>
          </div>

          <h1 className="animate-slide-up opacity-0 stagger-2 text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Your <span className="text-gradient">Subdomain</span>,<br />
            Your Rules
          </h1>

          <p className="animate-slide-up opacity-0 stagger-3 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Request custom subdomains for your game servers, websites, and projects. 
            Powered by Cloudflare DNS for lightning-fast propagation.
          </p>

          <div className="animate-slide-up opacity-0 stagger-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="glow" size="lg">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=signup">
                  <Button variant="glow" size="lg">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Preview card */}
          <div className="animate-slide-up opacity-0 stagger-4 mt-16 max-w-md mx-auto">
            <div className="glass shadow-card rounded-xl p-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Example</span>
                <span className="px-2 py-0.5 rounded bg-success/20 text-success text-xs font-medium">Active</span>
              </div>
              <div className="space-y-2">
                <code className="block font-mono text-lg">
                  <span className="text-primary">gaming</span>
                  <span className="text-muted-foreground">.yourdomain.com</span>
                </code>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-xs font-mono">A</span>
                  <span>→</span>
                  <code className="font-mono">192.168.1.100</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, powerful subdomain management with enterprise-grade DNS infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass glass-hover rounded-xl p-6 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Get your subdomain up and running in minutes.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 glass rounded-lg p-4 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                </div>
                <p className="text-foreground">{step}</p>
                <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {!user && (
              <Link to="/auth?mode=signup">
                <Button variant="glow" size="lg">
                  Start Now — It's Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 SubDomain. Powered by Cloudflare DNS.</p>
        </div>
      </footer>
    </div>
  );
}
