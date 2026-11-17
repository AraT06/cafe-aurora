export interface PedidoItem {
  id: number;
  pedido_id: number;
  producto_id: number | null;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  total: number;
  estado: string;
  creado_en: string;
  items?: PedidoItem[];
}
