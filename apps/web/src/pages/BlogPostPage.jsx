import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';
import BackButton from '@/components/BackButton.jsx';
import NewsletterCapture from '@/components/NewsletterCapture.jsx';

function BlogPostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

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
