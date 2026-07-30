import type { ResultadoEnvio, SolicitudCotizacion } from '@/types/contenido';
import { formatearMedida, formatearPT } from '@/lib/piesTablares';
import { urlWhatsApp } from '@/lib/whatsapp';
import { MINIMO_ENVIO_PT } from '@/data/empresa';

const ETIQUETA_ACABADO: Record<string, string> = {
  rustica: 'rústica',
  cepillada: 'cepillada',
  secada: 'secada',
  curada: 'curada',
};

/** El remito en texto plano, para que llegue legible al WhatsApp de la planta. */
export function componerMensaje(solicitud: SolicitudCotizacion): string {
  const lineas: string[] = ['*Solicitud de cotización — sitio web*', ''];

  lineas.push(`Nombre: ${solicitud.nombre}`);
  if (solicitud.empresa) lineas.push(`Empresa: ${solicitud.empresa}`);
  lineas.push(`Teléfono: ${solicitud.telefono}`);
  if (solicitud.correo) lineas.push(`Correo: ${solicitud.correo}`);
  if (solicitud.ciudad) lineas.push(`Ciudad: ${solicitud.ciudad}`);

  if (solicitud.partidas.length > 0) {
    lineas.push('', '*Lista de partidas*');
    for (const partida of solicitud.partidas) {
      const pt = (partida.espesor * partida.ancho * partida.largo * partida.piezas) / 12;
      lineas.push(
        `• ${partida.especie} ${formatearMedida(partida.espesor)}" x ` +
          `${formatearMedida(partida.ancho)}" x ${formatearMedida(partida.largo)}' ` +
          `— ${partida.piezas} pzas — ${ETIQUETA_ACABADO[partida.acabado] ?? partida.acabado} ` +
          `— ${formatearPT(pt)} pt`,
      );
    }
    lineas.push(`*Total: ${formatearPT(solicitud.total_pt)} pies tablares*`);
    if (solicitud.total_pt >= MINIMO_ENVIO_PT) {
      lineas.push(`(Alcanza el mínimo de ${formatearPT(MINIMO_ENVIO_PT)} pt para envío)`);
    }
  }

  if (solicitud.proyecto) lineas.push('', `*Proyecto*`, solicitud.proyecto);
  if (solicitud.fecha_requerida) lineas.push('', `Fecha requerida: ${solicitud.fecha_requerida}`);

  lineas.push('', `Transporte: ${solicitud.requiere_transporte ? 'sí' : 'no, retiro en planta'}`);
  if (solicitud.requiere_transporte && solicitud.direccion_entrega) {
    lineas.push(`Dirección de entrega: ${solicitud.direccion_entrega}`);
  }
  if (solicitud.notas) lineas.push('', `*Notas*`, solicitud.notas);

  return lineas.join('\n');
}

/**
 * Envío de la solicitud.
 *
 * Fase 1: abre WhatsApp con el remito ya armado. El sitio convierte desde el
 * día uno sin backend.
 *
 * TODO (fase 2): reemplazar por invocación a la Edge Function 'crear-solicitud'
 * de Supabase. La firma de esta función no cambia, así que la UI no se toca:
 *
 *   const { error } = await supabase.functions.invoke('crear-solicitud', {
 *     body: solicitud,
 *   });
 *   return error ? { ok: false, motivo: error.message } : { ok: true, via: 'supabase' };
 */
export function enviarSolicitud(solicitud: SolicitudCotizacion): ResultadoEnvio {
  const url = urlWhatsApp(componerMensaje(solicitud));
  const ventana = window.open(url, '_blank', 'noopener,noreferrer');

  if (!ventana) {
    return {
      ok: false,
      motivo:
        'El navegador bloqueó la ventana de WhatsApp. Habilitá las ventanas emergentes para este sitio o llamanos al 8843-9226.',
    };
  }
  return { ok: true, via: 'whatsapp' };
}
