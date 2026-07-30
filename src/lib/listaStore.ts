/**
 * Lista de cotización acumulada.
 *
 * Store mínimo fuera de React: la calculadora y la barra fija son dos islas
 * distintas y necesitan el mismo estado. Comparten este módulo, no un Context.
 * Se persiste en localStorage para que la lista sobreviva la navegación entre
 * páginas estáticas — nunca sessionStorage, nunca cookies.
 */
import type { Partida } from '@/types/contenido';
import { totalPiesTablares } from '@/lib/piesTablares';

const CLAVE = 'mdh:lista:v1';

let partidas: readonly Partida[] = [];
let hidratado = false;
const suscriptores = new Set<() => void>();

const VACIO: readonly Partida[] = Object.freeze([]);

function esPartida(valor: unknown): valor is Partida {
  if (typeof valor !== 'object' || valor === null) return false;
  const p = valor as Record<string, unknown>;
  return (
    typeof p['id'] === 'string' &&
    typeof p['especie'] === 'string' &&
    typeof p['acabado'] === 'string' &&
    typeof p['espesor'] === 'number' &&
    typeof p['ancho'] === 'number' &&
    typeof p['largo'] === 'number' &&
    typeof p['piezas'] === 'number'
  );
}

function leerDeDisco(): readonly Partida[] {
  if (typeof localStorage === 'undefined') return VACIO;
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return VACIO;
    const datos: unknown = JSON.parse(crudo);
    if (!Array.isArray(datos)) return VACIO;
    return Object.freeze(datos.filter(esPartida));
  } catch {
    // localStorage bloqueado o JSON corrupto: se sigue con la lista vacía.
    return VACIO;
  }
}

function escribirEnDisco(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(partidas));
  } catch {
    // Modo privado o cuota llena. La lista sigue viva en memoria.
  }
}

function avisar(): void {
  for (const suscriptor of suscriptores) suscriptor();
}

/** Se llama una vez desde el cliente antes del primer render hidratado. */
export function hidratar(): void {
  if (hidratado) return;
  hidratado = true;
  partidas = leerDeDisco();
  avisar();
}

export function suscribir(callback: () => void): () => void {
  suscriptores.add(callback);
  return () => {
    suscriptores.delete(callback);
  };
}

export function obtener(): readonly Partida[] {
  return partidas;
}

/** Snapshot para el render de servidor: siempre vacío, no hay localStorage. */
export function obtenerEnServidor(): readonly Partida[] {
  return VACIO;
}

function nuevoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `p-${Math.floor(performance.now() * 1000).toString(36)}`;
}

export function agregar(partida: Omit<Partida, 'id'>): void {
  partidas = Object.freeze([...partidas, { ...partida, id: nuevoId() }]);
  escribirEnDisco();
  avisar();
}

export function actualizar(id: string, cambios: Partial<Omit<Partida, 'id'>>): void {
  partidas = Object.freeze(
    partidas.map((partida) => (partida.id === id ? { ...partida, ...cambios } : partida)),
  );
  escribirEnDisco();
  avisar();
}

export function eliminar(id: string): void {
  partidas = Object.freeze(partidas.filter((partida) => partida.id !== id));
  escribirEnDisco();
  avisar();
}

export function vaciar(): void {
  partidas = VACIO;
  escribirEnDisco();
  avisar();
}

export function total(): number {
  return totalPiesTablares(partidas);
}

/* --- Memoria del cruce de umbral -------------------------------------- */

/**
 * El barrido de ocote al cruzar los 10,000 pt se hace una sola vez. Si baja del
 * umbral y vuelve a cruzarlo, el cambio es instantáneo, sin ceremonia.
 *
 * Es una variable de módulo y no sessionStorage a propósito: la regla del
 * proyecto es que el sitio no escribe nada fuera de la clave de la lista. El
 * costo es que la animación puede repetirse una vez por carga de página, que es
 * un desenlace aceptable para algo puramente decorativo.
 */
let umbralCelebrado = false;

export function umbralYaCelebrado(): boolean {
  return umbralCelebrado;
}

export function marcarUmbralCelebrado(): void {
  umbralCelebrado = true;
}
