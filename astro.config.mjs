import { defineConfig } from 'astro/config';

export default defineConfig({
  ...(process.env.SITE && { site: process.env.SITE }),
  ...(process.env.BASE_PATH && { base: process.env.BASE_PATH }),
  outDir: './dist',
  output: 'static',
});
