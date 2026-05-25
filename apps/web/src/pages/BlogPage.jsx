import React from 'react';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';
import { Link } from 'react-router-dom';

function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Astrology Blog & Guides | Match by Birth</title>
        <meta name="description" content="Read our latest articles and guides on zodiac compatibility, astrology, and relationship advice." />
      </Helmet>

      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>Blog & Guides</h1>
            <p style={{ fontSize: '1rem', color: '#888', marginTop: 8 }}>Insights into the stars and your relationships.</p>
          </header>

          <section className="posts-grid">
            {posts.map((post) => (
              <article key={post.slug} className="post-card">
                <h3 className="post-title"><Link to={`/blog/${post.slug}`} className="post-link">{post.title}</Link></h3>
                <p className="post-date">{new Date(post.date).toLocaleDateString()}</p>
                <p className="post-description">{post.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {post.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="read-more">Read More →</Link>
              </article>
            ))}
          </section>

          <style>{`
            .posts-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
            }

            @media (min-width: 720px) {
              .posts-grid {
                grid-template-columns: 1fr 1fr;
              }
            }

            .post-card {
              background: #ffffff;
              border: 1px solid #e6e6f0;
              border-radius: 16px;
              padding: 20px;
              box-shadow: 0 1px 4px rgba(16,24,40,0.04);
            }

            .post-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 8px 0; color: #1a1a2e; }
            .post-link { color: inherit; text-decoration: none; }
            .post-link:hover { text-decoration: underline; color: #6c4de6; }

            .post-date { font-size: 0.875rem; color: #888; margin: 0 0 12px 0; }
            .post-description { color: #2d2d2d; font-size: 1rem; margin: 0 0 12px 0; }

            .tag { background: #f3f0ff; color: #6c4de6; padding: 4px 8px; border-radius: 999px; font-size: 0.75rem; }

            .read-more { color: #6c4de6; font-weight: 600; text-decoration: none; }
            .read-more:hover { text-decoration: underline; }
          `}</style>
        </div>
      </main>
    </>
  );
}

export default BlogPage;
