/**
 * Genera `public/og.png` (1200x630).
 *
 * La mayoría de estos enlaces se comparten por WhatsApp, que recorta la imagen
 * y la muestra chica: por eso el texto es grande, hay pocos elementos y el
 * contraste es alto.
 *
 * Se corre a mano: `node scripts/og.mjs`. La salida se versiona.
 *
 * TODO: rehacerla cuando llegue el logo real y, si se puede, con el trazado de
 * Archivo convertido a curvas. Aquí el título va con la fuente del sistema
 * porque librsvg no carga webfonts.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const VERDE_TINTA = '#0E2A1D';
const VERDE_MONTE = '#1C4B34';
const OCOTE = '#B4712A';
const ASERRIN = '#E7DFCE';
const CAL = '#F8F7F3';

const ESTRELLA =
  'M0,-1 L0.225,-0.309 L0.951,-0.309 L0.363,0.118 L0.588,0.809 ' +
  'L0,0.382 L-0.588,0.809 L-0.363,0.118 L-0.951,-0.309 L-0.225,-0.309 Z';

const CUERPOS_PINO = [
  'M0,-34 L9,-14 L-9,-14 Z',
  'M0,-24 L14,0 L-14,0 Z',
  'M0,-10 L17,18 L-17,18 Z',
  'M-2.5,18 h5 v8 h-5 Z',
];

const pino = (transform) =>
  `<g transform="${transform}">${CUERPOS_PINO.map((d) => `<path d="${d}"/>`).join('')}</g>`;

const marca = `
  <g transform="translate(88 74) scale(0.95)">
    <g fill="${CAL}">
      ${pino('translate(26 63.7) scale(0.78)')}
      ${pino('translate(94 63.7) scale(0.78)')}
      ${pino('translate(60 58)')}
    </g>
    <g fill="${VERDE_MONTE}">
      <path d="${ESTRELLA}" transform="translate(60 66) scale(4)"/>
      <path d="${ESTRELLA}" transform="translate(52 58) scale(3.6)"/>
      <path d="${ESTRELLA}" transform="translate(68 58) scale(3.6)"/>
      <path d="${ESTRELLA}" transform="translate(52 74) scale(3.6)"/>
      <path d="${ESTRELLA}" transform="translate(68 74) scale(3.6)"/>
    </g>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${VERDE_TINTA}"/>

  ${marca}

  <text x="240" y="118" font-family="Arial, Helvetica, sans-serif" font-size="26"
        font-weight="700" letter-spacing="4" fill="${ASERRIN}">MADERAS DE HONDURAS</text>
  <text x="240" y="152" font-family="Arial, Helvetica, sans-serif" font-size="22"
        letter-spacing="2" fill="${VERDE_MONTE}">ASERRADERO Y PLANTA PROCESADORA</text>

  <line x1="88" y1="212" x2="1112" y2="212" stroke="${VERDE_MONTE}" stroke-width="2"/>

  <text x="88" y="318" font-family="Arial Black, Arial, sans-serif" font-size="76"
        font-weight="900" fill="${CAL}">Pino, roble, caoba</text>
  <text x="88" y="400" font-family="Arial Black, Arial, sans-serif" font-size="76"
        font-weight="900" fill="${CAL}">y cedro, a tu medida</text>

  <line x1="88" y1="462" x2="1112" y2="462" stroke="${VERDE_MONTE}" stroke-width="2"/>

  <text x="88" y="524" font-family="Consolas, Courier New, monospace" font-size="28"
        fill="${ASERRIN}">4 ESPECIES</text>
  <text x="340" y="524" font-family="Consolas, Courier New, monospace" font-size="28"
        fill="${ASERRIN}">11 PRODUCTOS</text>
  <text x="640" y="524" font-family="Consolas, Courier New, monospace" font-size="28"
        fill="${ASERRIN}">PLANTA PROPIA 2013</text>

  <rect x="88" y="556" width="470" height="4" fill="${OCOTE}"/>
  <text x="88" y="596" font-family="Consolas, Courier New, monospace" font-size="26"
        fill="${OCOTE}">DESPACHAMOS DESDE 10,000 PIES TABLARES</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(path.join(raiz, 'public', 'og.png'), png);
console.log(`public/og.png — ${(png.length / 1024).toFixed(1)} KB`);
