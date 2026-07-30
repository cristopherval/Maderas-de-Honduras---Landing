// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// TODO: confirmar el dominio definitivo con el cliente antes de publicar.
// De aquí salen las URL canónicas, el sitemap y las etiquetas Open Graph.
const SITIO = 'https://maderasdehonduras.hn';

export default defineConfig({
  site: SITIO,
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), sitemap({ lastmod: new Date('2026-07-30') })],
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  image: {
    // Marcadores de foto por ahora; el pipeline queda listo para reemplazarlos.
    formats: ['avif', 'webp'],
  },
  vite: {
    build: {
      cssCodeSplit: false,
    },
  },
});
