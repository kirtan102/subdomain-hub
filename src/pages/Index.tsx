import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    price: "₹0",
    period: "forever",
    description: "Perfect for personal projects",
    features: [
      "1 subdomain",
      "A & CNAME records",
      "Community support",
      "24h approval time",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹59",
    period: "per year",
    description: "For developers and small teams",
    features: [
      "5 subdomains",
      "All record types",
      "Priority support",
      "12h approval time",
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
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
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
            <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
              <button className="w-40 h-10 rounded-xl bg-foreground text-background border border-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors">
                {user ? "Go to Dashboard" : "Get Subdomain"}
                {user && <ArrowRight className="w-4 h-4" />}
              </button>
            </Link>
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-40 h-10 rounded-xl bg-background text-foreground border border-foreground text-sm font-medium transition-colors"
            >
              View Pricing
            </button>
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
              <TextShimmer duration={1.5} repeatDelay={0.5}>Simple. Fast. Secure.</TextShimmer>
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
              <TextShimmer duration={1.5} repeatDelay={0.5}>Four simple steps.</TextShimmer>
            </p>
          </div>

          {/* Desktop: Horizontal timeline */}
          <div className="hidden lg:block max-w-5xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-8 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
              
              <div className="grid grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Step number circle */}
                    <motion.div 
                      className="relative z-10 w-16 h-16 rounded-full bg-background border-2 border-foreground flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1, borderColor: "hsl(var(--primary))" }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xl font-bold text-foreground">{index + 1}</span>
                    </motion.div>
                    
                    {/* Step text */}
                    <p className="text-foreground font-medium text-sm">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Vertical timeline */}
          <div className="lg:hidden max-w-sm mx-auto">
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute top-0 bottom-0 left-8 w-[2px] bg-gradient-to-b from-border via-border to-transparent" />
              
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative flex items-center gap-6"
                  >
                    {/* Step number circle */}
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-background border-2 border-foreground flex items-center justify-center">
                      <span className="text-xl font-bold text-foreground">{index + 1}</span>
                    </div>
                    
                    {/* Step text */}
                    <p className="text-foreground font-medium">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <Link to={user ? "/dashboard" : "/auth?mode=signup"}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="h-12 px-8 rounded-full bg-foreground text-background border border-foreground text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
              >
                {user ? "Go to Dashboard" : "Start Now"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
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
              <TextShimmer duration={1.5} repeatDelay={0.5}>Choose the plan that fits your needs.</TextShimmer>
            </p>
          </div>

          <div 
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            onMouseLeave={() => setHoveredPlan(null)}
          >
            {pricingPlans.map((plan, index) => {
              const isHighlighted = hoveredPlan ? hoveredPlan === plan.name : plan.popular;
              return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                className={`glass glass-hover rounded-lg p-6 relative transition-all duration-300 ${
                  isHighlighted ? 'ring-2 ring-foreground' : 'ring-0'
                }`}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <span className="bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </motion.div>
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
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={feature} 
                      className="flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.15 + featureIndex * 0.05 + 0.2,
                        duration: 0.3
                      }}
                    >
                      <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                {plan.name === "Enterprise" ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full h-10 rounded-xl text-sm font-medium transition-colors bg-background text-foreground border border-foreground"
                  >
                    {plan.cta}
                  </motion.button>
                ) : (
                  <Link to="/auth?mode=signup" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full h-10 rounded-xl text-sm font-medium transition-colors ${
                        plan.popular
                          ? 'bg-foreground text-background hover:bg-foreground/90'
                          : 'bg-background text-foreground border border-foreground'
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section 
        ref={(el) => { sectionsRef.current[3] = el; }}
        className="py-24 border-t border-border scroll-reveal"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              <TextShimmer duration={1.5} repeatDelay={0.5}>Everything you need to know.</TextShimmer>
            </p>
          </div>

          <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How long does subdomain approval take?",
                answer: "Approval times depend on your plan. Free users get 24-hour approval, Pro users get 12-hour priority approval, and Enterprise users enjoy instant approval."
              },
              {
                question: "What subdomain formats are supported?",
                answer: "Subdomains must be at least 3 characters long and can contain lowercase letters, numbers, and hyphens. They cannot start or end with a hyphen."
              },
              {
                question: "Can I upgrade my plan later?",
                answer: "Yes! You can upgrade from Free to Pro or Enterprise at any time. Your existing subdomains will be retained, and you'll immediately get access to additional features."
              },
              {
                question: "What DNS record types are available?",
                answer: "Free plans support A and CNAME records. Pro and Enterprise plans unlock all record types including TXT and SRV records for advanced configurations."
              },
              {
                question: "How do I point my subdomain to my website?",
                answer: "After approval, your DNS records are automatically configured. For A records, point to your server's IP address. For CNAME records, point to your hosting provider's domain."
              },
              {
                question: "Is there a limit on subdomains?",
                answer: "Free users get 1 subdomain, Pro users get 5 subdomains, and Enterprise users enjoy unlimited subdomains for their organization."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="glass rounded-lg px-6 border-none">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section 
        id="contact"
        ref={(el) => { sectionsRef.current[4] = el; }}
        className="py-24 border-t border-border scroll-reveal"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground">
              <TextShimmer duration={1.5} repeatDelay={0.5}>Have questions? We'd love to help you.</TextShimmer>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="glass rounded-lg p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                  </div>
                  <div className="space-y-2">
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
                  </div>
                </div>

                <div className="space-y-2">
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
                </div>

                <div className="space-y-2">
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
                    className="resize-none min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
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

