export interface CarritoItem {
  producto_id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  precio: number;
  cantidad: number;
}

export interface CarritoResumen {
  items: CarritoItem[];
  total: number;
}
