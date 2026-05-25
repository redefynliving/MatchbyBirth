
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import CookieConsentBanner from '@/components/CookieConsentBanner.jsx';

import HomePage from '@/pages/HomePage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import FAQPage from '@/pages/FAQPage.jsx';
import BlogPage from '@/pages/BlogPage.jsx';
import BlogPostPage from '@/pages/BlogPostPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import DisclaimerPage from '@/pages/DisclaimerPage.jsx';
import ResultPage from '@/pages/ResultPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/disclaimers" element={<DisclaimerPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-4xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
                <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  Back to Home
                </a>
              </div>
            } />
          </Routes>
        </div>

        <Footer />
        
        <CookieConsentBanner />
        <Toaster position="bottom-right" richColors />
      </div>
    </Router>
  );
}

export default App;
