export interface DetallePromocion {
  titulo: string;
  subtitulo: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  precio: number;
  precio_original: number | null;
  destacado: boolean;
  detalles_promocion: DetallePromocion[] | null;
  imagen: string | null;
  activo: boolean;
  creado_en: string;
}
