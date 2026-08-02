// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

/**
 * De aquí salen las URL canónicas, el sitemap y las etiquetas Open Graph.
 *
 * TODO: confirmar el dominio definitivo con el cliente antes de publicar.
 *
 * Para una vista previa —enseñarle el sitio al cliente antes de tener el
 * dominio— se construye así:
 *
 *   VISTA_PREVIA=1 SITIO_PREVIA=https://loquesea.netlify.app corepack pnpm build
 *
 * Eso hace dos cosas: apunta las canónicas al enlace de prueba en vez de a un
 * dominio que no existe, y marca todas las páginas como `noindex` para que
 * Google no se quede con la versión provisional.
 */
const SITIO = process.env.SITIO_PREVIA || 'https://maderasdehonduras.hn';

export default defineConfig({
  site: SITIO,
  output: 'static',
  trailingSlash: 'never',
  /**
   * Las islas están escritas en React (JSX, hooks, `useSyncExternalStore`) y se
   * ejecutan sobre preact/compat.
   *
   * Motivo: el presupuesto del brief es JS del inicio < 60 KB comprimido y está
   * marcado como no negociable. Solo el runtime de react-dom pesa 58.5 KB
   * comprimido, así que React puro deja 1.5 KB para todo el código de la
   * aplicación: es imposible por aritmética, no por implementación.
   * Con preact/compat el mismo código fuente baja a ~12 KB en total.
   *
   * Si el cliente prefiere React puro, se revierte cambiando esta línea por
   * `react()` y los alias de `tsconfig.json`. Los componentes no se tocan.
   */
  integrations: [preact({ compat: true }), sitemap({ lastmod: new Date('2026-07-30') })],
  build: {
    // Una sola hoja de estilo, incrustada: en 3G lento una petición menos vale
    // más que el caché compartido entre páginas.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      cssCodeSplit: false,
    },
  },
});
