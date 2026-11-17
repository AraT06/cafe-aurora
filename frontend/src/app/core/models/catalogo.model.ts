export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string | null;
  activo: boolean;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  activo: boolean;
}

export interface GaleriaItem {
  id: number;
  titulo: string | null;
  url_imagen: string;
  descripcion: string | null;
  activo: boolean;
}
