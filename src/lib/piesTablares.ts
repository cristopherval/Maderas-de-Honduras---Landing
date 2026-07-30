import type { Partida } from '@/types/contenido';

/**
 * Pie tablar: la unidad real del aserradero.
 *
 *   pies tablares = (espesor" x ancho" x largo' x piezas) / 12
 *
 * Espesor y ancho en pulgadas, largo en pies. El 12 convierte pulgada-pulgada-pie
 * a pie-pie-pie.
 */
export function piesTablaresDePartida(medidas: {
  espesor: number;
  ancho: number;
  largo: number;
  piezas: number;
}): number {
  const { espesor, ancho, largo, piezas } = medidas;
  if (![espesor, ancho, largo, piezas].every((v) => Number.isFinite(v) && v > 0)) return 0;
  return (espesor * ancho * largo * piezas) / 12;
}

export function totalPiesTablares(partidas: readonly Partida[]): number {
  return partidas.reduce((total, partida) => total + piesTablaresDePartida(partida), 0);
}

/** Formato de cifra con separador de miles hondureño. Sin decimales. */
export function formatearPT(pies: number): string {
  return Math.round(pies).toLocaleString('es-HN', { maximumFractionDigits: 0 });
}

/** Medida con hasta dos decimales, sin ceros de relleno. `2` y no `2.00`. */
export function formatearMedida(valor: number): string {
  return valor.toLocaleString('es-HN', { maximumFractionDigits: 2 });
}

/* ------------------------------------------------------------------ */
/* Validación                                                          */
/* ------------------------------------------------------------------ */

export type CampoMedida = 'espesor' | 'ancho' | 'largo' | 'piezas';

/** Límites de cordura. No son reglas del cliente, son topes para atrapar dedazos. */
const LIMITES: Record<CampoMedida, { max: number; unidad: string; entero: boolean }> = {
  espesor: { max: 24, unidad: 'pulgadas', entero: false },
  ancho: { max: 48, unidad: 'pulgadas', entero: false },
  largo: { max: 40, unidad: 'pies', entero: false },
  piezas: { max: 100_000, unidad: 'piezas', entero: true },
};

const NOMBRE_CAMPO: Record<CampoMedida, string> = {
  espesor: 'El espesor',
  ancho: 'El ancho',
  largo: 'El largo',
  piezas: 'La cantidad de piezas',
};

/**
 * Devuelve el mensaje de error o `null` si el valor sirve.
 * Los mensajes dicen qué pasó y qué hacer; nunca "campo inválido".
 */
export function validarMedida(campo: CampoMedida, valor: string): string | null {
  const texto = valor.trim();
  if (texto === '') return `${NOMBRE_CAMPO[campo]} hace falta para calcular la partida.`;

  const numero = Number(texto.replace(',', '.'));
  if (!Number.isFinite(numero)) {
    return `${NOMBRE_CAMPO[campo]} tiene que ser un número. Escribilo con punto decimal, por ejemplo 1.5`;
  }

  const limite = LIMITES[campo];
  if (numero <= 0) return `${NOMBRE_CAMPO[campo]} debe ser mayor que 0.`;
  if (limite.entero && !Number.isInteger(numero)) {
    return `${NOMBRE_CAMPO[campo]} tiene que ser un número entero de piezas.`;
  }
  if (numero > limite.max) {
    return `${NOMBRE_CAMPO[campo]} pasa de ${limite.max} ${limite.unidad}. Si de verdad ocupás esa medida, pedila en el mensaje de la cotización.`;
  }
  return null;
}

export function aNumero(valor: string): number {
  return Number(valor.trim().replace(',', '.'));
}
