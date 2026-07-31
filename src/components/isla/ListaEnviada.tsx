import { useState } from 'react';
import { vaciar } from '@/lib/listaStore';
import { formatearMedida, formatearPT, piesTablaresDePartida } from '@/lib/piesTablares';
import { usarPartidas } from '@/components/isla/hooks';

/**
 * La lista no se borra sola al enviar: si WhatsApp no llegó a abrirse o el
 * mensaje no se mandó, borrarla sería tirar el trabajo del visitante. Se le
 * ofrece vaciarla y él decide.
 */
export default function ListaEnviada() {
  const partidas = usarPartidas();
  const [vaciada, setVaciada] = useState(false);

  if (partidas.length === 0) {
    return vaciada ? (
      <p className="font-dato text-dato text-aserrin" role="status">
        Lista vaciada. Podés armar una nueva cuando quieras.
      </p>
    ) : null;
  }

  const total = partidas.reduce((suma, partida) => suma + piesTablaresDePartida(partida), 0);

  return (
    <div className="border-hair border-verde-musgo">
      <h2 className="border-b-hair border-verde-musgo px-4 py-3 font-dato text-spec uppercase text-aserrin">
        Lo que mandaste
      </h2>
      <ul>
        {partidas.map((partida) => (
          <li
            key={partida.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-hair border-dotted border-verde-musgo/60 px-4 py-2.5"
          >
            <span className="font-dato text-dato-sm font-semibold uppercase text-aserrin">
              {partida.especie}
            </span>
            <span className="font-dato text-dato-sm text-cal">
              {formatearMedida(partida.espesor)}&Prime; &times; {formatearMedida(partida.ancho)}
              &Prime; &times; {formatearMedida(partida.largo)}&prime; &times; {partida.piezas}
            </span>
            <span className="ml-auto font-dato text-dato-sm font-semibold text-cal">
              {formatearPT(piesTablaresDePartida(partida))} pt
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <span className="font-dato text-dato-lg font-semibold text-cal">
          {formatearPT(total)} pt
        </span>
        <button
          type="button"
          onClick={() => {
            vaciar();
            setVaciada(true);
          }}
          className="font-dato text-spec-sm uppercase text-ocote underline underline-offset-4 hover:text-cal"
        >
          Vaciar la lista
        </button>
      </div>
    </div>
  );
}
