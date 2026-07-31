import { useId, useMemo, useState } from 'react';
import type { Acabado, Partida } from '@/types/contenido';
import { actualizar, agregar, eliminar } from '@/lib/listaStore';
import {
  aNumero,
  formatearMedida,
  formatearPT,
  piesTablaresDePartida,
  validarMedida,
  type CampoMedida,
} from '@/lib/piesTablares';
import { usarConteo, usarPartidas } from '@/components/isla/hooks';

export interface EspecieOpcion {
  slug: string;
  nombre: string;
  acabados: readonly Acabado[];
}

interface Props {
  especies: EspecieOpcion[];
  /** Ficha de especie: llega con la especie ya puesta. */
  especieInicial?: string;
}

const ETIQUETA_ACABADO: Record<Acabado, string> = {
  rustica: 'Rústica',
  cepillada: 'Cepillada',
  secada: 'Secada',
  curada: 'Curada',
};

const CAMPOS: { campo: CampoMedida; etiqueta: string; unidad: string; ayuda: string }[] = [
  { campo: 'espesor', etiqueta: 'Espesor', unidad: 'pulg', ayuda: 'en pulgadas' },
  { campo: 'ancho', etiqueta: 'Ancho', unidad: 'pulg', ayuda: 'en pulgadas' },
  { campo: 'largo', etiqueta: 'Largo', unidad: 'pies', ayuda: 'en pies' },
  { campo: 'piezas', etiqueta: 'Piezas', unidad: 'pzas', ayuda: 'cantidad de piezas' },
];

type Medidas = Record<CampoMedida, string>;

const MEDIDAS_INICIALES: Medidas = { espesor: '1', ancho: '6', largo: '12', piezas: '100' };

export default function Calculadora({ especies, especieInicial }: Props) {
  const partidas = usarPartidas();
  const idBase = useId();

  const primeraEspecie = especies[0];
  const [especie, setEspecie] = useState<string>(
    especieInicial ?? primeraEspecie?.slug ?? '',
  );
  const [medidas, setMedidas] = useState<Medidas>(MEDIDAS_INICIALES);
  const [acabado, setAcabado] = useState<Acabado>('rustica');
  const [editando, setEditando] = useState<string | null>(null);
  const [tocados, setTocados] = useState<Partial<Record<CampoMedida, boolean>>>({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const especieActual = especies.find((e) => e.slug === especie) ?? primeraEspecie;
  const acabadosDisponibles = especieActual?.acabados ?? ['rustica'];
  const acabadoActual = acabadosDisponibles.includes(acabado)
    ? acabado
    : (acabadosDisponibles[0] ?? 'rustica');

  const errores = useMemo(() => {
    const resultado: Partial<Record<CampoMedida, string>> = {};
    for (const { campo } of CAMPOS) {
      const error = validarMedida(campo, medidas[campo]);
      if (error) resultado[campo] = error;
    }
    return resultado;
  }, [medidas]);

  const hayErrores = Object.keys(errores).length > 0;

  const ptPartida = hayErrores
    ? 0
    : piesTablaresDePartida({
        espesor: aNumero(medidas.espesor),
        ancho: aNumero(medidas.ancho),
        largo: aNumero(medidas.largo),
        piezas: aNumero(medidas.piezas),
      });

  const totalReal = partidas.reduce((suma, p) => suma + piesTablaresDePartida(p), 0);
  const totalAnimado = usarConteo(totalReal);

  function cambiar(campo: CampoMedida, valor: string): void {
    setMedidas((previo) => ({ ...previo, [campo]: valor }));
  }

  function reiniciar(): void {
    setEditando(null);
    setMedidas(MEDIDAS_INICIALES);
    setTocados({});
    setIntentoEnvio(false);
  }

  function enviar(evento: { preventDefault: () => void }): void {
    evento.preventDefault();
    setIntentoEnvio(true);
    if (hayErrores || !especieActual) return;

    const datos = {
      especie: especieActual.nombre,
      espesor: aNumero(medidas.espesor),
      ancho: aNumero(medidas.ancho),
      largo: aNumero(medidas.largo),
      piezas: aNumero(medidas.piezas),
      acabado: acabadoActual,
    };

    if (editando) actualizar(editando, datos);
    else agregar(datos);
    reiniciar();
  }

  function editarPartida(partida: Partida): void {
    const coincidencia = especies.find((e) => e.nombre === partida.especie);
    if (coincidencia) setEspecie(coincidencia.slug);
    setMedidas({
      espesor: String(partida.espesor),
      ancho: String(partida.ancho),
      largo: String(partida.largo),
      piezas: String(partida.piezas),
    });
    setAcabado(partida.acabado);
    setEditando(partida.id);
    setTocados({});
    setIntentoEnvio(false);
  }

  const mostrarError = (campo: CampoMedida): string | undefined =>
    tocados[campo] || intentoEnvio ? errores[campo] : undefined;

  return (
    <section
      aria-labelledby={`${idBase}-titulo`}
      className="border-hair border-verde-tinta bg-cal"
    >
      {/* Cabecera de la hoja */}
      <div className="flex items-baseline justify-between gap-4 border-b-hair border-verde-tinta bg-verde-tinta px-4 py-3 sm:px-6">
        <h2 id={`${idBase}-titulo`} className="font-dato text-spec uppercase text-aserrin">
          Hoja de conteo
        </h2>
        <span className="font-dato text-spec-sm uppercase text-aserrin">
          {partidas.length === 0
            ? 'sin partidas'
            : `${partidas.length} ${partidas.length === 1 ? 'partida' : 'partidas'}`}
        </span>
      </div>

      {/* Partidas ya cargadas */}
      {partidas.length > 0 && (
        <ul className="border-b-hair border-verde-musgo/40">
          {partidas.map((partida) => {
            const pt = piesTablaresDePartida(partida);
            return (
              <li
                key={partida.id}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b-hair border-dotted border-verde-musgo/60 px-4 py-3 last:border-b-0 sm:px-6"
              >
                <span className="font-dato text-dato-sm font-semibold uppercase text-verde-monte">
                  {partida.especie}
                </span>
                <span className="font-dato text-dato-sm text-verde-tinta">
                  {formatearMedida(partida.espesor)}&Prime; &times;{' '}
                  {formatearMedida(partida.ancho)}&Prime; &times;{' '}
                  {formatearMedida(partida.largo)}&prime;
                </span>
                <span className="font-dato text-dato-sm text-verde-tinta">
                  {partida.piezas} pzas
                </span>
                <span className="font-dato text-spec-sm uppercase text-verde-monte">
                  {ETIQUETA_ACABADO[partida.acabado]}
                </span>
                <span className="ml-auto font-dato text-dato font-semibold text-verde-tinta">
                  {formatearPT(pt)} pt
                </span>
                <span className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => editarPartida(partida)}
                    className="font-dato text-spec-sm uppercase text-ocote-tinta underline underline-offset-4 hover:text-verde-monte"
                  >
                    Editar
                    <span className="sr-only">
                      {' '}
                      la partida de {partida.especie} de {formatearPT(pt)} pies tablares
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(partida.id)}
                    className="font-dato text-spec-sm uppercase text-ocote-tinta underline underline-offset-4 hover:text-verde-monte"
                  >
                    Quitar
                    <span className="sr-only">
                      {' '}
                      la partida de {partida.especie} de {formatearPT(pt)} pies tablares
                    </span>
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Alta y edición de partida */}
      <form onSubmit={enviar} noValidate className="px-4 py-5 sm:px-6">
        <fieldset>
          <legend className="font-dato text-spec-sm uppercase text-verde-monte">
            {editando ? 'Editar la partida' : 'Agregar una partida'}
          </legend>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            <label className="col-span-2 sm:col-span-1">
              <span className="block font-dato text-spec-sm uppercase text-verde-monte">
                Especie
              </span>
              <select
                value={especie}
                onChange={(evento) => setEspecie(evento.currentTarget.value)}
                className="mt-1.5 h-11 w-full border-hair border-verde-musgo bg-cal px-2 font-dato text-dato text-verde-tinta"
              >
                {especies.map((opcion) => (
                  <option key={opcion.slug} value={opcion.slug}>
                    {opcion.nombre}
                  </option>
                ))}
              </select>
            </label>

            {CAMPOS.map(({ campo, etiqueta, unidad, ayuda }) => {
              const error = mostrarError(campo);
              const idError = `${idBase}-${campo}-error`;
              return (
                <label key={campo}>
                  <span className="block font-dato text-spec-sm uppercase text-verde-monte">
                    {etiqueta}{' '}
                    <span className="normal-case tracking-normal text-verde-musgo">({unidad})</span>
                  </span>
                  <input
                    type="text"
                    inputMode={campo === 'piezas' ? 'numeric' : 'decimal'}
                    value={medidas[campo]}
                    aria-label={`${etiqueta} ${ayuda}`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? idError : undefined}
                    onChange={(evento) => cambiar(campo, evento.currentTarget.value)}
                    onBlur={() => setTocados((previo) => ({ ...previo, [campo]: true }))}
                    className={`mt-1.5 h-11 w-full border-hair bg-cal px-2 font-dato text-dato text-verde-tinta ${
                      error ? 'border-ocote-tinta' : 'border-verde-musgo'
                    }`}
                  />
                </label>
              );
            })}

            <label>
              <span className="block font-dato text-spec-sm uppercase text-verde-monte">
                Acabado
              </span>
              <select
                value={acabadoActual}
                onChange={(evento) => setAcabado(evento.currentTarget.value as Acabado)}
                className="mt-1.5 h-11 w-full border-hair border-verde-musgo bg-cal px-2 font-dato text-dato text-verde-tinta"
              >
                {acabadosDisponibles.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {ETIQUETA_ACABADO[opcion]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Los errores dicen qué pasó y qué hacer. */}
          <div className="mt-3 space-y-1">
            {CAMPOS.map(({ campo }) => {
              const error = mostrarError(campo);
              if (!error) return null;
              return (
                <p
                  key={campo}
                  id={`${idBase}-${campo}-error`}
                  role="alert"
                  className="font-dato text-dato-sm text-ocote-tinta"
                >
                  {error}
                </p>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="font-dato text-dato-sm text-verde-monte">
              Esta partida:{' '}
              <span className="font-semibold text-verde-tinta">{formatearPT(ptPartida)} pt</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {editando && (
                <button type="button" onClick={reiniciar} className="boton-linea">
                  Cancelar
                </button>
              )}
              <button type="submit" className="boton-cotizar">
                {editando ? 'Guardar cambios' : 'Agregar a la lista'}
              </button>
            </div>
          </div>
        </fieldset>
      </form>

      {/* Total, con doble regla como en una boleta de remito */}
      <div className="border-t-[3px] border-double border-verde-tinta bg-aserrin px-4 py-4 sm:px-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-dato text-spec uppercase text-verde-monte">Total</span>
          <span aria-hidden="true" className="font-dato text-dato-xl text-verde-tinta">
            {formatearPT(totalAnimado)} <span className="text-dato-lg">pt</span>
          </span>
        </div>
        {/* El lector de pantalla anuncia el número final, no cada cuadro. */}
        <p aria-live="polite" className="sr-only">
          {formatearPT(totalReal)} pies tablares en la lista.
        </p>
      </div>
    </section>
  );
}
