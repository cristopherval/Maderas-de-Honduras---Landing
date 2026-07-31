import { formatearPT, piesTablaresDePartida } from '@/lib/piesTablares';
import { MINIMO_ENVIO_PT } from '@/data/empresa';
import { usarPartidas } from '@/components/isla/hooks';

/**
 * Recordatorio del cierre de la portada. Si el visitante ya cargó partidas, se
 * las nombra; si no, no se inventa un estado que no existe.
 */
export default function ResumenCierre() {
  const partidas = usarPartidas();
  if (partidas.length === 0) return null;

  const total = partidas.reduce((suma, partida) => suma + piesTablaresDePartida(partida), 0);
  const faltan = Math.max(0, MINIMO_ENVIO_PT - total);

  return (
    <p className="font-dato text-dato text-aserrin">
      Llevás{' '}
      <span className="text-dato-lg font-semibold text-cal">{formatearPT(total)} pies tablares</span>{' '}
      en tu lista.{' '}
      {faltan > 0
        ? `Faltan ${formatearPT(faltan)} pt para el mínimo de envío.`
        : 'Alcanzás el mínimo para envío con nuestro transporte.'}
    </p>
  );
}
