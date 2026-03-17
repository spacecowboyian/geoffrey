# Migration Notes: Keystatic → Sanity

This document describes how to migrate existing Keystatic content into Sanity.

---

## Existing Content

The three existing build log entries are stored as `.mdoc` files in `content/build-logs/`. The site settings are in `content/site-settings.yaml`. These files remain in the repository as a reference but are no longer read by the site.

---

## Migration Script

Run the script below **once** after setting up your Sanity project to import the existing content.

### Prerequisites

- A Sanity project created at [sanity.io](https://www.sanity.io)
- The `@sanity/client` package available (already in the project)
- Your `SANITY_TOKEN` with write access (create one in `sanity.io/manage → API → Tokens`)

### Run

```bash
node scripts/migrate-to-sanity.mjs
```

The script is at `scripts/migrate-to-sanity.mjs` (see below). Set the required environment variables first:

```bash
export SANITY_PROJECT_ID=your_project_id
export SANITY_TOKEN=your_write_token
node scripts/migrate-to-sanity.mjs
```

---

## What the Script Does

1. Creates a `siteSettings` document from `content/site-settings.yaml`
2. Creates one `buildLog` document per `.mdoc` file in `content/build-logs/`
3. Converts the MDOC body to Portable Text blocks (headings, paragraphs, lists, blockquotes, code, links)
4. Preserves all frontmatter fields: title, date, vehicle, phase, status, odometer, hours, partsUsed, summary, slug

### Not Migrated Automatically

- **Images**: Cover images and gallery images referenced in the original content were stored in `public/images/build-logs/`. These need to be re-uploaded to Sanity manually via the Studio (or via the Assets API). The original images remain in `public/` for reference.
- **MDOC-specific formatting**: The body content used Keystatic's MDOC format. The migration script converts standard Markdown constructs. Complex or custom MDOC elements may need manual review.

---

## Manual Steps After Migration

1. **Create a Sanity project** at [sanity.io](https://www.sanity.io) and note your Project ID.
2. **Set environment variables** in `.env` (copy from `.env.example`).
3. **Run the migration script** to import existing content.
4. **Upload images** via Sanity Studio (`sanity/` directory).
5. **Deploy the Studio** with `cd sanity && npm run deploy` (or keep it local).
6. **Set `PUBLIC_SANITY_PROJECT_ID`** in your GitHub Actions secrets / Pages environment.

---

## Content Model Mapping

| Keystatic field | Sanity field | Notes |
|---|---|---|
| `title` (slug source) | `title` + `slug` (auto-generated) | Slug is now a separate field |
| `date` | `date` | Same format (YYYY-MM-DD) |
| `vehicle` | `vehicle` | Same values |
| `phase` | `phase` | Same values |
| `odometer` | `odometer` | Same |
| `hours` | `hours` | Same |
| `status` | `status` | Same values |
| `partsUsed` | `partsUsed` | Same (array of strings) |
| `coverImage` | `coverImage` | Now a Sanity image asset (not a file path) |
| `gallery` | `gallery` | Now an array of Sanity image assets |
| `summary` | `summary` | Same |
| `content` (MDOC document) | `body` (Portable Text) | Format changed |
| `siteSettings.github` | `siteSettings.socialLinks[platform=GitHub]` | Consolidated into `socialLinks` array |
| `siteSettings.instagram` | `siteSettings.socialLinks[platform=Instagram]` | Same |
| `siteSettings.youtube` | `siteSettings.socialLinks[platform=YouTube]` | Same |
