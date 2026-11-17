import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CafeteriaInfo } from '../models/cafeteria-info.model';

@Injectable({ providedIn: 'root' })
export class CafeteriaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cafeteria`;

  obtenerInformacion(): Observable<CafeteriaInfo> {
    return this.http.get<CafeteriaInfo>(this.baseUrl);
  }
}
