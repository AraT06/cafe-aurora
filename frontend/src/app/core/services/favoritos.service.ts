import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/favoritos`;

  private readonly _favoritos = signal<Producto[]>([]);

  readonly favoritos = this._favoritos.asReadonly();
  readonly idsFavoritos = computed(() => new Set(this._favoritos().map((producto) => producto.id)));

  cargar(): void {
    this.http.get<Producto[]>(this.baseUrl).subscribe({
      next: (favoritos) => this._favoritos.set(favoritos),
      error: () => this._favoritos.set([])
    });
  }

  limpiarEstadoLocal(): void {
    this._favoritos.set([]);
  }

  esFavorito(productoId: number): boolean {
    return this.idsFavoritos().has(productoId);
  }

  agregar(producto: Producto): Observable<unknown> {
    return this.http
      .post(this.baseUrl, { productoId: producto.id })
      .pipe(tap(() => this._favoritos.update((actual) => [...actual, producto])));
  }

  quitar(productoId: number): Observable<unknown> {
    return this.http
      .delete(`${this.baseUrl}/${productoId}`)
      .pipe(tap(() => this._favoritos.update((actual) => actual.filter((producto) => producto.id !== productoId))));
  }
}
