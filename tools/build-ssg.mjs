import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import posts from '../apps/web/src/data/posts/index.js';
import { getZodiacPairingPages } from './zodiac-pairings.mjs';
import { prerenderBlogHtml } from '../apps/web/tools/prerender-blog-html.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist/apps/web');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const SITE_URL = 'https://matchbybirth.com';

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

function canonicalUrl(route) {
  const normalizedRoute = route === '/'
    ? '/'
    : `/${String(route || '').replace(/^\/+|\/+$/g, '')}`;
  return normalizedRoute === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedRoute}`;
}

function upsertHeadTag(html, matcher, tag) {
  return matcher.test(html)
    ? html.replace(matcher, tag)
    : html.replace('</head>', `\t\t${tag}\n\t</head>`);
}

function renderRouteHtml(template, {
  route,
  title,
  description,
  content,
  type = 'website',
}) {
  const safeTitle = escapeXml(title);
  const safeDescription = escapeXml(description);
  const safeCanonical = escapeXml(canonicalUrl(route));

  let html = template
    .replace(/<title>[^<]*<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${content}</div>`);

  const tags = [
    [/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${safeDescription}" />`],
    [/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${safeCanonical}" />`],
    [/<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${type}">`],
    [/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${safeTitle}">`],
    [/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${safeDescription}">`],
    [/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${safeCanonical}">`],
    [/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${safeTitle}">`],
    [/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${safeDescription}">`],
  ];

  for (const [matcher, tag] of tags) {
    html = upsertHeadTag(html, matcher, tag);
  }

  return html;
}

function routeFilePath(outputRoot, route) {
  const normalizedRoute = String(route || '').replace(/^\/+|\/+$/g, '');
  return normalizedRoute
    ? path.join(outputRoot, `${normalizedRoute}.html`)
    : path.join(outputRoot, 'index.html');
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
      title: 'About Match by Birth | Compatibility Tool',
      description: 'Learn who Match by Birth is for, what the compatibility calculator does, what it does not claim, and how birth details are handled.',
      content: `
        <header>
          <h1>About Match by Birth</h1>
          <p>A clearer way to talk about compatibility.</p>
        </header>
        <article>
          <p>Match by Birth is a private compatibility tool for people who want a quick, readable way to compare birth patterns. It turns birth details into strengths, watch areas, and conversation prompts you can actually use.</p>
          <h2>Who it is for</h2>
          <p>Match by Birth is for people comparing romantic partners, friendships, families, work relationships, or groups.</p>
          <h2>What the tool does</h2>
          <p>The calculator uses birth date, zodiac sign, life path number, and pair or group context to create a compatibility snapshot. Optional birth time and place can refine sign placement for cusp birthdays.</p>
          <h2>What it does not claim</h2>
          <p>Match by Birth does not predict the future, diagnose relationships, promise outcomes, or decide whether someone is right for you. It is better used as entertainment, reflection, and a conversation starter.</p>
          <h2>How privacy works</h2>
          <p>Birth dates are processed for the calculation and are not used for identity profiling. Shared result links use opaque URLs and do not put raw birth details in the address.</p>
          <h2>Support and feedback</h2>
          <p>Questions, corrections, and support requests can be sent to support@matchbybirth.com.</p>
        </article>
      `
    },
    {
      route: 'how-it-works',
      title: 'How Match by Birth Works | Compatibility Methodology',
      description: 'Learn how Match by Birth uses birth dates, optional birth time and place, zodiac signs, life path numbers, pair mode, and group mode to frame compatibility responsibly.',
      content: `
        <header>
          <p>MBB methodology</p>
          <h1>How Match by Birth works</h1>
          <p>Match by Birth turns birth details into a compatibility snapshot: where a connection may feel easy, where it may catch, and what is worth talking about next. It is a stronger conversation starter, not a prediction system, not a soulmate detector, and not a relationship verdict.</p>
        </header>
        <article>
          <h2>How the reading is assembled</h2>
          <p>MBB first confirms each birth-date pattern: Sun sign, seasonal rhythm, life path number, and basic timing pattern. If time and place are added, Exact Mode can refine signs near a boundary.</p>
          <p>Next, MBB reads the relationship context. A romantic comparison, friendship check, work dynamic, family connection, and group reading are not interpreted the same way.</p>
          <p>Then the system compares strengths and friction: where the patterns naturally support each other and where timing, pace, emotional style, or expectations may need clearer language.</p>
          <p>The final result turns that comparison into one practical next step: a strength to trust, a watch area to name, or a conversation to have earlier.</p>
          <h2>Birth date</h2>
          <p>Date-only results still work. MBB uses each calendar birth date to read Sun sign placement, seasonal rhythm, life path number, and the basic timing pattern between people.</p>
          <h2>Optional time and place</h2>
          <p>Exact Mode is optional. Birth time and selected birth place help when someone was born near a sign boundary, where the same month and day can sometimes point to different signs.</p>
          <h2>Life path number</h2>
          <p>Life path numbers add a second lens for pace, motivation, and default relationship style. They do not replace the birth-date reading; they give the result more texture.</p>
          <h2>Date-only vs. Exact Mode</h2>
          <p>Date-only mode is best for fast readings, most birthdays, and anyone who does not know an exact birth time. Exact Mode is best for cusp birthdays or people who want a more precise Sun sign check.</p>
          <h2>What the score means</h2>
          <p>The score is only the entry point. The interpretation around it explains strengths, watch areas, and the next conversation prompt.</p>
          <h2>What the score is looking at</h2>
          <p>The score looks at natural rhythm, emotional support, communication pace, chemistry and interest, and the watch area most likely to create misunderstanding if nobody names it directly.</p>
          <h2>Example reading</h2>
          <p>Alex and Jordan: 82 overall fit. Strength: strong natural rhythm. Watch area: planning pace. Next step: name the timeline early.</p>
          <p>This does not mean Alex and Jordan are guaranteed to work. It means their birth-date patterns suggest enough overlap for the connection to feel easy quickly, while the useful next conversation is about timing.</p>
          <h2>Pair mode</h2>
          <p>Pair mode focuses on two people and is built for romantic, friendship, work, family, or general connection checks where the goal is to understand what may feel natural, what may need translation, and what to discuss earlier.</p>
          <h2>Group mode</h2>
          <p>Group mode compares every person against every other person, then summarizes the group rhythm. It is useful for friend groups, teams, families, and group trips because one strong or tense pair can change how the whole group feels.</p>
          <h2>Relationship timing</h2>
          <p>Timing notes are written as conversation prompts, not guarantees. The point is not to tell people what will happen. The point is to make the next honest conversation easier to start.</p>
          <h2>Privacy and limits</h2>
          <p>Birth dates are processed for the calculation and are not used for identity profiling. Optional birth time and place help refine sign placement, especially near cusp dates, but date-only readings remain available. Shared result links are opaque and do not expose raw birth details in the URL.</p>
          <p><a href="/#calculator">Try the calculator</a> or <a href="/blog/what-compatibility-score-means">read the score guide</a>.</p>
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
      route: 'refund-policy',
      title: 'Refund Policy | Match by Birth',
      description: 'Refund and support policy for paid Match by Birth compatibility reports.',
      content: `
        <header>
          <p>Paid reports</p>
          <h1>Refund Policy</h1>
          <p>Last updated: July 5, 2026</p>
        </header>
        <article>
          <h2>What you are buying</h2>
          <p>A paid Match by Birth report is a one-time digital compatibility report delivered by private link and email. It expands the free result into strengths, friction points, communication notes, a watch area, and practical conversation prompts.</p>
          <h2>When refunds are available</h2>
          <p>Email support@matchbybirth.com if you paid and did not receive access, received a broken report link, were charged incorrectly, or the report could not be generated.</p>
          <h2>When refunds may not apply</h2>
          <p>Because reports are digital goods delivered after checkout, refunds are not guaranteed simply because a reading is not the answer someone hoped for. Match by Birth is designed for reflection and conversation, not certainty, prediction, or a relationship verdict.</p>
          <h2>How fast support replies</h2>
          <p>We review report and payment support requests as quickly as possible, usually within 1-2 business days. If a technical issue blocked delivery, we will restore access, resend the private link, or help with a refund.</p>
        </article>
      `
    },
    {
      route: 'report-delivery',
      title: 'Report Delivery | Match by Birth',
      description: 'How paid Match by Birth compatibility reports are generated, delivered, and handled privately.',
      content: `
        <header>
          <p>Private paid reports</p>
          <h1>How report delivery works</h1>
          <p>Paid reports are designed to be clear, private, and useful without turning compatibility into a verdict.</p>
        </header>
        <article>
          <h2>What the report includes</h2>
          <p>The paid report expands your free compatibility result into nine sections: strengths, friction, communication, emotional style, stability, growth, practical advice, what to try more of, and what to watch for.</p>
          <h2>How delivery happens</h2>
          <p>After Stripe checkout, Match by Birth prepares the report and sends a private report link to the checkout email. The success page also checks for the report and redirects you when it is ready.</p>
          <h2>What data is used</h2>
          <p>The report uses sanitized compatibility data: display names, signs, elements, scores, relationship type, and the result summary. Birth dates and the checkout email are not sent to the AI provider. Payment details are handled by Stripe.</p>
          <h2>If something goes wrong</h2>
          <p>If the first report attempt fails, delivery is retried automatically. If you paid but cannot access the report, email support@matchbybirth.com with your checkout email and any result link you have.</p>
        </article>
      `
    },
    {
      route: 'premium',
      title: 'Weekly Match Intel | Match by Birth',
      description: 'Get weekly Match by Birth compatibility notes by email, with private delivery, unsubscribe controls, and practical relationship prompts.',
      content: `
        <header>
          <h1>Weekly Match Intel</h1>
          <p>Get practical compatibility notes delivered to your inbox.</p>
        </header>
        <article>
          <p>Subscribe to receive weekly timing notes, relationship prompts, and compatibility guides. This is reflection content, not professional advice. Unsubscribe anytime.</p>
          <p>One-time compatibility reports are delivered by private link and email after Stripe checkout. Birth dates and checkout emails are not sent to the AI provider.</p>
        </article>
      `
    },
    {
      route: 'sample-report',
      title: 'Sample Compatibility Report | Match by Birth',
      description: 'Preview a Match by Birth paid compatibility report before checkout, including strengths, friction, communication, watch area, and one practical conversation prompt.',
      content: `
        <header>
          <p>Sample report</p>
          <h1>Alex & Jordan</h1>
          <p>Preview the kind of private paid report Match by Birth creates from a compatibility result.</p>
        </header>
        <article>
          <h2>See your own private report</h2>
          <p>This sample shows the format. Your full report is built from your actual birth details and gives you a more personal compatibility reading.</p>
          <p><a href="/#calculator">Get your full private report</a></p>
          <h2>Report snapshot</h2>
          <p>Score: 86%. Strongest area: Chemistry. Watch area: Stability. Say this first: "I think chemistry is where this feels easiest, but stability is the part we should name early instead of guessing."</p>
          <h2>Want a report that's actually yours?</h2>
          <p>The sample gives you the feel of the experience. Your private report is based on your real match, with deeper insight and a personalized reading.</p>
          <p><a href="/#calculator">Unlock my full report</a></p>
          <h2>Where you connect</h2>
          <p>This sample shows how a paid report turns a score into readable strengths, friction, communication style, and a practical next conversation.</p>
          <h2>Where it may catch</h2>
          <p>The watch area is not a verdict. It is the part of the connection that may need clearer language before either person starts guessing.</p>
          <h2>Ready to see your real match?</h2>
          <p>Run your own birth match and get the complete private report.</p>
          <p><a href="/#calculator">Get my report</a></p>
        </article>
      `
    },
    {
      route: 'tools/crush-birthday-compatibility',
      title: 'Crush Birthday Compatibility Calculator | Match by Birth',
      description: 'Compare your birthday with your crush birth date. Get a private compatibility score, strengths, watch area, and conversation prompt in seconds.',
      content: `
        <header>
          <p>Private birthday compatibility check</p>
          <h1>Crush Birthday Compatibility</h1>
          <p>Enter your birthday and theirs. See the connection pattern in seconds: where it flows, where it may catch, and what to talk about next.</p>
          <p><a href="/tools/crush-birthday-compatibility#calculator">Open the calculator</a></p>
        </header>
        <article>
          <h2>What this checks</h2>
          <p>Match by Birth compares two birth dates to frame natural rhythm, possible friction, and one useful next conversation prompt. It is designed for quick reflection, not a relationship verdict.</p>
          <h2>Do I need their birth time?</h2>
          <p>No. You can start with names and birth dates only. Birth time and place are optional for people who want a more precise Sun sign check near a sign boundary.</p>
          <h2>Will they know I checked?</h2>
          <p>No. Match by Birth does not notify anyone. You can use the result privately or share it only if you choose to.</p>
          <h2>Is this a relationship verdict?</h2>
          <p>No. The score is a conversation starter. It points to strengths, possible friction, and one useful next step, but it should not replace your own judgment.</p>
          <p>Read <a href="/how-it-works">how Match by Birth works</a> or browse the <a href="/blog">compatibility guides</a>.</p>
        </article>
      `
    },
    {
      route: 'tools/life-path-compatibility',
      title: 'Life Path Number Calculator & Compatibility | Match by Birth',
      description: 'Find your life path number or compare two birth dates. Learn master numbers, life path meanings, compatibility patterns, and what to talk about next.',
      content: `
        <header>
          <p>Birth date numerology calculator</p>
          <h1>Life Path Number Calculator & Compatibility</h1>
          <p>Find your Life Path number from your birth date, then compare two people to see the relationship pattern, watch area, and one practical conversation prompt.</p>
          <p><a href="/tools/life-path-compatibility#calculator">Open the calculator</a></p>
        </header>
        <article>
          <h2>Find your number or compare two people</h2>
          <p>This page works as a life path number calculator for one person and a life path compatibility calculator for two people.</p>
          <h2>What is a life path number?</h2>
          <p>A life path number is a numerology shorthand made from the digits in a birth date. On Match by Birth, it is used as one reflection layer beside zodiac and birthday-based compatibility.</p>
          <h2>How to calculate your life path number</h2>
          <p>Start with the full birth date, add the month, day, and year separately, reduce each part, then add those three results together. Reduce again unless the final number is 11, 22, or 33.</p>
          <p>Example: August 24, 1995 becomes month 8, day 6, and year 6. Together that is 20, then 2 + 0 = 2.</p>
          <h2>Master numbers</h2>
          <p>Most life path numbers reduce to one digit, but 11, 22, and 33 are kept as master numbers when the final calculation lands there.</p>
          <h2>Life path meanings</h2>
          <p>The root numbers describe patterns like independence, emotional attunement, creative expression, structure, freedom, care, depth, focus, and compassion. Master numbers add a stronger layer of sensitivity, responsibility, or devoted care.</p>
          <h2>Compatibility table</h2>
          <p>Some life paths share an easy pace, some create strong but intense chemistry, and some need more translation around freedom, structure, care, or privacy.</p>
          <h2>Responsible use</h2>
          <p>Life path compatibility is a reflection tool, not a relationship verdict. Use it to start a clearer conversation, not to outsource judgment.</p>
          <h2>Related guides</h2>
          <p>Read the <a href="/blog/life-path-number-compatibility-guide">Life Path Number Compatibility Guide</a>, compare <a href="/blog/birth-date-compatibility-vs-zodiac-compatibility">birth date compatibility vs. zodiac compatibility</a>, or learn <a href="/blog/how-to-use-compatibility-results-responsibly">how to use compatibility results responsibly</a>.</p>
          <p>Read <a href="/how-it-works">how Match by Birth works</a> or try the <a href="/tools/crush-birthday-compatibility">crush birthday compatibility calculator</a>.</p>
        </article>
      `
    }
  ];

  // Pre-render standard pages
  for (const page of pages) {
    const pageFile = routeFilePath(DIST_DIR, page.route);
    fs.mkdirSync(path.dirname(pageFile), { recursive: true });

    const pageHtml = renderRouteHtml(template, {
      route: `/${page.route}`,
      title: page.title,
      description: page.description,
      content: page.content,
    });

    fs.writeFileSync(pageFile, pageHtml, 'utf8');
    console.log(`[SSG] Route /${page.route} pre-rendered.`);
  }

  const blogFiles = prerenderBlogHtml({ outputRoot: DIST_DIR, templatePath: TEMPLATE_PATH });
  console.log(`[SSG] Blog HTML pre-rendered with ${blogFiles.length} files.`);

  // Pre-render the 144 zodiac pairings (Programmatic SEO)
  preRenderZodiacPairings(template);

  console.log('[SSG] All pages successfully pre-rendered!');
}

function getElementHarmony(el1, el2) {
  const pair = [el1, el2].sort().join(' + ');
  switch (pair) {
    case 'Fire + Fire': return 'Double Fire pairings are passionate, high-energy, and exciting. Both signs inspire each other to take action, but they must watch out for ego clashes and burnouts.';
    case 'Earth + Fire': return 'Fire and Earth sign combinations balance bold action with practical stability. Earth grounds Fire\'s restless enthusiasm, while Fire provides energy and inspiration to Earth\'s routines.';
    case 'Air + Fire': return 'Fire and Air pairings enjoy strong natural compatibility. Air feeds Fire\'s inspiration, and Fire keeps Air\'s intellectual ideas active and moving forward.';
    case 'Fire + Water': return 'Fire and Water pairings create high emotional chemistry and intensity. However, Fire can feel smothered by Water\'s depth, and Water can feel hurt by Fire\'s direct heat.';
    case 'Earth + Earth': return 'Double Earth pairings value routine, home comfort, and financial security. This is an exceptionally durable, reliable combination, though they should make an effort to welcome variety and adventure.';
    case 'Air + Earth': return 'Earth and Air pairings combine practical execution with intellectual thought. Earth keeps Air\'s ideas grounded in reality, while Air helps Earth see new perspectives.';
    case 'Earth + Water': return 'Earth and Water pairings form one of the most nurturing, fertile combinations in synastry. Earth gives structure and container to Water\'s emotional currents, and Water softens and nourishes Earth\'s analytical drive.';
    case 'Air + Air': return 'Double Air pairings thrive on ideas, conversation, and social variety. They communicate effortlessly and respect each other\'s independence, though they may avoid dealing with deep emotional undercurrents.';
    case 'Air + Water': return 'Air and Water pairings mix rational analysis with deep emotional intuition. This pairing can communicate well, but Air must learn to sit with Water\'s feelings rather than intellectualizing them.';
    case 'Water + Water': return 'Double Water pairings share a psychic, intuitive bond. They understand each other\'s mood shifts without words, creating a cozy and deeply empathetic space, though they must build boundaries to prevent codependency.';
    default: return 'Every elemental matchup brings unique dynamics to love, friendship, and collaboration.';
  }
}

function getQualityHarmony(q1, q2) {
  if (q1 === q2) {
    return `Both partners share a ${q1} modality. This means you share a similar tempo and approach to making decisions—either both initiating changes (Cardinal), both anchoring down stubbornly (Fixed), or both adapting and shifting constantly (Mutable).`;
  }
  return `This pairing combines ${q1} and ${q2} modalities. The ${q1} partner\'s natural pace is balanced by the ${q2} partner\'s approach, creating a dynamic exchange of energy that keeps the relationship from getting stuck.`;
}

function preRenderZodiacPairings(template) {
  console.log('[SSG] Starting programmatic 144 zodiac pairings generator...');
  let count = 0;

  for (const { firstSign: s1, secondSign: s2, slug } of getZodiacPairingPages()) {
    const postFile = routeFilePath(DIST_DIR, `blog/${slug}`);
    fs.mkdirSync(path.dirname(postFile), { recursive: true });

    const title = `${s1.label} and ${s2.label} Compatibility: Love, Friendship & Chemistry`;
    const description = `Are ${s1.label} and ${s2.label} compatible? Read a practical compatibility breakdown of elements, qualities, and relationship dynamics for this pairing.`;

    const postBody = `
        <article class="blog-content">
          <header>
            <span class="category-tag" style="font-size: 10px; font-weight: bold; text-transform: uppercase; tracking-wider; background: #6c4de6/10; color: #6c4de6; padding: 4px 8px; border-radius: 12px;">Zodiac Compatibility Deep Dive</span>
            <h1 style="font-size: 2.25rem; font-weight: 800; color: #1c0e35; margin: 12px 0 6px;">${s1.label} and ${s2.label} Compatibility</h1>
            <p class="post-meta">Published by Match by Birth</p>
          </header>
          <div>
            <p>Are <strong>${s1.label}</strong> and <strong>${s2.label}</strong> compatible in love, friendship, and life? In classical synastry, compatibility is often discussed through elements, planetary rulers, and modality combinations. Below is a practical compatibility breakdown of how this pairing may function.</p>
            
            <h2>1. Elemental Harmony: ${s1.element} meets ${s2.element}</h2>
            <p>${getElementHarmony(s1.element, s2.element)}</p>
            
            <h2>2. Modal Rhythm: ${s1.quality} & ${s2.quality}</h2>
            <p>${getQualityHarmony(s1.quality, s2.quality)}</p>
            
            <h2>3. Ruling Planets: ${s1.planet} & ${s2.planet}</h2>
            <p>This match is influenced by the cosmic conversations between <strong>${s1.planet}</strong> (ruling ${s1.label}) and <strong>${s2.planet}</strong> (ruling ${s2.label}). These planetary forces dictate how the signs assert their desires, resolve conflict, and express affection.</p>

            <div style="margin-top: 40px; padding: 24px; border-radius: 20px; background: #6c4de6; color: #fff; text-align: center; box-shadow: 0 4px 12px rgba(108,77,230,0.15);">
              <h3 style="margin-top: 0; font-size: 1.25rem; font-weight: 700; color: #fff;">Get Your Exact Compatibility Score</h3>
              <p style="font-size: 0.875rem; color: rgba(255,255,255,0.9); margin-bottom: 20px;">Sun signs are just the starting point. To see your true compatibility, you must calculate planetary aspects and exact birth charts.</p>
              <a href="/" style="display: inline-block; padding: 12px 24px; border-radius: 12px; background: #fff; color: #6c4de6; font-weight: 800; text-decoration: none; transition: transform 0.2s;">Run the Calculator →</a>
            </div>
          </div>
        </article>
      `;

    const postHtml = renderRouteHtml(template, {
      route: `/blog/${slug}`,
      title: `${title} | Match by Birth`,
      description,
      content: postBody,
      type: 'article',
    });

    fs.writeFileSync(postFile, postHtml, 'utf8');
    count++;
  }

  console.log(`[SSG] Successfully pre-rendered ${count} programmatic zodiac pairings!`);
}

function main() {
  console.log('[SSG] Starting static site generation (SSG) pipeline...');
  preRenderPages();
  generateRssFeed();
}

main();
