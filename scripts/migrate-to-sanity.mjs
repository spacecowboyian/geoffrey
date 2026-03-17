/**
 * Migration script: Keystatic → Sanity
 *
 * Imports existing .mdoc build log entries and site-settings.yaml into Sanity.
 *
 * Usage:
 *   export SANITY_PROJECT_ID=your_project_id
 *   export SANITY_TOKEN=your_write_token
 *   node scripts/migrate-to-sanity.mjs
 *
 * Dataset defaults to "production". Override with SANITY_DATASET env var.
 */

import { createClient } from '@sanity/client';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

// ── Sanity client ────────────────────────────────────────────────────────────

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_TOKEN;
const dataset = process.env.SANITY_DATASET ?? 'production';

if (!projectId || !token) {
  console.error('ERROR: SANITY_PROJECT_ID and SANITY_TOKEN must be set.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

// ── YAML parser (minimal, no deps) ──────────────────────────────────────────

function parseYaml(text) {
  const result = {};
  const lines = text.split('\n');
  let currentKey = null;
  let arrayItems = null;

  for (const line of lines) {
    const arrayItemMatch = line.match(/^(\s+)- (.+)$/);
    const keyValueMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_]*): (.*)$/);
    const bareKeyMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_]*):$/);

    if (arrayItemMatch && currentKey && arrayItems !== null) {
      arrayItems.push(arrayItemMatch[2].trim().replace(/^['"]|['"]$/g, ''));
    } else if (keyValueMatch) {
      if (arrayItems !== null && currentKey) result[currentKey] = arrayItems;
      arrayItems = null;
      currentKey = keyValueMatch[1];
      let value = keyValueMatch[2].trim();
      if (value === '~' || value === 'null') {
        result[currentKey] = null;
      } else if (value.startsWith('"') && value.endsWith('"')) {
        result[currentKey] = value.slice(1, -1).replace(/\\n/g, '\n');
      } else if (value.startsWith("'") && value.endsWith("'")) {
        result[currentKey] = value.slice(1, -1);
      } else if (value === '') {
        // Will collect as multiline or array below
      } else {
        result[currentKey] = isNaN(Number(value)) ? value : Number(value);
      }
    } else if (bareKeyMatch) {
      if (arrayItems !== null && currentKey) result[currentKey] = arrayItems;
      currentKey = bareKeyMatch[1];
      arrayItems = [];
    }
  }

  if (arrayItems !== null && currentKey) result[currentKey] = arrayItems;
  return result;
}

// ── MDOC parser ─────────────────────────────────────────────────────────────

function parseMdoc(fileContent) {
  const fmMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { frontmatter: {}, body: '' };

  const frontmatter = parseYaml(fmMatch[1]);
  const body = fmMatch[2].trim();
  return { frontmatter, body };
}

// ── Markdown → Portable Text ─────────────────────────────────────────────────

function markdownToPortableText(md) {
  const blocks = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading
    const headingMatch = line.match(/^(#{1,6}) (.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const style = level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : level === 4 ? 'h4' : 'h5';
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style,
        children: [{ _type: 'span', _key: randomKey(), text: headingMatch[2].trim(), marks: [] }],
        markDefs: [],
      });
      i++;
      continue;
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}$/)) {
      // skip — no portable text equivalent for hr
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const text = line.slice(2);
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: 'blockquote',
        children: inlineToSpans(text),
        markDefs: [],
      });
      i++;
      continue;
    }

    // Unordered list item
    if (line.match(/^[-*] /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        listItems.push({
          _type: 'block',
          _key: randomKey(),
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          children: inlineToSpans(lines[i].slice(2)),
          markDefs: [],
        });
        i++;
      }
      blocks.push(...listItems);
      continue;
    }

    // Ordered list item
    if (line.match(/^\d+\. /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push({
          _type: 'block',
          _key: randomKey(),
          style: 'normal',
          listItem: 'number',
          level: 1,
          children: inlineToSpans(lines[i].replace(/^\d+\. /, '')),
          markDefs: [],
        });
        i++;
      }
      blocks.push(...listItems);
      continue;
    }

    // Code block
    if (line.startsWith('```')) {
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        children: [{ _type: 'span', _key: randomKey(), text: codeLines.join('\n'), marks: ['code'] }],
        markDefs: [],
      });
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-blank lines
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^#{1,6} /) && !lines[i].startsWith('```') && !lines[i].startsWith('> ') && !lines[i].match(/^[-*] /) && !lines[i].match(/^\d+\. /)) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        children: inlineToSpans(paraLines.join(' ')),
        markDefs: [],
      });
    }
  }

  return blocks;
}

function inlineToSpans(text) {
  // Very simple inline parser: bold, italic, code, links
  const spans = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/^([\s\S]*?)\*\*([\s\S]+?)\*\*([\s\S]*)$/);
    if (boldMatch && boldMatch[1].length < remaining.indexOf('**')) {
      if (boldMatch[1]) spans.push({ _type: 'span', _key: randomKey(), text: boldMatch[1], marks: [] });
      spans.push({ _type: 'span', _key: randomKey(), text: boldMatch[2], marks: ['strong'] });
      remaining = boldMatch[3];
      continue;
    }

    // Italic
    const italicMatch = remaining.match(/^([\s\S]*?)\*([\s\S]+?)\*([\s\S]*)$/);
    if (italicMatch && italicMatch[1].length < remaining.indexOf('*')) {
      if (italicMatch[1]) spans.push({ _type: 'span', _key: randomKey(), text: italicMatch[1], marks: [] });
      spans.push({ _type: 'span', _key: randomKey(), text: italicMatch[2], marks: ['em'] });
      remaining = italicMatch[3];
      continue;
    }

    // Code
    const codeMatch = remaining.match(/^([\s\S]*?)`([\s\S]+?)`([\s\S]*)$/);
    if (codeMatch) {
      if (codeMatch[1]) spans.push({ _type: 'span', _key: randomKey(), text: codeMatch[1], marks: [] });
      spans.push({ _type: 'span', _key: randomKey(), text: codeMatch[2], marks: ['code'] });
      remaining = codeMatch[3];
      continue;
    }

    // Plain text
    spans.push({ _type: 'span', _key: randomKey(), text: remaining, marks: [] });
    break;
  }

  return spans.length > 0 ? spans : [{ _type: 'span', _key: randomKey(), text: text, marks: [] }];
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Migrate site settings ────────────────────────────────────────────────────

async function migrateSiteSettings() {
  const yamlPath = join(ROOT, 'content', 'site-settings.yaml');
  const raw = readFileSync(yamlPath, 'utf-8');
  const data = parseYaml(raw);

  const socialLinks = [];
  if (data.github) socialLinks.push({ _type: 'object', _key: randomKey(), platform: 'GitHub', url: data.github });
  if (data.instagram) socialLinks.push({ _type: 'object', _key: randomKey(), platform: 'Instagram', url: data.instagram });
  if (data.youtube) socialLinks.push({ _type: 'object', _key: randomKey(), platform: 'YouTube', url: data.youtube });

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: data.siteTitle ?? 'Geoffrey',
    siteDescription: data.siteDescription ?? '',
    heroTitle: data.heroTitle ?? '',
    heroText: data.heroText ?? '',
    aboutText: data.aboutText ?? '',
    socialLinks,
  };

  await client.createOrReplace(doc);
  console.log('✓ Site settings migrated');
}

// ── Migrate build logs ────────────────────────────────────────────────────────

async function migrateBuildLogs() {
  const logsDir = join(ROOT, 'content', 'build-logs');
  const files = readdirSync(logsDir).filter((f) => f.endsWith('.mdoc'));

  for (const file of files) {
    const slug = basename(file, '.mdoc');
    const content = readFileSync(join(logsDir, file), 'utf-8');
    const { frontmatter, body } = parseMdoc(content);

    const portableTextBody = markdownToPortableText(body);

    const doc = {
      _id: `buildLog-${slug}`,
      _type: 'buildLog',
      title: frontmatter.title ?? slug,
      slug: { _type: 'slug', current: slug },
      date: frontmatter.date ?? null,
      vehicle: frontmatter.vehicle ?? '1962-renault-dauphine',
      phase: frontmatter.phase ?? 'misc',
      odometer: frontmatter.odometer ?? null,
      hours: frontmatter.hours ?? null,
      status: frontmatter.status ?? 'planned',
      partsUsed: Array.isArray(frontmatter.partsUsed) ? frontmatter.partsUsed : [],
      coverImage: null,
      gallery: [],
      summary: frontmatter.summary ?? '',
      body: portableTextBody,
    };

    await client.createOrReplace(doc);
    console.log(`✓ Build log migrated: ${slug}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Migrating to Sanity project "${projectId}" (dataset: ${dataset})…\n`);
  await migrateSiteSettings();
  await migrateBuildLogs();
  console.log('\nMigration complete.');
  console.log('NOTE: Images are not migrated automatically. Please re-upload them via Sanity Studio.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
