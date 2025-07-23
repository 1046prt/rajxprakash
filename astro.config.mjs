import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'url';

export default defineConfig({
  site: 'https://prakashraj.info',
  base: '/',
  integrations: [tailwind(), react()],
  output: 'static',
  server: {
    port: 4321,
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      assetsInlineLimit: 0,
    },
  },
});
