import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Especialidad, GaleriaItem, Servicio } from '../models/catalogo.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/catalogo`;

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/servicios`);
  }

  obtenerEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.baseUrl}/especialidades`);
  }

  obtenerGaleria(): Observable<GaleriaItem[]> {
    return this.http.get<GaleriaItem[]>(`${this.baseUrl}/galeria`);
  }
}
