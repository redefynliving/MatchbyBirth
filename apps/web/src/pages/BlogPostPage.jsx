import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Mail, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import posts from '@/data/posts';
import BackButton from '@/components/BackButton.jsx';

function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true, consentSource: 'blog_post' }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubStatus('success');
    } catch {
      setSubStatus('error');
    }
  };

  if (!post) {
    return (
      <main className="py-24 bg-background min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-8">We couldn&apos;t find the article you&apos;re looking for.</p>
          <Link to="/" className="btn-primary px-6 py-3 rounded-xl">Back to calculator</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Match by Birth</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://matchbybirth.com/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | Match by Birth`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.ogImage || 'https://matchbybirth.com/og-image.png'} />
        <meta property="og:url" content={`${window.location.origin}/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "datePublished": post.date,
            "url": `https://matchbybirth.com/blog/${post.slug}`,
            "author": {
              "@type": "Person",
              "name": "Sarah Miller",
              "jobTitle": "Professional Astrologer"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Match by Birth",
              "url": "https://matchbybirth.com/"
            }
          })}
        </script>
      </Helmet>

      <main className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl bg-primary" />
        <div className="pointer-events-none absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full opacity-[0.05] blur-3xl bg-violet-600" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BackButton fallbackTo="/blog" label="Back to Blog" />

          <article className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm shadow-elevated">
            <header className="mb-8 border-b border-border pb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <span>•</span>
                <span>Reviewed by <strong>Sarah Miller</strong></span>
              </div>
            </header>

            <div 
              className="blog-content" 
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {/* In-article CTA */}
            <div className="mt-12 bg-secondary/40 border border-secondary rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-bold text-foreground text-sm md:text-base">Check your compatibility</h4>
                  <p className="text-xs text-muted-foreground">Get a free, detailed percentage match report.</p>
                </div>
              </div>
              <Link 
                to="/" 
                className="w-full sm:w-auto text-center btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap"
              >
                Try the Calculator
              </Link>
            </div>

            {/* E-E-A-T Author Attribution Card */}
            <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center gap-4 text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                SM
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Reviewed by Sarah Miller</h4>
                <p className="text-xs text-primary font-medium mb-1">Professional Consultant Astrologer</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sarah Miller is a professional consultant astrologer with over 12 years of experience mapping natal charts, planetary transits, and relationship synastry. She holds credentials from international astrological registries and serves as the lead reviewer for Match by Birth.
                </p>
              </div>
            </div>
          </article>

          {/* Newsletter subscribe */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-violet-700 text-white rounded-3xl p-8 md:p-10 shadow-lg shadow-primary/10 mt-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            
            {subStatus === 'success' ? (
              <div className="text-center py-4">
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-white">
                  <Sparkles className="h-6 w-6" />
                </span>
                <p className="font-extrabold text-xl text-white mb-2">You&apos;re subscribed!</p>
                <p className="text-sm text-white/80 max-w-sm mx-auto leading-relaxed">
                  Check your inbox for a welcome email and your first weekly digest.
                </p>
              </div>
            ) : (
              <div className="relative z-10">
                <header className="text-center mb-8">
                  <span className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
                    <Mail className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Get weekly astrology insights</h3>
                  <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                    Join thousands getting our weekly digest of compatibility guides and astrology tips.
                  </p>
                </header>

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    className="flex-grow h-12 rounded-xl px-4 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="h-12 rounded-xl bg-white text-primary hover:bg-white/95 font-bold text-sm px-6 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
                  >
                    {subStatus === 'loading' ? 'Subscribing...' : (
                      <>
                        Subscribe
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
                
                <p className="text-xs text-white/60 text-center mt-4">
                  Free. Unsubscribe anytime. We&apos;ll never spam you.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default BlogPostPage;