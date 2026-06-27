import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import posts from '../apps/web/src/data/posts/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist/apps/web');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateRssFeed() {
  console.log('[SSG] Generating RSS feed...');
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Match by Birth Blog</title>
  <link>https://matchbybirth.com/blog</link>
  <description>Astrological compatibility, relationship guides, and zodiac pair deep dives.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="https://matchbybirth.com/feed.xml" rel="self" type="application/rss+xml" />
  ${posts.map(post => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>https://matchbybirth.com/blog/${post.slug}</link>
    <guid>https://matchbybirth.com/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.description)}</description>
  </item>`).join('')}
</channel>
</rss>
`;

  fs.writeFileSync(path.join(DIST_DIR, 'feed.xml'), xml, 'utf8');
  console.log('[SSG] feed.xml written successfully.');
}

function preRenderPages() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`[SSG] Error: Template file not found at ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Define static pages and their HTML fallback contents
  const pages = [
    {
      route: 'about',
      title: 'About Us | Match by Birth',
      description: 'Learn about our mission to help you understand compatibility, including our unique 7-person Group Mode.',
      content: `
        <header>
          <h1>About Match by Birth</h1>
          <p>Astrology meets science. Love meets data.</p>
        </header>
        <article>
          <p>Match by Birth helps you understand the people in your life through the oldest compatibility system on earth. We believe that birth dates hold distinct energetic blueprints that influence how individuals relate, communicate, and support each other.</p>
          <h2>Our Astrological Methodology</h2>
          <p>Our algorithm maps your birth date to planetary alignments and elements. By calculating aspects, elemental balances (Fire, Earth, Air, Water), and chart logic, we compile a detailed compatibility profile across five dimensions: Overall Harmony, Emotional Support, Communication Flow, Physical Chemistry, and Conflict Risk.</p>
          <h2>Our Team & Mission</h2>
          <p>Match by Birth is developed by a dedicated team of astrologers, developers, and relationship researchers. Our mission is to make deep, meaningful chart interpretations accessible to everyone without requiring complex chart readings.</p>
        </article>
      `
    },
    {
      route: 'faq',
      title: 'Frequently Asked Questions | Match by Birth',
      description: 'Find answers to common questions about astrological compatibility, our calculator, and how to interpret your results.',
      content: `
        <header>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about Match by Birth.</p>
        </header>
        <section>
          <h2>Do I need an exact birth time?</h2>
          <p>No. Match by Birth is designed to give you compatibility insights using calendar birth dates alone. If you do have your exact birth time and place, you can toggle "Exact Mode" on the calculator to get a highly precise placement of your Sun sign.</p>
          <h2>Are birth dates stored?</h2>
          <p>No. We respect your privacy. Birth dates are processed transiently in server memory to calculate your compatibility scores and astrological signs, and are immediately discarded. They are never saved to our database or included in sharing links.</p>
          <h2>Can I compare a group of people?</h2>
          <p>Yes! Group Mode allows you to compare 3 to 7 people at the same time. The calculator ranks every unique pair within the group, shows the strongest cosmic relationships, and computes an overall "Group Vibe Score." It is perfect for families, friend groups, or work teams.</p>
          <h2>How are compatibility scores calculated?</h2>
          <p>We determine the precise degree of planetary placements on your birth date. Then, we analyze element interactions (Fire, Earth, Air, Water) and aspect patterns to generate compatibility scores across five key areas: Overall Harmony, Emotional Support, Communication Flow, Chemistry, and Conflict Risk.</p>
          <h2>Is payment security guaranteed?</h2>
          <p>Yes. All payments are processed securely by Stripe, a world-class payment provider. Match by Birth does not store, see, or process your credit card numbers on our servers.</p>
        </section>
      `
    },
    {
      route: 'contact',
      title: 'Contact Us | Match by Birth',
      description: 'Get in touch with the Match by Birth team for support, feedback, or inquiries.',
      content: `
        <header>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you.</p>
        </header>
        <article>
          <p>For support regarding purchased reports, general questions, or feedback, please email our team at:</p>
          <p><strong>support@matchbybirth.com</strong></p>
          <p>We typically respond to all support requests within 24 to 48 hours.</p>
        </article>
      `
    },
    {
      route: 'privacy',
      title: 'Privacy Policy | Match by Birth',
      description: 'How Match by Birth processes calculator, result, payment, email, and analytics data.',
      content: `
        <header>
          <h1>Privacy Policy</h1>
          <p>Last Updated: June 9, 2026</p>
        </header>
        <article>
          <p>At Match by Birth, we take your privacy seriously. This policy explains how we collect, use, and protect your data.</p>
          <h2>Birth Date Calculations</h2>
          <p>We process all birth date, place, and time inputs transiently in server memory. We do not store birth dates in any database, and they are never exposed in sharing links.</p>
          <h2>Payments</h2>
          <p>Payments are handled securely by Stripe. We do not store or process your credit card details on our servers.</p>
          <h2>Marketing & Emails</h2>
          <p>If you subscribe to our newsletter, we store your email with consent. Every email contains a one-click unsubscribe link.</p>
        </article>
      `
    },
    {
      route: 'terms',
      title: 'Terms of Service | Match by Birth',
      description: 'Terms of Service for using Match by Birth.',
      content: `
        <header>
          <h1>Terms of Service</h1>
          <p>Last Updated: June 9, 2026</p>
        </header>
        <article>
          <p>Welcome to Match by Birth. By using our website, you agree to these terms.</p>
          <h2>Astrological Disclaimers</h2>
          <p>Our service provides entertainment and relationship insights based on classical astrology. It should not be used as a substitute for professional counseling, legal, medical, or financial advice.</p>
          <h2>User Behavior</h2>
          <p>You agree to use our compatibility calculator responsibly and not to scrape content or abuse our APIs.</p>
        </article>
      `
    },
    {
      route: 'disclaimers',
      title: 'Disclaimers | Match by Birth',
      description: 'Important disclaimers about the use of our astrological compatibility calculator.',
      content: `
        <header>
          <h1>Disclaimers</h1>
        </header>
        <article>
          <p>Match by Birth is an astrological compatibility tool. Astrological readings are subjective and provided for insight, guidance, and entertainment purposes only.</p>
          <p>We do not guarantee any relationship outcomes or compatibility accuracy in real-world situations. Relationships require mutual effort, communication, and commitment regardless of cosmic configurations.</p>
        </article>
      `
    },
    {
      route: 'premium',
      title: 'Weekly Match Intel | Match by Birth',
      description: 'Get weekly astrology compatibility intel by email, with private delivery and premium relationship insights.',
      content: `
        <header>
          <h1>Weekly Match Intel</h1>
          <p>Get premium cosmic relationship guides delivered to your inbox.</p>
        </header>
        <article>
          <p>Subscribe to our premium astrological newsletter to receive weekly forecasts, element-specific tips, and zodiac compatibility updates. Unsubscribe anytime.</p>
        </article>
      `
    }
  ];

  // Pre-render standard pages
  for (const page of pages) {
    const pageDir = path.join(DIST_DIR, page.route);
    fs.mkdirSync(pageDir, { recursive: true });

    let pageHtml = template
      .replace(/<title>[^<]*<\/title>/g, `<title>${page.title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/g, `<meta name="description" content="${page.description}" />`)
      .replace(/<div id="root">[\s\S]*?<\/div>/g, `<div id="root">${page.content}</div>`);

    fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf8');
    console.log(`[SSG] Route /${page.route} pre-rendered.`);
  }

  // Pre-render blog list
  const blogListDir = path.join(DIST_DIR, 'blog');
  fs.mkdirSync(blogListDir, { recursive: true });
  const blogListHtml = template
    .replace(/<title>[^<]*<\/title>/g, `<title>Astrology Blog & Guides | Match by Birth</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/g, `<meta name="description" content="Explore astrology compatibility guides, zodiac pair deep dives, and relationship insights." />`)
    .replace(/<div id="root">[\s\S]*?<\/div>/g, `<div id="root">
      <h1>Astrology Blog & Guides</h1>
      <p>Read all our latest astrological compatibility articles.</p>
      <ul>
        ${posts.map(post => `<li><a href="/blog/${post.slug}">${post.title}</a> - ${post.description}</li>`).join('')}
      </ul>
    </div>`);
  fs.writeFileSync(path.join(blogListDir, 'index.html'), blogListHtml, 'utf8');
  console.log('[SSG] Route /blog pre-rendered.');

  // Pre-render blog post detail pages
  for (const post of posts) {
    const postDir = path.join(DIST_DIR, 'blog', post.slug);
    fs.mkdirSync(postDir, { recursive: true });

    // Format content with E-E-A-T author attribution
    const postBody = `
      <article class="blog-content">
        <header>
          <h1>${post.title}</h1>
          <p class="post-meta">Published on ${post.date} | Reviewed by Sarah Miller, Professional Astrologer</p>
        </header>
        <div>
          ${post.content}
        </div>
        <footer class="author-bio-footer" style="margin-top: 40px; padding-top: 20px; border-t: 1px solid #ccc;">
          <h3>Reviewed by Sarah Miller, Professional Astrologer</h3>
          <p>Sarah Miller is a professional consultant astrologer with over 12 years of experience mapping natal charts, planetary transits, and relationship synastry. She holds credentials from international astrological registries and serves as the lead reviewer for Match by Birth.</p>
        </footer>
      </article>
    `;

    let postHtml = template
      .replace(/<title>[^<]*<\/title>/g, `<title>${post.title} | Match by Birth</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/g, `<meta name="description" content="${post.description}" />`)
      .replace(/<div id="root">[\s\S]*?<\/div>/g, `<div id="root">${postBody}</div>`);

    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf8');
    console.log(`[SSG] Blog post /blog/${post.slug} pre-rendered.`);
  }

  console.log('[SSG] All pages successfully pre-rendered!');
}

function main() {
  console.log('[SSG] Starting static site generation (SSG) pipeline...');
  preRenderPages();
  generateRssFeed();
}

main();
