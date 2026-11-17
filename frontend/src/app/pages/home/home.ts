import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CafeteriaService } from '../../core/services/cafeteria.service';
import { ProductosService } from '../../core/services/productos.service';
import { CafeteriaInfo } from '../../core/models/cafeteria-info.model';
import { Producto } from '../../core/models/producto.model';
import { ProductoCard } from '../../shared/producto-card/producto-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductoCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);
  private readonly productosService = inject(ProductosService);

  readonly info = signal<CafeteriaInfo | null>(null);
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);

  readonly destacado = computed(() => this.productos().find((producto) => producto.destacado) ?? null);

  readonly tituloHero = computed(() => {
    const titulo = this.info()?.titulo_hero ?? 'ORDER COFFEE';
    const espacio = titulo.indexOf(' ');
    return espacio === -1 ? { izquierda: titulo, derecha: '' } : { izquierda: titulo.slice(0, espacio), derecha: titulo.slice(espacio + 1) };
  });
  readonly menuTeaser = computed(() =>
    this.productos()
      .filter((producto) => producto.activo && !producto.destacado)
      .slice(0, 8)
  );

  ngOnInit(): void {
    this.cafeteriaService.obtenerInformacion().subscribe({
      next: (info) => this.info.set(info),
      error: () => this.info.set(null)
    });

    this.productosService.obtenerTodos().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
