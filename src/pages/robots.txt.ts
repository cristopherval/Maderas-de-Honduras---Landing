import type { APIRoute } from 'astro';

/**
 * `robots.txt` generado, no estático.
 *
 * Antes era un archivo fijo en `public/` con el dominio escrito a mano, así que
 * una vista previa publicaba un sitemap apuntando a un dominio que no existe y
 * se dejaba rastrear.
 *
 * En vista previa (`VISTA_PREVIA=1`) se prohíbe todo. En la construcción normal
 * se permite todo y se declara el sitemap del dominio real.
 */
export const GET: APIRoute = ({ site }) => {
  const vistaPrevia = process.env.VISTA_PREVIA === '1';

  const cuerpo = vistaPrevia
    ? [
        '# Vista previa para el cliente. No se indexa.',
        'User-agent: *',
        'Disallow: /',
        '',
      ].join('\n')
    : [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
        '',
      ].join('\n');

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
