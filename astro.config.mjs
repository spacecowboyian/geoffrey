import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// In CI (GitHub Actions) we build a purely static site for GitHub Pages.
// Keystatic's admin UI requires SSR and cannot be served from GitHub Pages,
// so we exclude both the adapter and the Keystatic integration in that context.
const isCI = Boolean(process.env.CI);

export default defineConfig({
  ...(process.env.SITE && { site: process.env.SITE }),
  ...(process.env.BASE_PATH && { base: process.env.BASE_PATH }),
  outDir: './dist',
  ...(isCI ? {} : { adapter: node({ mode: 'standalone' }) }),
  integrations: [
    react(),
    ...(isCI ? [] : [keystatic()]),
  ],
});
