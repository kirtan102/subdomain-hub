import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">Essential Cookies</h3>
                <p>
                  Required for the website to function. These include authentication cookies 
                  that keep you logged in.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground">Functional Cookies</h3>
                <p>
                  Remember your preferences and settings to provide a personalized experience.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground">Analytics Cookies</h3>
                <p>
                  Help us understand how visitors interact with our website to improve our service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can 
              choose to block or delete cookies, but this may affect your experience on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Third-Party Cookies</h2>
            <p>
              We may use third-party services that place cookies on your device. These are governed 
              by the respective privacy policies of those services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any 
              changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at support@example.com.
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
