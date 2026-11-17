import { Component, OnInit, inject, signal } from '@angular/core';

import { CafeteriaService } from '../../core/services/cafeteria.service';
import { CafeteriaInfo } from '../../core/models/cafeteria-info.model';

@Component({
  selector: 'app-nosotros',
  imports: [],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.scss'
})
export class Nosotros implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  readonly info = signal<CafeteriaInfo | null>(null);
  readonly cargando = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.cafeteriaService.obtenerInformacion().subscribe({
      next: (info) => {
        this.info.set(info);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }
}
