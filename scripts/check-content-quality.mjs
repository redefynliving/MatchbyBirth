#!/usr/bin/env node

import fs from 'node:fs'
import {analyzeDraftQuality} from '../studio-matchbybirth/tools/content-quality.mjs'

const inputPath = process.argv[2]

if (!inputPath) {
  console.error('Usage: node scripts/check-content-quality.mjs ./draft.json')
  process.exit(1)
}

const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
const result = analyzeDraftQuality(input)

console.log(JSON.stringify(result, null, 2))

if (!result.ok) {
  process.exit(1)
}
