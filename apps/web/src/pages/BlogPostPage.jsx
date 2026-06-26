import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Mail, ArrowRight } from 'lucide-react';
import posts from '@/data/posts';
import { getArticleNextSteps } from '@/data/articleNextSteps.js';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  canonicalBlogUrl,
  getRelatedPosts,
} from '@/lib/blog-seo.js';

function EditorialEnhancements({ post }) {
  const hasTakeaways = Array.isArray(post.quickTakeaways) && post.quickTakeaways.length > 0;
  const hasExamples = Array.isArray(post.exampleScenarios) && post.exampleScenarios.length > 0;
  const hasComparison = Array.isArray(post.comparisonRows) && post.comparisonRows.length > 0;
  const hasFaq = Array.isArray(post.faq) && post.faq.length > 0;

  if (!hasTakeaways && !hasExamples && !hasComparison && !hasFaq) return null;

  return (
    <div className="blog-enhancements" style={{ marginTop: 40, display: 'grid', gap: 22 }}>
      {hasTakeaways && (
        <section style={{ border: '1px solid #e6e6f0', borderRadius: 8, padding: 20, background: '#fbfbff' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1a1a2e', margin: '0 0 12px' }}>Quick takeaways</h2>
          <ul style={{ margin: 0, paddingLeft: 22, color: '#2d2d2d', lineHeight: 1.7 }}>
            {post.quickTakeaways.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}

      {hasComparison && (
        <section style={{ border: '1px solid #e6e6f0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1a1a2e', margin: 0, padding: '18px 20px', borderBottom: '1px solid #e6e6f0' }}>Comparison guide</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
              <thead>
                <tr style={{ background: '#f6f3ff', color: '#1a1a2e', textAlign: 'left' }}>
                  <th style={{ padding: 14, fontSize: '0.85rem' }}>Signal</th>
                  <th style={{ padding: 14, fontSize: '0.85rem' }}>Best use</th>
                  <th style={{ padding: 14, fontSize: '0.85rem' }}>Watch out</th>
                </tr>
              </thead>
              <tbody>
                {post.comparisonRows.map((row) => (
                  <tr key={row.label} style={{ borderTop: '1px solid #eeeef7' }}>
                    <td style={{ padding: 14, fontWeight: 700, verticalAlign: 'top' }}>{row.label}</td>
                    <td style={{ padding: 14, verticalAlign: 'top' }}>{row.bestUse}</td>
                    <td style={{ padding: 14, verticalAlign: 'top' }}>{row.watchOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {hasExamples && (
        <section style={{ border: '1px solid #e6e6f0', borderRadius: 8, padding: 20, background: '#fff' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1a1a2e', margin: '0 0 14px' }}>Example scenarios</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {post.exampleScenarios.map((example) => (
              <article key={example.title}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#5b3fd6', margin: '0 0 6px' }}>{example.title}</h3>
                <p style={{ margin: 0, lineHeight: 1.7 }}>{example.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {hasFaq && (
        <section style={{ border: '1px solid #e6e6f0', borderRadius: 8, padding: 20, background: '#fbfbff' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1a1a2e', margin: '0 0 14px' }}>Common questions</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {post.faq.map((item) => (
              <article key={item.question}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 6px' }}>{item.question}</h3>
                <p style={{ margin: 0, lineHeight: 1.7 }}>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ArticleNextSteps({ post }) {
  const links = getArticleNextSteps(post);
  if (links.length === 0) return null;

  return (
    <section style={{ marginTop: 40, border: '1px solid #e6e1d8', borderRadius: 8, padding: 20, background: '#fff' }}>
      <p style={{ margin: '0 0 6px', color: '#6c4de6', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Recommended next
      </p>
      <h2 style={{ fontSize: '1.3rem', color: '#1a1a2e', margin: '0 0 14px' }}>
        Keep reading or try your own match
      </h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {links.map((link) => (
          <Link
            key={`${post.slug}-${link.href}`}
            to={link.href}
            style={{ display: 'block', border: '1px solid #eee8df', borderRadius: 8, padding: 14, color: '#1a1a2e', textDecoration: 'none', background: '#fbfaf8' }}
          >
            <strong style={{ display: 'block', color: '#5b3fd6' }}>{link.label}</strong>
            <span style={{ display: 'block', marginTop: 4, color: '#665f72', lineHeight: 1.5 }}>{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const visuallyHiddenStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

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
      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e' }}>Post not found</h1>
          <p style={{ marginTop: 16 }}>We couldn't find the article you're looking for.</p>
          <Link to="/" style={{ marginTop: 24, display: 'inline-block', color: '#6c4de6' }}>Back to calculator</Link>
        </div>
      </main>
    );
  }

  const canonicalUrl = canonicalBlogUrl(post);
  const relatedPosts = getRelatedPosts(post, posts, 3);

  return (
    <>
      <Helmet>
        <title>{post.title} | Match by Birth</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${post.title} | Match by Birth`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.ogImage || 'https://matchbybirth.com/og-image.png'} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(buildArticleSchema(post))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildBreadcrumbSchema(post))}
        </script>
      </Helmet>

      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link to="/blog" style={{ color: '#6c4de6', display: 'inline-block', marginBottom: 12 }}>← Back to Blog</Link>

          <article>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>{post.title}</h1>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: 32 }}>{new Date(post.date).toLocaleDateString()}</p>

            <div className="blog-content" style={{ lineHeight: 1.8, fontSize: '1.125rem', color: '#2d2d2d' }} dangerouslySetInnerHTML={{ __html: post.content }} />

            <EditorialEnhancements post={post} />
            <ArticleNextSteps post={post} />

            {relatedPosts.length > 0 && (
              <section style={{ marginTop: 40, borderTop: '1px solid #e6e6f0', paddingTop: 28 }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1a1a2e', margin: '0 0 14px' }}>Related articles</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      to={`/blog/${relatedPost.slug}`}
                      style={{ display: 'block', border: '1px solid #e6e6f0', borderRadius: 8, padding: 16, color: '#1a1a2e', textDecoration: 'none', background: '#fff' }}
                    >
                      <strong style={{ color: '#5b3fd6' }}>{relatedPost.title}</strong>
                      <span style={{ display: 'block', marginTop: 6, color: '#555', lineHeight: 1.5 }}>{relatedPost.description}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div style={{ marginTop: 40 }}>
              <div style={{
                background: '#fff',
                color: '#1a1a2e',
                padding: '22px',
                borderRadius: 8,
                border: '1px solid #e6e1d8',
                boxShadow: '0 10px 28px rgba(16,24,40,0.06)',
              }}>
                <p style={{ margin: '0 0 6px', color: '#6c4de6', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Try the tool</p>
                <h2 style={{ margin: '0 0 8px', fontSize: '1.35rem', color: '#1a1a2e' }}>Check your birth date compatibility</h2>
                <p style={{ margin: '0 0 16px', color: '#665f72', lineHeight: 1.6 }}>
                  Compare two people or a group, then use this guide to understand the score in context.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <Link
                    to="/#calculator"
                    style={{ color: '#fff', background: '#1f1d2b', fontWeight: 800, textDecoration: 'none', padding: '10px 14px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    Try the calculator →
                  </Link>
                  <Link
                    to="/how-it-works"
                    style={{ color: '#5b3fd6', background: '#f8f6ff', border: '1px solid #e6e0ff', fontWeight: 800, textDecoration: 'none', padding: '10px 14px', borderRadius: 8, display: 'inline-flex', alignItems: 'center' }}
                  >
                    How it works
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Newsletter subscribe */}
          <div style={{
            marginTop: 48,
            padding: '24px',
            background: '#fff',
            borderRadius: 8,
            color: '#1a1a2e',
            border: '1px solid #e6e1d8',
            boxShadow: '0 10px 28px rgba(16,24,40,0.06)',
          }}>
            <div aria-live="polite">
              {subStatus === 'success' ? (
                <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 4px', color: '#1a1a2e' }}>You're subscribed.</p>
                <p style={{ fontSize: '0.9rem', color: '#665f72', margin: 0 }}>Check your inbox for your first weekly note.</p>
                </div>
              ) : (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <span style={{ width: 40, height: 40, margin: '0 auto 10px', borderRadius: 8, border: '1px solid #e6e1d8', display: 'grid', placeItems: 'center', color: '#6c4de6', background: '#fbfaf8' }}>
                      <Mail style={{ width: 20, height: 20 }} aria-hidden="true" />
                    </span>
                    <p style={{ margin: '0 0 6px', color: '#6c4de6', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Birth Match Notes</p>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px', color: '#1a1a2e' }}>Get weekly compatibility notes by email</h3>
                    <p style={{ fontSize: '0.9rem', color: '#665f72', lineHeight: 1.55, margin: 0 }}>One weekly note with timing ideas, compatibility insights, and new Match by Birth guides.</p>
                  </div>
                  <form onSubmit={handleSubscribe} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 440, margin: '0 auto' }}>
                    <label htmlFor="blog-subscribe-email" style={visuallyHiddenStyle}>Email address</label>
                    <input
                      id="blog-subscribe-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                      style={{ flex: '1 1 220px', height: 44, borderRadius: 8, border: '1px solid #ded9e6', padding: '0 14px', fontSize: '0.95rem', outline: 'none', color: '#1a1a2e', background: '#fff' }}
                    />
                    <button
                      type="submit"
                      disabled={subStatus === 'loading'}
                      style={{ height: 44, borderRadius: 8, border: 'none', background: '#1f1d2b', color: '#fff', fontWeight: 700, fontSize: '0.9rem', padding: '0 16px', cursor: subStatus === 'loading' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: subStatus === 'loading' ? 0.7 : 1, flex: '0 0 auto' }}
                    >
                      {subStatus === 'loading' ? 'Subscribing...' : <>Subscribe <ArrowRight style={{ width: 14, height: 14 }} /></>}
                    </button>
                  </form>
                  {subStatus === 'error' && (
                    <p style={{ fontSize: '0.85rem', color: '#b42318', textAlign: 'center', margin: '10px 0 0', fontWeight: 700 }}>
                      We could not subscribe you right now. Please try again.
                    </p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#777083', textAlign: 'center', marginTop: 10, margin: '10px 0 0' }}>Free. Unsubscribe anytime. No spam.</p>
                </>
              )}
            </div>
          </div>

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
