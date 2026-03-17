# Geoffrey — 1962 Renault Dauphine Build Log

A car build log website for the 1962 Renault Dauphine restoration project. Built with [Astro](https://astro.build) (static output, hosted on GitHub Pages) and [Sanity](https://www.sanity.io) as the content backend.

---

## Stack

| Tool | Purpose |
|---|---|
| [Astro 5](https://astro.build) | Site framework (TypeScript, static output) |
| [Sanity v3](https://www.sanity.io) | Headless CMS — content API + hosted Studio |
| `@sanity/client` | Fetch content from Sanity at build time |
| `@sanity/image-url` | Build CDN image URLs from Sanity image assets |
| `@portabletext/to-html` | Render Portable Text body content to HTML |
| Plain CSS | Styling — dark theme, no framework |
| GitHub Pages | Static frontend hosting |

---

## Project Structure

```
geoffrey/
├── astro.config.mjs          # Astro config (static output)
├── tsconfig.json
├── .env.example              # Required environment variables
├── sanity/                   # Sanity Studio project
│   ├── sanity.config.ts      # Studio configuration
│   ├── schemas/
│   │   ├── buildLog.ts       # Build log content model
│   │   └── siteSettings.ts   # Site settings singleton
│   └── package.json
├── scripts/
│   └── migrate-to-sanity.mjs # One-time migration script (Keystatic → Sanity)
├── content/                  # Legacy Keystatic content (kept for reference)
├── public/
│   ├── favicon.svg
│   └── images/build-logs/    # Legacy local images (re-upload to Sanity)
└── src/
    ├── types/
    │   └── sanity.ts         # TypeScript types for Sanity documents
    ├── utils/
    │   ├── sanityClient.ts   # Sanity client instance
    │   ├── queries.ts        # GROQ queries
    │   ├── imageUrl.ts       # @sanity/image-url helper
    │   └── portableText.ts   # Portable Text → HTML renderer
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
    └── styles/
        └── global.css         # Global dark-theme CSS variables and utilities
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A [Sanity account](https://www.sanity.io) and project

### 1. Create a Sanity Project

```bash
# Install Sanity CLI globally (or use npx)
npm install -g sanity

# Create a new project (or use an existing one)
sanity init
```

Note your **Project ID** from [sanity.io/manage](https://www.sanity.io/manage).

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Sanity project ID:

```env
PUBLIC_SANITY_PROJECT_ID=your_project_id_here
PUBLIC_SANITY_DATASET=production
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Set Up the Sanity Studio

```bash
cd sanity
cp .env.example .env
# fill in SANITY_STUDIO_PROJECT_ID in sanity/.env
npm install
npm run dev
```

The Studio runs at [http://localhost:3333](http://localhost:3333).

### 5. Add Content

Use the Sanity Studio to:
- Create **Build Log** entries
- Edit **Site Settings** (title, hero text, about text, social links)

### 6. Run the Frontend

```bash
# Back in the root directory
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

---

## Migrating Existing Keystatic Content

If you have existing content in `content/build-logs/` and `content/site-settings.yaml`, run the migration script:

```bash
export SANITY_PROJECT_ID=your_project_id
export SANITY_TOKEN=your_write_token   # from sanity.io/manage → API → Tokens
node scripts/migrate-to-sanity.mjs
```

See [MIGRATION.md](./MIGRATION.md) for full details, including notes on image migration.

---

## Build

```bash
npm run build
```

Outputs to `dist/`. Content is fetched from the Sanity API at build time.

### Environment Variables for CI

Set these in your GitHub Actions secrets:

| Variable | Description |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `PUBLIC_SANITY_DATASET` | Dataset name (usually `production`) |

---

## Deploying the Studio

```bash
cd sanity
npm run deploy
```

This deploys the Studio to `https://your-project.sanity.studio`. You can also self-host it on Vercel, Netlify, or any static host.

---

## Content Model

### Build Log (`buildLog`)

| Field | Type | Notes |
|---|---|---|
| `title` | string | Display title |
| `slug` | slug | Auto-generated from title |
| `date` | date | ISO 8601 (YYYY-MM-DD) |
| `vehicle` | string (select) | Currently: `1962-renault-dauphine` |
| `phase` | string (select) | teardown, rust-repair, suspension, brakes, engine, transmission, wiring, interior, paint, bodywork, testing, misc |
| `status` | string (select) | planned, in-progress, complete, blocked |
| `odometer` | number | Miles (optional) |
| `hours` | number | Hours worked (optional) |
| `partsUsed` | string[] | List of parts and materials |
| `coverImage` | image | Cover photo (Sanity image asset) |
| `gallery` | image[] | Additional photos (Sanity image assets) |
| `summary` | text | Short description (shown on cards) |
| `body` | Portable Text | Full rich-text writeup |

### Site Settings (`siteSettings`)

| Field | Type |
|---|---|
| `siteTitle` | string |
| `siteDescription` | text |
| `heroTitle` | string |
| `heroText` | text |
| `aboutText` | text |
| `socialLinks` | array of `{ platform, url }` |

---

## Added / Removed Packages

### Added

```
@sanity/client        ^7.17.0   Sanity API client
@sanity/image-url     ^2.0.3    Image URL builder for Sanity assets
@portabletext/to-html ^5.0.2    Portable Text → HTML (server-side)
```

### Removed

```
@keystatic/core       (removed)
@keystatic/astro      (removed)
@astrojs/node         (removed — no longer needed for SSR)
@astrojs/react        (removed)
react                 (removed)
react-dom             (removed)
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home page with hero and 3 most recent build log entries |
| `/build-log` | All build log entries, newest first |
| `/build-log/[slug]` | Individual build log detail page |
| `/about` | About page with hero text and social links |

