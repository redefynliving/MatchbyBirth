#!/usr/bin/env python3
"""
Add compatibility deep-dive posts to index.js
Writes proper JavaScript with correct escaping.
"""

import re

FILE = "/Users/alijahfox/MatchbyBirth/apps/web/src/data/posts/index.js"

with open(FILE, "r") as f:
    content = f.read()

existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", content))
print(f"Existing posts: {len(existing_slugs)}")

# Helper to escape content for JS template literal
def esc(text):
    return text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

NEW_POSTS = [
    {
        "slug": "scorpio-capricorn-compatibility",
        "title": "Scorpio and Capricorn Compatibility — The Power Duo That Builds Empires",
        "date": "2026-06-29",
        "desc": "Scorpio and Capricorn are both ambitious, disciplined, and intensely loyal. Discover how this power duo creates one of the zodiac's most formidable partnerships.",
        "tags": "['scorpio','capricorn','compatibility','power-couple','ambition']",
        "body": """<h1>Scorpio and Capricorn Compatibility — The Power Duo That Builds Empires</h1>
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

<p>Want to see how your Scorpio-Capricorn pairing scores with exact birth data? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "aries-leo-compatibility",
        "title": "Aries and Leo Compatibility — The Fire That Lights Up the Room",
        "date": "2026-06-30",
        "desc": "Aries and Leo are two fire signs that create an electrifying, passionate, and dramatic romance. Learn how this power couple thrives.",
        "tags": "['aries','leo','compatibility','fire-signs','power-couple']",
        "body": """<h1>Aries and Leo Compatibility — The Fire That Lights Up the Room</h1>
<p>Aries and Leo — two fire signs that together create a blaze of passion, creativity, and sheer life force. Ruled by Mars and the Sun respectively, this pairing is bold, generous, and impossible to ignore.</p>

<h2>The instant attraction</h2>
<p>Aries and Leo are drawn to each other like moths to a flame. Aries admires Leo's confidence, warmth, and regal presence. Leo admires Aries' courage, directness, and raw energy. Both are attracted to strength, and both recognize a kindred spirit immediately.</p>
<p>The chemistry is physical, mental, and emotional. They share a love of excitement, a hatred of boredom, and an infectious enthusiasm for life. First dates are adventures. First kisses are electric.</p>

<h2>Love and romance</h2>
<p>Romance between Aries and Leo is grand, generous, and unapologetically dramatic. Both signs love grand gestures — surprise trips, expensive gifts, public declarations of love. They're not subtle, and they don't want to be.</p>
<p>Both are generous lovers who put their partner's pleasure first. The physical chemistry is intense and sustained. Both signs are passionate, loyal (once committed), and willing to fight for the relationship.</p>

<h2>The ego factor</h2>
<p>Let's be honest: both Aries and Leo have big egos. Both want to be the leader, the star, the one in charge. Arguments can be spectacular — loud, dramatic, and sometimes public. Neither sign backs down easily.</p>
<p>The solution isn't for one to submit — it's for both to take turns. Aries can lead in action; Leo can lead in vision. When both feel respected and admired, the ego clashes dissolve into mutual admiration.</p>

<h2>Communication style</h2>
<p>Both signs are direct, honest, and sometimes blunt. They say what they mean and mean what they say. Arguments are resolved quickly because neither sign holds grudges for long.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Ego clashes — both need to feel like the star. Take turns.</li>
  <li>Impatience — both want things now. Practice delayed gratification.</li>
  <li>Financial impulsiveness — both love spending. Create a budget together.</li>
  <li>Stubbornness — neither likes to admit they're wrong. Learn to apologize.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Passion, loyalty, generosity, fun.<br>Challenges: Ego clashes, impulsiveness, stubbornness.<br>Overall: 8/10 — A fiery, exciting partnership that lights up every room.</p>

<p>Curious how your Aries-Leo pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "cancer-scorpio-compatibility",
        "title": "Cancer and Scorpio Compatibility — The Emotional Fortress",
        "date": "2026-07-01",
        "desc": "Cancer and Scorpio are two water signs that create one of the zodiac's most deeply bonded, almost psychic connections.",
        "tags": "['cancer','scorpio','compatibility','water-signs','emotional']",
        "body": """<h1>Cancer and Scorpio Compatibility — The Emotional Fortress</h1>
<p>Cancer and Scorpio — two water signs that together create an emotional bond so deep it borders on the psychic. Ruled by the Moon and Pluto respectively, this pairing operates on a frequency that most other signs can't even detect.</p>

<h2>The almost psychic connection</h2>
<p>Cancer and Scorpio don't need words to understand each other. They communicate through glances, silences, and an intuitive knowing that defies explanation. Cancer senses Scorpio's emotional shifts before Scorpio voices them. Scorpio perceives Cancer's unspoken needs before Cancer articulates them.</p>

<h2>Love and romance</h2>
<p>Romance between Cancer and Scorpio is intense, all-consuming, and deeply private. This is not a couple that shares their relationship with the world — they create a sacred space that belongs only to them. Cancer brings nurturing, tenderness, and the ability to make a house feel like a home. Scorpio brings passion, loyalty, and an almost fierce protectiveness.</p>

<h2>Emotional depth</h2>
<p>Both signs feel everything deeply — joy, pain, love, fear. This creates a relationship of extraordinary emotional richness. Cancer's moodiness can trigger Scorpio's intensity; Scorpio's brooding can trigger Cancer's anxiety.</p>
<p>The key is learning to navigate each other's emotional storms without drowning together. Cancer needs to develop emotional boundaries; Scorpio needs to learn that vulnerability isn't weakness.</p>

<h2>Trust and loyalty</h2>
<p>Trust is everything to both signs. Once broken, it's nearly impossible to rebuild. But when trust is established, the loyalty is absolute. Cancer and Scorpio would do anything for each other.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Moodiness amplification — both signs can spiral into negative emotional patterns.</li>
  <li>Possessiveness — both need to feel secure, which can become controlling.</li>
  <li>Avoidance of outside perspectives — the relationship can become too insular.</li>
  <li>Grudge-holding — Scorpio especially can hold onto hurts. Practice forgiveness.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Emotional depth, loyalty, intuition, devotion.<br>Challenges: Moodiness, possessiveness, insularity.<br>Overall: 9/10 — One of the zodiac's most profoundly connected pairings.</p>

<p>Want to see how your Cancer-Scorpio pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "taurus-virgo-compatibility",
        "title": "Taurus and Virgo Compatibility — The Earth Sign Power Couple",
        "date": "2026-07-02",
        "desc": "Taurus and Virgo are two earth signs that build a life of comfort, stability, and quiet devotion.",
        "tags": "['taurus','virgo','compatibility','earth-signs','practical']",
        "body": """<h1>Taurus and Virgo Compatibility — The Earth Sign Power Couple</h1>
<p>Taurus and Virgo — two earth signs that together create a partnership built on practicality, loyalty, and quiet devotion. Ruled by Venus and Mercury respectively, this pairing values substance over flash, routine over chaos, and building something real over chasing fantasies.</p>

<h2>Why earth signs work together</h2>
<p>Taurus and Virgo share a fundamental understanding of how the physical world works. Both value hard work, tangible results, and the comfort that comes from a well-organized life. Neither is interested in grand gestures or dramatic declarations — they show love through actions, not words.</p>

<h2>Love and romance</h2>
<p>Romance between Taurus and Virgo is understated but deeply felt. Love is expressed through acts of service, physical touch, and quiet presence. Taurus brings sensuality and comfort; Virgo brings thoughtfulness and attention to detail.</p>

<h2>Communication style</h2>
<p>Both signs are reserved and thoughtful communicators. They don't speak just to fill silence — when they talk, it means something. The main challenge: Virgo's tendency to criticize can wound Taurus' pride.</p>

<h2>Work and practical life</h2>
<p>This is where the pairing excels. Taurus and Virgo together create a well-run, comfortable, and financially stable household. Both signs are hardworking and reliable.</p>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Loyalty, practicality, shared values, reliability.<br>Challenges: Emotional reserve, criticism, stubbornness.<br>Overall: 9/10 — One of the zodiac's most dependable partnerships.</p>

<p>Curious how your Taurus-Virgo pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "pisces-cancer-compatibility",
        "title": "Pisces and Cancer Compatibility — The Emotional Sanctuary",
        "date": "2026-07-03",
        "desc": "Pisces and Cancer are two water signs that create one of the zodiac's most nurturing, empathetic, and emotionally rich partnerships.",
        "tags": "['pisces','cancer','compatibility','water-signs','nurturing']",
        "body": """<h1>Pisces and Cancer Compatibility — The Emotional Sanctuary</h1>
<p>Pisces and Cancer — two water signs that together create an emotional bond of extraordinary depth and tenderness. Ruled by Neptune and the Moon respectively, this pairing operates in the realm of feeling, intuition, and the unseen currents that connect human hearts.</p>

<h2>The emotional merging</h2>
<p>Pisces and Cancer don't just understand each other — they feel each other. This is a pairing where empathy isn't just a skill; it's a way of being. Cancer provides practical care; Pisces provides emotional and spiritual care.</p>

<h2>Love and romance</h2>
<p>Romance between Pisces and Cancer is tender, devoted, and deeply romantic. Both signs believe in soulmates and love that transcends the physical. They create a relationship that feels like coming home.</p>

<h2>Home and family</h2>
<p>Both signs value home, family, and domestic comfort above almost everything else. Together, they create a home that's warm, beautiful, and emotionally safe.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Emotional overwhelm — both signs feel everything deeply. Boundaries are essential.</li>
  <li>Escapism — both signs can avoid harsh realities. Stay grounded.</li>
  <li>Codependency — maintain individual identities.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Emotional depth, nurturing, empathy, devotion.<br>Challenges: Emotional overwhelm, escapism, codependency.<br>Overall: 9/10 — One of the zodiac's most emotionally rich pairings.</p>

<p>Want to see how your Pisces-Cancer pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "leo-sagittarius-compatibility",
        "title": "Leo and Sagittarius Compatibility — The Fire That Never Dies",
        "date": "2026-07-06",
        "desc": "Leo and Sagittarius are two fire signs that create an optimistic, adventurous, and endlessly enthusiastic partnership.",
        "tags": "['leo','sagittarius','compatibility','fire-signs','adventure']",
        "body": """<h1>Leo and Sagittarius Compatibility — The Fire That Never Dies</h1>
<p>Leo and Sagittarius — two fire signs that together create a relationship of extraordinary optimism, adventure, and joy. Ruled by the Sun and Jupiter respectively, this pairing is larger than life, endlessly enthusiastic, and impossible to ignore.</p>

<h2>The instant spark</h2>
<p>Leo and Sagittarius are drawn to each other by a shared love of life, laughter, and adventure. Both are attracted to big personalities, and both recognize a kindred spirit immediately. The chemistry is immediate and sustained — this is not a slow-burn romance, it is a fireworks display that keeps going.</p>

<h2>Love and romance</h2>
<p>Romance between Leo and Sagittarius is grand, generous, and fun. This is the couple that takes spontaneous road trips, plans elaborate dates, and makes every day feel like an adventure. Both signs are romantic in a big, bold way.</p>

<h2>Shared optimism</h2>
<p>One of the most beautiful things about this pairing is their shared optimism. Both Leo and Sagittarius believe that things will work out, that the future is bright, and that anything is possible. This creates a relationship that is resilient in the face of challenges.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Financial impulsiveness — both love spending. Create a budget and stick to it.</li>
  <li>Ego clashes — both want to be the star. Take turns shining.</li>
  <li>Bluntness — Sagittarius' honesty can wound Leo's pride. Practice tact.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Optimism, adventure, generosity, passion.<br>Challenges: Financial impulsiveness, ego clashes, bluntness.<br>Overall: 9/10 — One of the zodiac's most joyful pairings.</p>

<p>Curious how your Leo-Sagittarius pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "aries-sagittarius-compatibility",
        "title": "Aries and Sagittarius Compatibility — The Adventure Duo",
        "date": "2026-07-07",
        "desc": "Aries and Sagittarius are two fire signs that create an energetic, adventurous, and freedom-loving partnership that never stands still.",
        "tags": "['aries','sagittarius','compatibility','fire-signs','adventure']",
        "body": """<h1>Aries and Sagittarius Compatibility — The Adventure Duo</h1>
<p>Aries and Sagittarius — two fire signs that together create a relationship of extraordinary energy, adventure, and freedom. Ruled by Mars and Jupiter respectively, this pairing is always moving, always exploring, and always looking for the next horizon.</p>

<h2>The shared love of adventure</h2>
<p>Aries and Sagittarius are both adventurers at heart. Aries wants to be first — the pioneer, the trailblazer. Sagittarius wants to explore — to travel, to learn, to understand the bigger picture. Together, they are the couple that is always planning the next trip, the next project, the next big thing.</p>

<h2>Love and romance</h2>
<p>Romance between Aries and Sagittarius is passionate, spontaneous, and fun. This is not the couple that plans a formal dinner date — they are the couple that decides at 9 PM to drive to the coast and watch the sunrise. Physical chemistry is intense and playful.</p>

<h2>Freedom and independence</h2>
<p>Both signs need significant personal freedom, and both are happy to give it to their partner. Neither is jealous, possessive, or controlling. They trust each other completely, which creates a relationship that is both secure and spacious.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Impulsiveness — both act first, think later. Slow down for big decisions.</li>
  <li>Financial carelessness — both love spending. Create a savings plan.</li>
  <li>Bluntness — both can be tactlessly honest. Practice kindness in communication.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Adventure, energy, honesty, mutual freedom.<br>Challenges: Impulsiveness, financial carelessness, bluntness.<br>Overall: 9/10 — One of the zodiac's most exciting pairings.</p>

<p>Want to see how your Aries-Sagittarius pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "capricorn-taurus-compatibility",
        "title": "Capricorn and Taurus Compatibility — The Builders of Empires",
        "date": "2026-07-08",
        "desc": "Capricorn and Taurus are two earth signs that create a partnership built on shared values, mutual respect, and a long-term vision for success.",
        "tags": "['capricorn','taurus','compatibility','earth-signs','builders']",
        "body": """<h1>Capricorn and Taurus Compatibility — The Builders of Empires</h1>
<p>Capricorn and Taurus — two earth signs that together create a partnership of extraordinary stability, ambition, and shared values. Ruled by Saturn and Venus respectively, this pairing is the zodiac's ultimate power couple — not because they seek attention, but because they build things that last.</p>

<h2>Shared values</h2>
<p>Capricorn and Taurus share a fundamental understanding of what matters: security, loyalty, hard work, and building something meaningful. Neither sign is interested in shortcuts or superficial success. Both believe in earning what you have and building it to last.</p>

<h2>Love and romance</h2>
<p>Romance between Capricorn and Taurus is steady, sensual, and deeply committed. This is not a whirlwind romance — it is a slow burn that grows stronger over time. Taurus brings sensuality and physical affection. Capricorn brings loyalty, protection, and quiet devotion.</p>

<h2>Ambition and success</h2>
<p>Both signs are ambitious, but they express it differently. Capricorn is the public achiever; Taurus is the private builder. Together, they create both public success and private security. They make excellent business partners because they share a work ethic and a long-term vision.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Emotional reserve — both signs struggle to express feelings verbally.</li>
  <li>Stubbornness — both are fixed signs. Compromise requires conscious effort.</li>
  <li>Work-life imbalance — both are workaholics. Schedule intentional downtime.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Shared values, loyalty, ambition, stability.<br>Challenges: Emotional reserve, stubbornness, work-life imbalance.<br>Overall: 9/10 — One of the zodiac's most enduring partnerships.</p>

<p>Want to see how your Capricorn-Taurus pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "aquarius-gemini-compatibility",
        "title": "Aquarius and Gemini Compatibility — The Freedom Alliance",
        "date": "2026-07-09",
        "desc": "Aquarius and Gemini are two air signs that create an intellectually electric, freedom-loving, and endlessly curious partnership.",
        "tags": "['aquarius','gemini','compatibility','air-signs','freedom']",
        "body": """<h1>Aquarius and Gemini Compatibility — The Freedom Alliance</h1>
<p>Aquarius and Gemini — two air signs that together create a partnership built on intellectual curiosity, mutual independence, and a shared love of freedom. Ruled by Uranus and Mercury respectively, this pairing values ideas over emotions, friendship over possessiveness, and the open road over the well-worn path.</p>

<h2>The intellectual connection</h2>
<p>Aquarius and Gemini connect through ideas — big, unusual, future-oriented ideas. They can talk for hours about technology, philosophy, social change, and the nature of the universe. Both signs are mentally agile, curious, and genuinely interested in learning from each other.</p>

<h2>Freedom and independence</h2>
<p>This is the most freedom-loving pairing in the zodiac. Both Aquarius and Gemini need significant personal space, independent friendships, and the freedom to pursue their own interests. Neither is jealous, possessive, or clingy — and both appreciate the same in return.</p>

<h2>Love and romance</h2>
<p>Romance between Aquarius and Gemini is playful, intellectual, and unconventional. This is not a traditional couple — they are more likely to fall in love over a debate about quantum physics than over a candlelit dinner. Both signs value mental stimulation over emotional intensity.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Emotional detachment — both signs can struggle with emotional vulnerability.</li>
  <li>Inconsistency — both signs are changeable, which can create instability.</li>
  <li>Commitment avoidance — both like to keep their options open.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Intellectual stimulation, mutual freedom, friendship, curiosity.<br>Challenges: Emotional detachment, inconsistency, commitment avoidance.<br>Overall: 9/10 — One of the zodiac's most intellectually compatible pairings.</p>

<p>Curious how your Aquarius-Gemini pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
    {
        "slug": "gemini-libra-compatibility",
        "title": "Gemini and Libra Compatibility — The Ultimate Air Sign Romance",
        "date": "2026-07-10",
        "desc": "Gemini and Libra are two air signs that create an intellectually stimulating, socially graceful, and endlessly conversational romance.",
        "tags": "['gemini','libra','compatibility','air-signs','intellectual']",
        "body": """<h1>Gemini and Libra Compatibility — The Ultimate Air Sign Romance</h1>
<p>Gemini and Libra — two air signs that together create a relationship of extraordinary intellectual chemistry, social grace, and endless conversation. Ruled by Mercury and Venus respectively, this pairing values ideas, beauty, and the art of communication above all else.</p>

<h2>The meeting of minds</h2>
<p>Gemini and Libra connect first and foremost through ideas. Their conversations range across art, philosophy, culture, politics, and everything in between. Neither sign is interested in small talk — they want to explore concepts, debate perspectives, and learn from each other.</p>

<h2>Love and romance</h2>
<p>Romance between Gemini and Libra is flirtatious, intellectual, and socially elegant. This is the couple that looks stunning together at parties, that finishes each other's sentences, and that can talk until 3 AM about everything and nothing.</p>

<h2>Social chemistry</h2>
<p>Gemini and Libra are both social butterflies who love being around people. Together, they are the couple that hosts the best parties, knows everyone in the room, and makes every gathering more fun.</p>

<h2>Challenges to watch</h2>
<ul>
  <li>Indecision — both signs can struggle to make decisions. Designate a decision-maker.</li>
  <li>Emotional avoidance — both prefer intellectual connection over emotional vulnerability.</li>
  <li>Commitment hesitation — both signs like to keep their options open.</li>
</ul>

<h2>Quick compatibility snapshot</h2>
<p>Strengths: Intellectual chemistry, social grace, communication, shared interests.<br>Challenges: Indecision, emotional avoidance, commitment hesitation.<br>Overall: 9/10 — One of the zodiac's most intellectually compatible pairings.</p>

<p>Want to see how your Gemini-Libra pairing scores? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for a personalized synastry reading.</p>"""
    },
]

# Build the JS insertion
js_blocks = []
for p in NEW_POSTS:
    if p["slug"] in existing_slugs:
        print(f"  Skipping duplicate: {p['slug']}")
        continue
    
    title_esc = p["title"].replace("'", "\\'")
    desc_esc = p["desc"].replace("'", "\\'")
    body_esc = p["body"].replace('\\', '\\\\').replace('`', '\\`')
    
    block = f"""  // ===== DEEP DIVE: {p["slug"].replace("-", " ").upper()} =====
  {{
    slug: '{p["slug"]}',
    title: '{title_esc}',
    date: '{p["date"]}',
    description: '{desc_esc}',
    tags: {p['tags']},
    content: `
{body_esc}
    `,
  }},"""
    js_blocks.append(block)

if not js_blocks:
    print("No new posts to add!")
    exit(0)

insertion = "\n" + "\n".join(js_blocks) + "\n"

# Find insertion point
insertion_point = content.rfind("];")
if insertion_point == -1:
    print("❌ Could not find closing ];")
    exit(1)

# Ensure last post has comma
last_brace = content.rfind("}", 0, insertion_point)
after_brace = content[last_brace+1:insertion_point].strip()
if not after_brace.endswith(","):
    content = content[:last_brace+1] + "," + content[last_brace+1:]

new_content = content[:insertion_point] + insertion + "\n" + content[insertion_point:]

with open(FILE, "w") as f:
    f.write(new_content)

total = len(set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", new_content)))
print(f"✅ Added {len(js_blocks)} deep-dive posts")
print(f"📊 Total posts now: {total}")

# Build
import subprocess
result = subprocess.run(["npm", "run", "build"], cwd="/Users/alijahfox/MatchbyBirth",
                       capture_output=True, text=True, timeout=60)
if result.returncode == 0:
    print("✅ Build successful!")
else:
    print(f"❌ Build failed:\n{result.stderr[-500:]}")
