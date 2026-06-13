#!/usr/bin/env python3
"""
Properly merge new pillar guide posts into src/data/posts/index.js
Formats new posts as proper JS array elements with correct backtick syntax.
"""

import re

EXISTING_FILE = "/Users/alijahfox/MatchbyBirth/apps/web/src/data/posts/index.js"

# Read existing file
with open(EXISTING_FILE, "r") as f:
    content = f.read()

# Find existing slugs
existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", content))
print(f"Existing posts: {len(existing_slugs)}")

# Find the last post object's closing brace and comma
# We need to find the pattern: `\n  }\n];` and insert before `];`
last_close_idx = content.rfind("];")
if last_close_idx == -1:
    print("❌ Could not find closing ];")
    exit(1)

# The new posts to add — properly formatted as JS array elements
NEW_POSTS = """

  // ===== PILLAR GUIDE: GEMINI =====
  {
    slug: 'gemini-compatibility',
    title: 'Gemini Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-13',
    description: 'How does Gemini get along with every sign of the zodiac? Discover Gemini\\'s best and worst compatibility matches for love, friendship, and work.',
    tags: ['gemini','compatibility','zodiac','love','air-sign'],
    content: `
      <h1>Gemini Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Gemini \\u2014 the zodiac's curious communicator. Ruled by Mercury, Gemini brings wit, adaptability, and an insatiable need for mental stimulation. Here's your definitive ranking.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Libra (Air) \\u2014 The intellectual soulmate</h3>
      <p>Gemini and Libra are a classic air-sign pairing: mentally harmonious, socially graceful, and endlessly conversational. Both value intellectual connection, beauty, and variety. <strong>Verdict: 9/10</strong></p>

      <h3>2. Aquarius (Air) \\u2014 The freedom alliance</h3>
      <p>Two air signs who both prize independence and intellectual curiosity. Neither is clingy, and both value friendship as the foundation of romance. <strong>Verdict: 9/10</strong></p>

      <h3>3. Aries (Fire) \\u2014 The spark generator</h3>
      <p>Playful, energetic, and mutually independent. Both value freedom and hate being bored. <strong>Verdict: 8/10</strong></p>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Leo (Fire) \\u2014 The spotlight duo</h3>
      <p>Both love attention and creativity. Friction when Leo needs more emotional depth than Gemini offers. <strong>Verdict: 7/10</strong></p>

      <h3>5. Gemini (Air) \\u2014 The twin connection</h3>
      <p>Intellectually perfect but emotionally shallow unless both do inner work. <strong>Verdict: 7/10</strong></p>

      <h3>6. Sagittarius (Fire) \\u2014 The adventure pair</h3>
      <p>Opposite signs with complementary strengths. <strong>Verdict: 7/10</strong></p>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Taurus (Earth) \\u2014 Different tempos. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Cancer (Water) \\u2014 Emotional mismatch. <strong>Verdict: 4/10</strong></h3>
      <h3>9. Virgo (Earth) \\u2014 Mercury's children, different dialects. <strong>Verdict: 5/10</strong></h3>
      <h3>10. Scorpio (Water) \\u2014 Surface vs. depth. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Capricorn (Earth) \\u2014 Different worlds. <strong>Verdict: 4/10</strong></h3>
      <h3>12. Pisces (Water) \\u2014 Logic meets intuition. <strong>Verdict: 4/10</strong></h3>

      <p>Want to see how you and your partner actually score? <a href="https://matchbybirth.com">Try the MatchByBirth calculator</a>.</p>
    `,
  },

  // ===== PILLAR GUIDE: PISCES =====
  {
    slug: 'pisces-compatibility',
    title: 'Pisces Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-14',
    description: 'Pisces is the zodiac\\'s dreamer and empath. Discover which signs Pisces is most (and least) compatible with.',
    tags: ['pisces','compatibility','zodiac','love','water-sign'],
    content: `
      <h1>Pisces Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Pisces \\u2014 the zodiac's mystic and empath. Ruled by Neptune, Pisces swims in emotion, intuition, and imagination.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Cancer (Water) \\u2014 The emotional sanctuary. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Scorpio (Water) \\u2014 The transformative bond. <strong>Verdict: 9/10</strong></h3>
      <h3>3. Taurus (Earth) \\u2014 The grounding romance. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Capricorn (Earth) \\u2014 The practical dreamer. <strong>Verdict: 7/10</strong></h3>
      <h3>5. Virgo (Earth) \\u2014 Opposite signs, complementary gifts. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Pisces (Water) \\u2014 The double dream. <strong>Verdict: 6/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Libra (Air) \\u2014 Charm vs. depth. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Aquarius (Air) \\u2014 Logic vs. feeling. <strong>Verdict: 5/10</strong></h3>
      <h3>9. Gemini (Air) \\u2014 Scattered vs. deep. <strong>Verdict: 4/10</strong></h3>
      <h3>10. Aries (Fire) \\u2014 Bold vs. gentle. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Leo (Fire) \\u2014 Drama vs. subtlety. <strong>Verdict: 4/10</strong></h3>
      <h3>12. Sagittarius (Fire) \\u2014 Freedom vs. fusion. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Use the MatchByBirth calculator</a> for your personalized reading.</p>
    `,
  },

  // ===== PILLAR GUIDE: AQUARIUS =====
  {
    slug: 'aquarius-compatibility',
    title: 'Aquarius Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-15',
    description: 'Aquarius is the zodiac\\'s rebel and visionary. Find out which signs are most compatible with Aquarius.',
    tags: ['aquarius','compatibility','zodiac','love','air-sign'],
    content: `
      <h1>Aquarius Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Aquarius \\u2014 the zodiac's innovator. Ruled by Uranus, Aquarius values independence and progressive ideals.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Gemini (Air) \\u2014 The freedom alliance. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Libra (Air) \\u2014 The social visionaries. <strong>Verdict: 8/10</strong></h3>
      <h3>3. Aries (Fire) \\u2014 The rebel alliance. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Sagittarius (Fire) \\u2014 The adventure philosophers. <strong>Verdict: 7/10</strong></h3>
      <h3>5. Aquarius (Air) \\u2014 The double vision. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Leo (Fire) \\u2014 Opposite signs, big sparks. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Taurus (Earth) \\u2014 Innovation vs. tradition. <strong>Verdict: 4/10</strong></h3>
      <h3>8. Cancer (Water) \\u2014 Independence vs. intimacy. <strong>Verdict: 4/10</strong></h3>
      <h3>9. Virgo (Earth) \\u2014 Analysis vs. innovation. <strong>Verdict: 5/10</strong></h3>
      <h3>10. Scorpio (Water) \\u2014 Depth vs. detachment. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Capricorn (Earth) \\u2014 Different ambitions. <strong>Verdict: 5/10</strong></h3>
      <h3>12. Pisces (Water) \\u2014 Logic vs. feeling. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> to see how you match.</p>
    `,
  },

  // ===== PILLAR GUIDE: CAPRICORN =====
  {
    slug: 'capricorn-compatibility',
    title: 'Capricorn Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-16',
    description: 'Capricorn is the zodiac\\'s achiever and strategist. Discover which signs Capricorn is most compatible with.',
    tags: ['capricorn','compatibility','zodiac','love','earth-sign'],
    content: `
      <h1>Capricorn Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Capricorn \\u2014 the zodiac's ambitious achiever. Ruled by Saturn, Capricorn values discipline and tangible results.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Taurus (Earth) \\u2014 The power couple. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Virgo (Earth) \\u2014 The strategic alliance. <strong>Verdict: 9/10</strong></h3>
      <h3>3. Scorpio (Water) \\u2014 The power duo. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Cancer (Water) \\u2014 Opposite signs, complementary needs. <strong>Verdict: 7/10</strong></h3>
      <h3>5. Pisces (Water) \\u2014 The practical dreamer. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Capricorn (Earth) \\u2014 The double ambition. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Libra (Air) \\u2014 Different priorities. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Aquarius (Air) \\u2014 Tradition vs. innovation. <strong>Verdict: 5/10</strong></h3>
      <h3>9. Gemini (Air) \\u2014 Different tempos. <strong>Verdict: 4/10</strong></h3>
      <h3>10. Aries (Fire) \\u2014 Different speeds. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Leo (Fire) \\u2014 Ego clashes. <strong>Verdict: 4/10</strong></h3>
      <h3>12. Sagittarius (Fire) \\u2014 Structure vs. freedom. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for your personalized synastry reading.</p>
    `,
  },

  // ===== PILLAR GUIDE: SAGITTARIUS =====
  {
    slug: 'sagittarius-compatibility',
    title: 'Sagittarius Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-17',
    description: 'Sagittarius is the zodiac\\'s adventurer and philosopher. Find out which signs are most compatible with Sagittarius.',
    tags: ['sagittarius','compatibility','zodiac','love','fire-sign'],
    content: `
      <h1>Sagittarius Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Sagittarius \\u2014 the zodiac's eternal explorer. Ruled by Jupiter, Sagittarius values freedom and the big picture.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Aries (Fire) \\u2014 The adventure duo. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Leo (Fire) \\u2014 The spotlight partnership. <strong>Verdict: 9/10</strong></h3>
      <h3>3. Aquarius (Air) \\u2014 The freedom philosophers. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Libra (Air) \\u2014 The social explorers. <strong>Verdict: 7/10</strong></h3>
      <h3>5. Sagittarius (Fire) \\u2014 The double adventure. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Gemini (Air) \\u2014 Opposite signs, complementary minds. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Taurus (Earth) \\u2014 Freedom vs. stability. <strong>Verdict: 4/10</strong></h3>
      <h3>8. Cancer (Water) \\u2014 Independence vs. intimacy. <strong>Verdict: 4/10</strong></h3>
      <h3>9. Virgo (Earth) \\u2014 Blunt vs. precise. <strong>Verdict: 5/10</strong></h3>
      <h3>10. Scorpio (Water) \\u2014 Freedom vs. control. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Capricorn (Earth) \\u2014 Structure vs. freedom. <strong>Verdict: 4/10</strong></h3>
      <h3>12. Pisces (Water) \\u2014 Adventure vs. sanctuary. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Use the MatchByBirth calculator</a> to see how you match.</p>
    `,
  },

  // ===== PILLAR GUIDE: SCORPIO =====
  {
    slug: 'scorpio-compatibility',
    title: 'Scorpio Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-18',
    description: 'Scorpio is the zodiac\\'s most intense and magnetic sign. Discover which signs can handle Scorpio\\'s depth.',
    tags: ['scorpio','compatibility','zodiac','love','water-sign'],
    content: `
      <h1>Scorpio Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Scorpio \\u2014 the zodiac's most intense sign. Ruled by Pluto, Scorpio values emotional depth and transformation.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Cancer (Water) \\u2014 The emotional fortress. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Pisces (Water) \\u2014 The spiritual merger. <strong>Verdict: 9/10</strong></h3>
      <h3>3. Capricorn (Earth) \\u2014 The power alliance. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Virgo (Earth) \\u2014 The analytical depth. <strong>Verdict: 7/10</strong></h3>
      <h3>5. Scorpio (Water) \\u2014 The double intensity. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Taurus (Earth) \\u2014 Opposite signs, magnetic attraction. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Leo (Fire) \\u2014 Power struggle. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Aquarius (Air) \\u2014 Depth vs. detachment. <strong>Verdict: 4/10</strong></h3>
      <h3>9. Gemini (Air) \\u2014 Surface vs. depth. <strong>Verdict: 4/10</strong></h3>
      <h3>10. Aries (Fire) \\u2014 Mars-ruled clash. <strong>Verdict: 5/10</strong></h3>
      <h3>11. Libra (Air) \\u2014 Diplomacy vs. intensity. <strong>Verdict: 5/10</strong></h3>
      <h3>12. Sagittarius (Fire) \\u2014 Freedom vs. control. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for your personalized reading.</p>
    `,
  },

  // ===== PILLAR GUIDE: LIBRA =====
  {
    slug: 'libra-compatibility',
    title: 'Libra Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-19',
    description: 'Libra is the zodiac\\'s diplomat and romantic. Discover which signs Libra is most compatible with.',
    tags: ['libra','compatibility','zodiac','love','air-sign'],
    content: `
      <h1>Libra Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Libra \\u2014 the zodiac's diplomat. Ruled by Venus, Libra values harmony, beauty, and partnership.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Gemini (Air) \\u2014 The intellectual romance. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Aquarius (Air) \\u2014 The progressive partnership. <strong>Verdict: 8/10</strong></h3>
      <h3>3. Leo (Fire) \\u2014 The glamorous romance. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Sagittarius (Fire) \\u2014 The social explorers. <strong>Verdict: 7/10</strong></h3>
      <h3>5. Libra (Air) \\u2014 The double harmony. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Aries (Fire) \\u2014 Opposite signs, complementary energy. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Taurus (Earth) \\u2014 Venus-ruled, different dialects. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Cancer (Water) \\u2014 Harmony vs. emotion. <strong>Verdict: 5/10</strong></h3>
      <h3>9. Virgo (Earth) \\u2014 Analysis vs. charm. <strong>Verdict: 5/10</strong></h3>
      <h3>10. Scorpio (Water) \\u2014 Diplomacy vs. intensity. <strong>Verdict: 5/10</strong></h3>
      <h3>11. Capricorn (Earth) \\u2014 Different priorities. <strong>Verdict: 5/10</strong></h3>
      <h3>12. Pisces (Water) \\u2014 Charm vs. depth. <strong>Verdict: 5/10</strong></h3>

      <p><a href="https://matchbybirth.com">Use the MatchByBirth calculator</a> to see how you match.</p>
    `,
  },

  // ===== PILLAR GUIDE: VIRGO =====
  {
    slug: 'virgo-compatibility',
    title: 'Virgo Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-22',
    description: 'Virgo is the zodiac\\'s analyst and perfectionist. Discover which signs Virgo is most compatible with.',
    tags: ['virgo','compatibility','zodiac','love','earth-sign'],
    content: `
      <h1>Virgo Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Virgo \\u2014 the zodiac's meticulous analyst. Ruled by Mercury, Virgo values precision and service.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Taurus (Earth) \\u2014 The practical partnership. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Capricorn (Earth) \\u2014 The strategic alliance. <strong>Verdict: 9/10</strong></h3>
      <h3>3. Cancer (Water) \\u2014 The nurturing connection. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Scorpio (Water) \\u2014 The analytical depth. <strong>Verdict: 7/10</strong></h3>
      <h3>5. Virgo (Earth) \\u2014 The double precision. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Pisces (Water) \\u2014 Opposite signs, complementary gifts. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Libra (Air) \\u2014 Analysis vs. charm. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Aquarius (Air) \\u2014 Precision vs. innovation. <strong>Verdict: 5/10</strong></h3>
      <h3>9. Gemini (Air) \\u2014 Mercury's children, different dialects. <strong>Verdict: 5/10</strong></h3>
      <h3>10. Aries (Fire) \\u2014 Patience vs. impulsiveness. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Leo (Fire) \\u2014 Criticism vs. pride. <strong>Verdict: 4/10</strong></h3>
      <h3>12. Sagittarius (Fire) \\u2014 Precision vs. freedom. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for your personalized synastry reading.</p>
    `,
  },

  // ===== PILLAR GUIDE: LEO =====
  {
    slug: 'leo-compatibility',
    title: 'Leo Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-23',
    description: 'Leo is the zodiac\\'s star and natural leader. Discover which signs can match Leo\\'s warmth and drama.',
    tags: ['leo','compatibility','zodiac','love','fire-sign'],
    content: `
      <h1>Leo Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Leo \\u2014 the zodiac's star. Ruled by the Sun, Leo values loyalty, creativity, and being adored.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Sagittarius (Fire) \\u2014 The adventure romance. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Aries (Fire) \\u2014 The power couple. <strong>Verdict: 8/10</strong></h3>
      <h3>3. Gemini (Air) \\u2014 The spotlight duo. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Libra (Air) \\u2014 The glamorous romance. <strong>Verdict: 8/10</strong></h3>
      <h3>5. Leo (Fire) \\u2014 The double spotlight. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Aquarius (Air) \\u2014 Opposite signs, big sparks. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Taurus (Earth) \\u2014 Stubbornness squared. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Cancer (Water) \\u2014 Drama vs. sensitivity. <strong>Verdict: 5/10</strong></h3>
      <h3>9. Virgo (Earth) \\u2014 Criticism vs. pride. <strong>Verdict: 4/10</strong></h3>
      <h3>10. Scorpio (Water) \\u2014 Power struggle. <strong>Verdict: 5/10</strong></h3>
      <h3>11. Capricorn (Earth) \\u2014 Different ambitions. <strong>Verdict: 4/10</strong></h3>
      <h3>12. Pisces (Water) \\u2014 Drama vs. subtlety. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> to see how you and your partner actually score.</p>
    `,
  },

  // ===== PILLAR GUIDE: CANCER =====
  {
    slug: 'cancer-compatibility',
    title: 'Cancer Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-24',
    description: 'Cancer is the zodiac\\'s nurturer and emotional anchor. Discover which signs Cancer is most compatible with.',
    tags: ['cancer','compatibility','zodiac','love','water-sign'],
    content: `
      <h1>Cancer Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Cancer \\u2014 the zodiac's nurturer. Ruled by the Moon, Cancer values emotional security and family.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Scorpio (Water) \\u2014 The emotional fortress. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Pisces (Water) \\u2014 The emotional sanctuary. <strong>Verdict: 9/10</strong></h3>
      <h3>3. Taurus (Earth) \\u2014 The nurturing home. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Virgo (Earth) \\u2014 The nurturing connection. <strong>Verdict: 8/10</strong></h3>
      <h3>5. Capricorn (Earth) \\u2014 Opposite signs, complementary needs. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Cancer (Water) \\u2014 The double nurturing. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Libra (Air) \\u2014 Harmony vs. emotion. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Aquarius (Air) \\u2014 Independence vs. intimacy. <strong>Verdict: 4/10</strong></h3>
      <h3>9. Gemini (Air) \\u2014 Emotional mismatch. <strong>Verdict: 4/10</strong></h3>
      <h3>10. Aries (Fire) \\u2014 Bold vs. gentle. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Leo (Fire) \\u2014 Drama vs. sensitivity. <strong>Verdict: 5/10</strong></h3>
      <h3>12. Sagittarius (Fire) \\u2014 Freedom vs. fusion. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> for your personalized reading.</p>
    `,
  },

  // ===== PILLAR GUIDE: TAURUS =====
  {
    slug: 'taurus-compatibility',
    title: 'Taurus Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-25',
    description: 'Taurus is the zodiac\\'s anchor and sensualist. Discover which signs Taurus is most compatible with.',
    tags: ['taurus','compatibility','zodiac','love','earth-sign'],
    content: `
      <h1>Taurus Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Taurus \\u2014 the zodiac's anchor. Ruled by Venus, Taurus values stability, comfort, and tangible beauty.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Virgo (Earth) \\u2014 The practical partnership. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Cancer (Water) \\u2014 The nurturing home. <strong>Verdict: 8/10</strong></h3>
      <h3>3. Capricorn (Earth) \\u2014 The power couple. <strong>Verdict: 9/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Pisces (Water) \\u2014 The grounding romance. <strong>Verdict: 8/10</strong></h3>
      <h3>5. Taurus (Earth) \\u2014 The double stability. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Scorpio (Water) \\u2014 Opposite signs, magnetic attraction. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Libra (Air) \\u2014 Venus-ruled, different dialects. <strong>Verdict: 5/10</strong></h3>
      <h3>8. Aquarius (Air) \\u2014 Tradition vs. innovation. <strong>Verdict: 4/10</strong></h3>
      <h3>9. Gemini (Air) \\u2014 Different tempos. <strong>Verdict: 4/10</strong></h3>
      <h3>10. Aries (Fire) \\u2014 Patience vs. impulsiveness. <strong>Verdict: 4/10</strong></h3>
      <h3>11. Leo (Fire) \\u2014 Ego clashes. <strong>Verdict: 5/10</strong></h3>
      <h3>12. Sagittarius (Fire) \\u2014 Stability vs. freedom. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> to see how you and your partner actually score.</p>
    `,
  },

  // ===== PILLAR GUIDE: ARIES =====
  {
    slug: 'aries-compatibility',
    title: 'Aries Compatibility With Every Zodiac Sign: Ranked Best to Worst',
    date: '2026-06-26',
    description: 'Aries is the zodiac\\'s pioneer and trailblazer. Discover which signs can keep up with Aries\\' energy.',
    tags: ['aries','compatibility','zodiac','love','fire-sign'],
    content: `
      <h1>Aries Compatibility With Every Zodiac Sign: Ranked Best to Worst</h1>
      <p>Aries \\u2014 the zodiac's pioneer. Ruled by Mars, Aries values courage, independence, and new beginnings.</p>

      <h2>\\u2728 Best Matches</h2>
      <h3>1. Leo (Fire) \\u2014 The power couple. <strong>Verdict: 9/10</strong></h3>
      <h3>2. Sagittarius (Fire) \\u2014 The adventure duo. <strong>Verdict: 9/10</strong></h3>
      <h3>3. Gemini (Air) \\u2014 The spark generator. <strong>Verdict: 8/10</strong></h3>

      <h2>\\u2696\\ufe0f Good Matches</h2>
      <h3>4. Aquarius (Air) \\u2014 The rebel alliance. <strong>Verdict: 8/10</strong></h3>
      <h3>5. Aries (Fire) \\u2014 The double spark. <strong>Verdict: 7/10</strong></h3>
      <h3>6. Libra (Air) \\u2014 Opposite signs, complementary energy. <strong>Verdict: 7/10</strong></h3>

      <h2>\\u26a1 Challenging Matches</h2>
      <h3>7. Taurus (Earth) \\u2014 Patience vs. impulsiveness. <strong>Verdict: 4/10</strong></h3>
      <h3>8. Cancer (Water) \\u2014 Bold vs. gentle. <strong>Verdict: 4/10</strong></h3>
      <h3>9. Virgo (Earth) \\u2014 Patience vs. impulsiveness. <strong>Verdict: 4/10</strong></h3>
      <h3>10. Scorpio (Water) \\u2014 Mars-ruled clash. <strong>Verdict: 5/10</strong></h3>
      <h3>11. Capricorn (Earth) \\u2014 Different speeds. <strong>Verdict: 4/10</strong></h3>
      <h3>12. Pisces (Water) \\u2014 Bold vs. gentle. <strong>Verdict: 4/10</strong></h3>

      <p><a href="https://matchbybirth.com">Try the MatchByBirth calculator</a> to see how you and your partner actually score.</p>
    `,
  },
"""

# Insert the new posts before the closing ];
# Find the last ]; which closes the posts array
insertion_point = content.rfind("];")
if insertion_point == -1:
    print("❌ Could not find closing ];")
    exit(1)

# Make sure the last post has a comma before we add more
# Find the last } before the ];
last_brace = content.rfind("}", 0, insertion_point)
if last_brace == -1:
    print("❌ Could not find last post brace")
    exit(1)

# Check if there's already a comma after the last brace
after_brace = content[last_brace+1:insertion_point].strip()
if not after_brace.endswith(","):
    # Add a comma
    content = content[:last_brace+1] + "," + content[last_brace+1:]

# Now insert the new posts
new_content = content[:insertion_point] + NEW_POSTS + "\n" + content[insertion_point:]

# Write back
with open(EXISTING_FILE, "w") as f:
    f.write(new_content)

# Count total posts
total_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", new_content))
print(f"✅ Merged 12 new pillar guide posts")
print(f"📊 Total posts now: {len(total_slugs)}")

# Verify build
print("\nVerifying build...")
import subprocess
result = subprocess.run(
    ["npm", "run", "build"],
    cwd="/Users/alijahfox/MatchbyBirth",
    capture_output=True,
    text=True,
    timeout=60
)
if result.returncode == 0:
    print("✅ Build successful!")
else:
    print(f"❌ Build failed:\n{result.stderr[-500:]}")
