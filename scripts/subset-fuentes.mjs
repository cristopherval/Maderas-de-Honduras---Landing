/**
 * Recorta las fuentes al juego de caracteres que realmente usa el sitio (español
 * de Honduras + signos de medida) y las deja en `public/fonts/`.
 *
 * Se corre a mano, no en cada build: `pnpm fuentes`. La salida se versiona,
 * así el despliegue no depende de que este script vuelva a correr.
 *
 * Archivo completo con eje de ancho pesa 88 KB. Recortado ronda los 25 KB, y ese
 * es el titular del héroe: es el archivo que decide el LCP en 3G lento.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import subsetFont from 'subset-font';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.join(raiz, 'public', 'fonts');

/** Todo lo que puede aparecer en pantalla. Sin ★ ni ▸: esos van en SVG/CSS. */
const JUEGO_CARACTERES = [
  'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
  'abcdefghijklmnñopqrstuvwxyz',
  'ÁÉÍÓÚÜáéíóúü',
  '0123456789',
  ' .,:;!?¡¿()[]{}«»""\'\'—–-_/\\|@#%&*+=<>',
  '·°"′″', // punto medio, grado, comilla recta, prima (pies), doble prima (pulgadas)
  '$€₡', // lempira usa L, pero dejamos símbolos de moneda comunes por si acaso
].join('');

const TRABAJOS = [
  {
    entrada: '@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2',
    salida: 'archivo-latin.woff2',
    // El display solo se usa en negrita y de ancho normal a expandido. Recortar
    // los ejes a ese rango quita las interpolaciones que nunca vamos a pedir.
    ejes: { wght: { min: 600, max: 800 }, wdth: { min: 100, max: 125 } },
    nota: 'display — wght 600..800, wdth 100..125',
  },
  {
    entrada: '@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2',
    salida: 'instrument-sans-latin.woff2',
    ejes: { wght: { min: 400, max: 600 } },
    nota: 'cuerpo — wght 400..600',
  },
  {
    entrada: '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
    salida: 'ibm-plex-mono-400-latin.woff2',
    nota: 'datos — regular',
  },
  {
    entrada: '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2',
    salida: 'ibm-plex-mono-600-latin.woff2',
    nota: 'datos — semibold',
  },
];

await mkdir(destino, { recursive: true });

for (const trabajo of TRABAJOS) {
  const origen = path.join(raiz, 'node_modules', trabajo.entrada);
  const original = await readFile(origen);
  const recortada = await subsetFont(original, JUEGO_CARACTERES, {
    targetFormat: 'woff2',
    ...(trabajo.ejes ? { variationAxes: trabajo.ejes } : {}),
  });
  await writeFile(path.join(destino, trabajo.salida), recortada);

  const antes = (original.length / 1024).toFixed(1);
  const despues = (recortada.length / 1024).toFixed(1);
  console.log(`${trabajo.salida.padEnd(32)} ${antes} KB -> ${despues} KB  (${trabajo.nota})`);
}
