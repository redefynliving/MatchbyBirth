
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/faq', label: 'FAQ' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
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
            <a
              href="#calculator"
              role="button"
              aria-controls="calculator"
              className="ml-4 inline-flex items-center px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md font-semibold shadow-sm hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Try It Free
            </a>
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
