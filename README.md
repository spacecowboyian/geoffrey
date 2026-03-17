# Geoffrey — 1962 Renault Dauphine Build Log

A car build log website for the 1962 Renault Dauphine restoration project. Built with [Astro](https://astro.build) and [Keystatic](https://keystatic.com) as a flat-file CMS. All content lives in the repo.

---

## Stack

| Tool | Purpose |
|---|---|
| [Astro 5](https://astro.build) | Site framework (TypeScript, static output) |
| [Keystatic](https://keystatic.com) | Flat-file CMS with browser-based admin UI |
| Plain CSS | Styling — dark theme, no framework |
| `@astrojs/node` | Node adapter for Keystatic admin SSR |

---

## Project Structure

```
geoffrey/
├── astro.config.mjs          # Astro config (node adapter + Keystatic integration)
├── keystatic.config.ts       # Content model definitions
├── tsconfig.json
├── content/
│   ├── site-settings.yaml    # Site title, hero text, about text, social links
│   └── build-logs/           # One .mdoc file per build log entry
│       ├── first-look-teardown.mdoc
│       ├── floor-pan-rust-repair.mdoc
│       └── front-suspension-rebuild.mdoc
├── public/
│   ├── favicon.svg
│   └── images/build-logs/    # Drop photos here (referenced by Keystatic)
└── src/
    ├── layouts/
    │   └── Layout.astro      # Base HTML layout (header + footer)
    ├── components/
    │   ├── BuildLogCard.astro # Card used on home + index pages
    │   ├── MetaDisplay.astro  # Metadata grid (date, phase, status, odometer…)
    │   └── Gallery.astro      # Photo gallery grid
    ├── pages/
    │   ├── index.astro        # Home page
    │   ├── about.astro        # About page
    │   └── build-log/
    │       ├── index.astro    # Build log index (all entries)
    │       └── [slug].astro   # Individual build log detail page
    ├── styles/
    │   └── global.css         # Global dark-theme CSS variables and utilities
    └── utils/
        └── renderDocument.ts  # Converts Keystatic document AST → HTML
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) for the site.

### Keystatic Admin UI

With the dev server running, open [http://localhost:4321/keystatic](http://localhost:4321/keystatic).

From there you can:
- Add, edit, and delete **Build Log** entries
- Edit **Site Settings** (title, hero text, about text, social links)

Content is saved directly to files in the `content/` directory — no database, no API key, no cloud required.

### Build

```bash
npm run build
```

Outputs to `dist/`. Static pages are pre-rendered at build time. The Keystatic admin routes (`/keystatic/*` and `/api/keystatic/*`) are SSR and handled by the Node adapter.

### Preview the build

```bash
npm run preview
```

---

## Adding a New Build Log Entry

### Via Keystatic UI (recommended)

1. Run `npm run dev`
2. Go to [http://localhost:4321/keystatic](http://localhost:4321/keystatic)
3. Click **Build Logs → Add**
4. Fill in the fields and write the content
5. Save — Keystatic writes a `.mdoc` file to `content/build-logs/`

### Manually

Create a new file in `content/build-logs/` named `your-slug.mdoc`:

```mdoc
---
title: 'Your Entry Title'
date: '2024-06-01'
vehicle: 1962-renault-dauphine
phase: engine          # teardown | rust-repair | suspension | brakes | engine |
                       # transmission | wiring | interior | paint | bodywork | testing | misc
status: in-progress    # planned | in-progress | complete | blocked
odometer: 89500
hours: 4
partsUsed:
  - Part name here
  - Another part
summary: Short one-sentence summary shown on cards.
coverImage: ~          # or: /images/build-logs/your-photo.jpg
gallery: []
---

## Heading

Your full writeup goes here. Standard Markdown is supported.
```

The slug is the filename (without `.mdoc`). The entry will appear immediately in `npm run dev` and on the next build.

---

## Adding Photos

Place image files in `public/images/build-logs/`. They'll be served at `/images/build-logs/filename.jpg`.

Reference them in your content frontmatter:

```yaml
coverImage: /images/build-logs/my-photo.jpg
gallery:
  - /images/build-logs/photo-1.jpg
  - /images/build-logs/photo-2.jpg
```

Or use the Keystatic UI image picker, which handles placement automatically.

---

## Content Model

### Build Log (`content/build-logs/*.mdoc`)

| Field | Type | Notes |
|---|---|---|
| `title` | text | Display title |
| `date` | date | ISO 8601 (YYYY-MM-DD) |
| `vehicle` | select | Currently: `1962-renault-dauphine` |
| `phase` | select | teardown, rust-repair, suspension, brakes, engine, transmission, wiring, interior, paint, bodywork, testing, misc |
| `status` | select | planned, in-progress, complete, blocked |
| `odometer` | integer | Miles (optional) |
| `hours` | number | Hours worked (optional) |
| `partsUsed` | string[] | List of parts and materials |
| `coverImage` | image | Cover photo — stored in `public/images/build-logs/` |
| `gallery` | image[] | Additional photos |
| `summary` | text | Short description (shown on cards) |
| `content` | document | Full rich-text writeup (MDOC body) |

### Site Settings (`content/site-settings.yaml`)

| Field | Type |
|---|---|
| `siteTitle` | text |
| `siteDescription` | text |
| `heroTitle` | text |
| `heroText` | text (multiline) |
| `aboutText` | text (multiline) |
| `github` | url |
| `instagram` | url |
| `youtube` | url |

---

## Deployment

### Vercel / Netlify

Replace `@astrojs/node` with `@astrojs/vercel` or `@astrojs/netlify`:

```bash
npm install @astrojs/vercel
```

```js
// astro.config.mjs
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  integrations: [react(), keystatic()],
});
```

Note: Keystatic's local file-based editing only works in local development. For production CMS editing, configure [Keystatic Cloud](https://keystatic.com/docs/cloud) or GitHub mode.

### Static-only (no admin on server)

If you only need a static site without server-side Keystatic, remove the adapter and integrations from `astro.config.mjs`, change `output` to `'static'`, and use Keystatic only locally to edit content before each deploy.

---

## Files Created by This Scaffold

```
astro.config.mjs
keystatic.config.ts
tsconfig.json
package.json
.gitignore
public/favicon.svg
public/images/build-logs/       (empty — add your photos here)
content/site-settings.yaml
content/build-logs/first-look-teardown.mdoc
content/build-logs/floor-pan-rust-repair.mdoc
content/build-logs/front-suspension-rebuild.mdoc
src/layouts/Layout.astro
src/components/BuildLogCard.astro
src/components/MetaDisplay.astro
src/components/Gallery.astro
src/pages/index.astro
src/pages/about.astro
src/pages/build-log/index.astro
src/pages/build-log/[slug].astro
src/styles/global.css
src/utils/renderDocument.ts
```

## Packages Added

```
astro                  ^5.0.0   Site framework
@keystatic/core        ^0.5.0   CMS content model + reader
@keystatic/astro       ^5.0.0   Astro integration (injects admin routes)
@astrojs/node          ^9.0.0   Node adapter (SSR for Keystatic admin)
@astrojs/react         ^5.0.0   React integration (required by Keystatic UI)
react                  ^19.x    Peer dependency for Keystatic
react-dom              ^19.x    Peer dependency for Keystatic
```

## Manual Steps

1. **Add photos** — place build log photos in `public/images/build-logs/` and reference them in `.mdoc` frontmatter or via the Keystatic UI.
2. **Update site settings** — go to `/keystatic` and edit the Site Settings singleton with your own title, hero text, about text, and social links.
3. **Swap the adapter** for Vercel or Netlify before deploying (see Deployment section above).
4. **Extend the vehicle select** — add new `{ label, value }` entries to the `vehicle` field in `keystatic.config.ts` as needed.
