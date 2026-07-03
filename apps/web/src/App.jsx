
import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import CookieConsentBanner from '@/components/CookieConsentBanner.jsx';

import HomePage from '@/pages/HomePage.jsx';

const AboutPage = lazy(() => import('@/pages/AboutPage.jsx'));
const FAQPage = lazy(() => import('@/pages/FAQPage.jsx'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage.jsx'));
const BlogPage = lazy(() => import('@/pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage.jsx'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage.jsx'));
const ContactPage = lazy(() => import('@/pages/ContactPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage.jsx'));
const DisclaimerPage = lazy(() => import('@/pages/DisclaimerPage.jsx'));
const ResultPage = lazy(() => import('@/pages/ResultPage.jsx'));
const ReportPage = lazy(() => import('@/pages/ReportPage.jsx'));
const ReportSuccess = lazy(() => import('@/pages/ReportSuccess.jsx'));
const PremiumPage = lazy(() => import('@/pages/premium.jsx'));
const UnsubscribePage = lazy(() => import('@/pages/UnsubscribePage.jsx'));
const CrushBirthdayCompatibilityPage = lazy(() => import('@/pages/CrushBirthdayCompatibilityPage.jsx'));
const LifePathCompatibilityPage = lazy(() => import('@/pages/LifePathCompatibilityPage.jsx'));
const PrivateCompatibilityReadPage = lazy(() => import('@/pages/PrivateCompatibilityReadPage.jsx'));
const SampleReportPage = lazy(() => import('@/pages/SampleReportPage.jsx'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm font-medium text-muted-foreground">
      Loading...
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/category/:category" element={<CategoryPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/disclaimers" element={<DisclaimerPage />} />
              <Route path="/report-success" element={<ReportSuccess />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/reports/private-compatibility-read" element={<PrivateCompatibilityReadPage />} />
              <Route path="/reports/sample" element={<SampleReportPage />} />
              <Route path="/unsubscribe" element={<UnsubscribePage />} />
              <Route path="/tools/crush-birthday-compatibility" element={<CrushBirthdayCompatibilityPage />} />
              <Route path="/tools/life-path-compatibility" element={<LifePathCompatibilityPage />} />

              {/* Catch-all route */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <h1 className="text-4xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
                  <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="px-6 py-3 btn-primary rounded-xl font-medium hover:bg-primary/90 transition-colors">
                    Back to Home
                  </a>
                </div>
              } />
            </Routes>
          </Suspense>
        </div>

        <Footer />
        
        <CookieConsentBanner />
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
