import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
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

      <Footer />
    </div>
  );
}
