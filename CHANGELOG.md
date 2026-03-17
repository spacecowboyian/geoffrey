# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed

- GitHub Actions deploy workflow now passes `PUBLIC_SANITY_PROJECT_ID` secret as an environment variable during the build step, so Astro can fetch data from Sanity at build time on GitHub Pages.

### Added

- Sanity webhook configured to trigger an automatic GitHub Pages redeploy on every content publish. Webhook POSTs to the GitHub Actions `workflow_dispatch` API endpoint (`/repos/spacecowboyian/geoffrey/actions/workflows/deploy.yml/dispatches`) so the site stays in sync with Sanity content without manual intervention. Requires a GitHub PAT (classic, `workflow` scope) stored as the webhook's `Authorization` header.
- `featured` boolean field added to the `buildLog` Sanity schema. Checking it in the Studio pins that entry to the top of the homepage as a full-width hero card. Only one entry should be featured at a time. Schema deployed to buildlog.sanity.studio.
- Homepage now fetches the featured entry via a dedicated `getFeaturedBuildLog()` query (`featured == true`). The remaining three most-recent entries fill the grid below, with the featured entry excluded so it never appears twice.
- `BuildLogCard` gains a `featured` prop that switches it to a horizontal full-width layout (image left, content right) with a larger title and more summary lines. Collapses to vertical on narrow screens.
