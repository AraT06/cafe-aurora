import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ChatbotRespuesta, MensajeHistorial } from '../models/chatbot.model';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/chatbot`;

  enviarMensaje(mensaje: string, historial: MensajeHistorial[]): Observable<ChatbotRespuesta> {
    return this.http.post<ChatbotRespuesta>(this.baseUrl, { mensaje, historial });
  }
}
