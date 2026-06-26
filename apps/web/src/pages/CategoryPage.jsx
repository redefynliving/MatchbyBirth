import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import posts from '@/data/posts';
import { getCategoryMeta, getPostCategory } from '@/data/blogCategories.js';

function CategoryPage() {
  const { category } = useParams();
  const meta = getCategoryMeta(category);
  const categoryPosts = posts.filter(p => getPostCategory(p) === category);

  if (!meta || categoryPosts.length === 0) {
    return (
      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e' }}>Coming Soon</h1>
          <p style={{ color: '#888', marginTop: 16 }}>We're working on content for this section. Check back soon!</p>
          <Link to="/blog" style={{ color: '#6c4de6', fontWeight: 600, marginTop: 16, display: 'inline-block' }}>← Back to Blog</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{meta.seoTitle}</title>
        <meta name="description" content={meta.seoDescription} />
        <link rel="canonical" href={`https://matchbybirth.com/blog/category/${category}`} />
      </Helmet>

      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link to="/blog" style={{ color: '#6c4de6', fontSize: '0.875rem', fontWeight: 600 }}>← All Posts</Link>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1a1a2e', margin: '16px 0 8px' }}>{meta.label}</h1>
            <p style={{ fontSize: '1rem', color: '#888', maxWidth: 500, margin: '0 auto' }}>{meta.description}</p>
          </header>

          <section className="posts-grid">
            {categoryPosts.map((post) => (
              <article key={post.slug} className="post-card">
                <h3 className="post-title">
                  <Link to={`/blog/${post.slug}`} className="post-link">{post.title}</Link>
                </h3>
                <p className="post-date">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="post-description">{post.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {post.tags.slice(0, 4).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="read-more">Read More →</Link>
              </article>
            ))}
          </section>

          <style>{`
            .posts-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
            @media (min-width: 720px) { .posts-grid { grid-template-columns: 1fr 1fr; } }
            .post-card { background: #fff; border: 1px solid #e6e6f0; border-radius: 16px; padding: 20px; box-shadow: 0 1px 4px rgba(16,24,40,0.04); }
            .post-title { font-size: 1.15rem; font-weight: 600; margin: 0 0 6px 0; color: #1a1a2e; line-height: 1.3; }
            .post-link { color: inherit; text-decoration: none; }
            .post-link:hover { text-decoration: underline; color: #6c4de6; }
            .post-date { font-size: 0.8rem; color: #888; margin: 0 0 8px 0; }
            .post-description { color: #555; font-size: 0.9rem; margin: 0 0 10px 0; line-height: 1.5; }
            .tag { background: #f3f0ff; color: #6c4de6; padding: 3px 8px; border-radius: 999px; font-size: 0.7rem; }
            .read-more { color: #6c4de6; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
            .read-more:hover { text-decoration: underline; }
          `}</style>
        </div>
      </main>
    </>
  );
}

export default CategoryPage;
