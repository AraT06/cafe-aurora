import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ContactoCreado, ContactoPayload } from '../models/contacto.model';

@Injectable({ providedIn: 'root' })
export class ContactosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/contactos`;

  enviar(payload: ContactoPayload): Observable<ContactoCreado> {
    return this.http.post<ContactoCreado>(this.baseUrl, payload);
  }
}
