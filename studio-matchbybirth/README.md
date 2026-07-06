# Match by Birth Blog Studio

This is the Sanity Studio for writing Match by Birth blog posts without editing code.

## Start the Studio

From this folder:

```bash
npm run dev
```

Then open:

```text
http://localhost:3333/
```

## How to Use It

1. Create a category
   - Go to `Category`.
   - Add a title like `Birth Matching`, `Zodiac Signs`, `Numerology`, or `Relationship Timing`.
   - Generate the slug from the title.
   - Publish the category.

2. Create a blog post
   - Go to `Blog Post`.
   - Add a clear title, slug, category, topic, publish date, excerpt, and meta description.
   - Write the main article in `Article body`.
   - Use headings, short paragraphs, and examples. Avoid generic filler.

3. Add article quality blocks
   - `Quick takeaways`: 2-5 direct points.
   - `Example scenarios`: practical examples for readers.
   - `Comparison rows`: useful for methodology, timing, or sign-comparison posts.
   - `FAQ`: short questions that answer the reader's next concern.
   - `Related posts`: link to nearby articles so readers do not hit a dead end.

4. Approve and publish
   - Automation drafts should start with `Approval status` set to `Raw automation draft`.
   - The rewrite pass should fill `Article body` and set `Approval status` to `Ready for review`.
   - Review the post once, then click `Approve & Publish`.
   - The live website only syncs published posts whose approval status is either `Approved and published` or an older legacy post with no approval field.

## AI Draft Workflow

Use four steps only:

1. Hermes creates `title`, `slug`, `excerpt`, `metaTitle`, `metaDescription`, and `rawBody`.
2. A rewrite pass turns `rawBody` into the final Sanity `Article body`, removes filler, and sets `approvalStatus` to `ready`.
3. Sanity Studio shows `Approve & Publish` only when the post is ready and has a body.
4. The website build syncs only approved/published posts.

To create or update a raw automation draft from JSON:

```bash
SANITY_API_TOKEN=your_write_token node tools/upsert-ai-draft.mjs ./draft.json
```

The script writes to `drafts.blogPost.<slug>`, which keeps the Sanity draft/published relationship intact.

### Draft Prompt

```text
Write a first draft for Match by Birth.

Voice:
- premium
- calm
- minimal
- editorial
- clear, not mystical
- never generic SEO blog tone

Rules:
- answer directly
- short paragraphs
- no filler intros
- no "when it comes to"
- no "it's important to note"
- no "whether you're"
- no exaggerated certainty
- no fake warmth
- no long conclusions

Return JSON only:
{
  "title": "",
  "slug": "",
  "excerpt": "",
  "metaTitle": "",
  "metaDescription": "",
  "rawBody": ""
}

Topic: {{TOPIC}}
Keyword: {{KEYWORD}}
Notes: {{NOTES}}
```

### Rewrite Prompt

```text
Rewrite this Match by Birth draft so it sounds like a thoughtful human editor.

Brand voice:
- premium
- restrained
- emotionally precise
- grounded
- elegant, not flowery

Goals:
- remove AI filler
- remove generic transitions
- tighten sentences
- vary rhythm
- keep it short
- preserve the meaning
- do not add facts

If the draft still sounds generic, rewrite harder.

Return JSON only:
{
  "body": "",
  "approvalStatus": "ready",
  "slopFlags": []
}

Draft: {{RAW_BODY}}
```

## Writing Rules

- Keep Match by Birth grounded and responsible.
- It is fine to say Match by Birth Exact Mode can improve Sun sign placement when birth date, time, and selected birth place are provided.
- Do not say MBB guarantees compatibility, predicts relationship success, or proves love.
- Prefer specific examples over broad astrology claims.
- Every article should link readers back to the calculator or a related guide.

## Going Live

The website fetches approved Sanity posts at build time. After publishing, trigger the Vercel rebuild/deploy hook so the live blog, sitemap, and static HTML update together.
