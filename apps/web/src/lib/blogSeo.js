import { getPostCategory } from '../data/blogCategories.js';

export const SITE_URL = 'https://matchbybirth.com';

export function canonicalUrl(route) {
  const normalizedRoute = route === '/'
    ? '/'
    : `/${String(route || '').replace(/^\/+|\/+$/g, '')}`;
  return normalizedRoute === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedRoute}`;
}

export function buildArticleSchema(post) {
  const url = canonicalUrl(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    articleSection: post.category || getPostCategory(post),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Organization',
      name: 'Match by Birth',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Match by Birth',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` },
    },
    ...(post.ogImage || post.heroImage?.url ? { image: post.ogImage || post.heroImage.url } : {}),
  };
}

export function buildBreadcrumbSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: canonicalUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: canonicalUrl('/blog'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl(`/blog/${post.slug}`),
      },
    ],
  };
}

export function getRelatedPosts(post, allPosts, limit = 3) {
  if (!post || !Array.isArray(allPosts)) return [];
  const explicit = Array.isArray(post.relatedSlugs)
    ? post.relatedSlugs
      .map((slug) => allPosts.find((candidate) => candidate.slug === slug && candidate.slug !== post.slug))
      .filter(Boolean)
    : [];

  if (explicit.length >= limit) return explicit.slice(0, limit);

  const category = getPostCategory(post);
  const fallback = allPosts.filter((candidate) => (
    candidate.slug !== post.slug
    && !explicit.some((related) => related.slug === candidate.slug)
    && getPostCategory(candidate) === category
  ));

  return [...explicit, ...fallback].slice(0, limit);
}

export function hasEnhancedContent(post) {
  return Boolean(
    post?.quickTakeaways?.length
    || post?.comparisonRows?.length
    || post?.exampleScenarios?.length
    || post?.faq?.length,
  );
}
