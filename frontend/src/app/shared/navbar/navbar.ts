import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  protected readonly authService = inject(AuthService);
  protected readonly carritoService = inject(CarritoService);

  readonly menuAbierto = signal(false);

  readonly enlaces = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/menu', texto: 'Menú' },
    { ruta: '/catalogo', texto: 'Catálogo' },
    { ruta: '/nosotros', texto: 'Nosotros' },
    { ruta: '/contacto', texto: 'Contacto' }
  ];

  alternarMenu(): void {
    this.menuAbierto.update((valor) => !valor);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
