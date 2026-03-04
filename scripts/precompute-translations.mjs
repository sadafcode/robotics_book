/**
 * Build-time Urdu pre-translation script.
 * Reads all built HTML files, extracts text nodes, translates via
 * Helsinki-NLP/opus-mt-en-ur (free HuggingFace Inference API),
 * and saves build/translations-ur.json for instant frontend lookup.
 *
 * Usage: node scripts/precompute-translations.mjs
 * Optional env: HF_TOKEN=hf_xxx (improves rate limits)
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

const HF_API = 'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-ur';
const BUILD_DIR = './build';
const OUTPUT = join(BUILD_DIR, 'translations-ur.json');
const BATCH_SIZE = 10;       // texts per HF request (keep small for free tier)
const BATCH_DELAY_MS = 2000; // pause between batches to respect free-tier rate limits
const MAX_TEXT_LEN = 400;    // skip very long blocks (unlikely to be single nodes)

// Same tags skipped by TranslationWrapper in the browser
const SKIP_TAG_RE = /<(code|pre|script|style|svg|kbd|samp|var|math)[^>]*>[\s\S]*?<\/\1>/gi;

/** Extract visible text segments from an HTML string (mirrors browser TreeWalker logic) */
function extractTexts(html) {
  // Strip skip-tag blocks first
  const clean = html
    .replace(SKIP_TAG_RE, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const texts = new Set();
  const re = />([^<]{3,})</g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const t = m[1].trim();
    if (
      t.length > 2 &&
      t.length <= MAX_TEXT_LEN &&
      /[a-zA-Z]/.test(t) &&          // must contain English letters
      !/^\s*[{};:=<>\/\\]+\s*$/.test(t) // skip pure code symbols
    ) {
      texts.add(t);
    }
  }
  return [...texts];
}

/** Recursively find all .html files under a directory */
async function findHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...await findHtmlFiles(full));
    else if (e.name.endsWith('.html')) files.push(full);
  }
  return files;
}

/** Call HuggingFace Inference API with retry on model-loading 503 */
async function translateBatch(texts) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    console.error('\nERROR: HF_TOKEN env var not set.');
    console.error('Get a free token at https://huggingface.co/settings/tokens');
    console.error('Then add it as a GitHub Actions secret named HF_TOKEN\n');
    process.exit(1);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  for (let attempt = 1; attempt <= 4; attempt++) {
    let res;
    try {
      res = await fetch(HF_API, {
        method: 'POST',
        headers,
        body: JSON.stringify({ inputs: texts }),
      });
    } catch (e) {
      console.warn(`  Network error (attempt ${attempt}):`, e.message);
      await sleep(5000);
      continue;
    }

    if (res.status === 503) {
      // Model is still loading on HF's side
      let wait = 20000;
      try { wait = ((await res.json()).estimated_time ?? 20) * 1000; } catch {}
      console.log(`  Model loading, waiting ${Math.round(wait / 1000)}s…`);
      await sleep(wait);
      continue;
    }

    if (res.status === 429) {
      console.warn('  Rate limited, waiting 15s…');
      await sleep(15000);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      console.warn(`  HF API error ${res.status}: ${body} — keeping originals`);
      return texts;
    }

    const data = await res.json();
    if (!Array.isArray(data)) return texts;

    // Batch response: [[{translation_text}], [{translation_text}], ...]
    // Single response: [{translation_text}]
    return data.map((item, i) => {
      if (Array.isArray(item)) return item[0]?.translation_text ?? texts[i];
      return item?.translation_text ?? texts[i];
    });
  }

  console.warn('  All retries failed — keeping originals');
  return texts;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log('=== Build-time Urdu pre-translation ===\n');

  // 1. Gather all HTML files
  const htmlFiles = await findHtmlFiles(BUILD_DIR);
  console.log(`Found ${htmlFiles.length} HTML files`);

  // 2. Extract unique text segments across all pages
  const allTexts = new Set();
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf-8');
    extractTexts(html).forEach((t) => allTexts.add(t));
  }
  const unique = [...allTexts];
  console.log(`Unique translatable segments: ${unique.length}\n`);

  if (unique.length === 0) {
    console.log('Nothing to translate.');
    await writeFile(OUTPUT, '{}');
    return;
  }

  // 3. Translate in batches
  const translations = {};
  const totalBatches = Math.ceil(unique.length / BATCH_SIZE);

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batch = unique.slice(i, i + BATCH_SIZE);
    process.stdout.write(`Translating batch ${batchNum}/${totalBatches}… `);

    const results = await translateBatch(batch);

    batch.forEach((orig, j) => {
      // Use same getCacheKey logic as translationService.ts
      const key = `ur:${orig.slice(0, 100)}`;
      translations[key] = results[j] ?? orig;
    });

    console.log('done');

    if (i + BATCH_SIZE < unique.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  // 4. Save
  await writeFile(OUTPUT, JSON.stringify(translations));
  console.log(`\nSaved ${Object.keys(translations).length} translations → ${OUTPUT}`);
}

main().catch((e) => {
  console.error('Translation pre-computation failed:', e);
  process.exit(1);
});
