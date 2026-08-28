import { getCategoryMeta, getPostCategory } from '../data/blogCategories.js';
import { getCanonicalBlogPostSlug } from '../../../../tools/zodiac-pairings.mjs';

export const SITE_URL = 'https://matchbybirth.com';
export const SITE_NAME = 'Match by Birth';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const BLOG_AUTHOR = {
  name: 'AJ Fox',
  url: `${SITE_URL}/about`,
};

export function canonicalUrl(route) {
  const normalizedRoute = route === '/'
    ? '/'
    : `/${String(route || '').replace(/^\/+|\/+$/g, '')}`;
  return normalizedRoute === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedRoute}`;
}

export function getBlogPostPath(post) {
  const slug = getCanonicalBlogPostSlug(post.canonicalSlug || post.slug);
  return `/blog/${slug}`;
}

export function getBlogPostSeo(post) {
  const categoryKey = post.category || getPostCategory(post);
  const category = getCategoryMeta(categoryKey);
  const image = post.ogImage || post.heroImage?.url || DEFAULT_OG_IMAGE;
  const description = post.description || '';
  const url = canonicalUrl(getBlogPostPath(post));
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];

  return {
    title: post.metaTitle || `${post.title} | ${SITE_NAME}`,
    socialTitle: post.title,
    description,
    url,
    image,
    authorName: post.author || BLOG_AUTHOR.name,
    authorUrl: post.authorUrl || BLOG_AUTHOR.url,
    datePublished: post.date,
    dateModified: post.updatedAt || post.modifiedAt || post.date,
    categoryKey,
    categoryLabel: category?.label || categoryKey || 'Guide',
    tags,
  };
}

export function buildArticleSchema(post) {
  const seo = getBlogPostSeo(post);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: seo.description,
    image: [post.image || seo.image],
    datePublished: seo.datePublished,
    dateModified: seo.dateModified,
    articleSection: seo.categoryLabel,
    keywords: seo.tags,
    mainEntityOfPage: { '@type': 'WebPage', '@id': seo.url },
    author: {
      '@type': 'Person',
      name: seo.authorName,
      url: seo.authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` },
    },
  };
}

export function buildFaqSchema(post) {
  if (!Array.isArray(post?.faq) || post.faq.length === 0) return null;
  const base = canonicalUrl(getBlogPostPath(post));
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${base}#faq`,
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(post) {
  const seo = getBlogPostSeo(post);
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
        item: seo.url,
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
  const sameCategoryFallback = allPosts.filter((candidate) => (
    candidate.slug !== post.slug
    && !explicit.some((related) => related.slug === candidate.slug)
    && getPostCategory(candidate) === category
  ));

  const broadFallback = allPosts.filter((candidate) => (
    candidate.slug !== post.slug
    && !explicit.some((related) => related.slug === candidate.slug)
    && !sameCategoryFallback.some((related) => related.slug === candidate.slug)
  ));

  return [...explicit, ...sameCategoryFallback, ...broadFallback].slice(0, limit);
}

export function hasEnhancedContent(post) {
  return Boolean(
    post?.quickTakeaways?.length
    || post?.comparisonRows?.length
    || post?.exampleScenarios?.length
    || post?.faq?.length,
  );
}
