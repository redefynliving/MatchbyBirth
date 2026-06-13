#!/usr/bin/env python3
"""
Generate compatibility deep-dive posts and merge into index.js
"""

import re

EXISTING_FILE = "/Users/alijahfox/MatchbyBirth/apps/web/src/data/posts/index.js"

with open(EXISTING_FILE, "r") as f:
    content = f.read()

existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", content))
print(f"Existing posts: {len(existing_slugs)}")

# New deep-dive posts to add
NEW_POSTS = """

  // ===== DEEP DIVE: SCORPIO x CAPRICORN =====
  {
    slug: 'scorpio-capricorn-compatibility',
    title: 'Scorpio and Capricorn Compatibility — The Power Duo That Builds Empires',
    date: '2026-06-29',
    description: 'Scorpio and Capricorn are both ambitious, disciplined, and intensely loyal. Discover how this power duo creates one of the zodiac\'s most formidable partnerships.',
    tags: ['scorpio','capricorn','compatibility','power-couple','ambition'],
    content: \`
      <h1>Scorpio and Capricorn Compatibility — The Power Duo That Builds Empires</h1>
      <p>Scorpio and Capricorn are two of the zodiac's most formidable signs. Both are ruled by Saturn (Capricorn directly, Scorpio traditionally), both value discipline and long-term planning, and both understand that real power is built slowly and quietly. When these two come together, they create a partnership that can weather almost anything.</p>

      <h2>Why this pairing works</h2>
      <p>At the core, Scorpio and Capricorn share a fundamental understanding: nothing worth having comes easily. Both signs are willing to work harder, wait longer, and dig deeper than anyone else. Scorpio brings emotional intensity, strategic thinking, and an almost psychic ability to read people. Capricorn brings structure, patience, and the ability to navigate social and professional hierarchies with grace.</p>
      <p>Neither sign is interested in superficiality. Scorpio wants emotional truth; Capricorn wants tangible results. Together, they create a partnership that's both deeply felt and practically effective.</p>

      <h2>Love and romance</h2>
      <p>Romance between Scorpio and Capricorn is intense but private. They're not the couple making grand public gestures — they're the couple building something real behind closed doors. Scorpio brings passion, loyalty, and emotional depth. Capricorn brings stability, reliability, and a quiet, steady devotion that deepens over time.</p>
      <p>Both signs are slow to trust but fiercely loyal once trust is established. Neither is prone to casual flings — when they commit, they mean it. The relationship may start slowly, but it grows stronger with time, like a fine wine or a well-built house.</p>

      <h2>Communication style</h2>
      <p>Both signs are reserved and private, which creates a comfortable silence between them. They don't need constant conversation to feel connected. When they do communicate, it's direct and purposeful. Scorpio speaks in emotional truths; Capricorn speaks in practical realities. Both appreciate the other's honesty.</p>
      <p>The main communication challenge: Scorpio's emotional intensity can feel overwhelming to Capricorn, who prefers to process feelings privately. Capricorn's emotional reserve can feel like rejection to Scorpio. The key is for Scorpio to give Capricorn space, and for Capricorn to verbalize affection more often.</p>

      <h2>Work and ambition</h2>
      <p>This is where the pairing truly shines. Scorpio and Capricorn together are an unstoppable professional team. Scorpio handles strategy, research, and behind-the-scenes maneuvering. Capricorn handles public-facing leadership, long-term planning, and institutional navigation.</p>
      <p>They share a work ethic that most signs can't match. Both are willing to sacrifice short-term pleasure for long-term gain. Both understand that real success requires patience, discipline, and the ability to keep secrets. In business, this combination is formidable.</p>

      <h2>Challenges to watch</h2>
      <p>The main risk is emotional distance. Both signs are reserved and can struggle to express vulnerability. The relationship can become all work and no play if they're not intentional about intimacy. Scorpio needs emotional catharsis; Capricorn needs to feel safe enough to let their guard down.</p>
      <p>Control struggles can also surface. Both signs want to be in charge, and neither likes to submit. Establishing clear roles and mutual respect for each other's domains prevents power struggles.</p>

      <h2>How to make it work</h2>
      <ul>
        <li>Schedule intentional intimacy time — don't let work consume everything.</li>
        <li>Practice verbal affection — both signs need to hear "I love you" more than they admit.</li>
        <li>Respect each other's need for privacy — don't push for emotional disclosure before the other is ready.</li>
        <li>Celebrate wins together — both signs work hard; make sure you enjoy the results.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Loyalty, ambition, mutual respect, shared values.<br>Challenges: Emotional reserve, control struggles, work-life imbalance.<br>Overall: 8/10 — A power couple that builds something lasting.</p>

      <p>Want to see how your Scorpio-Capricorn pairing scores with exact birth data? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: ARIES x LEO =====
  {
    slug: 'aries-leo-compatibility',
    title: 'Aries and Leo Compatibility — The Fire That Lights Up the Room',
    date: '2026-06-30',
    description: 'Aries and Leo are two fire signs that create an electrifying, passionate, and dramatic romance. Learn how this power couple thrives — and where the sparks can fly.',
    tags: ['aries','leo','compatibility','fire-signs','power-couple'],
    content: \`
      <h1>Aries and Leo Compatibility — The Fire That Lights Up the Room</h1>
      <p>Aries and Leo — two fire signs that together create a blaze of passion, creativity, and sheer life force. Ruled by Mars and the Sun respectively, this pairing is bold, generous, and impossible to ignore. When these two come together, the room lights up.</p>

      <h2>The instant attraction</h2>
      <p>Aries and Leo are drawn to each other like moths to a flame — and they don't mind getting burned. Aries admires Leo's confidence, warmth, and regal presence. Leo admires Aries' courage, directness, and raw energy. Both are attracted to strength, and both recognize a kindred spirit immediately.</p>
      <p>The chemistry is physical, mental, and emotional. They share a love of excitement, a hatred of boredom, and an infectious enthusiasm for life. First dates are adventures. First kisses are electric. This is a pairing that starts fast and burns bright.</p>

      <h2>Love and romance</h2>
      <p>Romance between Aries and Leo is grand, generous, and unapologetically dramatic. Both signs love grand gestures — surprise trips, expensive gifts, public declarations of love. They're not subtle, and they don't want to be. This is a couple that wants the world to know they're together.</p>
      <p>Both are generous lovers who put their partner's pleasure first. The physical chemistry is intense and sustained — this is not a pairing that fizzles out quickly. Both signs are passionate, loyal (once committed), and willing to fight for the relationship.</p>

      <h2>The ego factor</h2>
      <p>Let's be honest: both Aries and Leo have big egos. Both want to be the leader, the star, the one in charge. This is the pairing's biggest challenge. Arguments can be spectacular — loud, dramatic, and sometimes public. Neither sign backs down easily.</p>
      <p>The solution isn't for one to submit — it's for both to take turns. Aries can lead in action; Leo can lead in vision. When both feel respected and admired, the ego clashes dissolve into mutual admiration.</p>

      <h2>Communication style</h2>
      <p>Both signs are direct, honest, and sometimes blunt. They say what they mean and mean what they say. This creates a refreshing lack of game-playing — you always know where you stand with an Aries-Leo couple. Arguments are resolved quickly because neither sign holds grudges for long.</p>
      <p>The challenge: both signs can be impatient and interrupt each other. Learning to listen — really listen — prevents small disagreements from becoming big fights.</p>

      <h2>Friendship and fun</h2>
      <p>This is where the pairing truly excels. Aries and Leo are the couple that's always planning the next adventure, hosting the best parties, and making everyone around them laugh. They share a love of sports, games, travel, and anything that gets the adrenaline pumping.</p>
      <p>As friends, they're loyal and protective. As romantic partners, they're each other's biggest cheerleaders. Both signs genuinely want the other to succeed and shine.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Ego clashes — both need to feel like the star. Take turns.</li>
        <li>Impatience — both want things now. Practice delayed gratification.</li>
        <li>Financial impulsiveness — both love spending. Create a budget together.</li>
        <li>Stubbornness — neither likes to admit they're wrong. Learn to apologize.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Passion, loyalty, generosity, fun.<br>Challenges: Ego clashes, impulsiveness, stubbornness.<br>Overall: 8/10 — A fiery, exciting partnership that lights up every room.</p>

      <p>Curious how your Aries-Leo pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: CANCER x SCORPIO =====
  {
    slug: 'cancer-scorpio-compatibility',
    title: 'Cancer and Scorpio Compatibility — The Emotional Fortress',
    date: '2026-07-01',
    description: 'Cancer and Scorpio are two water signs that create one of the zodiac\'s most deeply bonded, almost psychic connections. Discover why this pairing is so powerful.',
    tags: ['cancer','scorpio','compatibility','water-signs','emotional'],
    content: \`
      <h1>Cancer and Scorpio Compatibility — The Emotional Fortress</h1>
      <p>Cancer and Scorpio — two water signs that together create an emotional bond so deep it borders on the psychic. Ruled by the Moon and Pluto respectively, this pairing operates on a frequency that most other signs can't even detect. When these two connect, it's not just romance — it's a merging of souls.</p>

      <h2>The almost psychic connection</h2>
      <p>Cancer and Scorpio don't need words to understand each other. They communicate through glances, silences, and an intuitive knowing that defies explanation. Cancer senses Scorpio's emotional shifts before Scorpio voices them. Scorpio perceives Cancer's unspoken needs before Cancer articulates them.</p>
      <p>This isn't just emotional intelligence — it's something deeper. Both signs are naturally psychic, intuitive, and attuned to the undercurrents of human interaction. Together, they create a private emotional world that's rich, complex, and completely their own.</p>

      <h2>Love and romance</h2>
      <p>Romance between Cancer and Scorpio is intense, all-consuming, and deeply private. This is not a couple that shares their relationship with the world — they create a sacred space that belongs only to them. Cancer brings nurturing, tenderness, and the ability to make a house feel like a home. Scorpio brings passion, loyalty, and an almost fierce protectiveness.</p>
      <p>Both signs are looking for total commitment — not casual dating, not half-measures. When Cancer and Scorpio commit, they're all in. The bond deepens over time, becoming stronger and more unbreakable with each passing year.</p>

      <h2>Emotional depth</h2>
      <p>Both signs feel everything deeply — joy, pain, love, fear. This creates a relationship of extraordinary emotional richness, but it also means that hurts cut deep and moods can be overwhelming. Cancer's moodiness can trigger Scorpio's intensity; Scorpio's brooding can trigger Cancer's anxiety.</p>
      <p>The key is learning to navigate each other's emotional storms without drowning together. Cancer needs to develop emotional boundaries; Scorpio needs to learn that vulnerability isn't weakness.</p>

      <h2>Trust and loyalty</h2>
      <p>Trust is everything to both signs. Once broken, it's nearly impossible to rebuild. But when trust is established, the loyalty is absolute. Cancer and Scorpio would do anything for each other — and they know it. This creates a sense of safety that allows both signs to be completely vulnerable.</p>
      <p>Neither sign is prone to casual infidelity. Both are too intense, too loyal, and too invested in the relationship. When they're in, they're all in.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Moodiness amplification — both signs can spiral into negative emotional patterns.</li>
        <li>Possessiveness — both need to feel secure, which can become controlling.</li>
        <li>Avoidance of outside perspectives — the relationship can become too insular.</li>
        <li>Grudge-holding — Scorpio especially can hold onto hurts. Practice forgiveness.</li>
      </ul>

      <h2>How to make it work</h2>
      <ul>
        <li>Create rituals of connection — weekly date nights, morning check-ins, shared meals.</li>
        <li>Develop emotional boundaries — support each other without absorbing each other's moods.</li>
        <li>Maintain outside friendships — don't let the relationship become your entire world.</li>
        <li>Practice direct communication — don't expect the other to read your mind, even though you often can.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Emotional depth, loyalty, intuition, devotion.<br>Challenges: Moodiness, possessiveness, insularity.<br>Overall: 9/10 — One of the zodiac's most profoundly connected pairings.</p>

      <p>Want to see how your Cancer-Scorpio pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: TAURUS x VIRGO =====
  {
    slug: 'taurus-virgo-compatibility',
    title: 'Taurus and Virgo Compatibility — The Earth Sign Power Couple',
    date: '2026-07-02',
    description: 'Taurus and Virgo are two earth signs that build a life of comfort, stability, and quiet devotion. Discover why this practical pairing is one of the zodiac\'s most reliable matches.',
    tags: ['taurus','virgo','compatibility','earth-signs','practical'],
    content: \`
      <h1>Taurus and Virgo Compatibility — The Earth Sign Power Couple</h1>
      <p>Taurus and Virgo — two earth signs that together create a partnership built on practicality, loyalty, and quiet devotion. Ruled by Venus and Mercury respectively, this pairing values substance over flash, routine over chaos, and building something real over chasing fantasies.</p>

      <h2>Why earth signs work together</h2>
      <p>Taurus and Virgo share a fundamental understanding of how the physical world works. Both value hard work, tangible results, and the comfort that comes from a well-organized life. Neither is interested in grand gestures or dramatic declarations — they show love through actions, not words.</p>
      <p>Taurus brings sensuality, patience, and the ability to create physical comfort. Virgo brings analytical skill, attention to detail, and the ability to solve practical problems. Together, they build a life that's both beautiful and functional.</p>

      <h2>Love and romance</h2>
      <p>Romance between Taurus and Virgo is understated but deeply felt. This isn't the couple writing love poems on restaurant napkins — it's the couple where one remembers the other's favorite tea and has it ready when they get home. Love is expressed through acts of service, physical touch, and quiet presence.</p>
      <p>Taurus brings sensuality to the relationship — good food, soft textures, physical affection. Virgo brings thoughtfulness — remembering details, anticipating needs, keeping the household running smoothly. Both signs feel loved when their partner does practical things to make life easier.</p>

      <h2>Communication style</h2>
      <p>Both signs are reserved and thoughtful communicators. They don't speak just to fill silence — when they talk, it means something. Taurus is direct and honest; Virgo is precise and analytical. Both appreciate clarity and dislike game-playing.</p>
      <p>The main communication challenge: Virgo's tendency to criticize can wound Taurus' pride. Taurus' stubbornness can frustrate problem-solving Virgo. The key is for Virgo to frame suggestions as help, not criticism, and for Taurus to be open to feedback.</p>

      <h2>Work and practical life</h2>
      <p>This is where the pairing excels. Taurus and Virgo together create a well-run, comfortable, and financially stable household. Taurus handles the big-picture financial decisions and creates physical comfort. Virgo handles the details — bills, schedules, maintenance, health.</p>
      <p>Both signs are hardworking and reliable. Neither is prone to laziness or financial irresponsibility. They build wealth slowly and steadily, and they take pride in a well-maintained home.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Emotional reserve — both signs can struggle to express feelings verbally.</li>
        <li>Virgo's criticism — well-intentioned advice can feel like nagging to Taurus.</li>
        <li>Taurus' stubbornness — once Taurus has made up their mind, changing it is nearly impossible.</li>
        <li>Lack of spontaneity — the relationship can become too routine. Plan surprises.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Loyalty, practicality, shared values, reliability.<br>Challenges: Emotional reserve, criticism, stubbornness.<br>Overall: 9/10 — One of the zodiac's most dependable partnerships.</p>

      <p>Curious how your Taurus-Virgo pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: GEMINI x LIBRA =====
  {
    slug: 'gemini-libra-compatibility',
    title: 'Gemini and Libra Compatibility — The Ultimate Air Sign Romance',
    date: '2026-07-03',
    description: 'Gemini and Libra are two air signs that create an intellectually stimulating, socially graceful, and endlessly conversational romance.',
    tags: ['gemini','libra','compatibility','air-signs','intellectual'],
    content: \`
      <h1>Gemini and Libra Compatibility — The Ultimate Air Sign Romance</h1>
      <p>Gemini and Libra — two air signs that together create a relationship of extraordinary intellectual chemistry, social grace, and endless conversation. Ruled by Mercury and Venus respectively, this pairing values ideas, beauty, and the art of communication above all else.</p>

      <h2>The meeting of minds</h2>
      <p>Gemini and Libra connect first and foremost through ideas. Their conversations range across art, philosophy, culture, politics, and everything in between. Neither sign is interested in small talk — they want to explore concepts, debate perspectives, and learn from each other.</p>
      <p>Gemini brings rapid-fire curiosity, wit, and an endless stream of new ideas. Libra brings aesthetic refinement, diplomatic grace, and the ability to see all sides of any issue. Together, they create an intellectual partnership that's both stimulating and harmonious.</p>

      <h2>Love and romance</h2>
      <p>Romance between Gemini and Libra is flirtatious, intellectual, and socially elegant. This is the couple that looks stunning together at parties, that finishes each other's sentences, and that can talk until 3 AM about everything and nothing.</p>
      <p>Both signs value variety and novelty in romance. They're not interested in a predictable routine — they want to explore new restaurants, attend cultural events, and keep the intellectual spark alive. Both are romantic in a cerebral way: love letters, thoughtful gifts, and meaningful conversations matter more than grand gestures.</p>

      <h2>Social chemistry</h2>
      <p>Gemini and Libra are both social butterflies who love being around people. Together, they're the couple that hosts the best parties, knows everyone in the room, and makes every gathering more fun. They share a love of culture, art, and social connection.</p>
      <p>Both signs are charming and diplomatic, which means they navigate social situations with ease. They rarely make enemies and always know the right thing to say. As a couple, they're well-liked and well-connected.</p>

      <h2>Communication style</h2>
      <p>Communication is this pairing's superpower. Both signs are articulate, thoughtful, and genuinely interested in what the other has to say. Conversations flow naturally, and both signs feel heard and understood.</p>
      <p>The challenge: both signs can avoid difficult conversations in favor of keeping the peace. Libra especially hates conflict, and Gemini can deflect serious topics with humor. Learning to address issues directly — even when it's uncomfortable — strengthens the relationship.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Indecision — both signs can struggle to make decisions. Designate a decision-maker for different areas.</li>
        <li>Emotional avoidance — both prefer intellectual connection over emotional vulnerability.</li>
        <li>Social butterfly syndrome — the relationship can become all friends, no intimacy.</li>
        <li>Commitment hesitation — both signs like to keep their options open. Discuss expectations early.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Intellectual chemistry, social grace, communication, shared interests.<br>Challenges: Indecision, emotional avoidance, commitment hesitation.<br>Overall: 9/10 — One of the zodiac's most intellectually compatible pairings.</p>

      <p>Want to see how your Gemini-Libra pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: AQUARIUS x GEMINI =====
  {
    slug: 'aquarius-gemini-compatibility',
    title: 'Aquarius and Gemini Compatibility — The Freedom Alliance',
    date: '2026-07-06',
    description: 'Aquarius and Gemini are two air signs that create an intellectually electric, freedom-loving, and endlessly curious partnership.',
    tags: ['aquarius','gemini','compatibility','air-signs','freedom'],
    content: \`
      <h1>Aquarius and Gemini Compatibility — The Freedom Alliance</h1>
      <p>Aquarius and Gemini — two air signs that together create a partnership built on intellectual curiosity, mutual independence, and a shared love of freedom. Ruled by Uranus and Mercury respectively, this pairing values ideas over emotions, friendship over possessiveness, and the open road over the well-worn path.</p>

      <h2>The intellectual connection</h2>
      <p>Aquarius and Gemini connect through ideas — big, unusual, future-oriented ideas. They can talk for hours about technology, philosophy, social change, and the nature of the universe. Both signs are mentally agile, curious, and genuinely interested in learning from each other.</p>
      <p>Gemini brings rapid-fire curiosity and the ability to see connections between seemingly unrelated things. Aquarius brings visionary thinking and the courage to challenge conventional wisdom. Together, they generate more ideas in an hour than most couples generate in a month.</p>

      <h2>Freedom and independence</h2>
      <p>This is the most freedom-loving pairing in the zodiac. Both Aquarius and Gemini need significant personal space, independent friendships, and the freedom to pursue their own interests. Neither is jealous, possessive, or clingy — and both appreciate the same in return.</p>
      <p>This creates a relationship where both partners can grow independently while remaining deeply connected. They don't need to be together every moment to feel close. In fact, time apart makes the time together richer.</p>

      <h2>Love and romance</h2>
      <p>Romance between Aquarius and Gemini is playful, intellectual, and unconventional. This is not a traditional couple — they're more likely to fall in love over a debate about quantum physics than over a candlelit dinner. Both signs value mental stimulation over emotional intensity.</p>
      <p>Physical chemistry is lively and fun rather than intense and passionate. Both signs enjoy novelty and variety, which keeps the physical relationship fresh. The emotional connection is real but expressed through friendship and intellectual partnership rather than grand romantic gestures.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Emotional detachment — both signs can struggle with emotional vulnerability.</li>
        <li>Inconsistency — both signs are changeable, which can create instability.</li>
        <li>Commitment avoidance — both like to keep their options open.</li>
        <li>Lack of grounding — the relationship can live entirely in the mind. Practice being present.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Intellectual stimulation, mutual freedom, friendship, curiosity.<br>Challenges: Emotional detachment, inconsistency, commitment avoidance.<br>Overall: 9/10 — One of the zodiac's most intellectually compatible pairings.</p>

      <p>Curious how your Aquarius-Gemini pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: PISCES x CANCER =====
  {
    slug: 'pisces-cancer-compatibility',
    title: 'Pisces and Cancer Compatibility — The Emotional Sanctuary',
    date: '2026-07-07',
    description: 'Pisces and Cancer are two water signs that create one of the zodiac\'s most nurturing, empathetic, and emotionally rich partnerships.',
    tags: ['pisces','cancer','compatibility','water-signs','nurturing'],
    content: \`
      <h1>Pisces and Cancer Compatibility — The Emotional Sanctuary</h1>
      <p>Pisces and Cancer — two water signs that together create an emotional bond of extraordinary depth and tenderness. Ruled by Neptune and the Moon respectively, this pairing operates in the realm of feeling, intuition, and the unseen currents that connect human hearts.</p>

      <h2>The emotional merging</h2>
      <p>Pisces and Cancer don't just understand each other — they feel each other. This is a pairing where empathy isn't just a skill; it's a way of being. Cancer senses Pisces' emotional shifts; Pisces feels Cancer's unspoken fears. They create a shared emotional world that's rich, complex, and deeply comforting.</p>
      <p>Both signs are natural nurturers who put their partner's emotional needs first. Cancer provides practical care — cooking, organizing, creating a safe home. Pisces provides emotional and spiritual care — listening, dreaming, offering unconditional acceptance.</p>

      <h2>Love and romance</h2>
      <p>Romance between Pisces and Cancer is tender, devoted, and deeply romantic in the old-fashioned sense. Both signs believe in soulmates, in love that transcends the physical, in partnerships that feel destined. They create a relationship that feels like coming home.</p>
      <p>Both are physically affectionate and emotionally expressive. They're not afraid to say "I love you," to cry together, to be vulnerable. The relationship is characterized by a gentleness and tenderness that's rare in the zodiac.</p>

      <h2>Home and family</h2>
      <p>Both signs value home, family, and domestic comfort above almost everything else. Together, they create a home that's warm, beautiful, and emotionally safe. Cancer handles the practical aspects of homemaking; Pisces adds beauty, creativity, and spiritual warmth.</p>
      <p>Both are natural parents (or parental figures) who put family first. If they have children, the kids will be deeply loved and emotionally supported.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Emotional overwhelm — both signs feel everything deeply. Boundaries are essential.</li>
        <li>Escapism — both signs can avoid harsh realities. Stay grounded in practical matters.</li>
        <li>Codependency — the merging can go too far. Maintain individual identities.</li>
        <li>Difficulty with conflict — both avoid confrontation. Learn to address issues directly.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Emotional depth, nurturing, empathy, devotion.<br>Challenges: Emotional overwhelm, escapism, codependency.<br>Overall: 9/10 — One of the zodiac's most emotionally rich pairings.</p>

      <p>Want to see how your Pisces-Cancer pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: LEO x SAGITTARIUS =====
  {
    slug: 'leo-sagittarius-compatibility',
    title: 'Leo and Sagittarius Compatibility — The Fire That Never Dies',
    date: '2026-07-08',
    description: 'Leo and Sagittarius are two fire signs that create an optimistic, adventurous, and endlessly enthusiastic partnership.',
    tags: ['leo','sagittarius','compatibility','fire-signs','adventure'],
    content: \`
      <h1>Leo and Sagittarius Compatibility — The Fire That Never Dies</h1>
      <p>Leo and Sagittarius — two fire signs that together create a relationship of extraordinary optimism, adventure, and joy. Ruled by the Sun and Jupiter respectively, this pairing is larger than life, endlessly enthusiastic, and impossible to ignore.</p>

      <h2>The instant spark</h2>
      <p>Leo and Sagittarius are drawn to each other by a shared love of life, laughter, and adventure. Leo admires Sagittarius' optimism, philosophical depth, and love of travel. Sagittarius admires Leo's confidence, warmth, and creative flair. Both are attracted to big personalities, and both recognize a kindred spirit immediately.</p>
      <p>The chemistry is immediate and sustained. This is not a slow-burn romance — it's a fireworks display that keeps going. Both signs are passionate, generous, and enthusiastic lovers who bring out the best in each other.</p>

      <h2>Love and romance</h2>
      <p>Romance between Leo and Sagittarius is grand, generous, and fun. This is the couple that takes spontaneous road trips, plans elaborate dates, and makes every day feel like an adventure. Both signs are romantic in a big, bold way — they want to be swept off their feet and they want to do the same for their partner.</p>
      <p>Both are generous lovers who put their partner's pleasure and happiness first. The physical chemistry is intense and sustained. Both signs are optimistic about the relationship, which creates a self-fulfilling prophecy of happiness.</p>

      <h2>Shared optimism</h2>
      <p>One of the most beautiful things about this pairing is their shared optimism. Both Leo and Sagittarius believe that things will work out, that the future is bright, and that anything is possible. This creates a relationship that's resilient in the face of challenges — when one partner is down, the other lifts them up.</p>
      <p>Both signs are generous, forgiving, and forward-looking. They don't dwell on past mistakes or hold grudges. They focus on the positive and move forward together.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Financial impulsiveness — both love spending. Create a budget and stick to it.</li>
        <li>Ego clashes — both want to be the star. Take turns shining.</li>
        <li>Commitment to routine — neither likes boredom. Keep things fresh with new experiences.</li>
        <li>Bluntness — Sagittarius' honesty can wound Leo's pride. Practice tact.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Optimism, adventure, generosity, passion.<br>Challenges: Financial impulsiveness, ego clashes, bluntness.<br>Overall: 9/10 — One of the zodiac's most joyful pairings.</p>

      <p>Curious how your Leo-Sagittarius pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: ARIES x SAGITTARIUS =====
  {
    slug: 'aries-sagittarius-compatibility',
    title: 'Aries and Sagittarius Compatibility — The Adventure Duo',
    date: '2026-07-09',
    description: 'Aries and Sagittarius are two fire signs that create an energetic, adventurous, and freedom-loving partnership that never stands still.',
    tags: ['aries','sagittarius','compatibility','fire-signs','adventure'],
    content: \`
      <h1>Aries and Sagittarius Compatibility — The Adventure Duo</h1>
      <p>Aries and Sagittarius — two fire signs that together create a relationship of extraordinary energy, adventure, and freedom. Ruled by Mars and Jupiter respectively, this pairing is always moving, always exploring, and always looking for the next horizon.</p>

      <h2>The shared love of adventure</h2>
      <p>Aries and Sagittarius are both adventurers at heart. Aries wants to be first — the pioneer, the trailblazer, the one who charges ahead. Sagittarius wants to explore — to travel, to learn, to understand the bigger picture. Together, they're the couple that's always planning the next trip, the next project, the next big thing.</p>
      <p>Neither sign is interested in a quiet, predictable life. Both need excitement, novelty, and the freedom to pursue their interests. This creates a relationship that's never boring — but also never still.</p>

      <h2>Love and romance</h2>
      <p>Romance between Aries and Sagittarius is passionate, spontaneous, and fun. This is not the couple that plans a formal dinner date — they're the couple that decides at 9 PM to drive to the coast and watch the sunrise. Both signs are impulsive, romantic in a spontaneous way, and always ready for the next adventure.</p>
      <p>Physical chemistry is intense and playful. Both signs are energetic, athletic, and enjoy physical activity together. The relationship is characterized by laughter, excitement, and a shared sense of possibility.</p>

      <h2>Freedom and independence</h2>
      <p>Both signs need significant personal freedom, and both are happy to give it to their partner. Neither is jealous, possessive, or controlling. They trust each other completely, which creates a relationship that's both secure and spacious.</p>
      <p>This is important because both signs are independent and need time alone or with their own friends. The relationship works because neither partner feels threatened by the other's independence.</p>

      <h2>Communication style</h2>
      <p>Both signs are direct, honest, and sometimes blunt. They say what they mean and expect the same in return. Arguments are loud but short-lived — neither sign holds grudges, and both are quick to forgive.</p>
      <p>The challenge: both signs can be impatient and impulsive. Learning to think before acting — and to consider each other's feelings before speaking — prevents unnecessary hurt.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Impulsiveness — both act first, think later. Slow down for big decisions.</li>
        <li>Commitment to routine — neither likes boredom. This is great for adventure but challenging for daily life.</li>
        <li>Financial carelessness — both love spending. Create a savings plan.</li>
        <li>Bluntness — both can be tactlessly honest. Practice kindness in communication.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Adventure, energy, honesty, mutual freedom.<br>Challenges: Impulsiveness, financial carelessness, bluntness.<br>Overall: 9/10 — One of the zodiac's most exciting pairings.</p>

      <p>Want to see how your Aries-Sagittarius pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },

  // ===== DEEP DIVE: CAPRICORN x TAURUS =====
  {
    slug: 'capricorn-taurus-compatibility',
    title: 'Capricorn and Taurus Compatibility — The Builders of Empires',
    date: '2026-07-10',
    description: 'Capricorn and Taurus are two earth signs that create a partnership built on shared values, mutual respect, and a long-term vision for success.',
    tags: ['capricorn','taurus','compatibility','earth-signs','builders'],
    content: \`
      <h1>Capricorn and Taurus Compatibility — The Builders of Empires</h1>
      <p>Capricorn and Taurus — two earth signs that together create a partnership of extraordinary stability, ambition, and shared values. Ruled by Saturn and Venus respectively, this pairing is the zodiac's ultimate power couple — not because they seek attention, but because they build things that last.</p>

      <h2>Shared values</h2>
      <p>Capricorn and Taurus share a fundamental understanding of what matters: security, loyalty, hard work, and building something meaningful. Neither sign is interested in shortcuts, get-rich-quick schemes, or superficial success. Both believe in earning what you have and building it to last.</p>
      <p>This shared value system creates a relationship of extraordinary stability. Both partners are reliable, committed, and willing to do the work that long-term success requires. They're not looking for a fairy tale — they're looking for a partnership that can weather any storm.</p>

      <h2>Love and romance</h2>
      <p>Romance between Capricorn and Taurus is steady, sensual, and deeply committed. This is not a whirlwind romance — it's a slow burn that grows stronger over time. Both signs are cautious about love, but once they commit, they're in it for life.</p>
      <p>Taurus brings sensuality, physical affection, and the ability to create a beautiful, comfortable home. Capricorn brings loyalty, protection, and a quiet, steady devotion that deepens with time. Both signs express love through actions — providing, protecting, and building a life together.</p>

      <h2>Ambition and success</h2>
      <p>Both signs are ambitious, but they express it differently. Capricorn is the public achiever — climbing the ladder, building a reputation, achieving recognition. Taurus is the private builder — accumulating wealth, creating comfort, building something tangible. Together, they create both public success and private security.</p>
      <p>They make excellent business partners because they share a work ethic and a long-term vision. Both are willing to sacrifice short-term pleasure for long-term gain, and both understand that real success takes time.</p>

      <h2>Challenges to watch</h2>
      <ul>
        <li>Emotional reserve — both signs struggle to express feelings verbally.</li>
        <li>Stubbornness — both are fixed signs. Compromise requires conscious effort.</li>
        <li>Work-life imbalance — both are workaholics. Schedule intentional downtime.</li>
        <li>Rigidity — both resist change. Practice flexibility and spontaneity.</li>
      </ul>

      <h2>Quick compatibility snapshot</h2>
      <p>Strengths: Shared values, loyalty, ambition, stability.<br>Challenges: Emotional reserve, stubbornness, work-life imbalance.<br>Overall: 9/10 — One of the zodiac's most enduring partnerships.</p>

      <p>Want to see how your Capricorn-Taurus pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>
    \`,
  },
"""

# Find insertion point (before closing ];
insertion_point = content.rfind("];")
if insertion_point == -1:
    print("❌ Could not find closing ];")
    exit(1)

# Check if last post has a comma
last_brace = content.rfind("}", 0, insertion_point)
after_brace = content[last_brace+1:insertion_point].strip()
if not after_brace.endswith(","):
    content = content[:last_brace+1] + "," + content[last_brace+1:]

# Insert new posts
new_content = content[:insertion_point] + NEW_POSTS + "\n" + content[insertion_point:]

with open(EXISTING_FILE, "w") as f:
    f.write(new_content)

# Count
total_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", new_content))
print(f"✅ Added 10 deep-dive posts")
print(f"📊 Total posts now: {len(total_slugs)}")

# Build
import subprocess
result = subprocess.run(["npm", "run", "build"], cwd="/Users/alijahfox/MatchbyBirth",
                       capture_output=True, text=True, timeout=60)
if result.returncode == 0:
    print("✅ Build successful!")
else:
    print(f"❌ Build failed: {result.stderr[-300:]}")
