const SITE_URL = 'https://matchbybirth.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export function canonicalBlogUrl(post, siteUrl = SITE_URL) {
  return `${siteUrl.replace(/\/$/, '')}/blog/${post.slug}`;
}

export function buildArticleSchema(post, { siteUrl = SITE_URL } = {}) {
  const canonicalUrl = canonicalBlogUrl(post, siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    image: post.ogImage || DEFAULT_IMAGE,
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      name: 'Match by Birth',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Match by Birth',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };
}

export function buildBreadcrumbSchema(post, { siteUrl = SITE_URL } = {}) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${normalizedSiteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${normalizedSiteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalBlogUrl(post, siteUrl),
      },
    ],
  };
}

export function getRelatedPosts(post, allPosts, limit = 3) {
  if (!post || !Array.isArray(allPosts)) return [];

  const seen = new Set([post.slug]);
  const bySlug = new Map(allPosts.map((entry) => [entry.slug, entry]));
  const explicit = (post.relatedSlugs || [])
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .filter((entry) => {
      if (seen.has(entry.slug)) return false;
      seen.add(entry.slug);
      return true;
    });

  const fallback = allPosts
    .filter((entry) => entry.category === post.category)
    .filter((entry) => !seen.has(entry.slug))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return [...explicit, ...fallback].slice(0, limit);
}
