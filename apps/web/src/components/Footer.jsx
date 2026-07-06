
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Sparkles className="w-6 h-6 text-primary" />
              Match by Birth
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Clear, private compatibility readings for romantic, friendship, family, work, and group connections.
            </p>
            <div className="flex flex-col space-y-2 pt-2">
              <a href="mailto:support@matchbybirth.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>support@matchbybirth.com</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              {/* About page removed from footer quick links to match header */}
              <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog & Guides</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Legal</h4>
            <nav className="flex flex-col gap-3">
	              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
	              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
	              <Link to="/disclaimers" className="text-muted-foreground hover:text-primary transition-colors">Disclaimers</Link>
	              <Link to="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
	              <Link to="/report-delivery" className="text-muted-foreground hover:text-primary transition-colors">Report Delivery</Link>
	            </nav>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Match by Birth. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            For entertainment purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
