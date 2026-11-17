export interface ContactoPayload {
  nombre: string;
  correo: string;
  telefono?: string;
  mensaje: string;
}

export interface ContactoCreado extends ContactoPayload {
  id: number;
  fecha: string;
}
