/**
 * Única puerta de entrada al contenido.
 *
 * Los componentes importan de aquí y nunca de `astro:content` directamente. Ese
 * es el punto donde, en la fase 2, se cambia el origen por Supabase sin tocar
 * una sola página.
 */
import { getCollection } from 'astro:content';
import type {
  Especie,
  EtapaProceso,
  PerfilCliente,
  Producto,
  Servicio,
  CategoriaProducto,
} from '@/types/contenido';

const porOrden = (a: { orden: number }, b: { orden: number }): number => a.orden - b.orden;

export async function obtenerEspecies(): Promise<Especie[]> {
  const entradas = await getCollection('especies');
  return entradas.map(({ id, data }) => ({ slug: id, ...data })).sort(porOrden);
}

export async function obtenerEspecie(slug: string): Promise<Especie | undefined> {
  return (await obtenerEspecies()).find((especie) => especie.slug === slug);
}

export async function obtenerProductos(): Promise<Producto[]> {
  const entradas = await getCollection('productos');
  return entradas.map(({ id, data }) => ({ slug: id, ...data })).sort(porOrden);
}

export async function obtenerServicios(): Promise<Servicio[]> {
  const entradas = await getCollection('servicios');
  return entradas.map(({ id, data }) => ({ slug: id, ...data })).sort(porOrden);
}

export async function obtenerProceso(): Promise<EtapaProceso[]> {
  const entradas = await getCollection('proceso');
  return entradas.map(({ id, data }) => ({ slug: id, ...data })).sort(porOrden);
}

export async function obtenerPerfiles(): Promise<PerfilCliente[]> {
  const entradas = await getCollection('perfiles');
  return entradas.map(({ id, data }) => ({ slug: id, ...data })).sort(porOrden);
}

/** Productos de una especie, en el orden del catálogo. */
export async function productosDeEspecie(slugEspecie: string): Promise<Producto[]> {
  return (await obtenerProductos()).filter((producto) =>
    producto.especies.includes(slugEspecie),
  );
}

/** Especies en las que se ofrece un producto. */
export async function especiesDeProducto(slugProducto: string): Promise<Especie[]> {
  return (await obtenerEspecies()).filter((especie) =>
    especie.productos.includes(slugProducto),
  );
}

export const ETIQUETA_CATEGORIA: Record<CategoriaProducto, string> = {
  construccion: 'Construcción',
  industria: 'Industria y embalaje',
  combustible: 'Combustible y derivados',
};

export const RESUMEN_CATEGORIA: Record<CategoriaProducto, string> = {
  construccion: 'Lo que sostiene y lo que cierra la obra.',
  industria: 'Embalaje, estiba y armado provisional.',
  combustible: 'Lo que sale del aserrío y no se bota.',
};

/** Productos agrupados por caso de uso, en el orden en que se muestran. */
export async function productosPorCategoria(): Promise<
  { categoria: CategoriaProducto; etiqueta: string; resumen: string; productos: Producto[] }[]
> {
  const productos = await obtenerProductos();
  const categorias: CategoriaProducto[] = ['construccion', 'industria', 'combustible'];
  return categorias.map((categoria) => ({
    categoria,
    etiqueta: ETIQUETA_CATEGORIA[categoria],
    resumen: RESUMEN_CATEGORIA[categoria],
    productos: productos.filter((producto) => producto.categoria === categoria),
  }));
}
