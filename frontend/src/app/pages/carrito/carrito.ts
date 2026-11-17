import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss'
})
export class Carrito {
  protected readonly carritoService = inject(CarritoService);
  private readonly router = inject(Router);

  readonly procesando = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.carritoService.cargar();
  }

  cambiarCantidad(productoId: number, cantidad: number): void {
    if (cantidad < 1) return;
    this.carritoService.actualizarCantidad(productoId, cantidad).subscribe();
  }

  eliminar(productoId: number): void {
    this.carritoService.eliminar(productoId).subscribe();
  }

  finalizarPedido(): void {
    this.procesando.set(true);
    this.error.set(null);

    this.carritoService.checkout().subscribe({
      next: (pedido) => {
        this.procesando.set(false);
        this.router.navigate(['/cuenta'], { queryParams: { pedido: pedido.id } });
      },
      error: () => {
        this.procesando.set(false);
        this.error.set('No se pudo procesar el pedido. Intenta de nuevo.');
      }
    });
  }
}
