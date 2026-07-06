#!/usr/bin/env node

import fs from 'node:fs'

const projectId = process.env.SANITY_PROJECT_ID || '4qj4p6px'
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_API_TOKEN
const inputPath = process.argv[2]

if (!token) {
  console.error('Set SANITY_API_TOKEN before writing a Sanity draft.')
  process.exit(1)
}

if (!inputPath) {
  console.error('Usage: SANITY_API_TOKEN=... node tools/upsert-ai-draft.mjs ./draft.json')
  process.exit(1)
}

const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'))

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

const slug = slugify(input.slug || input.title)

if (!slug || !input.title || !input.excerpt || !input.metaDescription || !input.rawBody) {
  console.error('Draft JSON needs title, slug/title, excerpt, metaDescription, and rawBody.')
  process.exit(1)
}

const document = {
  _id: `drafts.blogPost.${slug}`,
  _type: 'blogPost',
  title: input.title,
  slug: {_type: 'slug', current: slug},
  status: 'draft',
  approvalStatus: 'raw',
  aiGenerated: true,
  slopFlags: Array.isArray(input.slopFlags) ? input.slopFlags : [],
  excerpt: input.excerpt,
  metaTitle: input.metaTitle || input.title.slice(0, 60),
  metaDescription: input.metaDescription,
  rawBody: input.rawBody,
  topic: input.topic || 'birth-matching',
  calculatorCta: input.calculatorCta !== false,
}

if (input.categoryRef) {
  document.category = {_type: 'reference', _ref: input.categoryRef}
}

const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`
const response = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mutations: [{createOrReplace: document}],
  }),
})

if (!response.ok) {
  console.error(await response.text())
  process.exit(1)
}

console.log(`Upserted Sanity draft: ${document._id}`)
