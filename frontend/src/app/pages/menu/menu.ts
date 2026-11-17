import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductosService } from '../../core/services/productos.service';
import { Producto } from '../../core/models/producto.model';
import { ProductoCard } from '../../shared/producto-card/producto-card';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, ProductoCard],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  private readonly productosService = inject(ProductosService);

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly error = signal(false);
  readonly categoriaActiva = signal<string>('Todos');

  readonly categorias = computed(() => {
    const vistas = new Set(
      this.productos()
        .map((producto) => producto.categoria)
        .filter((categoria): categoria is string => !!categoria)
    );
    return ['Todos', ...vistas];
  });

  readonly productosFiltrados = computed(() => {
    const categoria = this.categoriaActiva();
    const productos = this.productos().filter((producto) => producto.activo);
    return categoria === 'Todos' ? productos : productos.filter((producto) => producto.categoria === categoria);
  });

  ngOnInit(): void {
    this.productosService.obtenerTodos().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }
}
