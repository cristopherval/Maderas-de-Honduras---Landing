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
 * No existen todavía. Un pie de página con iconos sin enlace grita
 * "sitio abandonado". Mientras esté vacío, el bloque no se renderiza.
 */
export const REDES: readonly { readonly nombre: string; readonly url: string }[] = [];

/**
 * TODO: confirmar coordenadas con el cliente (tomarlas en la planta con el GPS
 * del teléfono). Mientras sean `null` no se pinta mapa ni se emite `geo` en el
 * JSON-LD; se muestra la dirección escrita y un botón de búsqueda en Maps.
 */
export const MAPA_LAT: number | null = null;
export const MAPA_LNG: number | null = null;

export const HORARIO = [
  { dias: 'Lunes a viernes', abre: '7:00 a.m.', cierra: '5:00 p.m.', iso: ['Mo', 'Tu', 'We', 'Th', 'Fr'], isoAbre: '07:00', isoCierra: '17:00' },
  { dias: 'Sábados', abre: '7:00 a.m.', cierra: '12:00 m.', iso: ['Sa'], isoAbre: '07:00', isoCierra: '12:00' },
  { dias: 'Domingos', abre: null, cierra: null, iso: ['Su'], isoAbre: null, isoCierra: null },
] as const;

/** Mínimo por envío con transporte propio, en pies tablares. */
export const MINIMO_ENVIO_PT = 10_000;

/**
 * TODO: confirmar línea de tiempo con el cliente. Dice "13 años en el rubro" y
 * también "planta propia desde 2013", que no cuadran entre sí. Se publica solo
 * el dato duro y verificable; no se afirma un año de fundación.
 */
export const ANIO_PLANTA_PROPIA = 2013;

export const ESPECIES_CANTIDAD = 4;
export const PRODUCTOS_CANTIDAD = 11;

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
