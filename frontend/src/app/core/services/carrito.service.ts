import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CarritoResumen } from '../models/carrito.model';
import { Pedido } from '../models/pedido.model';

const CARRITO_VACIO: CarritoResumen = { items: [], total: 0 };

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/carrito`;

  private readonly _resumen = signal<CarritoResumen>(CARRITO_VACIO);

  readonly resumen = this._resumen.asReadonly();
  readonly cantidadItems = computed(() => this._resumen().items.reduce((suma, item) => suma + item.cantidad, 0));

  cargar(): void {
    this.http.get<CarritoResumen>(this.baseUrl).subscribe({
      next: (resumen) => this._resumen.set(resumen),
      error: () => this._resumen.set(CARRITO_VACIO)
    });
  }

  limpiarEstadoLocal(): void {
    this._resumen.set(CARRITO_VACIO);
  }

  agregar(productoId: number, cantidad = 1): Observable<CarritoResumen> {
    return this.http
      .post<CarritoResumen>(this.baseUrl, { productoId, cantidad })
      .pipe(tap((resumen) => this._resumen.set(resumen)));
  }

  actualizarCantidad(productoId: number, cantidad: number): Observable<CarritoResumen> {
    return this.http
      .put<CarritoResumen>(`${this.baseUrl}/${productoId}`, { cantidad })
      .pipe(tap((resumen) => this._resumen.set(resumen)));
  }

  eliminar(productoId: number): Observable<CarritoResumen> {
    return this.http
      .delete<CarritoResumen>(`${this.baseUrl}/${productoId}`)
      .pipe(tap((resumen) => this._resumen.set(resumen)));
  }

  checkout(): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.baseUrl}/checkout`, {}).pipe(tap(() => this._resumen.set(CARRITO_VACIO)));
  }
}
