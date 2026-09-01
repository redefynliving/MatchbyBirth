import { lifePathMeanings } from './lifePath.js';
const masterNumbers = new Set([11, 22, 33]);

export function generateLifePathBlogPost(lifePath) {
  const profile = lifePathMeanings[lifePath];
  if (!profile) throw new Error(`No profile for LP ${lifePath}`);

  const isMaster = masterNumbers.has(lifePath);
  const numberName = getNumberName(lifePath);
  const slug = `life-path-${lifePath}`;
  const title = `Life Path Number ${lifePath}: ${numberName} Meaning & Compatibility`;
  const description = `${profile.core || profile.theme}. Discover strengths, shadow, career, love, and spiritual path.`;

  const content = `
<h2>At a Glance: Life Path Number ${lifePath}</h2>
<p><strong>Core archetype:</strong> ${profile.core || `${profile.theme} — ${profile.strength}`}</p>
<p><strong>Gift:</strong> ${profile.gift || profile.strength}</p>

<h2>Your Developmental Journey: ${profile.framework?.name || getFrameworkName(lifePath)}</h2>
<p>Every Life Path number moves through distinct developmental stages. These aren't rigid phases but recurring movements that deepen with time:</p>
${profile.framework?.stages.map((s, i) => `
<div class="stage-block">
  <h3>${i + 1}. ${s.label}</h3>
  <p>${s.desc}</p>
</div>
`).join('')}

<h2>Strengths: The Gifts You Bring</h2>
<p>Life Path ${lifePath} expresses its power through these core strengths:</p>
<ul>
${profile.strengths.map(s => `<li>${s}</li>`).join('')}
</ul>

<h2>Shadow Side: Where You Get Stuck</h2>
<p>Every gift has a shadow face. Watch for these patterns:</p>
<ul>
${profile.shadow.map(s => `<li>${s}</li>`).join('')}
</ul>

<h2>Life Stages: How This Number Evolves</h2>
${profile.lifeStages ? `
<div class="life-stages">
  <div class="stage"><h3>Early Years</h3><p>${profile.lifeStages.early}</p></div>
  <div class="stage"><h3>Middle Years</h3><p>${profile.lifeStages.middle}</p></div>
  <div class="stage"><h3>Later Years</h3><p>${profile.lifeStages.later}</p></div>
</div>` : '<p>Your path unfolds in its own timing, shaped by choices and circumstances.</p>'}

<h2>Love & Relationships</h2>
<p>The core intimacy challenge for Life Path ${lifePath} is: <strong>${profile.loveChallenge || profile.watch}</strong></p>
<p>${getRelationshipNarrative(lifePath)}</p>

<h2>Compatibility Matrix</h2>
<p>No pairing guarantees ease or difficulty — your whole chart matters. But these dynamics are recognizable:</p>
<table class="compatibility-table">
  <thead><tr><th>Life Path ${lifePath} with</th><th>Dynamic</th></tr></thead>
  <tbody>
${Object.entries(profile.compatibility).map(([num, desc]) => `
    <tr><td><strong>${num === String(lifePath) ? lifePath + ' (mirror)' : num}</strong></td><td>${desc}</td></tr>
`).join('')}
  </tbody>
</table>

<h2>Career Guidance</h2>
${profile.careerClusters.map(cluster => `
<div class="career-cluster">
  <h3>${cluster.title}</h3>
  <p><strong>Why it fits:</strong> ${cluster.why}</p>
  <p><strong>Typical roles:</strong> ${cluster.roles.join(', ')}</p>
</div>
`).join('')}

<h2>Money & Wealth</h2>
<p>${profile.moneyPattern}</p>

<h2>Wellbeing & Health</h2>
<p>${profile.wellbeing}</p>

<h2>Spiritual Meaning</h2>
<p>${profile.spiritualMeaning}</p>

<h2>What Pop Numerology Gets Wrong</h2>
<p>${getMythsNarrative(lifePath)}</p>

<h2>Tonight's Action</h2>
<p>${profile.action}</p>
`;

  const faqs = [
    { question: `What does Life Path Number ${lifePath} mean?`, answer: `${profile.core || profile.theme}. This reveals your fundamental life purpose.` },
    { question: `Is Life Path ${lifePath} compatible with my partner?`, answer: getCompatibilityAnswer(lifePath, profile) },
    { question: `What is the spiritual meaning of Life Path ${lifePath}?`, answer: `${profile.spiritualMeaning}` },
  ];

  return {
    slug,
    title,
    description,
    content,
    faqs,
    tags: [`life-path-${lifePath}`, 'numerology', 'compatibility', 'spiritual-meaning'],
  };
}

const numberNames = {
  1: 'The Independent', 2: 'The Diplomat', 3: 'The Creative', 4: 'The Builder',
  5: 'The Explorer', 6: 'The Caregiver', 7: 'The Seeker', 8: 'The Leader',
  9: 'The Humanitarian', 11: 'The Visionary', 22: 'The Master Builder', 33: 'The Master Teacher',
};
function getNumberName(n) { return numberNames[n] || ''; }
function getFrameworkName(n) { return ['Ignition Ascent','Attunement Bridge','The Third Point','Foundation Test','Contact Spiral','Solitude Threshold','Stewardship Test','Completion Cycle','Awakening Spiral','Awakening Spiral','Manifestation Arc','The Healing Circle'][n-1] || 'Life Path Journey'; }

function getRelationshipNarrative(n) {
  const narratives = {
    1: 'Leads with confidence and initiative, but must learn to invite rather than declare. Partnership multiplies strength, it does not divide it.',
    2: 'Thrives on emotional attunement and mutual support. Must speak needs directly rather than absorbing tension silently.',
    3: 'Warm, expressive, and responsive to shared joy. Risk is filling silence with performance rather than presence.',
    4: 'Shows care through reliability and practical devotion. Must allow flexibility when plans shift.',
    5: 'Needs freedom that still makes trust feel steady. The dance is between independence and intimacy.',
    6: 'Cares deeply and wants to nurture. Danger is over-functioning and taking responsibility for others happiness.',
    7: 'Brings depth, loyalty, and thoughtful attention. Must share feelings before they are fully understood.',
    8: 'Wants to lead and provide. Must learn power becomes sacred when it opens way for life beyond self.',
    9: 'Moves with expansive compassion. Challenge is setting boundaries so giving doesn not become self-abandonment.',
  };
  return narratives[n] || 'Every relationship asks this number to grow in love, balancing gifts with intimacy vulnerability.';
}

function getMythsNarrative(n) {
  const myths = {
    1: `Pop numerology reduces LP 1 to "bossy" or "lonely alpha." But the 1 who leads from service, who takes initiative to lift others, embodies the highest expression.`,
    2: `The "people-pleaser" misses the mature 2 who sets firm boundaries in service of harmony.`,
    3: `Not just "life of the party." The 3 who writes a novel or heals through art channels the same energy — expression that serves.`,
    4: `The "boring" 4 erases the 4 who breaks ground through consistency. Structure is not rigidity when it serves something meaningful.`,
    5: `The "commitment-phobe" misses the 5 who commits fiercely to aligned causes and people.`,
    6: `The 6 is not always "martyr" — many are fierce advocates who set boundaries to protect energy for true needs.`,
    7: `The "lonely seeker" misses the 7 who builds chosen family and finds solitude to become more present.`,
    8: `The "power-hungry" 8 erases the 8 who uses authority to open gates for others.`,
    9: `The "eternal victim" misses the 9 who forgives from strength, not weakness. Mercy is a superpower.`,
  };
  return myths[n] || `The simplified version misses the depth. Pop numerology trades nuance for catchphrases.`;
}

function getCompatibilityAnswer(lifePath, profile) {
  const entries = Object.entries(profile.compatibility || {});
  const match = entries.find(([num]) => num !== String(lifePath));
  const partnerName = numberNames[match ? parseInt(match[0]) : 2] || 'complementary numbers';
  return `Life Path ${lifePath} connects most naturally with ${partnerName}. Your ${profile.strength} pairs with their complementary energy. But whole-chart compatibility matters more than any single number.`;
}
