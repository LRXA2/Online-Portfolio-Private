import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lrxa2.github.io',
  base: '/Online-Portfolio-Private',
  redirects: {
    '/about': '/', // about page folded into landing; keep old links alive
  },
});
