import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CafeteriaService } from '../../core/services/cafeteria.service';
import { CafeteriaInfo } from '../../core/models/cafeteria-info.model';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit {
  private readonly cafeteriaService = inject(CafeteriaService);

  readonly info = signal<CafeteriaInfo | null>(null);
  readonly anioActual = new Date().getFullYear();

  ngOnInit(): void {
    this.cafeteriaService.obtenerInformacion().subscribe({
      next: (info) => this.info.set(info),
      error: () => this.info.set(null)
    });
  }
}
