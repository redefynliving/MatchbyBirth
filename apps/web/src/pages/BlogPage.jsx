import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import BackButton from '@/components/BackButton.jsx';
import posts from '@/data/posts';
import { ALL_POSTS_CATEGORY, BLOG_CATEGORIES, getPostCategory } from '@/data/blogCategories.js';
import { DEFAULT_AUTHOR } from '@/lib/blogSeo.js';

const POSTS_PER_PAGE = 8;
const CATEGORIES = [ALL_POSTS_CATEGORY, ...BLOG_CATEGORIES];

const featuredCategoryKeys = [
  'learn-astrology',
  'pair-deep-dive',
  'moon-signs',
  'numerology',
];

const popularPostSlugs = [
  'how-birth-date-affects-personality-relationships',
  'history-of-astrology-birth-compatibility',
  'what-compatibility-score-means',
  'cancer-moon-compatibility',
];

const startHereLinks = [
  {
    title: 'Understand birth matching',
    description: 'Start with the plain-English version of what Match by Birth is comparing.',
    to: '/blog/how-birth-date-affects-personality-relationships',
  },
  {
    title: 'Read the methodology',
    description: 'See what the calculator uses, what it does not claim, and how to read results.',
    to: '/how-it-works',
  },
  {
    title: 'Try a simple tool',
    description: 'Use Life Path compatibility as a low-friction entry point before a full match.',
    to: '/tools/life-path-compatibility',
  },
];

function formatPostDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getSearchText(post) {
  return [
    post.title,
    post.description,
    post.category,
    ...(post.tags || []),
  ].join(' ').toLowerCase();
}

function PostCard({ post, categories }) {
  const categoryLabel = categories.find((category) => category.key === post.category)?.label || 'Guide';

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30 md:p-6">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary">
            {categoryLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatPostDate(post.date)}
          </span>
        </div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          By {post.author || DEFAULT_AUTHOR.name}
        </p>
        <h3 className="text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
      </div>

      <Link
        to={`/blog/${post.slug}`}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
      >
        Read guide <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const enrichedPosts = useMemo(() => {
    return posts
      .map((post) => ({ ...post, category: getPostCategory(post) }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  const categoryCounts = useMemo(() => {
    return enrichedPosts.reduce((counts, post) => {
      counts.all += 1;
      counts[post.category] = (counts[post.category] || 0) + 1;
      return counts;
    }, { all: 0 });
  }, [enrichedPosts]);

  const featuredCategories = BLOG_CATEGORIES
    .filter((category) => featuredCategoryKeys.includes(category.key))
    .filter((category) => categoryCounts[category.key] > 0);

  const popularPosts = popularPostSlugs
    .map((slug) => enrichedPosts.find((post) => post.slug === slug))
    .filter(Boolean);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return enrichedPosts.filter((post) => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      const matchesSearch = !normalizedQuery || getSearchText(post).includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, enrichedPosts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.currentTarget.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Astrology Blog & Guides | Match by Birth</title>
        <meta
          name="description"
          content="Browse Match by Birth compatibility guides, astrology explainers, moon sign articles, numerology tools, and relationship timing resources."
        />
        <link rel="canonical" href="https://matchbybirth.com/blog" />
      </Helmet>

      <main className="min-h-screen bg-background py-12 md:py-16">
        <div className="content-container">
          <BackButton fallbackTo="/" label="Back to Calculator" />

          <header className="mx-auto max-w-3xl py-8 text-center md:py-10">
            <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card text-primary">
              <BookOpen className="h-6 w-6" />
            </span>
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary">
              Match by Birth guides
            </p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-6xl">
              Start with the question you actually have.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Learn birth matching, compare zodiac patterns, read Moon sign guides, or jump into the tools when you want a result.
            </p>
          </header>

          <section className="grid gap-4 border-y border-border py-6 md:grid-cols-3" aria-labelledby="start-here-heading">
            <div className="md:col-span-3">
              <h2 id="start-here-heading" className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Start here
              </h2>
            </div>
            {startHereLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
              >
                <h3 className="flex items-center justify-between gap-3 text-lg font-semibold text-foreground">
                  {item.title}
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </section>

          <section className="py-8" aria-labelledby="featured-topics-heading">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="featured-topics-heading" className="text-2xl font-semibold tracking-tight text-foreground">
                  Featured topics
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Pick the kind of answer you want first.</p>
              </div>
              <Link to="/blog/category/learn-astrology" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Beginner resources <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => handleCategoryChange(category.key)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    activeCategory === category.key
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <span className="text-base font-semibold text-foreground">{category.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{category.description}</span>
                  <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {categoryCounts[category.key]} guides
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-6 py-8 lg:grid-cols-[0.76fr_1.24fr]" aria-labelledby="popular-posts-heading">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
              <h2 id="popular-posts-heading" className="text-2xl font-semibold tracking-tight text-foreground">
                Popular posts
              </h2>
              <div className="mt-5 space-y-4">
                {popularPosts.map((post, index) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className="group block border-t border-border pt-4 first:border-t-0 first:pt-0">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      0{index + 1}
                    </span>
                    <h3 className="mt-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
              <label htmlFor="blog-search" className="text-sm font-semibold text-foreground">
                Search guides
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  id="blog-search"
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search compatibility, Moon signs, life path, timing..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <nav className="mt-5 flex flex-wrap gap-2" aria-label="Blog topics">
                {CATEGORIES.map((category) => {
                  const count = categoryCounts[category.key] || 0;
                  if (count === 0 && category.key !== 'all') return null;
                  return (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => handleCategoryChange(category.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        activeCategory === category.key
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/30'
                      }`}
                    >
                      {category.label} <span className="opacity-70">({count})</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </section>

          <section className="py-8" aria-labelledby="recent-posts-heading">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="recent-posts-heading" className="text-2xl font-semibold tracking-tight text-foreground">
                  Recent guides
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredPosts.length} result{filteredPosts.length === 1 ? '' : 's'}
                  {searchQuery ? ` for "${searchQuery.trim()}"` : ''}
                </p>
              </div>
              {(searchQuery || activeCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    handleCategoryChange('all');
                  }}
                  className="text-left text-sm font-semibold text-primary"
                >
                  Clear filters
                </button>
              )}
            </div>

            {paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.slug} post={post} categories={CATEGORIES} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <p className="text-muted-foreground">No guides match that search yet.</p>
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="px-2 text-sm font-medium text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </section>

          <section className="grid gap-6 border-t border-border py-8 lg:grid-cols-[0.72fr_1.28fr]" aria-labelledby="topic-index-heading">
            <div>
              <h2 id="topic-index-heading" className="text-2xl font-semibold tracking-tight text-foreground">
                Topic index
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Use the archive when you know the lane: signs, pairings, Moon signs, numerology, timing, or relationship use cases.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {BLOG_CATEGORIES.filter((category) => categoryCounts[category.key] > 0).map((category) => (
                <Link
                  key={category.key}
                  to={`/blog/category/${category.key}`}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30"
                >
                  <span className="font-semibold text-foreground">{category.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{category.seoDescription}</span>
                  <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    Browse {categoryCounts[category.key]} posts
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-primary/15 bg-card p-6 text-center shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Ready to check your compatibility?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Enter two birth dates for a private compatibility read, then use the guides when you want more context.
            </p>
            <Link
              to="/#calculator"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try the calculator <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}

export default BlogPage;
