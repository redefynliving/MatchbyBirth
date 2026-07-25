// Editorial engine: free-LLM draft (OpenAI-compatible) + original template
// fallback. Reuses the project's existing slop gate (content-quality.mjs).
import { analyzeDraftQuality } from '../studio-matchbybirth/tools/content-quality.mjs';

function slugify(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96);
}

function internalLink() {
  // Rotate among real site anchors so every post links inward.
  const targets = [
    '[Try the calculator](https://matchbybirth.com/)',
    '[Check your compatibility](https://matchbybirth.com/)',
    '[Life path compatibility tool](https://matchbybirth.com/tools/life-path-compatibility)',
    '[Moon sign compatibility](https://matchbybirth.com/tools/moon-sign-compatibility)',
    '[How compatibility results work](https://matchbybirth.com/how-it-works)',
  ];
  return targets[Math.floor(Math.random() * targets.length)];
}

function templatePost(topic) {
  const kw = topic.keyword;
  const angle = topic.angle;
  const fact = topic.fact || '';
  const title = (topic.title || `${kw}: ${angle[0].toUpperCase() + angle.slice(1)}`).slice(0, 90);
  const meta = `${(`${kw}: ${angle}. ${fact ? fact + ' ' : ''}A practical, no-jargon read`).trim().slice(0, 157)}`;
  const body = `## The short version
${kw} matters because ${angle}. It is a lens for noticing what is already happening between people — not a verdict, and not a scoreboard. ${fact} Most friction that people blame on compatibility is really just two people running on different clocks: one processes out loud, the other needs to sit with it; one wants the plan named now, the other wants to feel safe first. When ${kw.toLowerCase()} is in play, those differences get louder, and louder differences get misread as distance. The useful move is to name the pattern early instead of overwriting it with assumption.

## What actually shifts when this is active
The change shows up in *how people talk and decide*, not in whether they care. A transit or a number does not end a bond; silence about the shift is what quietly erodes one. Imagine a group where one person reads the change as distance and another as normal recharge. The fix is not a grand romantic gesture — it is a small shared rule like "we reconnect after dinner, no phones." Structure beats guessing. The bond does not need more love; it needs one agreed habit that removes the ambiguity and lets both people relax.

## Two examples that show the pattern
Now picture a workspace where the loudest voice is read as the only one who cares. Naming the pattern — "I go quiet when I'm processing, not when I've checked out" — turns a recurring loop into a joke everyone understands, and jokes defuse more than lectures. Or watch a group chat when energy spikes: the planner wants the date locked, the skeptic wants to wait, the cheerleader wants everyone together now. Same pattern, different room. "We're in a timing crunch, let's just pick Friday" is the whole skill, and it works because it names the clock instead of the person.

## What ${kw} is not
It is not a prediction, and not a ranking of who is "better" at relationships. It describes a tendency, not a destiny. People change their patterns on purpose all the time; the forecast cannot see the conversation you had last night. Treat it as a map of common friction, not a sentence. The useful move is to ask a better question, then let the answer come from the actual person in front of you rather than from a calendar. Attention shapes perception, so point it at the quiet okay moments, not only the loud ones.

## The one habit that helps most
Pick one low-effort ritual — a Sunday reset, a post-argument reset, a two-minute "how are we" text — and protect it. The lens explains the weather; the ritual is the umbrella. People overestimate insights and underestimate small repeatable structures, which is why one dependable habit does more for a bond than any forecast. When ${kw.toLowerCase()} trends, it is tempting to read every off day as a sign. It usually isn't. A relationship has a thousand quiet okay moments for every loud one, and the forecast only names the loud ones.

## How to use this without overthinking it
Use the lens to start a conversation, then check the real thing. ${internalLink()} weighs full birth charts — Sun, Moon, Venus, and the aspects between them — not just one placement or one transit. That is where a specific percentage and the specific friction points actually live, and where you can see whether a pattern is a real mismatch or just a timing effect. Keep the calculator as the second step, not the first: talk first, confirm second, and let the number add detail instead of pressure.

## A practical way to start tonight
You do not need a special moment to use this. Pick the one relationship or group that has felt slightly off, and name one pattern out loud using this lens — not as a complaint, but as a description. "I think we've been on different clocks this week" lands differently than "you've been distant." The first opens a conversation; the second closes one. That single habit, repeated, is most of what people mean when they say a bond "communicates well."

## Related reading
- [Aries and Scorpio compatibility](https://matchbybirth.com/blog/aries-scorpio-compatibility)
- [Most compatible zodiac signs of 2026](https://matchbybirth.com/blog/most-compatible-zodiac-signs-2026)
- [Try the Match by Birth calculator](https://matchbybirth.com/)`;
  const faq = [
    { q: `What is ${kw}?`, a: `${kw} describes ${angle}. It is a timing or pattern lens, not a fixed verdict.` },
    { q: `Should I make decisions based on this?`, a: `No. Match by Birth content is for reflection and conversation, not relationship, medical, financial, or legal decisions.` },
  ];
  const takeaways = [
    `${kw}: ${angle}.`,
    'Notice the shift in how people talk, not whether they care.',
    'Name it early; small structure beats guessing.',
    'Check the real charts for the exact score.',
  ];
  return {
    slug: slugify(topic.slug || topic.title),
    title,
    metaTitle: title.slice(0, 60),
    metaDescription: meta,
    excerpt: meta.length > 220 ? meta.slice(0, 217) + '...' : meta,
    categoryRef: undefined,
    topic: topic.category,
    aiGenerated: true,
    rawBody: body,
    faq,
    quickTakeaways: takeaways,
    calculatorCta: true,
  };
}

async function callLLM(systemPrompt, userPrompt) {
  const url = process.env.LLM_API_URL;
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';
  if (!url || !key) return null;
  const res = await fetch(`${url.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: 0.7 }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

function extractMarkdown(text) {
  if (!text) return '';
  const m = text.match(/```(?:markdown)?\n([\s\S]*?)```/);
  return (m ? m[1] : text).trim();
}

async function llmPost(topic, prevErrors) {
  const system = `You write original Match by Birth guides (astrology, numerology, compatibility, groups). Voice: specific, grounded, no fluff. OPEN with a specific claim or scene — never "when it comes to astrology" or "in today's world". Use 3-5 ## section headings. Include at least one concrete example/scenario. Include at least one internal link written as [text](https://matchbybirth.com). 700-950 words of body. NEVER copy from any source — write 100% original phrasing. Entertainment only: no medical, financial, or legal advice. Return ONLY markdown, no code fences.`;
  let user = `Write a blog post.\nKeyword/topic: ${topic.keyword}\nAngle: ${topic.angle}\n${topic.fact ? `Verified fact to include: ${topic.fact}` : ''}\nCategory context: ${topic.category}\nTitle suggestion: ${topic.title || ''}`;
  if (prevErrors && prevErrors.length) user += `\n\nFix these from the previous draft: ${prevErrors.join('; ')}`;
  const raw = extractMarkdown(await callLLM(system, user));
  if (!raw) return null;
  const meta = `${(`${topic.keyword}: ${topic.angle}. ${topic.fact ? topic.fact + ' ' : ''}A practical, no-jargon read`).trim().slice(0, 157)}`;
  const faq = [
    { q: `What is ${topic.keyword}?`, a: `${topic.keyword} describes ${topic.angle}. It is a lens, not a verdict.` },
    { q: `Should I make decisions based on this?`, a: `No. Match by Birth content is for reflection and conversation, not relationship, medical, financial, or legal decisions.` },
  ];
  return {
    slug: slugify(topic.slug || topic.title),
    title: topic.title || `${topic.keyword}: ${topic.angle[0].toUpperCase() + topic.angle.slice(1)}`,
    metaTitle: (topic.title || topic.keyword).slice(0, 60),
    metaDescription: meta,
    excerpt: meta.length > 220 ? meta.slice(0, 217) + '...' : meta,
    categoryRef: undefined,
    topic: topic.category,
    aiGenerated: true,
    rawBody: raw,
    faq,
    quickTakeaways: [],
    calculatorCta: true,
  };
}

export async function draftPost(topic) {
  let post = null;
  if (process.env.LLM_API_URL && process.env.LLM_API_KEY) {
    try {
      post = await llmPost(topic, null);
      if (post) {
        const q = analyzeDraftQuality(post);
        if (!q.ok) {
          const retry = await llmPost(topic, q.errors);
          if (retry) { const q2 = analyzeDraftQuality(retry); if (q2.ok) post = retry; }
        }
      }
    } catch (e) {
      console.warn(`[editorial] LLM failed (${e.message}); using template.`);
      post = null;
    }
  }
  if (!post || !analyzeDraftQuality(post).ok) post = templatePost(topic);
  return post;
}
