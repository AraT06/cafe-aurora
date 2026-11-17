export type RolMensaje = 'user' | 'assistant';

export interface MensajeHistorial {
  role: RolMensaje;
  content: string;
}

export interface ChatbotRespuesta {
  respuesta: string;
  modelo: string;
}
