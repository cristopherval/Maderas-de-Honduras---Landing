import { useId, useState } from 'react';
import { urlWhatsApp } from '@/lib/whatsapp';

/**
 * Tres campos y listo. Reemplaza al formulario largo de nueve campos que
 * pedía empresa, correo, ciudad, fecha requerida y dirección de entrega.
 *
 * No hay servidor: al enviar se abre WhatsApp con el mensaje ya escrito. Es
 * como trabajan de hecho los dos aserraderos de referencia, y evita prometer
 * un buzón que nadie está leyendo.
 */
type Campo = 'nombre' | 'telefono' | 'necesita';

const VACIO: Record<Campo, string> = { nombre: '', telefono: '', necesita: '' };

function validar(valores: Record<Campo, string>): Partial<Record<Campo, string>> {
  const errores: Partial<Record<Campo, string>> = {};

  if (valores.nombre.trim() === '') {
    errores.nombre = 'Indique su nombre para saber con quién tratamos.';
  }

  const digitos = valores.telefono.replace(/\D/g, '').replace(/^504/, '');
  if (valores.telefono.trim() === '') {
    errores.telefono = 'Necesitamos un teléfono para comunicarle el precio.';
  } else if (digitos.length !== 8) {
    errores.telefono = 'El teléfono debe tener 8 dígitos. Por ejemplo: 8843-9226.';
  }

  if (valores.necesita.trim() === '') {
    errores.necesita = 'Indique qué necesita, aunque sea en una línea.';
  }

  return errores;
}

export default function FormularioContacto() {
  const idBase = useId();
  const [valores, setValores] = useState<Record<Campo, string>>(VACIO);
  const [intento, setIntento] = useState(false);

  const errores = validar(valores);
  const error = (campo: Campo): string | undefined => (intento ? errores[campo] : undefined);

  function cambiar(campo: Campo, valor: string): void {
    setValores((previo) => ({ ...previo, [campo]: valor }));
  }

  function enviar(evento: { preventDefault: () => void }): void {
    evento.preventDefault();
    setIntento(true);

    if (Object.keys(errores).length > 0) {
      const primero = Object.keys(errores)[0];
      document.getElementById(`${idBase}-${primero}`)?.focus();
      return;
    }

    const mensaje = [
      `Buen día, soy ${valores.nombre.trim()}.`,
      valores.necesita.trim(),
      `Mi número de teléfono es ${valores.telefono.trim()}.`,
    ].join(' ');

    window.location.href = urlWhatsApp(mensaje);
  }

  const props = (campo: Campo) => ({
    id: `${idBase}-${campo}`,
    value: valores[campo],
    'aria-invalid': error(campo) ? true : undefined,
    'aria-describedby': error(campo) ? `${idBase}-${campo}-error` : undefined,
    className: `mt-1.5 w-full border-hair bg-cal px-3 py-2.5 text-base text-verde-tinta ${
      error(campo) ? 'border-ocote-tinta' : 'border-verde-musgo'
    }`,
  });

  function Etiqueta({ texto }: { texto: string }) {
    return <span className="block text-spec-sm uppercase text-verde-monte">{texto}</span>;
  }

  function Error({ campo }: { campo: Campo }) {
    const mensaje = error(campo);
    if (!mensaje) return null;
    return (
      <p id={`${idBase}-${campo}-error`} role="alert" className="mt-1.5 text-dato-sm text-ocote-tinta">
        {mensaje}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="max-w-medida">
      <div className="grid gap-5">
        <label>
          <Etiqueta texto="Nombre" />
          <input
            type="text"
            autoComplete="name"
            {...props('nombre')}
            onInput={(evento) => cambiar('nombre', evento.currentTarget.value)}
          />
          <Error campo="nombre" />
        </label>

        <label>
          <Etiqueta texto="Teléfono" />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...props('telefono')}
            onInput={(evento) => cambiar('telefono', evento.currentTarget.value)}
          />
          <Error campo="telefono" />
        </label>

        <label>
          <Etiqueta texto="Qué necesita" />
          <textarea
            rows={4}
            placeholder="Indique especie, cantidad, acabado y destino de la madera. Si cuenta con plano, mejor."
            {...props('necesita')}
            onInput={(evento) => cambiar('necesita', evento.currentTarget.value)}
          />
          <Error campo="necesita" />
        </label>
      </div>

      <button type="submit" className="boton-cotizar mt-6">
        Enviar por WhatsApp
        <span className="flecha" aria-hidden="true">
          &rarr;
        </span>
      </button>
      <p className="mt-3 text-sm text-verde-monte">
        Se abrirá WhatsApp con el mensaje ya redactado. Solo debe enviarlo.
      </p>
    </form>
  );
}
