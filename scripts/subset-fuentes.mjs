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

/**
 * Una sola familia para todo el sitio: Libre Franklin, del linaje de la Franklin
 * Gothic, que es la tipografía de los catálogos comerciales. Antes eran tres
 * (display, cuerpo y una monoespaciada para los datos); la monoespaciada se fue
 * con la calculadora y el par display/cuerpo se colapsó en esta.
 *
 * Un solo archivo variable: una petición en vez de cuatro, y el peso baja de
 * 64 KB a lo que salga de recortar el eje wght a 400..700.
 */
const TRABAJOS = [
  {
    entrada: '@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-normal.woff2',
    salida: 'libre-franklin-latin.woff2',
    ejes: { wght: { min: 400, max: 700 } },
    nota: 'todo el sitio — wght 400..700',
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
