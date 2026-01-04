import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TextReveal } from "@/components/ui/text-reveal";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  Globe, 
  Shield, 
  Zap, 
  Server,
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Clock,
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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
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

      {/* Pricing */}
      <section 
        id="pricing"
        ref={(el) => { sectionsRef.current[2] = el; }}
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

      {/* Contact */}
      <section 
        id="contact"
        ref={(el) => { sectionsRef.current[3] = el; }}
        className="py-24 border-t border-border scroll-reveal"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="rounded-2xl p-4 md:p-8 shadow-input bg-card border border-border">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={255}
                    />
                  </LabelInputContainer>
                </div>

                <LabelInputContainer>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    rows={5}
                  />
                </LabelInputContainer>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative group/btn w-full bg-foreground text-background rounded-xl h-10 font-medium shadow-input hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message →"}
                  <BottomGradient />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                <p className="text-muted-foreground mb-8">
                  Whether you have a question about features, pricing, or
                  anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-muted-foreground text-sm">
                      support@subdomain.app
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-muted-foreground text-sm">
                      San Francisco, CA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Response Time</h4>
                    <p className="text-muted-foreground text-sm">
                      Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
