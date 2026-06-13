#!/usr/bin/env python3
"""
Merge new pillar guide posts into src/data/posts/index.js
Reads the existing file, finds the closing ];, and inserts new posts before it.
"""

import re

EXISTING_FILE = "/Users/alijahfox/MatchbyBirth/apps/web/src/data/posts/index.js"
NEW_POSTS_FILE = "/Users/alijahfox/MatchbyBirth/apps/web/src/data/posts/new-pillar-guides.js"

# Read existing file
with open(EXISTING_FILE, "r") as f:
    existing_content = f.read()

# Read new posts
with open(NEW_POSTS_FILE, "r") as f:
    new_posts_content = f.read()

# Find existing slugs to check for duplicates
existing_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", existing_content))
new_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", new_posts_content))

duplicates = existing_slugs & new_slugs
if duplicates:
    print(f"⚠️  Skipping duplicate slugs: {duplicates}")
    # Remove duplicates from new posts content
    # This is a simple approach — for production, use a proper JS parser
    for slug in duplicates:
        pattern = r'\{\s*slug:\s*[\'"]' + re.escape(slug) + r'[\'"].*?\n  \},'
        new_posts_content = re.sub(pattern, '', new_posts_content, flags=re.DOTALL)

new_count = len(new_slugs) - len(duplicates)
print(f"Adding {new_count} new posts")

# Find the last ]; in the existing content (the array closing)
# We need to insert before the LAST ];
last_close = existing_content.rfind('];')

if last_close == -1:
    print("❌ Could not find closing ]; in existing file")
    exit(1)

# Build the insertion
insertion = "\n" + new_posts_content.strip() + "\n"

# Insert before ];
new_content = existing_content[:last_close] + insertion + existing_content[last_close:]

# Write back
with open(EXISTING_FILE, "w") as f:
    f.write(new_content)

print(f"✅ Merged {new_count} new posts into {EXISTING_FILE}")

# Count total posts
total_slugs = set(re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", new_content))
print(f"📊 Total posts now: {len(total_slugs)}")
