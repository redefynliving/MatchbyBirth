import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Mail, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import posts from '@/data/posts';
import BackButton from '@/components/BackButton.jsx';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';

function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

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

            {post.heroImage?.url && (
              <img
                src={post.heroImage.url}
                alt={post.heroImage.alt || ''}
                loading="eager"
                className="w-full rounded-2xl border border-border mb-8 object-cover aspect-video bg-muted"
              />
            )}

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

          <NewsletterCapture className="mt-12" consentSource="blog_post" />

          <style>{`
            .blog-content h2 { font-size: 1.5rem; font-weight: 700; color: #6c4de6; margin-top: 40px; }
            .blog-content h3 { font-size: 1.25rem; font-weight: 600; color: #6c4de6; }
            .blog-content strong, .blog-content b { color: #1a1a2e; font-weight: 700; }
            .blog-content p { margin-bottom: 20px; }
          `}</style>
        </div>
      </main>
    </>
  );
}

export default BlogPostPage;
