export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  creado_en: string;
}

export interface AuthRespuesta {
  usuario: Usuario;
  token: string;
}

export interface RegistroPayload {
  nombre: string;
  correo: string;
  password: string;
}

export interface LoginPayload {
  correo: string;
  password: string;
}
