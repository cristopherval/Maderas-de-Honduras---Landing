import { WHATSAPP_PRINCIPAL } from '@/data/empresa';

export function urlWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_PRINCIPAL}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Mensaje precargado según dónde está parado el visitante. Nada de "Hola".
 * Si alguien escribe desde la ficha de la caoba, el mensaje habla de caoba.
 */
export function mensajeDeContexto(contexto: {
  tipo: 'inicio' | 'producto' | 'proceso' | 'nosotros' | 'contacto';
  nombre?: string;
}): string {
  switch (contexto.tipo) {
    case 'producto':
      return 'Buenas. Estoy viendo el catálogo y quiero preguntar precio.';
    case 'proceso':
      return 'Buenas. Quiero consultar por un pedido con corte a la medida.';
    case 'nosotros':
      return 'Buenas. Quiero consultar por un pedido de madera.';
    case 'contacto':
      return 'Buenas. Quiero consultar horario y disponibilidad para pasar a la planta.';
    case 'inicio':
    default:
      return 'Buenas. Quiero preguntar precio de madera. Les paso las medidas.';
  }
}
