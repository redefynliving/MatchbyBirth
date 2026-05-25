import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';

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
      </Helmet>

      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link to="/blog" style={{ color: '#6c4de6', display: 'inline-block', marginBottom: 12 }}>← Back to Blog</Link>

          <article>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>{post.title}</h1>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: 32 }}>{new Date(post.date).toLocaleDateString()}</p>

            <div className="blog-content" style={{ lineHeight: 1.8, fontSize: '1.125rem', color: '#2d2d2d' }} dangerouslySetInnerHTML={{ __html: post.content }} />

            <div style={{ marginTop: 40 }}>
              <div style={{ background: '#6c4de6', color: '#fff', padding: '20px', borderRadius: 10, textAlign: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', marginRight: 12 }}>Check your compatibility →</span>
                <Link to="/" style={{ color: '#fff', fontWeight: 800, textDecoration: 'underline' }}>Try the Calculator</Link>
              </div>
            </div>
          </article>

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
