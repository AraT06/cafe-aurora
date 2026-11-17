import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { Pedido } from '../../core/models/pedido.model';

@Component({
  selector: 'app-cuenta',
  imports: [DatePipe],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.scss'
})
export class Cuenta implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly pedidosService = inject(PedidosService);
  private readonly router = inject(Router);

  readonly pedidos = signal<Pedido[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.pedidosService.listar().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/');
  }
}
