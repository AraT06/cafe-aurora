import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatbotService } from '../../core/services/chatbot.service';
import { MensajeHistorial } from '../../core/models/chatbot.model';

interface MensajeChat extends MensajeHistorial {
  error?: boolean;
}

@Component({
  selector: 'app-chatbot-widget',
  imports: [FormsModule],
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.scss'
})
export class ChatbotWidget {
  private readonly chatbotService = inject(ChatbotService);

  @ViewChild('listaMensajes') private listaMensajesRef?: ElementRef<HTMLDivElement>;

  readonly abierto = signal(false);
  readonly enviando = signal(false);
  readonly mensajeActual = signal('');
  readonly mensajes = signal<MensajeChat[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente de Café Aurora. Pregúntame sobre el menú, horarios o ubicación.'
    }
  ]);

  alternarPanel(): void {
    this.abierto.update((valor) => !valor);
  }

  enviar(): void {
    const texto = this.mensajeActual().trim();
    if (!texto || this.enviando()) {
      return;
    }

    const historial = this.mensajes().map(({ role, content }) => ({ role, content }));
    this.mensajes.update((actual) => [...actual, { role: 'user', content: texto }]);
    this.mensajeActual.set('');
    this.enviando.set(true);
    this.desplazarAbajo();

    this.chatbotService.enviarMensaje(texto, historial).subscribe({
      next: (respuesta) => {
        this.mensajes.update((actual) => [
          ...actual,
          { role: 'assistant', content: respuesta.respuesta || 'No tengo una respuesta para eso.' }
        ]);
        this.enviando.set(false);
        this.desplazarAbajo();
      },
      error: () => {
        this.mensajes.update((actual) => [
          ...actual,
          {
            role: 'assistant',
            content: 'No pude conectar con el asistente. Intenta de nuevo en un momento.',
            error: true
          }
        ]);
        this.enviando.set(false);
        this.desplazarAbajo();
      }
    });
  }

  private desplazarAbajo(): void {
    setTimeout(() => {
      const contenedor = this.listaMensajesRef?.nativeElement;
      if (contenedor) {
        contenedor.scrollTop = contenedor.scrollHeight;
      }
    });
  }
}
