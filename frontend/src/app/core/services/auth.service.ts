import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthRespuesta, LoginPayload, RegistroPayload, Usuario } from '../models/usuario.model';

const CLAVE_TOKEN = 'cafeteria_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  private readonly _usuario = signal<Usuario | null>(null);
  private readonly _listo = signal(false);

  readonly usuario = this._usuario.asReadonly();
  readonly listo = this._listo.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null);

  obtenerToken(): string | null {
    try {
      return localStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null;
    }
  }

  restaurarSesion(): void {
    const token = this.obtenerToken();
    if (!token) {
      this._listo.set(true);
      return;
    }

    this.http.get<Usuario>(`${this.baseUrl}/me`).subscribe({
      next: (usuario) => {
        this._usuario.set(usuario);
        this._listo.set(true);
      },
      error: () => {
        this.limpiarSesion();
        this._listo.set(true);
      }
    });
  }

  registrar(payload: RegistroPayload): Observable<AuthRespuesta> {
    return this.http.post<AuthRespuesta>(`${this.baseUrl}/registro`, payload).pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  iniciarSesion(payload: LoginPayload): Observable<AuthRespuesta> {
    return this.http.post<AuthRespuesta>(`${this.baseUrl}/login`, payload).pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  cerrarSesion(): void {
    this.limpiarSesion();
  }

  private guardarSesion(respuesta: AuthRespuesta): void {
    try {
      localStorage.setItem(CLAVE_TOKEN, respuesta.token);
    } catch {
      /* almacenamiento no disponible */
    }
    this._usuario.set(respuesta.usuario);
    this._listo.set(true);
  }

  private limpiarSesion(): void {
    try {
      localStorage.removeItem(CLAVE_TOKEN);
    } catch {
      /* almacenamiento no disponible */
    }
    this._usuario.set(null);
  }
}
