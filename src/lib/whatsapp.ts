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
      return 'Buen día. Estoy viendo el catálogo y quisiera consultar precio.';
    case 'proceso':
      return 'Buen día. Quisiera consultar por un corte a pedido.';
    case 'nosotros':
      return 'Buen día. Quisiera consultar por un pedido de madera.';
    case 'contacto':
      return 'Buen día. Quisiera consultar horario y disponibilidad para visitar la planta.';
    case 'inicio':
    default:
      return 'Buen día. Quisiera consultar precio de madera.';
  }
}
