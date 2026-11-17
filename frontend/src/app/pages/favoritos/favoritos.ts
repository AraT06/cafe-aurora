import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritosService } from '../../core/services/favoritos.service';
import { CarritoService } from '../../core/services/carrito.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-favoritos',
  imports: [RouterLink],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.scss'
})
export class Favoritos {
  protected readonly favoritosService = inject(FavoritosService);
  private readonly carritoService = inject(CarritoService);

  constructor() {
    this.favoritosService.cargar();
  }

  quitar(productoId: number): void {
    this.favoritosService.quitar(productoId).subscribe();
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar(producto.id).subscribe();
  }
}
