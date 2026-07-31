#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fetchSanityBlogPosts, writeSanityPostsModule, writeChangeManifest } from './sanity-posts.js';

const outputPath = path.resolve(process.cwd(), 'src/data/posts/sanity-posts.generated.js');

try {
  const posts = await fetchSanityBlogPosts();
  writeSanityPostsModule({ posts, outputPath });
  writeChangeManifest({ posts, outputPath });
  console.log(`Synced ${posts.length} Sanity blog posts to ${outputPath}`);
} catch (error) {
  if (process.env.SANITY_SYNC_STRICT === '1') {
    throw error;
  }

  if (!fs.existsSync(outputPath)) {
    writeSanityPostsModule({ posts: [], outputPath });
  }

  console.warn(`Sanity sync skipped: ${error.message}`);
}
