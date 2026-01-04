import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p className="mb-2">We collect information you provide directly to us:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Email address when you create an account</li>
              <li>Subdomain requests and associated DNS configurations</li>
              <li>Usage data and interaction with our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and manage your subdomain requests</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties. 
              We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your account</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at support@example.com.
            </p>
          </section>

          <p className="text-sm pt-8 border-t border-border">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
