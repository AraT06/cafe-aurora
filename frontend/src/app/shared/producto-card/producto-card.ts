import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-producto-card',
  imports: [],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.scss'
})
export class ProductoCard {
  readonly producto = input.required<Producto>();

  private readonly carritoService = inject(CarritoService);
  private readonly favoritosService = inject(FavoritosService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly agregando = signal(false);

  get esFavorito(): boolean {
    return this.favoritosService.esFavorito(this.producto().id);
  }

  agregarAlCarrito(): void {
    if (!this.authService.autenticado()) {
      this.router.navigate(['/login']);
      return;
    }

    this.agregando.set(true);
    this.carritoService.agregar(this.producto().id).subscribe({
      next: () => this.agregando.set(false),
      error: () => this.agregando.set(false)
    });
  }

  alternarFavorito(): void {
    if (!this.authService.autenticado()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.esFavorito) {
      this.favoritosService.quitar(this.producto().id).subscribe();
    } else {
      this.favoritosService.agregar(this.producto()).subscribe();
    }
  }
}
