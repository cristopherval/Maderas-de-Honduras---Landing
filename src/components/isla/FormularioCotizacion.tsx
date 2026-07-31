import { useId, useState } from 'react';
import type { SolicitudCotizacion } from '@/types/contenido';
import { eliminar } from '@/lib/listaStore';
import { enviarSolicitud } from '@/lib/solicitudes';
import { formatearMedida, formatearPT, piesTablaresDePartida } from '@/lib/piesTablares';
import { MINIMO_ENVIO_PT } from '@/data/empresa';
import { usarPartidas } from '@/components/isla/hooks';

type Campo =
  | 'nombre'
  | 'empresa'
  | 'telefono'
  | 'correo'
  | 'ciudad'
  | 'proyecto'
  | 'fecha_requerida'
  | 'direccion_entrega'
  | 'notas';

const VACIO: Record<Campo, string> = {
  nombre: '',
  empresa: '',
  telefono: '',
  correo: '',
  ciudad: '',
  proyecto: '',
  fecha_requerida: '',
  direccion_entrega: '',
  notas: '',
};

/** Los errores dicen qué pasó y cómo arreglarlo. Nunca "campo inválido". */
function validar(
  valores: Record<Campo, string>,
  requiereTransporte: boolean,
): Partial<Record<Campo, string>> {
  const errores: Partial<Record<Campo, string>> = {};

  const digitos = valores.telefono.replace(/\D/g, '').replace(/^504/, '');
  if (valores.telefono.trim() === '') {
    errores.telefono = 'Necesitamos un teléfono para llamarte con el precio.';
  } else if (digitos.length !== 8) {
    errores.telefono = 'El teléfono lleva 8 dígitos, por ejemplo 8843-9226.';
  }

  if (valores.correo.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valores.correo.trim())) {
    errores.correo = 'Revisá el correo: le falta el @ o el dominio. Podés dejarlo en blanco.';
  }

  if (requiereTransporte && valores.direccion_entrega.trim() === '') {
    errores.direccion_entrega =
      'Necesitamos la dirección para calcular el flete. Con la ciudad y una referencia basta.';
  }

  return errores;
}

export default function FormularioCotizacion() {
  const partidas = usarPartidas();
  const idBase = useId();

  const [valores, setValores] = useState<Record<Campo, string>>(VACIO);
  const [requiereTransporte, setRequiereTransporte] = useState(true);
  const [intento, setIntento] = useState(false);
  const [fallo, setFallo] = useState<string | null>(null);

  const errores = validar(valores, requiereTransporte);
  const total = partidas.reduce((suma, partida) => suma + piesTablaresDePartida(partida), 0);
  const alcanzado = total >= MINIMO_ENVIO_PT;

  function cambiar(campo: Campo, valor: string): void {
    setValores((previo) => ({ ...previo, [campo]: valor }));
  }

  function enviar(evento: { preventDefault: () => void }): void {
    evento.preventDefault();
    setIntento(true);
    setFallo(null);

    if (Object.keys(errores).length > 0) {
      const primero = Object.keys(errores)[0];
      document.getElementById(`${idBase}-${primero}`)?.focus();
      return;
    }

    const solicitud: SolicitudCotizacion = {
      nombre: valores.nombre.trim(),
      empresa: valores.empresa.trim(),
      telefono: valores.telefono.trim(),
      correo: valores.correo.trim(),
      ciudad: valores.ciudad.trim(),
      proyecto: valores.proyecto.trim(),
      fecha_requerida: valores.fecha_requerida,
      requiere_transporte: requiereTransporte,
      direccion_entrega: requiereTransporte ? valores.direccion_entrega.trim() : '',
      notas: valores.notas.trim(),
      partidas,
      total_pt: total,
    };

    const resultado = enviarSolicitud(solicitud);
    if (resultado.ok) window.location.href = '/gracias';
    else setFallo(resultado.motivo);
  }

  const error = (campo: Campo): string | undefined => (intento ? errores[campo] : undefined);

  const claseCampo = (campo: Campo): string =>
    `mt-1.5 w-full border-hair bg-cal px-3 py-2.5 font-cuerpo text-base text-verde-tinta ${
      error(campo) ? 'border-ocote-tinta' : 'border-verde-musgo'
    }`;

  function Etiqueta({ texto, ayuda }: { texto: string; ayuda?: string }) {
    return (
      <span className="block font-dato text-spec-sm uppercase text-verde-monte">
        {texto}
        {ayuda && <span className="normal-case tracking-normal text-verde-musgo"> · {ayuda}</span>}
      </span>
    );
  }

  function Error({ campo }: { campo: Campo }) {
    const mensaje = error(campo);
    if (!mensaje) return null;
    return (
      <p
        id={`${idBase}-${campo}-error`}
        role="alert"
        className="mt-1.5 font-dato text-dato-sm text-ocote-tinta"
      >
        {mensaje}
      </p>
    );
  }

  const props = (campo: Campo) => ({
    id: `${idBase}-${campo}`,
    value: valores[campo],
    'aria-invalid': error(campo) ? true : undefined,
    'aria-describedby': error(campo) ? `${idBase}-${campo}-error` : undefined,
    className: claseCampo(campo),
  });

  return (
    <form onSubmit={enviar} noValidate className="grid gap-12 lg:grid-cols-[1fr_minmax(0,24rem)]">
      <div>
        <fieldset>
          <legend className="text-display-2 ancho-normal text-verde-tinta">Quién sos</legend>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label>
              <Etiqueta texto="Nombre" />
              <input
                type="text"
                autoComplete="name"
                {...props('nombre')}
                onInput={(evento) => cambiar('nombre', evento.currentTarget.value)}
              />
            </label>

            <label>
              <Etiqueta texto="Empresa" ayuda="opcional" />
              <input
                type="text"
                autoComplete="organization"
                {...props('empresa')}
                onInput={(evento) => cambiar('empresa', evento.currentTarget.value)}
              />
            </label>

            <label>
              <Etiqueta texto="Teléfono" ayuda="obligatorio" />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                {...props('telefono')}
                onInput={(evento) => cambiar('telefono', evento.currentTarget.value)}
              />
              <Error campo="telefono" />
            </label>

            <label>
              <Etiqueta texto="Correo" ayuda="opcional" />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                {...props('correo')}
                onInput={(evento) => cambiar('correo', evento.currentTarget.value)}
              />
              <Error campo="correo" />
            </label>

            <label className="sm:col-span-2">
              <Etiqueta texto="Ciudad" />
              <input
                type="text"
                autoComplete="address-level2"
                {...props('ciudad')}
                onInput={(evento) => cambiar('ciudad', evento.currentTarget.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="text-display-2 ancho-normal text-verde-tinta">Qué necesitás</legend>

          <div className="mt-6 grid gap-5">
            <label>
              <Etiqueta texto="Descripción del proyecto" />
              <textarea
                rows={4}
                {...props('proyecto')}
                onInput={(evento) => cambiar('proyecto', evento.currentTarget.value)}
              />
            </label>

            <label className="sm:max-w-xs">
              <Etiqueta texto="Fecha requerida" ayuda="opcional" />
              <input
                type="date"
                {...props('fecha_requerida')}
                onInput={(evento) => cambiar('fecha_requerida', evento.currentTarget.value)}
              />
            </label>

            <div className="border-hair border-verde-musgo p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={requiereTransporte}
                  onChange={(evento) => setRequiereTransporte(evento.currentTarget.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-ocote"
                />
                <span>
                  <span className="block font-dato text-dato text-verde-tinta">
                    Quiero que lo entreguen con su transporte
                  </span>
                  <span className="mt-1 block font-dato text-dato-sm text-verde-monte">
                    Desde {formatearPT(MINIMO_ENVIO_PT)} pies tablares. Si no, se retira en planta.
                  </span>
                </span>
              </label>

              {requiereTransporte && (
                <label className="mt-4 block">
                  <Etiqueta texto="Dirección de entrega" />
                  <textarea
                    rows={2}
                    {...props('direccion_entrega')}
                    onInput={(evento) => cambiar('direccion_entrega', evento.currentTarget.value)}
                  />
                  <Error campo="direccion_entrega" />
                </label>
              )}
            </div>

            <label>
              <Etiqueta texto="Notas" ayuda="opcional" />
              <textarea
                rows={3}
                {...props('notas')}
                onInput={(evento) => cambiar('notas', evento.currentTarget.value)}
              />
            </label>
          </div>
        </fieldset>
      </div>

      {/* Resumen de la lista */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border-hair border-verde-tinta">
          <h2 className="border-b-hair border-verde-tinta bg-verde-tinta px-4 py-3 font-dato text-spec uppercase text-aserrin">
            Tu lista
          </h2>

          {partidas.length === 0 ? (
            <div className="px-4 py-6">
              <p className="text-base text-verde-tinta">
                Todavía no cargaste partidas. Podés mandar la solicitud así y describir lo que
                ocupás abajo, o armar la lista con medidas para que la cotización salga más rápido.
              </p>
              <a href="/#especies" className="boton-linea mt-4">
                Armar la lista
              </a>
            </div>
          ) : (
            <>
              <ul>
                {partidas.map((partida) => (
                  <li
                    key={partida.id}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-hair border-dotted border-verde-musgo/60 px-4 py-3"
                  >
                    <span className="font-dato text-dato-sm font-semibold uppercase text-verde-monte">
                      {partida.especie}
                    </span>
                    <span className="font-dato text-dato-sm text-verde-tinta">
                      {formatearMedida(partida.espesor)}&Prime; &times;{' '}
                      {formatearMedida(partida.ancho)}&Prime; &times;{' '}
                      {formatearMedida(partida.largo)}&prime; &times; {partida.piezas}
                    </span>
                    <span className="ml-auto font-dato text-dato-sm font-semibold text-verde-tinta">
                      {formatearPT(piesTablaresDePartida(partida))} pt
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminar(partida.id)}
                      className="basis-full text-left font-dato text-spec-sm uppercase text-ocote-tinta underline underline-offset-4 hover:text-verde-monte"
                    >
                      Quitar
                      <span className="sr-only"> la partida de {partida.especie}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t-[3px] border-double border-verde-tinta bg-aserrin px-4 py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-dato text-spec uppercase text-verde-monte">Total</span>
                  <span className="font-dato text-dato-lg font-semibold text-verde-tinta">
                    {formatearPT(total)} pt
                  </span>
                </div>
                <p className="mt-2 font-dato text-dato-sm text-verde-monte">
                  {alcanzado
                    ? 'Alcanzás el mínimo para envío con nuestro transporte.'
                    : `Faltan ${formatearPT(MINIMO_ENVIO_PT - total)} pt para el mínimo de envío.`}
                </p>
              </div>
            </>
          )}
        </div>

        {fallo && (
          <p role="alert" className="mt-5 border-hair border-ocote-tinta p-4 text-base text-verde-tinta">
            {fallo}
          </p>
        )}

        <button type="submit" className="boton-cotizar mt-6 w-full">
          Pedir cotización
          <span className="flecha" aria-hidden="true">
            &rarr;
          </span>
        </button>

        <p className="mt-3 font-dato text-dato-sm text-verde-monte">
          Se abre WhatsApp con la solicitud ya escrita. Solo tenés que darle enviar.
        </p>
      </aside>
    </form>
  );
}
