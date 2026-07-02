
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { scrollToCalculator } from '@/lib/scroll-to-calculator.js';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
    { path: '/blog', label: 'Blog' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
            <Sparkles className="w-6 h-6 text-primary" />
            Match by Birth
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                if (!scrollToCalculator()) {
                  window.location.assign('/#calculator');
                }
              }}
              className="btn-primary ml-2 rounded-xl px-5 py-2.5 text-sm">
              Try It Free
            </button>
          </nav>

          {/* Mobile Nav Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors rounded-md"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-l border-border">
              <SheetTitle className="text-left text-xl font-bold text-foreground mb-8 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Match by Birth
              </SheetTitle>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg px-4 py-3 rounded-xl transition-colors ${
                      isActive(link.path)
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (!scrollToCalculator()) {
                      window.location.assign('/#calculator');
                    }
                  }}
                  className="btn-primary mt-2 h-12 rounded-xl"
                >
                  Try It Free
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
