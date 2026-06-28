import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import posts from '@/data/posts';
import BackButton from '@/components/BackButton.jsx';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  canonicalUrl,
  getRelatedPosts,
  hasEnhancedContent,
} from '@/lib/blogSeo.js';

function EditorialEnhancements({ post }) {
  if (!hasEnhancedContent(post)) return null;

  return (
    <div className="mt-10 space-y-6">
      {post.quickTakeaways?.length > 0 && (
        <section className="rounded-2xl border border-border bg-muted/20 p-5">
          <h2 className="text-xl font-semibold text-foreground">Quick takeaways</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {post.quickTakeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {post.comparisonRows?.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-xl font-semibold text-foreground">Comparison guide</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-muted/30 text-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Signal</th>
                  <th className="px-5 py-3 font-semibold">Best use</th>
                  <th className="px-5 py-3 font-semibold">Watch out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                {post.comparisonRows.map((row) => (
                  <tr key={`${row.label}-${row.bestUse}`}>
                    <td className="px-5 py-4 font-semibold text-foreground">{row.label}</td>
                    <td className="px-5 py-4">{row.bestUse}</td>
                    <td className="px-5 py-4">{row.watchOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {post.exampleScenarios?.length > 0 && (
        <section className="rounded-2xl border border-border bg-muted/20 p-5">
          <h2 className="text-xl font-semibold text-foreground">Example scenarios</h2>
          <div className="mt-4 space-y-4">
            {post.exampleScenarios.map((example) => (
              <article key={example.title}>
                <h3 className="font-semibold text-foreground">{example.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{example.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {post.faq?.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold text-foreground">Common questions</h2>
          <div className="mt-4 space-y-4">
            {post.faq.map((item) => (
              <article key={item.question}>
                <h3 className="font-semibold text-foreground">{item.question}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  const relatedPosts = post ? getRelatedPosts(post, posts) : [];

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
        <link rel="canonical" href={canonicalUrl(`/blog/${post.slug}`)} />
        <meta property="og:title" content={`${post.title} | Match by Birth`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.ogImage || 'https://matchbybirth.com/og-image.png'} />
        <meta property="og:url" content={canonicalUrl(`/blog/${post.slug}`)} />
        <script type="application/ld+json">
          {JSON.stringify(buildArticleSchema(post))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildBreadcrumbSchema(post))}
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
                <span>Published by <strong>Match by Birth</strong></span>
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

            <EditorialEnhancements post={post} />

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

            {relatedPosts.length > 0 && (
              <section className="mt-10 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Keep reading</h2>
                <div className="mt-5 grid gap-4">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      to={`/blog/${related.slug}`}
                      className="group rounded-2xl border border-border bg-muted/20 p-5 transition-colors hover:bg-secondary/40"
                    >
                      <span className="flex items-center justify-between gap-4">
                        <span>
                          <span className="block font-semibold text-foreground">{related.title}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{related.description}</span>
                        </span>
                        <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* E-E-A-T Publisher Attribution Card */}
            <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center gap-4 text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                M
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Published by Match by Birth</h4>
                <p className="text-xs text-primary font-medium mb-1">Compatibility guides and calculator notes</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Match by Birth publishes practical compatibility guides for reflection and conversation. Articles are informational and should not be treated as relationship, medical, legal, or financial advice.
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
