import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { ChatbotWidget } from './shared/chatbot-widget/chatbot-widget';
import { AuthService } from './core/services/auth.service';
import { CarritoService } from './core/services/carrito.service';
import { FavoritosService } from './core/services/favoritos.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ChatbotWidget],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly carritoService = inject(CarritoService);
  private readonly favoritosService = inject(FavoritosService);

  constructor() {
    this.authService.restaurarSesion();

    effect(() => {
      if (this.authService.autenticado()) {
        this.carritoService.cargar();
        this.favoritosService.cargar();
      } else {
        this.carritoService.limpiarEstadoLocal();
        this.favoritosService.limpiarEstadoLocal();
      }
    });
  }
}
