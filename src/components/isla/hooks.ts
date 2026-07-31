import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Partida } from '@/types/contenido';
import { hidratar, obtener, suscribir } from '@/lib/listaStore';

/**
 * La lista acumulada, compartida entre la calculadora y la barra fija.
 *
 * En el render de servidor y en la hidratación la lista arranca vacía, porque
 * no hay localStorage. Apenas monta se hidrata y el store avisa: por eso el
 * total de la barra cuenta de 0 al valor guardado, que es justo el cierre de la
 * secuencia de carga del héroe.
 *
 * `useSyncExternalStore` de preact/compat recibe dos argumentos, no tres: no
 * hace falta el snapshot de servidor porque el store ya arranca vacío en Node.
 * `obtenerEnServidor` sigue exportado en el store para el día que se vuelva a
 * React puro.
 */
export function usarPartidas(): readonly Partida[] {
  useEffect(() => {
    hidratar();
  }, []);
  return useSyncExternalStore(suscribir, obtener);
}

export function prefiereMenosMovimiento(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ------------------------------------------------------------------ */
/* La curva del sitio, resuelta en JavaScript                          */
/* ------------------------------------------------------------------ */

/**
 * cubic-bezier(0.16, 1, 0.3, 1) — la misma curva que usa el CSS. El conteo
 * numérico tiene que sentirse igual que todo lo demás que se mueve.
 */
function sierra(t: number): number {
  const x1 = 0.16;
  const x2 = 0.3;
  const y1 = 1;
  const y2 = 1;

  const enX = (u: number): number =>
    3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
  const enY = (u: number): number =>
    3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;

  // Bisección: ocho pasos bastan para 280ms a 60 fps.
  let bajo = 0;
  let alto = 1;
  let u = t;
  for (let i = 0; i < 8; i += 1) {
    if (enX(u) < t) bajo = u;
    else alto = u;
    u = (bajo + alto) / 2;
  }
  return enY(u);
}

/**
 * Conteo numérico del total. Es el latido del sitio: cada cambio de partida
 * anima el total en 280ms. Con `prefers-reduced-motion` muestra el número y ya.
 */
export function usarConteo(objetivo: number, duracion = 280): number {
  const [mostrado, setMostrado] = useState(objetivo);
  const desde = useRef(objetivo);

  useEffect(() => {
    if (desde.current === objetivo) return;

    if (prefiereMenosMovimiento()) {
      desde.current = objetivo;
      setMostrado(objetivo);
      return;
    }

    const inicio = performance.now();
    const arranque = desde.current;
    let cuadro = 0;

    const paso = (ahora: number): void => {
      const avance = Math.min(1, (ahora - inicio) / duracion);
      setMostrado(arranque + (objetivo - arranque) * sierra(avance));
      if (avance < 1) {
        cuadro = requestAnimationFrame(paso);
      } else {
        desde.current = objetivo;
      }
    };

    cuadro = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(cuadro);
      desde.current = objetivo;
    };
  }, [objetivo, duracion]);

  return mostrado;
}
