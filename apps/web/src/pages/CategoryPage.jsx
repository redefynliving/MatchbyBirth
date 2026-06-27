import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import posts from '@/data/posts';
import BackButton from '@/components/BackButton.jsx';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

const CATEGORY_META = {
  'sign-guide': {
    title: 'Zodiac Sign Compatibility Guides',
    description: 'Complete compatibility guides for each zodiac sign. Find out which signs match best — and which ones challenge you.',
    seoTitle: 'Zodiac Sign Compatibility Guides | Match by Birth',
    seoDescription: 'Explore comprehensive compatibility guides for every zodiac sign. Ranked best to worst matches for love, friendship, and work.',
  },
  'pair-deep-dive': {
    title: 'Zodiac Pair Compatibility Deep Dives',
    description: 'In-depth analysis of specific zodiac pairings. Go beyond sun signs to understand the dynamics between two people.',
    seoTitle: 'Zodiac Pair Compatibility Deep Dives | Match by Birth',
    seoDescription: 'Detailed compatibility analysis for specific zodiac pairings. Learn the strengths, challenges, and hidden dynamics of each match.',
  },
  'learn-astrology': {
    title: 'Learn Astrology — Articles & Guides',
    description: 'Understand the building blocks of astrology: elements, planets, houses, and how they shape your relationships.',
    seoTitle: 'Learn Astrology — Articles & Guides | Match by Birth',
    seoDescription: 'Learn about astrological elements, planets, houses, and how they influence personality and relationships.',
  },
  seasonal: {
    title: 'Seasonal Astrology & Timely Guides',
    description: 'Retrograde survival guides, full moon rituals, and astrological forecasts for the current moment.',
    seoTitle: 'Seasonal Astrology & Timely Guides | Match by Birth',
    seoDescription: 'Stay current with seasonal astrology guides: Mercury retrograde, full moons, and planetary transits affecting your relationships.',
  },
  comparison: {
    title: 'Astrology App Comparisons & Reviews',
    description: 'Honest comparisons of popular astrology apps and tools. Find the right one for your needs.',
    seoTitle: 'Astrology App Comparisons & Reviews | Match by Birth',
    seoDescription: 'Unbiased reviews and comparisons of popular astrology apps. Find the best tool for compatibility readings and birth chart analysis.',
  },
};

function getCategory(post) {
  if (post.slug.endsWith('-compatibility') && !post.slug.includes('-compatibility-')) return 'pillar';
  if (post.tags.includes('compatibility') && (post.slug.match(/-/g) || []).length >= 3) return 'deep-dive';
  if (post.tags.some(t => ['elements', 'fire', 'earth', 'air', 'water', 'synastry', 'natal-chart', 'birth-date', 'houses', 'planets'].includes(t))) return 'educational';
  if (post.tags.some(t => ['retrograde', 'full-moon', 'new-moon', 'valentine', '2026', 'seasonal'].includes(t))) return 'seasonal';
  if (post.tags.some(t => ['costar', 'the-pattern', 'alternative', 'comparison', 'vs'].includes(t))) return 'comparison';
  return 'deep-dive';
}

function CategoryPage({ category }) {
  const meta = CATEGORY_META[category];
  const categoryPosts = posts.filter(p => getCategory(p) === category);

  if (!meta || categoryPosts.length === 0) {
    return (
      <main className="py-24 bg-background min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.07] blur-3xl bg-primary" />
        <div className="max-w-md mx-auto text-center px-4 relative z-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Coming Soon</h1>
          <p className="text-muted-foreground mb-8">We&apos;re working on content for this section. Check back soon!</p>
          <BackButton fallbackTo="/blog" label="Back to Blog" />
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

      <main className="py-16 md:py-24 bg-background min-h-screen relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl bg-primary" />
        <div className="pointer-events-none absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full opacity-[0.05] blur-3xl bg-violet-600" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BackButton fallbackTo="/blog" label="All Posts" />
          
          <header className="text-center mb-16 mt-4">
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
              {meta.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">{meta.description}</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {categoryPosts.map((post) => (
              <article key={post.slug} className="group bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all duration-300 shadow-sm relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {category.replace('-', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-3">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/95 leading-relaxed mb-6">{post.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                        #{t}
                      </span>
                    ))}
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-all gap-1.5 group-hover:translate-x-1 duration-200">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
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

export default CategoryPage;
