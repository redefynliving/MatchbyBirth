import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Mail, ArrowRight } from 'lucide-react';
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
      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e' }}>Post not found</h1>
          <p style={{ marginTop: 16 }}>We couldn't find the article you're looking for.</p>
          <Link to="/" style={{ marginTop: 24, display: 'inline-block', color: '#6c4de6' }}>Back to calculator</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Match by Birth</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={`${post.title} | Match by Birth`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.ogImage || 'https://matchbybirth.com/og-image.png'} />
        <meta property="og:url" content={`${window.location.origin}/blog/${post.slug}`} />
      </Helmet>

      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <BackButton fallbackTo="/blog" label="Back to Blog" />

          <article>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>{post.title}</h1>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: 32 }}>{new Date(post.date).toLocaleDateString()}</p>
            {post.heroImage?.url && (
              <img
                src={post.heroImage.url}
                alt={post.heroImage.alt || ''}
                loading="eager"
                style={{ width: '100%', borderRadius: 8, border: '1px solid #e6e1d8', margin: '0 0 28px', objectFit: 'cover', aspectRatio: '16 / 9', background: '#fbfaf8' }}
              />
            )}

            <div className="blog-content" style={{ lineHeight: 1.8, fontSize: '1.125rem', color: '#2d2d2d' }} dangerouslySetInnerHTML={{ __html: post.content }} />

            <div style={{ marginTop: 40 }}>
              <div style={{ background: '#6c4de6', color: '#fff', padding: '20px', borderRadius: 10, textAlign: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', marginRight: 12 }}>Check your compatibility →</span>
                <Link to="/" style={{ color: '#fff', fontWeight: 800, textDecoration: 'underline' }}>Try the Calculator</Link>
              </div>
            </div>
          </article>

          {/* Newsletter subscribe */}
          <div style={{ marginTop: 48, padding: '28px 24px', background: 'linear-gradient(135deg, #6c4de6 0%, #8b5cf6 100%)', borderRadius: 16, color: '#fff' }}>
            {subStatus === 'success' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 4px' }}>You're subscribed!</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0 }}>Check your inbox for a welcome email and your first weekly digest.</p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Mail style={{ width: 24, height: 24, margin: '0 auto 8px', opacity: 0.9 }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px' }}>Get weekly astrology insights</h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0 }}>Join thousands getting our weekly digest of compatibility guides and astrology tips.</p>
                </div>
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    style={{ flex: 1, height: 44, borderRadius: 10, border: 'none', padding: '0 14px', fontSize: '0.95rem', outline: 'none', color: '#1a1a2e', background: '#ffffff' }}
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    style={{ height: 44, borderRadius: 10, border: 'none', background: '#fff', color: '#6c4de6', fontWeight: 700, fontSize: '0.9rem', padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: subStatus === 'loading' ? 0.7 : 1 }}
                  >
                    {subStatus === 'loading' ? 'Subscribing...' : <>Subscribe <ArrowRight style={{ width: 14, height: 14 }} /></>}
                  </button>
                </form>
                <p style={{ fontSize: '0.72rem', opacity: 0.65, textAlign: 'center', marginTop: 10, margin: '10px 0 0' }}>Free. Unsubscribe anytime. No spam.</p>
              </>
            )}
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