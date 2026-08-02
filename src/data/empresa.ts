/**
 * Datos de la empresa. Única fuente de verdad.
 *
 * Nada de lo que está aquí es inventado: todo viene del cliente. Lo que el
 * cliente todavía no tiene está en `null` o en arreglo vacío, y la interfaz
 * está obligada a ocultarlo mientras siga así. El día que exista, se cambia
 * una línea de este archivo y aparece en todo el sitio.
 */

export const NOMBRE = 'Maderas de Honduras';
export const RUBRO = 'Aserradero y planta procesadora de madera';

export const DIRECCION = {
  linea: 'Carretera de Tegucigalpa a Olancho, km 60, calle hacia Valle Arriba, a 400 metros del desvío',
  corta: 'Km 60, carretera a Olancho',
  departamento: 'Francisco Morazán',
  pais: 'Honduras',
} as const;

/** Teléfonos reales. El primero es el que se usa para WhatsApp. */
export const TELEFONOS = ['8843-9226', '3326-0151'] as const;

/**
 * Formato internacional para wa.me, sin signos ni espacios.
 * TODO: confirmar cuál de los dos números tiene WhatsApp.
 */
export const WHATSAPP_PRINCIPAL = '50488439226';

/**
 * No existe todavía. Mientras sea `null`, ningún componente puede pintar una
 * dirección de correo. Prohibido rellenar con `info@...`.
 */
export const EMAIL_CONTACTO: string | null = null;

/**
 * Video de fondo del héroe. Mientras sea `null` se pinta la foto de fondo.
 *
 * Cuando el cliente entregue el video: se deja el archivo en `public/video/`
 * y acá se pone la ruta, por ejemplo `/video/planta.mp4`. La maqueta no se
 * toca; el héroe ya lo contempla, con `poster`, silenciado y respetando
 * `prefers-reduced-motion`.
 *
 * Que sea corto (8–15 s), en bucle, sin audio y bien comprimido: es lo primero
 * que carga la portada y pesa más que todo lo demás junto.
 */
export const VIDEO_HEROE: string | null = null;

/**
 * No existen todavía. Un pie de página con iconos sin enlace grita
 * "sitio abandonado". Mientras esté vacío, el bloque no se renderiza.
 */
export const REDES: readonly { readonly nombre: string; readonly url: string }[] = [];

/**
 * Coordenadas de la planta, del pin que pasó el cliente:
 * https://maps.app.goo.gl/BBnoVRTaHxCKBAXF9
 *
 * Con esto ya se pinta el mapa, `urlComoLlegar()` apunta al punto exacto en vez
 * de a una búsqueda por texto, y el JSON-LD emite `geo`.
 *
 * TODO: el cliente todavía no tiene perfil de empresa en Google. Cuando lo
 * cree, conviene enlazar la ficha en vez del pin suelto: sale con nombre,
 * horario y reseñas.
 */
export const MAPA_LAT: number | null = 14.427782;
export const MAPA_LNG: number | null = -87.045227;

/**
 * Mapa incrustado de Google Maps.
 *
 * `output=embed` no pide clave de API. El botón de "Cómo llegar" apunta al
 * mismo punto pero abre Maps para navegar.
 */
export function urlMapaIncrustado(zoom = 15): string {
  if (MAPA_LAT === null || MAPA_LNG === null) return '';
  return `https://www.google.com/maps?q=${MAPA_LAT},${MAPA_LNG}&z=${zoom}&hl=es&output=embed`;
}

export const HORARIO = [
  { dias: 'Lunes a viernes', abre: '7:00 a.m.', cierra: '5:00 p.m.', iso: ['Mo', 'Tu', 'We', 'Th', 'Fr'], isoAbre: '07:00', isoCierra: '17:00' },
  { dias: 'Sábados', abre: '7:00 a.m.', cierra: '12:00 m.', iso: ['Sa'], isoAbre: '07:00', isoCierra: '12:00' },
  { dias: 'Domingos', abre: null, cierra: null, iso: ['Su'], isoAbre: null, isoCierra: null },
] as const;

/**
 * Cómo se habla del volumen.
 *
 * El sitio NO publica un mínimo de compra ni promete entrega. Decir "mínimo
 * 10,000 pies tablares" es mandar a la calle al que compra poco, y prometer
 * transporte es comprometer algo que la planta no cubre a cualquier distancia.
 * Se dice lo que sí es cierto y nada más: se trabaja por volumen.
 */
export const NOTA_VOLUMEN = 'Trabajamos por volumen';

/**
 * TODO: confirmar línea de tiempo con el cliente. Dice "13 años en el rubro" y
 * también "planta propia desde 2013", que no cuadran entre sí. Se publica solo
 * el dato duro y verificable; no se afirma un año de fundación.
 */
export const ANIO_PLANTA_PROPIA = 2013;


/** Enlace a Google Maps por texto mientras no haya coordenadas confirmadas. */
export function urlComoLlegar(): string {
  const consulta =
    MAPA_LAT !== null && MAPA_LNG !== null
      ? `${MAPA_LAT},${MAPA_LNG}`
      : `${NOMBRE}, ${DIRECCION.linea}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

export function urlTelefono(numero: string): string {
  return `tel:+504${numero.replace(/\D/g, '')}`;
}
