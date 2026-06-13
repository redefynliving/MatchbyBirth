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
