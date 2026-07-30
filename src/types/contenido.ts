/**
 * Contratos de contenido del sitio.
 *
 * Fase 1: los cumplen los JSON de `src/content/`.
 * Fase 2: los tiene que cumplir lo que devuelva Supabase. Los nombres de campo
 * están en snake_case donde van a ser columnas, para que la migración sea
 * cambiar el origen de datos y no reescribir componentes.
 */

/** Los cuatro acabados que salen de la planta. Vienen de los servicios reales. */
export type Acabado = 'rustica' | 'cepillada' | 'secada' | 'curada';

/** Agrupación de productos por caso de uso, no por tipo de corte. */
export type CategoriaProducto = 'construccion' | 'industria' | 'combustible';

/** Variante tonal de la banda de cada especie. Solo verdes, nunca colores nuevos. */
export type TonoEspecie = 'tinta' | 'monte' | 'musgo' | 'aserrin';

/** Proporción del marcador de foto. Fija el `aspect-ratio` para que CLS sea 0. */
export type ProporcionFoto = '16/9' | '4/5' | '1/1' | '3/2';

/**
 * Marcador de fotografía. Mientras no haya sesión de fotos en la planta, esto
 * se renderiza como un bloque de color con la instrucción de toma escrita.
 * Cuando lleguen las fotos, se agrega `archivo` y el componente cambia solo.
 */
export interface MarcadorFoto {
  /** Qué hay que fotografiar, literal, para la lista de tomas. */
  readonly toma: string;
  /** Texto alternativo real de la foto final. */
  readonly alt: string;
  readonly proporcion: ProporcionFoto;
  /** Ruta dentro de `src/assets/` una vez exista la foto. */
  readonly archivo?: string;
}

export interface Especie {
  readonly slug: string;
  readonly nombre: string;
  /** Una línea. Lo que se lee en el índice. */
  readonly resumen: string;
  /** Dos o tres frases. Para qué sirve esta madera en obra hondureña. */
  readonly descripcion: string;
  /** Usos concretos, en minúscula, sin adjetivos de folleto. */
  readonly usos: readonly string[];
  readonly acabados: readonly Acabado[];
  /** Slugs de productos en los que se convierte. Ver TODO en especies.json. */
  readonly productos: readonly string[];
  /** El dato que se muestra grande en su ficha. Cualitativo, no inventado. */
  readonly dato_dominante: { readonly etiqueta: string; readonly valor: string };
  readonly tono: TonoEspecie;
  readonly foto: MarcadorFoto;
  readonly orden: number;
}

export interface Producto {
  readonly slug: string;
  readonly nombre: string;
  readonly categoria: CategoriaProducto;
  /** Qué es, en una o dos frases. Lenguaje de obra, no de catálogo. */
  readonly que_es: string;
  /** Unidad de venta típica. `null` = se cotiza por volumen, sin unidad fija. */
  readonly unidad: string | null;
  /** Slugs de especie. Ver TODO en productos.json. */
  readonly especies: readonly string[];
  readonly orden: number;
}

export interface Servicio {
  readonly slug: string;
  readonly nombre: string;
  readonly que_hace: string;
  /** Renglón en monoespaciada, tono de ficha técnica. */
  readonly especificacion: string;
  readonly orden: number;
}

export interface EtapaProceso {
  readonly slug: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly foto: MarcadorFoto;
  readonly orden: number;
}

export interface PerfilCliente {
  readonly slug: string;
  readonly nombre: string;
  /** La razón concreta por la que a este perfil le conviene. Sin relleno. */
  readonly razon: string;
  readonly orden: number;
}

/* ------------------------------------------------------------------ */
/* Lista de cotización                                                 */
/* ------------------------------------------------------------------ */

/** Una línea de la hoja de conteo. Medidas en pulgadas y pies. */
export interface Partida {
  readonly id: string;
  readonly especie: string;
  /** Pulgadas. */
  readonly espesor: number;
  /** Pulgadas. */
  readonly ancho: number;
  /** Pies. */
  readonly largo: number;
  readonly piezas: number;
  readonly acabado: Acabado;
}

export interface SolicitudCotizacion {
  readonly nombre: string;
  readonly empresa: string;
  readonly telefono: string;
  readonly correo: string;
  readonly ciudad: string;
  readonly proyecto: string;
  /** ISO `YYYY-MM-DD` o cadena vacía. */
  readonly fecha_requerida: string;
  readonly requiere_transporte: boolean;
  readonly direccion_entrega: string;
  readonly notas: string;
  readonly partidas: readonly Partida[];
  /** Total en pies tablares, calculado, no capturado. */
  readonly total_pt: number;
}

export type ResultadoEnvio =
  | { readonly ok: true; readonly via: 'whatsapp' | 'supabase' }
  | { readonly ok: false; readonly motivo: string };
