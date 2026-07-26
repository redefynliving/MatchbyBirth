const GENERIC_PHRASES = [
  /\bwhen it comes to\b/i,
  /\bit'?s important to note\b/i,
  /\bin today'?s (fast[- ]paced )?world\b/i,
  /\bwhether you'?re\b/i,
  /\blet'?s dive in\b/i,
  /\bdelve into\b/i,
  /\bunlock the secrets\b/i,
  /\bjourney of self[- ]discovery\b/i,
  /\bat the end of the day\b/i,
  /\bcommunication is key\b/i,
  /\bopen communication\b/i,
  /\bmeaningful connection\b/i,
  /\bdeep dive\b/i,
  /\bcosmic blueprint\b/i,
  /\bultimate guide\b/i,
]

const WEAK_INTRO_PATTERNS = [
  /^\s*(compatibility|astrology|numerology|relationships)\s+(is|can be|has long been)\b/i,
  /^\s*in today'?s\b/i,
  /^\s*when it comes to\b/i,
  /^\s*have you ever wondered\b/i,
  /^\s*whether you'?re\b/i,
]

const INTERNAL_LINK_PATTERNS = [
  /https:\/\/matchbybirth\.com\//i,
  /\]\(\/(?:blog|tools|how-it-works|about|faq|#calculator)/i,
  /\bhref=["']\/(?:blog|tools|how-it-works|about|faq|#calculator)/i,
  /\/blog\/[a-z0-9-]+/i,
  /\/tools\/[a-z0-9-]+/i,
  /\/how-it-works\b/i,
  /\/#calculator\b/i,
]

function stripMarkup(value) {
  return String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, ' $1 ')
    .replace(/[#*_>`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function wordCount(value) {
  const text = stripMarkup(value)
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

function getBody(input) {
  if (typeof input.rawBody === 'string' && input.rawBody.trim()) return input.rawBody
  if (typeof input.body === 'string' && input.body.trim()) return input.body
  return ''
}

function firstParagraph(body) {
  return String(body || '')
    .split(/\n\s*\n/)
    .map((part) => stripMarkup(part))
    .find(Boolean) || ''
}

function getHeadings(body) {
  const markdown = [...String(body || '').matchAll(/^\s{0,3}#{2,3}\s+(.+)$/gm)]
    .map((match) => stripMarkup(match[1]).toLowerCase())

  const html = [...String(body || '').matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
    .map((match) => stripMarkup(match[1]).toLowerCase())

  return [...markdown, ...html]
}

function getSections(body) {
  const source = String(body || '')
  if (!/^\s{0,3}#{2,3}\s+/m.test(source)) return []
  return source
    .split(/^\s{0,3}#{2,3}\s+.+$/m)
    .slice(1)
    .map((section) => section.trim())
    .filter(Boolean)
}

function repeatedParagraphStarts(body) {
  const starts = new Map()
  String(body || '')
    .split(/\n\s*\n/)
    .map(stripMarkup)
    .filter((paragraph) => wordCount(paragraph) >= 20)
    .forEach((paragraph) => {
      const start = paragraph.split(/\s+/).slice(0, 4).join(' ').toLowerCase()
      starts.set(start, (starts.get(start) || 0) + 1)
    })

  return [...starts.entries()]
    .filter(([, count]) => count > 1)
    .map(([start]) => start)
}

function hasExample(body) {
  return /\b(for example|example:|simple example|imagine|if one person|if someone|a pairing like|scenario)\b/i.test(body)
}

function hasInternalLink(body) {
  return INTERNAL_LINK_PATTERNS.some((pattern) => pattern.test(body));
}

// Lightweight similarity: shared 4-word shingles between the new draft and any
// already-published post. Near-duplicate pages (e.g. the life-path-N series
// all saying the same thing) get flagged so Google doesn't see a site full of
// repetitive AI pages. Returns the max overlap ratio found.
const SHINGLE_SIZE = 4;
function shingles(text) {
  const words = stripMarkup(text).toLowerCase().split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + SHINGLE_SIZE <= words.length; i++) {
    set.add(words.slice(i, i + SHINGLE_SIZE).join(' '));
  }
  return set;
}

export function maxSimilarityToCorpus(input, corpusBodies = []) {
  if (!corpusBodies.length) return 0;
  const body = getBody(input);
  if (!body) return 0;
  const a = shingles(body);
  if (!a.size) return 0;
  let worst = 0;
  for (const other of corpusBodies) {
    const b = shingles(other);
    if (!b.size) continue;
    let shared = 0;
    for (const shingle of a) if (b.has(shingle)) shared++;
    const ratio = shared / Math.min(a.size, b.size);
    if (ratio > worst) worst = ratio;
  }
  return worst;
}

function countGenericPhrases(body) {
  return GENERIC_PHRASES
    .filter((pattern) => pattern.test(body))
    .map((pattern) => pattern.source)
}

export function analyzeDraftQuality(input, options = {}) {
  const minWords = options.minWords || 650
  const body = getBody(input)
  const textWords = wordCount(body)
  const intro = firstParagraph(body)
  const headings = getHeadings(body)
  const duplicateHeadings = headings.filter((heading, index) => headings.indexOf(heading) !== index)
  const sections = getSections(body)
  const thinSections = sections.filter((section) => wordCount(section) < 80).length
  const genericMatches = countGenericPhrases(body)
  const paragraphRepeats = repeatedParagraphStarts(body)
  const errors = []
  const warnings = []
  const flags = []

  if (!input?.title || stripMarkup(input.title).length < 8) errors.push('Title is missing or too short.')
  if (stripMarkup(input?.title).length > 90) errors.push('Title must stay under 90 characters.')
  if (stripMarkup(input?.metaTitle || input?.title).length > 60) errors.push('Meta title must stay under 60 characters.')

  const metaDescriptionLength = stripMarkup(input?.metaDescription).length
  if (metaDescriptionLength < 80 || metaDescriptionLength > 160) {
    errors.push('Meta description must be 80-160 characters.')
  }

  const excerptLength = stripMarkup(input?.excerpt).length
  if (excerptLength < 80 || excerptLength > 220) {
    errors.push('Excerpt must be 80-220 characters.')
  }

  if (textWords < minWords) errors.push(`Body is too short. Minimum is ${minWords} words.`)
  if (!hasInternalLink(body)) errors.push('Body needs at least one Match by Birth internal link.')
  if (!hasExample(body)) errors.push('Body needs at least one concrete example or scenario.')

  if (WEAK_INTRO_PATTERNS.some((pattern) => pattern.test(intro))) {
    errors.push('Intro starts too generic. Open with a specific claim, scene, or tension.')
  }

  if (genericMatches.length >= 3) {
    errors.push('Body has too many generic AI-style phrases.')
  } else if (genericMatches.length > 0) {
    warnings.push('Body contains generic phrases to rewrite.')
  }

  if (duplicateHeadings.length > 0) errors.push(`Duplicate headings found: ${[...new Set(duplicateHeadings)].join(', ')}.`)
  if (thinSections > 2) errors.push('Too many sections are thin. Expand or combine them.')
  if (thinSections > 0 && thinSections <= 2) warnings.push('Some sections are thin.')
  if (paragraphRepeats.length > 0) warnings.push('Repeated paragraph openings make the post feel templated.')
  if (headings.length > 0 && headings.length < 3) warnings.push('Article has very few sections for a guide-style post.')

  for (const message of [...errors, ...warnings]) {
    flags.push(message)
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    flags,
    metrics: {
      wordCount: textWords,
      headingCount: headings.length,
      thinSections,
      genericPhraseCount: genericMatches.length,
      repeatedParagraphStarts: paragraphRepeats.length,
      metaDescriptionLength,
      excerptLength,
    },
  }
}

export function assertDraftQuality(input, options = {}) {
  const result = analyzeDraftQuality(input, options)
  if (!result.ok) {
    const error = new Error(`Draft failed quality checks:\n- ${result.errors.join('\n- ')}`)
    error.result = result
    throw error
  }
  return result
}
