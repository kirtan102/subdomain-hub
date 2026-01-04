import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SubdomainHub, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p>
              SubdomainHub provides a platform for requesting and managing custom subdomains. 
              All subdomain requests are subject to admin approval to ensure security and prevent abuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
            <p className="mb-2">You agree to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide accurate information when creating an account</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not use subdomains for malicious activities</li>
              <li>Not infringe on the rights of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Subdomain Usage</h2>
            <p>
              Subdomains are provided on an as-is basis. We reserve the right to revoke any subdomain 
              at any time if it violates our policies or is used for harmful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
            <p>
              SubdomainHub is provided without warranties of any kind. We are not liable for any 
              damages arising from the use or inability to use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the service after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact</h2>
            <p>
              For questions about these Terms, please contact us at support@example.com.
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
