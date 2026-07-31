import { useEffect, useState } from 'react';
import { MINIMO_ENVIO_PT } from '@/data/empresa';
import { formatearPT, piesTablaresDePartida } from '@/lib/piesTablares';
import { marcarUmbralCelebrado, umbralYaCelebrado } from '@/lib/listaStore';
import { usarConteo, usarPartidas } from '@/components/isla/hooks';

const TRAZO_ESTRELLA =
  'M0,-1 L0.225,-0.309 L0.951,-0.309 L0.363,0.118 L0.588,0.809 ' +
  'L0,0.382 L-0.588,0.809 L-0.363,0.118 L-0.951,-0.309 L-0.225,-0.309 Z';

function Estrella({ rellena }: { rellena: boolean }) {
  return (
    <svg
      viewBox="-1.15 -1.15 2.3 2.3"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path
        d={TRAZO_ESTRELLA}
        fill={rellena ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={rellena ? 0 : 0.18}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * La barra fija: el carrito sin checkout.
 *
 * Al cruzar los 10,000 pies tablares, el fondo pasa de verde-tinta a un barrido
 * de ocote, la estrella se rellena y el texto confirma el envío. Es el clímax
 * del sitio y se ejecuta una sola vez: si baja del umbral y vuelve a cruzarlo,
 * el cambio es instantáneo, sin ceremonia.
 */
export default function BarraTotal() {
  const partidas = usarPartidas();
  const total = partidas.reduce((suma, partida) => suma + piesTablaresDePartida(partida), 0);
  const totalAnimado = usarConteo(total);

  const visible = partidas.length > 0;
  const alcanzado = total >= MINIMO_ENVIO_PT;
  const faltan = Math.max(0, MINIMO_ENVIO_PT - total);

  const [instantaneo, setInstantaneo] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('con-barra', visible);
    return () => document.body.classList.remove('con-barra');
  }, [visible]);

  useEffect(() => {
    if (!alcanzado) return;
    if (umbralYaCelebrado()) {
      setInstantaneo(true);
      return;
    }
    marcarUmbralCelebrado();
  }, [alcanzado]);

  if (!visible) return null;

  const duracion = instantaneo ? 'duration-0' : 'duration-umbral';
  const colorTexto = alcanzado ? 'text-verde-tinta' : 'text-cal';
  const colorApagado = alcanzado ? 'text-verde-monte' : 'text-aserrin';

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t-hair border-verde-musgo bg-verde-tinta"
      role="status"
    >
      {/* El barrido de ocote. Solo transform: va al compositor. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 origin-left bg-ocote transition-transform ease-sierra ${duracion}`}
        style={{ transform: alcanzado ? 'scaleX(1)' : 'scaleX(0)' }}
      />

      <div className="plano relative flex min-h-barra flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
        <div className="flex items-center gap-3">
          <span className={`transition-colors ease-sierra ${duracion} ${colorTexto}`}>
            <Estrella rellena={alcanzado} />
          </span>
          <span
            aria-hidden="true"
            className={`font-dato text-dato-lg font-semibold transition-colors ease-sierra ${duracion} ${colorTexto}`}
          >
            {formatearPT(totalAnimado)} pt
          </span>
          <span className="sr-only">
            {formatearPT(total)} pies tablares en tu lista.
            {alcanzado
              ? ' Alcanzás el mínimo para envío con nuestro transporte.'
              : ` Faltan ${formatearPT(faltan)} pies tablares para el mínimo de envío.`}
          </span>
        </div>

        <p
          aria-hidden="true"
          className={`order-last w-full font-dato text-spec-sm uppercase transition-colors ease-sierra sm:order-none sm:w-auto sm:flex-1 ${duracion} ${colorApagado}`}
        >
          {alcanzado
            ? 'Alcanzás el mínimo para envío con nuestro transporte'
            : `Faltan ${formatearPT(faltan)} pt para el mínimo de envío`}
        </p>

        <a
          href="/cotizar"
          className={
            alcanzado
              ? 'boton border-verde-tinta bg-verde-tinta font-semibold text-cal hover:bg-verde-monte'
              : 'boton-cotizar'
          }
        >
          Pedir cotización
          <span className="flecha" aria-hidden="true">
            &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
