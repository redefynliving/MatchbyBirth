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
   - Add a clear title, slug, category, topic, publish date, author, excerpt, and meta description.
   - Use `AJ Fox` as the public author unless you intentionally want a different byline.
   - Write the main article in `Article body`.
   - Use headings, short paragraphs, and examples. Avoid generic filler.

3. Add article quality blocks
   - `Quick takeaways`: 2-5 direct points.
   - `Example scenarios`: practical examples for readers.
   - `Comparison rows`: useful for methodology, timing, or sign-comparison posts.
   - `FAQ`: short questions that answer the reader's next concern.
   - `Related posts`: link to nearby articles so readers do not hit a dead end.

4. Publish
   - Set `Status` to `Published`.
   - Click `Publish`.

## Writing Rules

- Keep Match by Birth grounded and responsible.
- It is fine to say MBB Exact Mode can improve Sun sign placement when birth date, time, and selected birth place are provided.
- Do not say MBB guarantees compatibility, predicts relationship success, or proves love.
- Prefer specific examples over broad astrology claims.
- Every article should link readers back to the calculator or a related guide.

## Going Live

The Studio saves content in Sanity. The website syncs published Sanity posts during the web build and includes them in blog pages, sitemap output, and static HTML.

After publishing a post, trigger a Vercel deploy or use the configured Vercel Deploy Hook so the live site rebuilds with the latest Sanity content.
