
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import posts from '@/data/posts';
import { Link } from 'react-router-dom';
import BackButton from '@/components/BackButton.jsx';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import { ALL_POSTS_CATEGORY, BLOG_CATEGORIES, getPostCategory } from '@/data/blogCategories.js';
import { ZODIAC_SIGNS, getCanonicalZodiacPairingPages } from '../../../../tools/zodiac-pairings.mjs';
import { getBlogPostPath } from '@/lib/blogSeo.js';

const POSTS_PER_PAGE = 6;

const CATEGORIES = [ALL_POSTS_CATEGORY, ...BLOG_CATEGORIES];
const PAIRING_PAGES = getCanonicalZodiacPairingPages();

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Enrich posts with category
  const enrichedPosts = useMemo(() => {
    return posts.map(p => ({ ...p, category: getPostCategory(p) }));
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
        <link rel="canonical" href="https://matchbybirth.com/blog" />
      </Helmet>

      <main className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl bg-primary" />
        <div className="pointer-events-none absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full opacity-[0.05] blur-3xl bg-violet-600" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BackButton fallbackTo="/" label="Back to Calculator" />
          
          {/* Header */}
          <header className="text-center mb-12">
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Blog & Guides</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-md mx-auto">Astrological insights, compatibility deep dives, and relationship advice.</p>
          </header>

          {/* Category Filter */}
          <nav className="flex flex-wrap items-center justify-center gap-2 mb-12 pb-2 border-b border-border/50">
            {CATEGORIES.map(cat => {
              const count = cat.key === 'all' ? enrichedPosts.length : enrichedPosts.filter(p => p.category === cat.key).length;
              if (count === 0 && cat.key !== 'all') return null;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  title={cat.description}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white border border-primary shadow-sm'
                      : 'bg-card border border-border text-foreground hover:bg-muted/50 hover:border-muted-foreground/30'
                  }`}
                >
                  {cat.label} <span className="opacity-70 ml-1">({count})</span>
                </button>
              );
            })}
          </nav>

          {/* Posts Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {paginatedPosts.map((post) => (
              <article key={post.slug} className="group bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all duration-300 shadow-sm relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {CATEGORIES.find(c => c.key === post.category)?.label || 'Guide'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-3">
                    <Link to={getBlogPostPath(post)}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/95 leading-relaxed mb-6">{post.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(post.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                        #{t}
                      </span>
                    ))}
                  </div>
                  
                  <Link to={getBlogPostPath(post)} className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-all gap-1.5 group-hover:translate-x-1 duration-200">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {/* Empty State */}
          {paginatedPosts.length === 0 && (
            <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto">
              <p className="text-muted-foreground">No posts found in this category. Check back soon!</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 flex items-center justify-center gap-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors font-semibold text-sm cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                      page === currentPage
                        ? 'bg-primary text-white border border-primary shadow-sm'
                        : 'bg-card border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <div className="sm:hidden text-sm font-medium text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-4 flex items-center justify-center gap-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors font-semibold text-sm cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}

          <section className="mt-20" aria-labelledby="pairing-directory-title">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 id="pairing-directory-title" className="text-2xl md:text-3xl font-extrabold text-foreground">
                Find your zodiac pairing
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                Pick either sign to reach the same compatibility guide.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ZODIAC_SIGNS.map((sign) => {
                const signPages = PAIRING_PAGES.filter((page) => (
                  page.firstSign.name === sign.name || page.secondSign.name === sign.name
                ));

                return (
                  <details key={sign.name} className="group self-start rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <summary className="cursor-pointer font-bold text-foreground">
                      {sign.label} compatibility
                    </summary>
                    <ul className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                      {signPages.map((page) => {
                        const partner = page.firstSign.name === sign.name ? page.secondSign : page.firstSign;
                        return (
                          <li key={page.slug}>
                            <Link
                              to={page.path}
                              className="block rounded-lg px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                            >
                              {sign.label} + {partner.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                );
              })}
            </div>
          </section>

          {/* CTA Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-violet-700 text-white rounded-3xl p-8 md:p-12 text-center shadow-lg shadow-primary/10 mt-20">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            
            <div className="relative z-10 max-w-lg mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Ready to check your compatibility?</h2>
              <p className="text-white/80 max-w-sm mx-auto mb-6 text-sm md:text-base leading-relaxed">Enter both birth dates for a free personalized astrological reading.</p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 bg-white text-primary font-bold rounded-xl px-6 py-3 hover:bg-white/95 transition-transform hover:scale-105 active:scale-100 shadow-md shadow-black/10"
              >
                Try the Calculator <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default BlogPage;
