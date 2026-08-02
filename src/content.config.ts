import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * Fase 1: el contenido vive en JSON con la misma forma que van a tener las
 * tablas de Supabase. El `id` de cada entrada es el slug y la futura llave.
 *
 * Fase 2: se cambia el `loader` por uno que lea de Supabase. Los esquemas y los
 * componentes no se tocan.
 *
 * TODO (cliente): confirmar la matriz especie x producto. Está armada con el
 * criterio estándar del rubro, no con la lista real de la planta.
 * TODO (cliente): confirmar la unidad de venta de capote, leña, ocote y aserrín.
 */

const marcadorFoto = z.object({
  toma: z.string(),
  alt: z.string(),
  proporcion: z.enum(['16/9', '4/5', '1/1', '3/2']),
  archivo: z.string().optional(),
});

const acabado = z.enum(['rustica', 'cepillada', 'secada', 'curada']);

const especies = defineCollection({
  loader: file('src/content/especies.json'),
  schema: z.object({
    nombre: z.string(),
    resumen: z.string(),
    descripcion: z.string(),
    usos: z.array(z.string()).min(1),
    acabados: z.array(acabado).min(1),
    productos: z.array(z.string()).min(1),
    dato_dominante: z.object({ etiqueta: z.string(), valor: z.string() }),
    tono: z.enum(['tinta', 'monte', 'aserrin']),
    foto: marcadorFoto,
    orden: z.number().int().positive(),
  }),
});

const productos = defineCollection({
  loader: file('src/content/productos.json'),
  schema: z.object({
    nombre: z.string(),
    categoria: z.enum(['construccion', 'industria', 'combustible']),
    que_es: z.string(),
    unidad: z.string().nullable(),
    especies: z.array(z.string()).min(1),
    foto: marcadorFoto,
    orden: z.number().int().positive(),
  }),
});

const servicios = defineCollection({
  loader: file('src/content/servicios.json'),
  schema: z.object({
    nombre: z.string(),
    que_hace: z.string(),
    especificacion: z.string(),
    foto: marcadorFoto,
    orden: z.number().int().positive(),
  }),
});

/*
 * Se quitaron las colecciones `proceso` y `perfiles`. La primera alimentaba la
 * página de las seis etapas, que ahora es `/servicios` y sale de
 * servicios.json; la segunda alimentaba "a quién le vendemos". Los JSON siguen
 * en el historial de git si hicieran falta.
 */
export const collections = { especies, productos, servicios };
