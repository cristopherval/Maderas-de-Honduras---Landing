import { WHATSAPP_PRINCIPAL } from '@/data/empresa';

export function urlWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_PRINCIPAL}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Mensaje precargado según dónde está parado el visitante. Nada de "Hola".
 * Si alguien escribe desde la ficha de la caoba, el mensaje habla de caoba.
 */
export function mensajeDeContexto(contexto: {
  tipo: 'inicio' | 'especie' | 'producto' | 'proceso' | 'nosotros' | 'contacto' | 'cotizar';
  nombre?: string;
}): string {
  switch (contexto.tipo) {
    case 'especie':
      return `Buenas. Estoy viendo la página de ${contexto.nombre} y quiero cotizar.`;
    case 'producto':
      return `Buenas. Quiero cotizar ${contexto.nombre}.`;
    case 'proceso':
      return 'Buenas. Vi el proceso de la planta y quiero consultar por un pedido con corte a la medida.';
    case 'nosotros':
      return 'Buenas. Quiero consultar por un pedido de madera.';
    case 'contacto':
      return 'Buenas. Quiero consultar horario y disponibilidad para pasar a la planta.';
    case 'cotizar':
      return 'Buenas. Estoy armando una cotización en el sitio y tengo una consulta.';
    case 'inicio':
    default:
      return 'Buenas. Quiero cotizar madera. Les paso las medidas.';
  }
}
