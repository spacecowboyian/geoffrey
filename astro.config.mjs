import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  // Static output by default; the node adapter enables SSR for the Keystatic admin routes
  outDir: './dist',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    keystatic(),
  ],
});
