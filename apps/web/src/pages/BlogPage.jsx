import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';

const POSTS_PER_PAGE = 6;

const CATEGORIES = [
  { key: 'all', label: 'All Posts' },
  { key: 'sign-guide', label: 'By Zodiac Sign', description: 'Compatibility guides for each sign' },
  { key: 'pair-deep-dive', label: 'Pair Deep Dives', description: 'In-depth analysis of specific pairings' },
  { key: 'learn-astrology', label: 'Learn Astrology', description: 'Elements, planets, and chart basics' },
  { key: 'seasonal', label: 'Seasonal', description: 'Retrogrades, transits, and timely guides' },
  { key: 'relationships', label: 'Relationships', description: 'Love, friendship, work, and family' },
];

function getCategory(post) {
  if (post.category) return post.category;
  // Fallback for any posts without category field
  if (post.slug.endsWith('-compatibility') && !post.slug.includes('-compatibility-')) return 'sign-guide';
  if (post.tags.includes('compatibility')) return 'pair-deep-dive';
  if (post.tags.some(t => ['elements', 'fire', 'earth', 'air', 'water'].includes(t))) return 'learn-astrology';
  return 'relationships';
}

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Enrich posts with category
  const enrichedPosts = useMemo(() => {
    return posts.map(p => ({ ...p, category: getCategory(p) }));
  }, [posts]);

  // Filter by category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return enrichedPosts;
    return enrichedPosts.filter(p => p.category === activeCategory);
  }, [enrichedPosts, activeCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset page when category changes
  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Astrology Blog & Guides | Match by Birth</title>
        <meta name="description" content="Explore astrology compatibility guides, zodiac pair deep dives, and relationship insights. Find out how the stars align for you." />
      </Helmet>

      <main style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <BackButton fallbackTo="/" label="Back to Calculator" />
          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>Blog & Guides</h1>
            <p style={{ fontSize: '1rem', color: '#888', marginTop: 8 }}>Astrology insights for your relationships.</p>
          </header>

          {/* Category Filter */}
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
            {CATEGORIES.map(cat => {
              const count = cat.key === 'all' ? enrichedPosts.length : enrichedPosts.filter(p => p.category === cat.key).length;
              if (count === 0 && cat.key !== 'all') return null;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  title={cat.description}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: '1px solid ' + (isActive ? '#6c4de6' : '#e6e6f0'),
                    background: isActive ? '#6c4de6' : '#fff',
                    color: isActive ? '#fff' : '#1a1a2e',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </nav>

          {/* Posts Grid */}
          <section className="posts-grid">
            {paginatedPosts.map((post) => (
              <article key={post.slug} className="post-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    background: '#f3f0ff',
                    color: '#6c4de6',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}>
                    {CATEGORIES.find(c => c.key === post.category)?.label || 'Guide'}
                  </span>
                </div>
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

          {/* Empty State */}
          {paginatedPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
              <p>No posts in this category yet. Check back soon!</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #e6e6f0',
                  background: currentPage === 1 ? '#f5f5f5' : '#fff',
                  color: currentPage === 1 ? '#ccc' : '#1a1a2e',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid ' + (page === currentPage ? '#6c4de6' : '#e6e6f0'),
                    background: page === currentPage ? '#6c4de6' : '#fff',
                    color: page === currentPage ? '#fff' : '#1a1a2e',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #e6e6f0',
                  background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                  color: currentPage === totalPages ? '#ccc' : '#1a1a2e',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                Next →
              </button>
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 48, background: '#6c4de6', color: '#fff', padding: '24px', borderRadius: 16, textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Ready to check your compatibility?</h2>
            <p style={{ margin: '0 0 16px 0', opacity: 0.9, fontSize: '0.95rem' }}>Enter both birth dates for a free personalized reading.</p>
            <Link to="/" style={{ color: '#fff', fontWeight: 800, textDecoration: 'underline', fontSize: '1.1rem' }}>Try the Calculator →</Link>
          </div>

          <style>{`
            .posts-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
            }
            @media (min-width: 720px) {
              .posts-grid { grid-template-columns: 1fr 1fr; }
            }
            .post-card {
              background: #ffffff;
              border: 1px solid #e6e6f0;
              border-radius: 16px;
              padding: 20px;
              box-shadow: 0 1px 4px rgba(16,24,40,0.04);
              transition: box-shadow 0.15s;
            }
            .post-card:hover {
              box-shadow: 0 4px 12px rgba(16,24,40,0.08);
            }
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

export default BlogPage;
